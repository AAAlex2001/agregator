import { BASE_PATH } from "./config";

export const SESSION_COOKIE = "admin_session";

const SESSION_TTL_SECONDS = 12 * 60 * 60;

const encoder = new TextEncoder();

const secretKey = () =>
  crypto.subtle.importKey(
    "raw",
    encoder.encode(process.env.ADMIN_NEXT_SECRET ?? ""),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );

const toHex = (bytes: ArrayBuffer) =>
  Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");

const fromHex = (hex: string) => Uint8Array.from(hex.match(/.{2}/g) ?? [], (byte) => parseInt(byte, 16));

/** Подписанный токен сессии «срок.подпись»: секрет остаётся на сервере, подделать токен нельзя. */
export const createSessionToken = async (): Promise<string> => {
  const expiresAt = String(Date.now() + SESSION_TTL_SECONDS * 1000);
  const signature = await crypto.subtle.sign("HMAC", await secretKey(), encoder.encode(expiresAt));

  return `${expiresAt}.${toHex(signature)}`;
};

/** Токен подлинный и срок не истёк. Работает и в proxy (edge), и в route handlers. */
export const isValidSessionToken = async (token: string | undefined): Promise<boolean> => {
  if (!token || !process.env.ADMIN_NEXT_SECRET) return false;

  const [expiresAt, signature] = token.split(".");

  if (!expiresAt || !signature || Number(expiresAt) < Date.now()) return false;

  return crypto.subtle.verify("HMAC", await secretKey(), fromHex(signature), encoder.encode(expiresAt));
};

/** Параметры cookie сессии. При maxAge 0 cookie удаляется. */
export const sessionCookie = (value: string, maxAge = SESSION_TTL_SECONDS) => ({
  name: SESSION_COOKIE,
  value,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: BASE_PATH || "/",
  maxAge,
});
