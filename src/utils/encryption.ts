import crypto from 'crypto';

/**
 * Encryption utility for sensitive data
 * Uses AES-256-GCM for authenticated encryption
 */

const ALGORITHM = 'aes-256-gcm';
const ENCODING = 'hex';
const AUTH_TAG_LENGTH = 16;
const IV_LENGTH = 16;

/**
 * Generate a random encryption key
 */
export const generateEncryptionKey = (): string => {
  return crypto.randomBytes(32).toString(ENCODING);
};

/**
 * Encrypt sensitive data
 */
export const encryptData = (data: string, key: string): string => {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key, ENCODING), iv);

    let encrypted = cipher.update(data, 'utf8', ENCODING);
    encrypted += cipher.final(ENCODING);

    const authTag = cipher.getAuthTag();

    // Return iv:authTag:encrypted
    return `${iv.toString(ENCODING)}:${authTag.toString(ENCODING)}:${encrypted}`;
  } catch (error) {
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Decrypt encrypted data
 */
export const decryptData = (encryptedData: string, key: string): string => {
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }

    const [ivHex, authTagHex, encrypted] = parts;
    const iv = Buffer.from(ivHex, ENCODING);
    const authTag = Buffer.from(authTagHex, ENCODING);

    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key, ENCODING), iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, ENCODING, 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Hash a password using bcrypt-style PBKDF2
 */
export const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString(ENCODING);
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
    .toString(ENCODING);
  return `${salt}:${hash}`;
};

/**
 * Verify a password against its hash
 */
export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  try {
    const [salt, hash] = hashedPassword.split(':');
    const verify = crypto
      .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
      .toString(ENCODING);
    return verify === hash;
  } catch {
    return false;
  }
};

/**
 * Generate a cryptographic hash of data
 */
export const hashData = (data: string, algorithm: string = 'sha256'): string => {
  return crypto.createHash(algorithm).update(data).digest(ENCODING);
};

/**
 * Generate a random token for verification
 */
export const generateToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString(ENCODING);
};

/**
 * Create a HMAC signature
 */
export const createHmac = (data: string, secret: string): string => {
  return crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest(ENCODING);
};

/**
 * Verify a HMAC signature
 */
export const verifyHmac = (data: string, signature: string, secret: string): boolean => {
  const expectedSignature = createHmac(data, secret);
  return signature === expectedSignature;
};
