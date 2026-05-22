import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  deriveKey, 
  encryptMessage, 
  decryptMessage, 
  generateMockPublicKeys,
  hashValue 
} from '../utils/crypto';
import { useAuth } from '../contexts/AuthContext';

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  combo_used: string;
  isSelf: boolean;
}

export const useWebSocket = (sessionId: string, initialCombo: string) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<'DISCONNECTED' | 'HANDSHAKING' | 'SECURE'>('DISCONNECTED');
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const clientId = useRef<string>(user?.username || 'Unknown_Operative');
  const cryptoKeyRef = useRef<CryptoKey | null>(null);
  const messageCounterRef = useRef<number>(0);

  useEffect(() => {
    if (!sessionId || !user?.token) return;
    
    const connectWebSocket = () => {
      const host = window.location.hostname;
      const wsUrl = (import.meta as any).env.VITE_WS_URL || `ws://${host}:8000`;
      const ws = new WebSocket(`${wsUrl}/ws/chat/${sessionId}?token=${user.token}`);
      wsRef.current = ws;

      ws.onopen = async () => {
        try {
          setStatus('HANDSHAKING');
          setError(null);

          // Generate mock PQC public keys
          const publicKeys = generateMockPublicKeys();

          // Send handshake initialization
          ws.send(JSON.stringify({
            type: 'pqc_handshake_init',
            combo_id: initialCombo,
            public_keys: publicKeys,
            client_id: clientId.current
          }));
        } catch (err) {
          setError('Failed to initiate handshake: ' + (err as Error).message);
          setStatus('DISCONNECTED');
        }
      };

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'pqc_handshake_reply') {
            // Server has completed handshake
            // In production, derive the session key from shared secrets
            // For now, we'll create a deterministic group key from the session ID
            const encoder = new TextEncoder();
            const sessionKeyMaterial = encoder.encode(
              sessionId + initialCombo + "GLOBAL_E2E_SALT"
            );
            const key = await deriveKey(sessionKeyMaterial.buffer);
            cryptoKeyRef.current = key;
            
            setStatus('SECURE');
            setError(null);
          } else if (data.type === 'chat_message') {
            // Decrypt incoming message
            if (!cryptoKeyRef.current) {
              console.warn('Received message before cryptographic setup');
              return;
            }

            try {
              const decrypted = await decryptMessage(
                data.ciphertext,
                data.iv,
                cryptoKeyRef.current
              );
              const payload = JSON.parse(decrypted);

              const messageId = await hashValue(
                payload.sender + payload.timestamp + messageCounterRef.current++
              );

              setMessages(prev => [...prev, {
                id: messageId,
                sender: payload.sender,
                content: payload.content,
                timestamp: payload.timestamp,
                combo_used: data.combo_used,
                isSelf: payload.sender === clientId.current
              }]);
            } catch (decryptErr) {
              console.error('Failed to decrypt message:', decryptErr);
              // Show error message in chat
              setMessages(prev => [...prev, {
                id: 'error_' + Date.now(),
                sender: 'System',
                content: '⚠️ Failed to decrypt message - possible tampering detected',
                timestamp: Date.now(),
                combo_used: 'ERROR',
                isSelf: false
              }]);
            }
          } else if (data.type === 'error') {
            setError('Server error: ' + data.message);
          }
        } catch (err) {
          console.error('Message handler error:', err);
          setError('Failed to process message: ' + (err as Error).message);
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        setError('Connection error');
        setStatus('DISCONNECTED');
      };

      ws.onclose = () => {
        setStatus('DISCONNECTED');
        cryptoKeyRef.current = null;
        // Attempt reconnect after 3 seconds
        setTimeout(() => {
          console.log('Attempting to reconnect...');
          connectWebSocket();
        }, 3000);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [sessionId, initialCombo]);

  const sendMessage = useCallback(async (content: string, combo: string) => {
    if (wsRef.current?.readyState !== WebSocket.OPEN || !cryptoKeyRef.current) {
      setError('Not connected or not ready. Please wait for secure channel.');
      return;
    }

    try {
      setError(null);

      const payload = {
        sender: clientId.current,
        content,
        timestamp: Date.now()
      };
      const plaintext = JSON.stringify(payload);

      // Encrypt with AES-256-GCM
      const { ciphertext, iv } = await encryptMessage(plaintext, cryptoKeyRef.current);

      // Send encrypted message
      wsRef.current.send(JSON.stringify({
        type: 'chat_message',
        ciphertext,
        iv,
        combo_used: combo,
        timestamp: Date.now()
      }));

      // Add to local messages
      const messageId = await hashValue(
        clientId.current + Date.now() + messageCounterRef.current++
      );

      setMessages(prev => [...prev, {
        id: messageId,
        sender: 'You',
        content,
        timestamp: Date.now(),
        combo_used: combo,
        isSelf: true
      }]);
    } catch (err) {
      setError('Failed to send message: ' + (err as Error).message);
      console.error('Send error:', err);
    }
  }, []);

  return { 
    messages, 
    status, 
    sendMessage,
    error,
    clientId: clientId.current
  };
};
