import hashlib


def build_signature_audit(
    ip_address: str | None,
    user_agent: str | None,
    session_id: str | None,
) -> dict[str, str | None]:
    return {
        "ip_address": ip_address,
        "user_agent": (user_agent or "")[:500] or None,
        "session_id_hash": (
            hashlib.sha256(session_id.encode("utf-8")).hexdigest() if session_id else None
        ),
    }
