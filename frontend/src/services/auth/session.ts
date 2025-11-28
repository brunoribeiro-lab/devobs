"use client";

import Cookies from "js-cookie";
import { securePack } from "@/utils/crypto";
import { AuthUserCookie } from "@/types/authUserCookie";

export function extractUserInfo(data: Record<string, unknown>): AuthUserCookie {
  const pickStr = (v: unknown) => (typeof v === "string" ? v : null);
  const pickNumBool = (v: unknown) =>
    typeof v === "number" || typeof v === "boolean" ? v : null;

  return {
    uid: pickStr(data["uid"]) || "",
    name: pickStr(data["name"]),
    email: pickStr(data["email"]),
    cc_verified: pickNumBool(data["cc_verified"]),
  };
}

function buildCookieOptions(expiresInSeconds: number) {
  const isSecure =
    typeof window !== "undefined" && window.location.protocol === "https:";
  const expires = new Date(Date.now() + expiresInSeconds * 1000);
  const domain = process.env.NEXT_PUBLIC_COOKIE;
  const base = { expires, sameSite: "lax" as const, secure: isSecure };
  return domain && domain !== "localhost"
    ? { ...base, domain: `.${domain}` }
    : base;
}

export async function setAuthCookies(params: {
  token: string;
  refreshToken?: string;
  expiresInSeconds: number;
  user: AuthUserCookie;
}) {
  const { token, refreshToken, expiresInSeconds, user } = params;
  const opts = buildCookieOptions(expiresInSeconds);

  Cookies.set("access_token", token, opts);
  if (refreshToken) Cookies.set("refresh_token", refreshToken, opts);

  const secret = process.env.NEXT_PUBLIC_COOKIE_SECRET || "";
  const userPayload = await securePack(user, secret);
  Cookies.set("user", userPayload, opts);
}
