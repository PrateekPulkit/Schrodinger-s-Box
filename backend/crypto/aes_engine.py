import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

class AESGCMCipher:
    """
    Handles AES-256-GCM encryption/decryption.
    Provides Authenticated Encryption with Associated Data (AEAD).
    """
    def __init__(self, key: bytes):
        if len(key) != 32:
            raise ValueError("AES-256 requires a 32-byte key")
        self.aesgcm = AESGCM(key)

    def encrypt(self, plaintext: bytes, associated_data: bytes = None) -> (bytes, bytes):
        """
        Encrypts plaintext using AES-256-GCM.
        Returns: (ciphertext_with_auth_tag, iv)
        """
        iv = os.urandom(12)  # NIST recommended 96-bit IV
        # encrypt appends the 16-byte auth tag at the end of the ciphertext
        ciphertext = self.aesgcm.encrypt(iv, plaintext, associated_data)
        return ciphertext, iv

    def decrypt(self, ciphertext: bytes, iv: bytes, associated_data: bytes = None) -> bytes:
        """
        Decrypts and verifies the ciphertext.
        """
        # decrypt validates the auth tag automatically
        plaintext = self.aesgcm.decrypt(iv, ciphertext, associated_data)
        return plaintext
