import os
from .aes_engine import AESGCMCipher

class KeyVault:
    """
    Secure storage for ephemeral session keys.
    Keys are never stored in plaintext in memory for prolonged periods;
    they are encrypted using a master ephemeral key (MEK).
    """

    def __init__(self, master_key: bytes = None):
        # 32-byte Master Ephemeral Key for the Vault itself
        self._mek = master_key or os.urandom(32)
        self._vault = {}  # session_id -> (encrypted_key, iv)

    def store_key(self, session_id: str, plaintext_session_key: bytes):
        """Encrypts and stores a session key."""
        cipher = AESGCMCipher(self._mek)
        enc_key, iv = cipher.encrypt(plaintext_session_key)
        self._vault[session_id] = (enc_key, iv)
        # Suggest zeroing out plaintext_session_key in caller context, 
        # though Python's GC makes direct memory wiping hard without C extensions.

    def retrieve_key(self, session_id: str) -> bytes:
        """Decrypts and returns a session key."""
        if session_id not in self._vault:
            raise KeyError("Session key not found.")
        
        enc_key, iv = self._vault[session_id]
        cipher = AESGCMCipher(self._mek)
        return cipher.decrypt(enc_key, iv)

    def purge_key(self, session_id: str):
        """Removes a session key from the vault securely."""
        if session_id in self._vault:
            del self._vault[session_id]

# Global KeyVault instance for the application lifecycle
global_vault = KeyVault()
