"Подписанные (HMAC-SHA256) самодостаточные токены для ссылок отписки и подтверждения подписки."

import base64
import hashlib
import hmac
import time

from config import email_config

CONFIRM_TTL_SECONDS = 7 * 24 * 3600


def sign(payload: str) -> str:
    secret = (email_config.mailing_token_secret or "").encode("utf-8")
    digest = hmac.new(secret, payload.encode("utf-8"), hashlib.sha256).digest()
    return base64.urlsafe_b64encode(digest).decode("ascii").rstrip("=")


def pack(payload: str) -> str:
    body = base64.urlsafe_b64encode(payload.encode("utf-8")).decode("ascii").rstrip("=")
    return f"{body}.{sign(payload)}"


def unpack(token: str) -> str | None:
    try:
        body, signature = token.split(".", 1)
        payload = base64.urlsafe_b64decode(body + "=" * (-len(body) % 4)).decode("utf-8")
    except (ValueError, UnicodeDecodeError):
        return None
    if not hmac.compare_digest(signature, sign(payload)):
        return None
    return payload


def make_unsubscribe_token(email: str) -> str:
    return pack(f"unsub:{email.strip().lower()}")


def read_unsubscribe_token(token: str) -> str | None:
    payload = unpack(token)
    if payload is None or not payload.startswith("unsub:"):
        return None
    return payload.removeprefix("unsub:")


def make_confirm_token(email: str, ttl_seconds: int = CONFIRM_TTL_SECONDS) -> str:
    expiry = int(time.time()) + ttl_seconds
    return pack(f"confirm:{email.strip().lower()}:{expiry}")


def read_confirm_token(token: str) -> str | None:
    payload = unpack(token)
    if payload is None or not payload.startswith("confirm:"):
        return None
    parts = payload.split(":")
    if len(parts) != 3:
        return None
    email, expiry = parts[1], parts[2]
    if not expiry.isdigit() or int(expiry) < int(time.time()):
        return None
    return email
