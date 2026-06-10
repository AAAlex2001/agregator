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


def internal_get(path: str) -> dict[str, Any]:
    "GET к backend internal-ручке (JSON). Бросает RuntimeError при отсутствии токена/ошибке HTTP."
    if not INTERNAL_API_TOKEN:
        raise RuntimeError("INTERNAL_API_TOKEN не задан в окружении админки")
    url = f"{BACKEND_INTERNAL_BASE}{path}"
    headers = {"X-Internal-Token": INTERNAL_API_TOKEN}
    with httpx.Client(timeout=TIMEOUT_SECONDS) as client:
        r = client.get(url, headers=headers)
        r.raise_for_status()
        return r.json()


def import_companies() -> dict[str, Any]:
    "Запускает на backend импорт базы компаний из JSON (файл уже в общем томе)."
    return internal_post("/companies/import", {})


def companies_stats() -> dict[str, Any]:
    "Возвращает статистику базы: всего / к отправке / отправлено / осталось."
    return internal_get("/companies/stats")


def send_batch(
    subject: str, body_text: str, batch_size: int, presentation_url: str | None
) -> dict[str, Any]:
    "Разово рассылает одну пачку по базе компаний. Презентация — ссылкой в письме (если загружена)."
    return internal_post(
        "/mailing/send-batch",
        {
            "subject": subject,
            "body_text": body_text,
            "batch_size": batch_size,
            "presentation_url": presentation_url,
        },
    )


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
