"Публичная ручка отписки от рассылок. Открывается по ссылке из письма."

from fastapi import APIRouter, Depends, Query
from fastapi.responses import HTMLResponse
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from services.campaigns import CampaignRepository, UnsubscribeUseCase

router = APIRouter(tags=["unsubscribe"])

PAGE = """<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><title>Отписка</title>
<style>
body{{font-family:"Montserrat";background:#f5f7fa;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}}
.card{{background:#fff;padding:40px 48px;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.08);text-align:center;max-width:440px}}
h1{{font-size:22px;color:#0f172a;margin:0 0 12px}}
p{{font-size:15px;color:#475569;line-height:22px;margin:0}}
</style></head>
<body><div class="card"><h1>Вы отписаны</h1>
<p>Адрес <b>{email}</b> больше не будет получать наши рассылки.</p></div></body></html>"""


@router.get("/unsubscribe", response_class=HTMLResponse)
async def unsubscribe(
    email: str = Query(..., min_length=3, max_length=320),
    db: AsyncSession = Depends(get_db),
) -> HTMLResponse:
    "Добавляет адрес в стоп-лист и показывает страницу подтверждения."
    await UnsubscribeUseCase(CampaignRepository(db)).execute(email)
    return HTMLResponse(PAGE.format(email=email))
