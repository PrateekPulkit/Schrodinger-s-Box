from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.backends import default_backend
from typing import Dict, List
import os

def derive_hybrid_session_key(shared_secrets: Dict[str, bytes], info: bytes = b"schrodingers_box_hybrid_key") -> bytes:
    """
    Combines outputs from multiple PQC algorithms via HKDF.
    No single algorithm failure compromises the session.
    
    Hash: SHA-512
    Input: secret_A || secret_B || secret_C
    """
    # Sort keys to ensure consistent order of concatenation
    sorted_algs = sorted(list(shared_secrets.keys()))
    
    combined_secret = b""
    for alg in sorted_algs:
        combined_secret += shared_secrets[alg]

    # Use HKDF with SHA-512 to derive a strong 32-byte (256-bit) session key for AES-256-GCM
    hkdf = HKDF(
        algorithm=hashes.SHA512(),
        length=32,
        salt=None,
        info=info,
        backend=default_backend()
    )

    session_key = hkdf.derive(combined_secret)
    return session_key
