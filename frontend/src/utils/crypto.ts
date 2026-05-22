/**
 * Cryptography utilities for frontend client
 * Uses browser's native Web Crypto API for AES-256-GCM encryption
 */

/**
 * Derive a 256-bit key from the shared secret using HKDF
 */
export async function deriveKey(sharedSecret: ArrayBuffer): Promise<CryptoKey> {
  // Import the shared secret as a key
  const key = await crypto.subtle.importKey(
    'raw',
    sharedSecret,
    { name: 'HKDF' },
    false,
    ['deriveKey']
  );

  // Derive AES-256 key using HKDF
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: new Uint8Array(16), // Empty salt for now
      info: new TextEncoder().encode('schrodinger-box-aes-key')
    },
    key,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  return derivedKey;
}

/**
 * Encrypt plaintext with AES-256-GCM
 * Returns {ciphertext, iv} both as base64 strings
 */
export async function encryptMessage(
  plaintext: string,
  cryptoKey: CryptoKey
): Promise<{ ciphertext: string; iv: string }> {
  const encoder = new TextEncoder();
  const plaintextBytes = encoder.encode(plaintext);

  // Generate random 96-bit IV (NIST recommended for GCM)
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    plaintextBytes
  );

  // Convert to base64 for transmission
  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
    iv: btoa(String.fromCharCode(...iv))
  };
}

/**
 * Decrypt ciphertext with AES-256-GCM
 * Expects {ciphertext, iv} as base64 strings
 */
export async function decryptMessage(
  ciphertext: string,
  iv: string,
  cryptoKey: CryptoKey
): Promise<string> {
  try {
    // Convert from base64
    const ciphertextBytes = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
    const ivBytes = Uint8Array.from(atob(iv), c => c.charCodeAt(0));

    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivBytes },
      cryptoKey,
      ciphertextBytes
    );

    return new TextDecoder().decode(plaintext);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt message - integrity check failed');
  }
}

/**
 * Generate mock PQC public keys for handshake
 * In production, these would be real Kyber/BIKE/SPHINCS+ keys
 */
export function generateMockPublicKeys(): {
  lattice: string;
  code_based: string;
  hash_based: string;
} {
  // For demo: generate random bytes and base64 encode
  // For demo: generate random bytes and base64 encode properly
  const generateRandomKey = () => {
    // btoa on raw String.fromCharCode array causes padding/invalid byte bugs in python's base64 parser
    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return btoa(`MOCK_KEY_${randomHex}`);
  };

  return {
    lattice: generateRandomKey(),
    code_based: generateRandomKey(),
    hash_based: generateRandomKey()
  };
}

/**
 * Hash a value for message IDs (deterministic but secure)
 */
export async function hashValue(value: string): Promise<string> {
  const encoded = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  return btoa(String.fromCharCode(...new Uint8Array(hashBuffer))).slice(0, 16);
}
