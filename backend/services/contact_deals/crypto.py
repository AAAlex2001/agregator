import base64
import hashlib
import json
import logging
import os
from typing import Any

from cryptography.fernet import Fernet, InvalidToken

logger = logging.getLogger(__name__)


class ContactDealCipher:
    """Encrypt sensitive contact and payment data before database storage."""

    def __init__(self, secret: str | None = None) -> None:
        configured = secret or os.getenv("CONTACT_DEAL_ENCRYPTION_KEY")
        if not configured:
            configured = os.getenv("INTERNAL_API_TOKEN")
            if configured:
                logger.warning(
                    "CONTACT_DEAL_ENCRYPTION_KEY is missing; INTERNAL_API_TOKEN is used as fallback"
                )
        if not configured:
            raise RuntimeError("CONTACT_DEAL_ENCRYPTION_KEY is not configured")
        key = base64.urlsafe_b64encode(hashlib.sha256(configured.encode("utf-8")).digest())
        self.fernet = Fernet(key)

    def encrypt_text(self, value: str) -> str:
        return self.fernet.encrypt(value.encode("utf-8")).decode("ascii")

    def decrypt_text(self, value: str) -> str:
        try:
            return self.fernet.decrypt(value.encode("ascii")).decode("utf-8")
        except InvalidToken as exc:
            raise RuntimeError("Unable to decrypt contact deal data") from exc

    def encrypt_json(self, value: dict[str, Any]) -> str:
        payload = json.dumps(value, ensure_ascii=False, separators=(",", ":"), sort_keys=True)
        return self.encrypt_text(payload)

    def decrypt_json(self, value: str) -> dict[str, Any]:
        decoded = json.loads(self.decrypt_text(value))
        if not isinstance(decoded, dict):
            raise TypeError("Invalid encrypted contact deal payload")
        return decoded
