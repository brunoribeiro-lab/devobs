"use client";

export const hasWebCrypto =
  typeof window !== "undefined" && !!window.crypto?.subtle;

const textEncoder =
  typeof TextEncoder !== "undefined" ? new TextEncoder() : undefined;

async function deriveAesKey(secret: string): Promise<CryptoKey> {
  if (!hasWebCrypto || !textEncoder) throw new Error("WebCrypto indisponível");
  const material = textEncoder.encode(secret);
  const hash = await window.crypto.subtle.digest("SHA-256", material);
  return window.crypto.subtle.importKey(
    "raw",
    hash,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++)
    binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function base64EncodeUnicode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

export async function securePack(
  obj: unknown,
  secret: string
): Promise<string> {
  if (secret && hasWebCrypto && textEncoder) {
    const key = await deriveAesKey(secret);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const plaintext = textEncoder.encode(JSON.stringify(obj));
    const ciphertext = new Uint8Array(
      await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        plaintext
      )
    );
    const packed = new Uint8Array(iv.length + ciphertext.length);
    packed.set(iv, 0);
    packed.set(ciphertext, iv.length);
    return `enc:${bytesToBase64(packed)}`;
  }
  return `b64:${base64EncodeUnicode(JSON.stringify(obj))}`;
}
