"Публичные ручки писем: отписка по подписанному токену (видимая ссылка в письме + one-click RFC 8058)."

import logging

from fastapi import APIRouter, Depends, Query
from fastapi.responses import HTMLResponse, PlainTextResponse
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from services.email.suppression import SuppressionRepository
from utils.signed_tokens import read_unsubscribe_token

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/email", tags=["email"])

PAGE_TEMPLATE = """<!doctype html>
<html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<style>
  body{{margin:0;font-family:Arial,Helvetica,sans-serif;background:#f4f5f7;color:#1f2937}}
  .box{{max-width:520px;margin:12vh auto;background:#fff;border-radius:16px;padding:40px 32px;
        text-align:center;box-shadow:0 6px 24px rgba(15,23,42,.08)}}
  h1{{font-size:22px;margin:0 0 12px}}
  p{{font-size:15px;line-height:23px;color:#4b5563;margin:0}}
  a{{color:#c2410c}}
</style></head>
<body><div class="box"><h1>{title}</h1><p>{text}</p></div></body></html>"""

OK_PAGE = PAGE_TEMPLATE.format(
    title="Вы отписаны",
    text="Адрес удалён из рассылки площадки «Ресурс-Плюс». Больше писем на него мы не отправим. "
    "Если это произошло по ошибке — напишите на expert@plus-resurs.com.",
)
BAD_PAGE = PAGE_TEMPLATE.format(
    title="Ссылка недействительна",
    text="Ссылка отписки повреждена или устарела. Напишите на expert@plus-resurs.com, и мы отпишем вас вручную.",
)


@router.get("/unsubscribe", response_class=HTMLResponse)
async def unsubscribe_page(
    token: str = Query(..., max_length=600),
    db: AsyncSession = Depends(get_db),
) -> HTMLResponse:
    "Видимая ссылка из письма: подтверждает отписку и показывает страницу."
    email = read_unsubscribe_token(token)
    if not email:
        return HTMLResponse(BAD_PAGE, status_code=400)
    await SuppressionRepository(db).add(email, reason="unsubscribe")
    logger.info("Unsubscribe via link: %s", email)
    return HTMLResponse(OK_PAGE)


@router.post("/unsubscribe", response_class=PlainTextResponse)
async def unsubscribe_oneclick(
    token: str = Query(..., max_length=600),
    db: AsyncSession = Depends(get_db),
) -> PlainTextResponse:
    "One-click отписка (RFC 8058): почтовый клиент шлёт POST. Всегда отвечаем 200."
    email = read_unsubscribe_token(token)
    if email:
        await SuppressionRepository(db).add(email, reason="unsubscribe")
        logger.info("Unsubscribe one-click: %s", email)
    return PlainTextResponse("OK")
