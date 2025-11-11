// backend/models/aesEncrypt.js
const crypto = require("crypto");

// Use a 32-byte key. Put HEX in .env: AES_SECRET_KEY=... (64 hex chars)
const KEY = Buffer.from(process.env.AES_SECRET_KEY, "hex"); // 32 bytes
const ALGO = "aes-256-gcm"; // authenticated encryption (better than CBC)

// helper: random 12-byte IV for GCM
function iv() { return crypto.randomBytes(12); }

// pack as base64 "iv:cipher:tag"
function pack(ivBuf, cipherBuf, tagBuf) {
  return `${ivBuf.toString("base64")}:${cipherBuf.toString("base64")}:${tagBuf.toString("base64")}`;
}

function unpack(packed) {
  try {
    const [ivB64, ciphB64, tagB64] = packed.split(":");
    if (!ivB64 || !ciphB64 || !tagB64) {
      throw new Error("Invalid packed string format");
    }
    return {
      iv: Buffer.from(ivB64, "base64"),
      cipher: Buffer.from(ciphB64, "base64"),
      tag: Buffer.from(tagB64, "base64"),
    };
  } catch (e) {
    console.error("Failed to unpack encrypted data:", e.message);
    return null; // Return null on unpack failure
  }
}

function encrypt(plainText) {
  if (plainText == null) return null;
  try {
    const i = iv();
    const cipher = crypto.createCipheriv(ALGO, KEY, i);
    const enc = Buffer.concat([cipher.update(String(plainText), "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return pack(i, enc, tag); // store this string in DB
  } catch (e) {
    console.error("Encryption failed:", e.message);
    return null;
  }
}

function decrypt(packed) {
  if (!packed) return null;
  try {
    const unpacked = unpack(packed);
    if (!unpacked) return null; // Handle unpack failure
    
    const { iv, cipher, tag } = unpacked;
    const dec = crypto.createDecipheriv(ALGO, KEY, iv);
    dec.setAuthTag(tag);
    const out = Buffer.concat([dec.update(cipher), dec.final()]);
    return out.toString("utf8");
  } catch (e) {
    // This will fire if the tag is invalid (tampered data) or on other errors
    console.error("Decryption failed:", e.message);
    return null; // Return null on decryption failure
  }
}

// ... (encryptFields/decryptFields helpers are fine, but we'll integrate directly for clarity) ...

module.exports = { encrypt, decrypt };