import { NextResponse } from "next/server";

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function deriveAesKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const material = enc.encode(secret);
  const hash = await crypto.subtle.digest("SHA-256", material);
  return crypto.subtle.importKey("raw", hash, { name: "AES-GCM" }, false, [
    "decrypt",
  ]);
}

export function previewUserCookie(val: string): string {
  return val.startsWith("enc:")
    ? "[enc] " + val.length + " bytes"
    : val.startsWith("b64:")
    ? "[b64] " + val.slice(0, 80) + (val.length > 80 ? "…" : "")
    : val.slice(0, 80) + (val.length > 80 ? "…" : "");
}

export async function decodeUserCookie(
  val: string,
  secrets: string | string[] = []
): Promise<unknown | null> {
  const dec = new TextDecoder();

  try {
    if (val.startsWith("b64:")) {
      const raw = base64ToBytes(val.slice(4));
      const json = dec.decode(raw);
      return JSON.parse(json);
    }

    if (val.startsWith("enc:")) {
      const packed = base64ToBytes(val.slice(4));
      if (packed.byteLength <= 12) return null;

      const iv = packed.slice(0, 12);
      const ciphertext = packed.slice(12);

      const list = Array.isArray(secrets) ? secrets : [secrets];
      for (const secret of list) {
        if (!secret) continue;

        try {
          const key = await deriveAesKey(secret);
          const plainBuf = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            ciphertext
          );
          const json = dec.decode(new Uint8Array(plainBuf));
          return JSON.parse(json);
        } catch {}
      }
      return null;
    }

    return null;
  } catch {
    return null;
  }
}

export function clearAuthCookies(
  res: NextResponse,
  names: string[] = ["access_token", "refresh_token", "user"]
) {
  for (const n of names) {
    res.cookies.set(n, "", { maxAge: 0, path: "/" });
  }
  return res;
}
