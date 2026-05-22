from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from sqlalchemy.orm import Session
from api.auth import get_current_user
import json
import base64
import time
from typing import Dict
from crypto import PQCHandshake, derive_hybrid_session_key, AESGCMCipher, PQC_COMBOS
from crypto.key_vault import global_vault
from db.database import get_db
from db.models import AuditLog
from db.models import AuditLog

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        # Maps session_id -> list of active websockets
        self.active_connections: Dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
        self.active_connections[session_id].append(websocket)

    def disconnect(self, websocket: WebSocket, session_id: str):
        if session_id in self.active_connections:
            self.active_connections[session_id].remove(websocket)
            if not self.active_connections[session_id]:
                del self.active_connections[session_id]

    async def broadcast(self, session_id: str, sender_ws: WebSocket, message: dict):
        """
        Pure Relay (True E2E): Server blindly broadcasts the encrypted blob.
        It does NOT know the key and does NOT decrypt the message.
        """
        if session_id not in self.active_connections:
            return
            
        for ws in self.active_connections[session_id]:
            if ws == sender_ws:
                continue
            await ws.send_json(message)

manager = ConnectionManager()

@router.websocket("/{session_id}")
async def websocket_chat(
    websocket: WebSocket, 
    session_id: str, 
    token: str = Query(...),
    db: Session = Depends(get_db)
):
    """
    WebSocket Endpoint for E2E Encrypted Chat
    Phase 1: Handshake
    Phase 2: Encrypted Messaging
    """
    # Authenticate via token query param
    try:
        user = get_current_user(token=token, db=db)
    except Exception:
        await websocket.close(code=1008)
        return

    await manager.connect(websocket, session_id)
    conn_id = f"{session_id}_{id(websocket)}"
    
    client_id = user.username # Use the real authenticated username!
    combo_used = "COMBO-A"  # Default, gets overwritten

    try:
        # Phase 1: Wait for Handshake Initiation
        data = await websocket.receive_json()
        if data.get("type") != "pqc_handshake_init":
            await websocket.close(code=1008)
            return

        combo_used = data.get("combo_id", "COMBO-A")
        client_public_keys_b64 = data.get("public_keys", {})
        
        # Decode base64 public keys
        client_pks = {alg: base64.b64decode(pk) for alg, pk in client_public_keys_b64.items()}
        
        combo = PQC_COMBOS.get(combo_used)
        if combo:
            # Map frontend roles to backend algorithm names
            remapped_pks = {}
            if "lattice" in client_pks: remapped_pks[combo.lattice] = client_pks["lattice"]
            elif combo.lattice in client_pks: remapped_pks[combo.lattice] = client_pks[combo.lattice]
            
            if "code_based" in client_pks: remapped_pks[combo.code_based] = client_pks["code_based"]
            elif combo.code_based in client_pks: remapped_pks[combo.code_based] = client_pks[combo.code_based]
            
            if "hash_based" in client_pks: remapped_pks[combo.hash_based] = client_pks["hash_based"]
            elif combo.hash_based in client_pks: remapped_pks[combo.hash_based] = client_pks[combo.hash_based]
            
            client_pks = remapped_pks

        # Server Encapsulate
        ciphertexts, shared_secrets = PQCHandshake.server_encapsulate(combo_used, client_pks)
        
        # Derive hybrid key
        session_key = derive_hybrid_session_key(shared_secrets)
        global_vault.store_key(conn_id, session_key)
        
        # Log Audit Event
        client_ip = websocket.client.host if websocket.client else "unknown"
        audit = AuditLog(
            session_id=session_id,
            combo_used=combo_used,
            threat_level_assessed="UNKNOWN", # Will link to ML output in real app
            ip_address=client_ip
        )
        db.add(audit)
        db.commit()

        # Reply with ciphertexts
        server_ciphertexts_b64 = {alg: base64.b64encode(ct).decode('utf-8') for alg, ct in ciphertexts.items()}
        await websocket.send_json({
            "type": "pqc_handshake_reply",
            "ciphertexts": server_ciphertexts_b64,
            "client_id": client_id
        })

        # Phase 2: Encrypted Message Loop
        while True:
            msg = await websocket.receive_json()
            if msg.get("type") == "chat_message":
                # Pure E2E Relay (WhatsApp style): server knows nothing, just forward it
                await manager.broadcast(session_id, websocket, msg)

    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
        global_vault.purge_key(conn_id)
    except Exception as e:
        import traceback
        print(f"CRITICAL WEBSOCKET ERROR: {e}")
        traceback.print_exc()
        try:
            await websocket.close(code=1011)
        except:
            pass
