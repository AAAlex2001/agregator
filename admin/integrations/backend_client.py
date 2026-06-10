"HTTP-клиент админки к backend internal-ручкам. Синхронный httpx — потому что админка sync."

import logging
import os
from typing import Any

import httpx

logger = logging.getLogger(__name__)

BACKEND_INTERNAL_BASE = os.getenv("BACKEND_INTERNAL_BASE", "http://backend:8000/api/internal").rstrip("/")
INTERNAL_API_TOKEN = os.getenv("INTERNAL_API_TOKEN", "")
TIMEOUT_SECONDS = 30.0


def internal_post(path: str, payload: dict[str, Any]) -> dict[str, Any]:
    "POST к backend internal-ручке с X-Internal-Token. Бросает RuntimeError при отсутствии токена/ошибке HTTP."
    if not INTERNAL_API_TOKEN:
        raise RuntimeError("INTERNAL_API_TOKEN не задан в окружении админки")
    url = f"{BACKEND_INTERNAL_BASE}{path}"
    headers = {"X-Internal-Token": INTERNAL_API_TOKEN}
    with httpx.Client(timeout=TIMEOUT_SECONDS) as client:
        r = client.post(url, json=payload, headers=headers)
        r.raise_for_status()
        return r.json()


def internal_get_html(path: str, params: dict[str, Any]) -> str:
    "GET к backend internal-ручке, возвращающей HTML (превью письма). Бросает RuntimeError при ошибке."
    if not INTERNAL_API_TOKEN:
        raise RuntimeError("INTERNAL_API_TOKEN не задан в окружении админки")
    url = f"{BACKEND_INTERNAL_BASE}{path}"
    headers = {"X-Internal-Token": INTERNAL_API_TOKEN}
    with httpx.Client(timeout=TIMEOUT_SECONDS) as client:
        r = client.get(url, params=params, headers=headers)
        r.raise_for_status()
        return r.text


def create_campaign(
    name: str, subject: str, batch_size: int, import_token: str, has_presentation: bool, only_active: bool
) -> dict[str, Any]:
    "Создаёт кампанию через backend. Файлы (JSON+PDF) уже лежат в общем томе под import_token — бэк читает их сам."
    return internal_post(
        "/campaigns",
        {
            "name": name,
            "subject": subject,
            "batch_size": batch_size,
            "import_token": import_token,
            "has_presentation": has_presentation,
            "only_active": only_active,
        },
    )


def send_campaign_batch(campaign_id: int) -> dict[str, Any]:
    "Разово отправляет одну пачку кампании (без цикла)."
    return internal_post(f"/campaigns/{campaign_id}/send-batch", {})


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
