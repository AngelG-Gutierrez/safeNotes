import CryptoJS from 'crypto-js';
import * as Crypto from 'expo-crypto';

const SECRET_KEY = "SafeNotesKey";
export async function generateKey() {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    SECRET_KEY
  );
}

export async function encryptText(plainText: string) {
  const key = await generateKey();

  const ivBytes = await Crypto.getRandomBytesAsync(16);
  const ivHex = Array.from(ivBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const encrypted = CryptoJS.AES.encrypt(plainText, CryptoJS.enc.Hex.parse(key), {
    iv: CryptoJS.enc.Hex.parse(ivHex),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return {
    cipher: encrypted.toString(),
    iv: ivHex,
  };
}

export async function decryptText(cipher: string, iv: string) {
  const key = await generateKey();

  const decrypted = CryptoJS.AES.decrypt(cipher, CryptoJS.enc.Hex.parse(key), {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}
