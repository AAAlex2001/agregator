"HTTP-клиент админки к backend internal-ручкам. Синхронный httpx — потому что админка sync."

import logging
import os

import httpx

logger = logging.getLogger(__name__)

BACKEND_INTERNAL_BASE = os.getenv("BACKEND_INTERNAL_BASE", "http://backend:8000/api/internal").rstrip("/")
INTERNAL_API_TOKEN = os.getenv("INTERNAL_API_TOKEN", "")
TIMEOUT_SECONDS = 30.0


def notify_blog_published(slug: str, title: str, preview: str) -> None:
    "Сообщает backend о публикации статьи: тот рассылает in-app уведомления и письма. Ошибки только логируем — не валим сохранение статьи."
    if not INTERNAL_API_TOKEN:
        logger.warning("INTERNAL_API_TOKEN не задан, рассылка по статье %s пропущена", slug)
        return
    url = f"{BACKEND_INTERNAL_BASE}/blog/published"
    payload = {"slug": slug, "title": title, "preview": preview}
    headers = {"X-Internal-Token": INTERNAL_API_TOKEN}
    try:
        with httpx.Client(timeout=TIMEOUT_SECONDS) as client:
            r = client.post(url, json=payload, headers=headers)
            r.raise_for_status()
            logger.info("Backend notified about blog publication: %s, response=%s", slug, r.json())
    except httpx.HTTPError:
        logger.exception("Не удалось уведомить backend о публикации статьи %s", slug)
