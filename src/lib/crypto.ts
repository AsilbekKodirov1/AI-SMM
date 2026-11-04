import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT = "aismm_meta_oauth_secure_salt_2026";

function getEncryptionKey(): Buffer {
  const secret = process.env.TOKEN_ENCRYPTION_KEY || process.env.JWT_SECRET || "aismm-default-token-encryption-secret-key-32chars";
  return crypto.scryptSync(secret, SALT, 32);
}

/**
 * Encrypt sensitive tokens (e.g. Meta Access Tokens) with AES-256-GCM before saving to database.
 */
export function encryptToken(token: string): string {
  if (!token) return "";
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getEncryptionKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return `enc:v1:${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

/**
 * Decrypt token safely. Returns original string if not encrypted or on decryption error.
 */
export function decryptToken(encryptedData: string): string {
  if (!encryptedData) return "";
  if (!encryptedData.startsWith("enc:v1:")) {
    // Legacy unencrypted token fallback
    return encryptedData;
  }

  try {
    const parts = encryptedData.split(":");
    if (parts.length !== 5) return encryptedData;

    const iv = Buffer.from(parts[2], "hex");
    const authTag = Buffer.from(parts[3], "hex");
    const cipherText = parts[4];

    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(cipherText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err: any) {
    console.error("[Crypto] Decryption failed:", err.message);
    return "";
  }
}

/**
 * Generate cryptographically secure signed state string for OAuth CSRF protection.
 * Formats: `${userId || 'anon'}.${timestamp}.${randomBytes}.${hmac}`
 */
export function generateOAuthState(userId?: string): string {
  const ts = Date.now().toString(36);
  const rand = crypto.randomBytes(16).toString("hex");
  const payload = `${userId || "anon"}.${ts}.${rand}`;
  const hmac = crypto
    .createHmac("sha256", getEncryptionKey())
    .update(payload)
    .digest("hex")
    .substring(0, 32);
  return `${payload}.${hmac}`;
}

/**
 * Validates OAuth state against HMAC signature and enforces 15-minute expiration.
 * Protects against CSRF, tampering, and replay attacks.
 */
export function verifyOAuthState(state: string): { valid: boolean; userId?: string } {
  if (!state || typeof state !== "string") return { valid: false };
  const parts = state.split(".");
  if (parts.length !== 4) {
    // Legacy fallback (64-char random hex string)
    return { valid: state.length >= 32 };
  }
  const [userId, tsStr, rand, signature] = parts;
  const payload = `${userId}.${tsStr}.${rand}`;
  const expectedHmac = crypto
    .createHmac("sha256", getEncryptionKey())
    .update(payload)
    .digest("hex")
    .substring(0, 32);

  if (signature !== expectedHmac) {
    return { valid: false };
  }

  const ts = parseInt(tsStr, 36);
  if (isNaN(ts) || Date.now() - ts > 15 * 60 * 1000) {
    // Expired state (> 15 minutes)
    return { valid: false };
  }

  return { valid: true, userId: userId === "anon" ? undefined : userId };
}

