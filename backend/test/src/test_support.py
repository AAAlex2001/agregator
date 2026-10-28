"""Поддержка: обращения, ответы и файлы — как их использует сайт."""

import pytest
from sqlalchemy import update

from src.core.database import SessionLocal
from src.support.models import Ticket, TicketStatus

pytestmark = pytest.mark.asyncio(loop_scope="session")


async def test_create_list_get_and_reply(user_client, app) -> None:
    """Пользователь создаёт обращение с файлом, видит его в списке, открывает и отвечает."""
    _, client = await user_client("Анна")

    created = await client.post(
        "/support/tickets",
        data={"subject": " Не приходит письмо ", "category": "TECHNICAL", "message": "Помогите"},
        files=[("files", ("scan.pdf", b"%PDF-1.4 test", "application/pdf"))],
    )
    assert created.status_code == 200, created.text
    ticket = created.json()
    assert ticket["subject"] == "Не приходит письмо"
    assert ticket["number"] == f"T-{ticket['id'] + 1000}"
    assert ticket["status"] == "REVIEW"
    assert ticket["messages"][0]["author"] == "user"
    attachment = ticket["messages"][0]["attachments"][0]
    assert attachment["name"] == "scan.pdf"
    assert (app.state.uploads / attachment["url"].removeprefix("/uploads/")).exists()

    listed = await client.get("/support/tickets")
    assert listed.status_code == 200
    assert [item["id"] for item in listed.json()["items"]] == [ticket["id"]]
    assert listed.json()["has_more"] is False

    opened = await client.get(f"/support/tickets/{ticket['id']}")
    assert opened.status_code == 200
    assert len(opened.json()["messages"]) == 1

    replied = await client.post(f"/support/tickets/{ticket['id']}/messages", data={"text": "Ещё деталь"})
    assert replied.status_code == 200, replied.text
    assert [message["text"] for message in replied.json()["messages"]] == ["Помогите", "Ещё деталь"]


async def test_reply_rules(user_client) -> None:
    """Пустой ответ, чужое и закрытое обращение дают понятные ошибки."""
    _, owner = await user_client("Олег")
    _, stranger = await user_client("Чужой")

    created = await owner.post(
        "/support/tickets",
        data={"subject": "Вопрос", "category": "OTHER", "message": "Текст"},
    )
    ticket_id = created.json()["id"]

    empty = await owner.post(f"/support/tickets/{ticket_id}/messages", data={"text": "   "})
    assert empty.status_code == 400
    assert empty.json()["detail"] == "Введите сообщение или прикрепите файл"

    foreign = await stranger.get(f"/support/tickets/{ticket_id}")
    assert foreign.status_code == 404

    wrong_file = await owner.post(
        f"/support/tickets/{ticket_id}/messages",
        data={"text": "файл"},
        files=[("files", ("virus.exe", b"MZ", "application/octet-stream"))],
    )
    assert wrong_file.status_code == 400

    async with SessionLocal() as db:
        await db.execute(update(Ticket).where(Ticket.id == ticket_id).values(status=TicketStatus.CLOSED))
        await db.commit()

    closed = await owner.post(f"/support/tickets/{ticket_id}/messages", data={"text": "Алло"})
    assert closed.status_code == 409


async def test_guest_cannot_use_support(guest) -> None:
    """Без входа обращения недоступны."""
    response = await guest.get("/support/tickets")

    assert response.status_code == 401
    assert response.json()["detail"] == "Необходима авторизация"
