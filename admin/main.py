import json
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from uuid import uuid4

import httpx
from markupsafe import Markup, escape
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from sqladmin import Admin, BaseView, ModelView, expose
from sqladmin.authentication import AuthenticationBackend
from starlette.middleware.sessions import SessionMiddleware
from starlette.requests import Request
from starlette.responses import RedirectResponse
from sqlalchemy import create_engine, inspect as sa_inspect
from sqlalchemy.orm import selectinload, sessionmaker

from models import (
    Base, User, Order, OrderResponse, Chat, ChatMessage,
    Payment, PricingPlan, UserSubscription, Review, Session, PasswordResetCode,
    LandingHero, LandingSectionHeader, LandingStep, LandingOrderExample,
    LandingAdvantage, LandingIndustry, LandingReview, LandingFaq, LandingPricingContent,
    SubscriptionKind, SubscriptionStatus,
    SupportTicket, SupportTicketMessage, TicketCategory, TicketMessageAuthor, TicketStatus,
    Notification, NotificationType,
    ExpertRoomMessage, ExpertRoomBan,
    PlatformSettings,
    Article, ArticleKind, ArticleStatus,
)

# --- БД (sync для SQLAdmin) ---
DATABASE_URL = os.getenv("DATABASE_URL", "")
# SQLAdmin работает с sync движком
SYNC_DATABASE_URL = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")

engine = create_engine(SYNC_DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine)

# --- Авторизация в админке ---
ADMIN_LOGIN = os.environ["ADMIN_LOGIN"]
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]
ADMIN_SECRET = os.environ["ADMIN_SECRET"]

if len(ADMIN_PASSWORD) < 12:
    raise RuntimeError("ADMIN_PASSWORD должен быть не короче 12 символов")
if len(ADMIN_SECRET) < 32:
    raise RuntimeError("ADMIN_SECRET должен быть не короче 32 символов (используется для подписи cookie)")


class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        username = form.get("username")
        password = form.get("password")
        if username == ADMIN_LOGIN and password == ADMIN_PASSWORD:
            request.session.update({"authenticated": True})
            return True
        return False

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        return request.session.get("authenticated", False)


# --- FastAPI ---
app = FastAPI(title="Ресурс-Плюс Админ-панель")
app.add_middleware(SessionMiddleware, secret_key=ADMIN_SECRET)

authentication_backend = AdminAuth(secret_key=ADMIN_SECRET)
admin = Admin(
    app,
    engine,
    authentication_backend=authentication_backend,
    title="Ресурс-Плюс | Админка",
    base_url="/admin",
    templates_dir=os.path.join(os.path.dirname(__file__), "templates"),
)


@app.post("/admin-actions/users/{user_id}/grant-subscription", name="grant_user_subscription")
async def grant_user_subscription(
    request: Request,
    user_id: int,
    plan_id: int = Form(...),
):
    if not request.session.get("authenticated", False):
        return RedirectResponse("/admin/login", status_code=303)

    with SessionLocal() as db:
        user = db.get(User, user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="Пользователь не найден")

        plan = db.get(PricingPlan, plan_id)
        if plan is None or not plan.is_active:
            raise HTTPException(status_code=404, detail="Активный тариф не найден")

        now = datetime.now(timezone.utc)
        (
            db.query(UserSubscription)
            .filter(
                UserSubscription.user_id == user_id,
                UserSubscription.status.in_(
                    [SubscriptionStatus.ACTIVE, SubscriptionStatus.PENDING]
                ),
            )
            .update(
                {
                    UserSubscription.status: SubscriptionStatus.EXPIRED,
                    UserSubscription.updated_at: now,
                },
                synchronize_session=False,
            )
        )
        db.add(
            UserSubscription(
                user_id=user_id,
                plan_id=plan.id,
                kind=plan.kind,
                status=SubscriptionStatus.ACTIVE,
                activated_at=now,
                expires_at=compute_subscription_expires_at(plan, now),
                responses_remaining=compute_subscription_responses_remaining(plan.kind),
                payment_id=None,
            )
        )
        db.commit()

    return RedirectResponse(
        request.headers.get("referer") or f"/admin/user/details/{user_id}",
        status_code=303,
    )


ARTICLE_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}
ARTICLE_MAX_IMAGE_SIZE = 20 * 1024 * 1024
ARTICLE_UPLOADS_ROOT = Path("/app/uploads/articles")


@app.post("/admin-actions/articles/upload-image", name="article_upload_image")
async def article_upload_image(request: Request, file: UploadFile = File(...)):
    if not request.session.get("authenticated", False):
        raise HTTPException(status_code=401, detail="Не авторизован")

    extension = Path(file.filename or "").suffix.lower()
    if extension not in ARTICLE_IMAGE_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Недопустимое расширение")

    ARTICLE_UPLOADS_ROOT.mkdir(parents=True, exist_ok=True)
    generated_name = f"{uuid4().hex}{extension}"
    full_path = ARTICLE_UPLOADS_ROOT / generated_name

    total = 0
    with open(full_path, "wb") as out:
        while True:
            chunk = await file.read(1024 * 1024)
            if not chunk:
                break
            total += len(chunk)
            if total > ARTICLE_MAX_IMAGE_SIZE:
                out.close()
                full_path.unlink(missing_ok=True)
                raise HTTPException(status_code=413, detail="Файл слишком большой")
            out.write(chunk)

    return {"url": f"/uploads/articles/{generated_name}"}


SUPPORT_FILE_EXTENSIONS = {".pdf", ".jpeg", ".jpg", ".png", ".doc", ".docx", ".xls", ".xlsx"}
SUPPORT_MAX_FILE_SIZE = 100 * 1024 * 1024
SUPPORT_MAX_FILES = 6
SUPPORT_UPLOADS_ROOT = Path("/app/uploads/support")


def save_support_attachments_sync(ticket_id: int, files: list[UploadFile]) -> list[dict]:
    "Синхронно сохраняет файлы тикета в общий с бэкендом том /app/uploads/support/{ticket_id}/."
    saved: list[dict] = []
    valid = [f for f in files if f and f.filename]
    if not valid:
        return saved
    if len(valid) > SUPPORT_MAX_FILES:
        valid = valid[:SUPPORT_MAX_FILES]

    upload_dir = SUPPORT_UPLOADS_ROOT / str(ticket_id)
    upload_dir.mkdir(parents=True, exist_ok=True)

    for upload in valid:
        original_name = upload.filename or "file"
        extension = Path(original_name).suffix.lower()
        if extension not in SUPPORT_FILE_EXTENSIONS:
            continue
        generated_name = f"{uuid4().hex}{extension}"
        full_path = upload_dir / generated_name
        with open(full_path, "wb") as out:
            chunk = upload.file.read(1024 * 1024)
            total = 0
            while chunk:
                total += len(chunk)
                if total > SUPPORT_MAX_FILE_SIZE:
                    out.close()
                    full_path.unlink(missing_ok=True)
                    break
                out.write(chunk)
                chunk = upload.file.read(1024 * 1024)
            else:
                saved.append({
                    "name": original_name,
                    "url": f"/uploads/support/{ticket_id}/{generated_name}",
                })
    return saved


@app.post("/admin-actions/support-tickets/{ticket_id}/reply", name="support_ticket_reply")
async def support_ticket_reply(
    request: Request,
    ticket_id: int,
    text: str = Form(""),
    files: list[UploadFile] = File(default=[]),
):
    if not request.session.get("authenticated", False):
        return RedirectResponse("/admin/login", status_code=303)

    cleaned = (text or "").strip()
    attachments = save_support_attachments_sync(ticket_id, files)

    if not cleaned and not attachments:
        return RedirectResponse(f"/admin/support-ticket/edit/{ticket_id}", status_code=303)

    with SessionLocal() as db:
        ticket = db.get(SupportTicket, ticket_id)
        if ticket is None:
            raise HTTPException(status_code=404, detail="Тикет не найден")
        if ticket.status == TicketStatus.CLOSED:
            return RedirectResponse(f"/admin/support-ticket/edit/{ticket_id}", status_code=303)

        now = datetime.now(timezone.utc)
        message = SupportTicketMessage(
            ticket_id=ticket.id,
            author_kind=TicketMessageAuthor.ADMIN,
            author_user_id=None,
            author_name="Поддержка",
            text=cleaned,
            attachments=attachments,
            created_at=now,
        )
        db.add(message)
        ticket.status = TicketStatus.ANSWERED
        ticket.has_unread_for_user = True
        ticket.has_unread_for_admin = False
        ticket.updated_at = now

        if cleaned:
            preview = (cleaned[:160] + "…") if len(cleaned) > 160 else cleaned
        else:
            preview = f"Прикреплено файлов: {len(attachments)}"
        notification = Notification(
            user_id=ticket.user_id,
            type=NotificationType.SUPPORT_REPLY,
            payload={
                "ticket_number": ticket.number,
                "subject": ticket.subject,
                "preview": preview,
            },
            action_url=f"/support?ticket={ticket.id}",
            is_read=False,
            created_at=now,
        )
        db.add(notification)
        db.query(User).filter(User.id == ticket.user_id).update(
            {User.notification_unread_count: User.notification_unread_count + 1},
            synchronize_session=False,
        )

        db.commit()

    return RedirectResponse(f"/admin/support-ticket/edit/{ticket_id}#stp-reply", status_code=303)


@app.get("/admin-actions/support-tickets/{ticket_id}/close", name="support_ticket_close")
async def support_ticket_close(request: Request, ticket_id: int):
    if not request.session.get("authenticated", False):
        return RedirectResponse("/admin/login", status_code=303)

    with SessionLocal() as db:
        ticket = db.get(SupportTicket, ticket_id)
        if ticket is None:
            raise HTTPException(status_code=404, detail="Тикет не найден")
        ticket.status = TicketStatus.CLOSED
        ticket.has_unread_for_admin = False
        ticket.updated_at = datetime.now(timezone.utc)
        db.commit()

    return RedirectResponse(f"/admin/support-ticket/edit/{ticket_id}", status_code=303)


@app.post("/admin-actions/expert-room/messages/{message_id}/delete", name="expert_room_message_delete")
async def expert_room_message_delete(request: Request, message_id: int):
    if not request.session.get("authenticated", False):
        return RedirectResponse("/admin/login", status_code=303)

    with SessionLocal() as db:
        message = db.get(ExpertRoomMessage, message_id)
        if message is not None:
            db.delete(message)
            db.commit()

    return RedirectResponse("/admin/expert-room-chat", status_code=303)


@app.post("/admin-actions/expert-room/users/{user_id}/ban", name="expert_room_user_ban")
async def expert_room_user_ban(
    request: Request,
    user_id: int,
    reason: str = Form(""),
):
    if not request.session.get("authenticated", False):
        return RedirectResponse("/admin/login", status_code=303)

    cleaned_reason = (reason or "").strip()[:500]

    with SessionLocal() as db:
        existing = db.query(ExpertRoomBan).filter(ExpertRoomBan.user_id == user_id).first()
        if existing is not None:
            existing.reason = cleaned_reason
        else:
            db.add(ExpertRoomBan(user_id=user_id, reason=cleaned_reason))
        db.commit()

    return RedirectResponse("/admin/expert-room-chat", status_code=303)


# ========== УТИЛИТЫ ==========

def format_technical_files(m, a):
    files = getattr(m, "technical_files", None)
    if not files:
        return "—"
    if isinstance(files, list):
        parts = []
        for f in files:
            if isinstance(f, str):
                name = f.rsplit("/", 1)[-1]
                ext = name.rsplit(".", 1)[-1].lower() if "." in name else ""
                if ext in ("jpg", "jpeg", "png", "gif", "webp", "svg"):
                    parts.append(
                        f'<div style="margin:4px 0">'
                        f'<a href="{f}" target="_blank">'
                        f'<img src="{f}" style="max-width:200px;max-height:150px;border-radius:6px;border:1px solid #ddd;" />'
                        f'</a>'
                        f'<br><small>{name}</small></div>'
                    )
                else:
                    parts.append(f'<div style="margin:4px 0"><a href="{f}" target="_blank">{name}</a></div>')
            else:
                parts.append(str(f))
        return Markup("".join(parts))
    return str(files)


def format_json_payload(value):
    if not value:
        return "—"
    pretty = json.dumps(value, ensure_ascii=False, indent=2)
    return Markup(
        f'<pre style="white-space:pre-wrap;word-break:break-word;max-width:960px;font-size:12px;line-height:1.5">{escape(pretty)}</pre>'
    )


def compute_subscription_expires_at(plan: PricingPlan, now: datetime) -> datetime | None:
    if plan.kind == SubscriptionKind.SINGLE:
        return None
    if plan.duration_days is None or plan.duration_days <= 0:
        return None
    return now + timedelta(days=plan.duration_days)


def compute_subscription_responses_remaining(kind: SubscriptionKind) -> int | None:
    if kind == SubscriptionKind.SINGLE:
        return 1
    return None


DADATA_PARTY_URL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party"


async def fetch_dadata_party_by_inn(inn: str) -> dict | None:
    token = os.getenv("DADATA_API_KEY", "")
    if not token:
        return None
    headers = {"Authorization": f"Token {token}", "Content-Type": "application/json"}
    secret = os.getenv("DADATA_SECRET_KEY", "")
    if secret:
        headers["X-Secret"] = secret
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                DADATA_PARTY_URL,
                headers=headers,
                json={"query": inn, "count": 10},
            )
    except httpx.HTTPError:
        return None
    if response.status_code >= 400:
        return None
    suggestions = response.json().get("suggestions", []) or []
    for suggestion in suggestions:
        data = suggestion.get("data") or {}
        if data.get("inn") == inn:
            return suggestion
    return None


COMPANY_FIELD_LABELS = {
    "value": "Наименование",
    "unrestricted_value": "Полное наименование",
    "data": "Карточка компании",
    "inn": "ИНН",
    "kpp": "КПП",
    "ogrn": "ОГРН",
    "ogrn_date": "Дата присвоения ОГРН",
    "type": "Тип",
    "branch_type": "Тип подразделения",
    "branch_count": "Количество филиалов",
    "source": "Источник",
    "qc": "Код качества",
    "hid": "Идентификатор DaData",
    "capital": "Уставный капитал",
    "invalid": "Признак недостоверности",
    "management": "Руководство",
    "name": "Название",
    "post": "Должность",
    "start_date": "Дата назначения",
    "disqualified": "Дисквалификация",
    "founders": "Учредители",
    "managers": "Руководители",
    "predecessors": "Предшественники",
    "successors": "Правопреемники",
    "state": "Состояние",
    "status": "Статус",
    "actuality_date": "Дата актуальности",
    "registration_date": "Дата регистрации",
    "liquidation_date": "Дата ликвидации",
    "opf": "Организационно-правовая форма",
    "code": "Код",
    "full": "Полное название",
    "short": "Краткое название",
    "full_with_opf": "Полное название с ОПФ",
    "short_with_opf": "Краткое название с ОПФ",
    "latin": "Латиницей",
    "okpo": "ОКПО",
    "okato": "ОКАТО",
    "oktmo": "ОКТМО",
    "okogu": "ОКОГУ",
    "okfs": "ОКФС",
    "okved": "ОКВЭД",
    "okved_type": "Тип ОКВЭД",
    "okveds": "Дополнительные ОКВЭД",
    "authorities": "Регистрационные органы",
    "documents": "Документы",
    "licenses": "Лицензии",
    "finance": "Финансы",
    "finance_history": "Финансовая история",
    "address": "Адрес",
    "postal_code": "Почтовый индекс",
    "country": "Страна",
    "country_iso_code": "ISO код страны",
    "federal_district": "Федеральный округ",
    "region_fias_id": "FIAS региона",
    "region_kladr_id": "КЛАДР региона",
    "region_iso_code": "Код региона ISO",
    "region_with_type": "Регион",
    "region_type": "Тип региона",
    "region_type_full": "Полный тип региона",
    "region": "Регион",
    "area_fias_id": "FIAS района",
    "area_kladr_id": "КЛАДР района",
    "area_with_type": "Район",
    "area_type": "Тип района",
    "area_type_full": "Полный тип района",
    "area": "Район",
    "city_fias_id": "FIAS города",
    "city_kladr_id": "КЛАДР города",
    "city_with_type": "Город",
    "city_type": "Тип города",
    "city_type_full": "Полный тип города",
    "city": "Город",
    "city_area": "Городская зона",
    "city_district_fias_id": "FIAS городского района",
    "city_district_kladr_id": "КЛАДР городского района",
    "city_district_with_type": "Городской район",
    "city_district_type": "Тип городского района",
    "city_district_type_full": "Полный тип городского района",
    "city_district": "Городской район",
    "settlement_fias_id": "FIAS населённого пункта",
    "settlement_kladr_id": "КЛАДР населённого пункта",
    "settlement_with_type": "Населённый пункт",
    "settlement_type": "Тип населённого пункта",
    "settlement_type_full": "Полный тип населённого пункта",
    "settlement": "Населённый пункт",
    "street_fias_id": "FIAS улицы",
    "street_kladr_id": "КЛАДР улицы",
    "street_with_type": "Улица",
    "street_type": "Тип улицы",
    "street_type_full": "Полный тип улицы",
    "street": "Улица",
    "stead_fias_id": "FIAS участка",
    "stead_cadnum": "Кадастровый номер участка",
    "stead_type": "Тип участка",
    "stead_type_full": "Полный тип участка",
    "stead": "Участок",
    "house_fias_id": "FIAS дома",
    "house_kladr_id": "КЛАДР дома",
    "house_cadnum": "Кадастровый номер дома",
    "house_flat_count": "Количество помещений",
    "house_type": "Тип дома",
    "house_type_full": "Полный тип дома",
    "house": "Дом",
    "block_type": "Тип корпуса",
    "block_type_full": "Полный тип корпуса",
    "block": "Корпус",
    "entrance": "Подъезд",
    "floor": "Этаж",
    "flat_fias_id": "FIAS помещения",
    "flat_cadnum": "Кадастровый номер помещения",
    "flat_type": "Тип помещения",
    "flat_type_full": "Полный тип помещения",
    "flat": "Помещение",
    "flat_area": "Площадь помещения",
    "square_meter_price": "Цена за м²",
    "flat_price": "Стоимость помещения",
    "room_fias_id": "FIAS комнаты",
    "room_cadnum": "Кадастровый номер комнаты",
    "room_type": "Тип комнаты",
    "room_type_full": "Полный тип комнаты",
    "room": "Комната",
    "postal_box": "Абонентский ящик",
    "fias_id": "FIAS ID",
    "fias_code": "FIAS код",
    "fias_level": "Уровень FIAS",
    "fias_actuality_state": "Статус актуальности FIAS",
    "kladr_id": "КЛАДР ID",
    "geoname_id": "Geoname ID",
    "capital_marker": "Признак столицы",
    "tax_office": "Код налоговой",
    "tax_office_legal": "Код налоговой (юр. лицо)",
    "timezone": "Часовой пояс",
    "geo_lat": "Широта",
    "geo_lon": "Долгота",
    "beltway_hit": "В пределах МКАД",
    "beltway_distance": "Расстояние до МКАД",
    "metro": "Метро",
    "line": "Линия",
    "distance": "Расстояние",
    "divisions": "Подразделения",
    "qc_geo": "Качество геокодирования",
    "qc_complete": "Полнота адреса",
    "qc_house": "Качество номера дома",
    "history_values": "История адресов",
    "unparsed_parts": "Нераспознанные части",
    "phones": "Телефоны",
    "emails": "Email",
    "sites": "Сайты",
    "employee_count": "Численность сотрудников",
}

COMPANY_DATE_FIELDS = {
    "start_date",
    "actuality_date",
    "registration_date",
    "liquidation_date",
    "ogrn_date",
}


def get_company_field_label(key):
    return COMPANY_FIELD_LABELS.get(key, key.replace("_", " ").capitalize())


def has_company_value(value):
    if value is None:
        return False
    if isinstance(value, str):
        return value.strip() != ""
    if isinstance(value, (list, tuple, set, dict)):
        return len(value) > 0
    return True


def format_company_timestamp(value):
    try:
        if isinstance(value, str):
            cleaned = value.strip()
            if not cleaned or not cleaned.lstrip("-").isdigit():
                return None
            value = int(cleaned)
        elif not isinstance(value, (int, float)):
            return None

        timestamp = float(value)
        if abs(timestamp) > 10_000_000_000:
            timestamp /= 1000

        return datetime.fromtimestamp(timestamp, tz=timezone.utc).strftime("%d.%m.%Y %H:%M")
    except (OverflowError, OSError, ValueError):
        return None


def format_company_scalar(key, value):
    if not has_company_value(value):
        return Markup('<span style="color:#8a94a6;">—</span>')

    if key in COMPANY_DATE_FIELDS:
        formatted_date = format_company_timestamp(value)
        if formatted_date:
            return escape(formatted_date)

    if isinstance(value, bool):
        return "Да" if value else "Нет"

    if isinstance(value, float):
        return escape(f"{value:.2f}".rstrip("0").rstrip("."))

    return escape(str(value))


def get_company_item_title(item, index):
    if isinstance(item, dict):
        for path in (
            ("name", "full_with_opf"),
            ("name", "short_with_opf"),
            ("name", "full"),
            ("name", "short"),
            ("data", "city"),
            ("data", "street_with_type"),
        ):
            current = item
            for part in path:
                if not isinstance(current, dict):
                    current = None
                    break
                current = current.get(part)
            if has_company_value(current):
                return str(current)

        for key in ("value", "unrestricted_value", "name", "post", "type", "city", "street_with_type"):
            current = item.get(key)
            if has_company_value(current):
                return str(current)

    return f"Элемент {index}"


def render_company_row(label, value_html, is_first=False):
    border = "" if is_first else "border-top:1px solid #e8edf3;"
    return (
        f'<div style="{border}display:grid;grid-template-columns:minmax(220px,280px) minmax(0,1fr);gap:16px;padding:12px 16px;align-items:start;">'
        f'<div style="color:#526071;font-size:13px;font-weight:700;line-height:1.5;">{escape(label)}</div>'
        f'<div style="color:#0f172a;font-size:14px;line-height:1.6;white-space:pre-wrap;word-break:break-word;">{value_html}</div>'
        "</div>"
    )


def render_company_card(title, body_html, is_first=False):
    border = "" if is_first else "border-top:1px solid #e8edf3;"
    return (
        f'<div style="{border}padding:14px 16px;background:#fbfcfe;">'
        f'<div style="margin-bottom:12px;color:#0f172a;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;">{escape(title)}</div>'
        f"{body_html}"
        "</div>"
    )


def wrap_company_group(parts):
    if not parts:
        return Markup('<div style="padding:12px 16px;color:#8a94a6;">Нет данных</div>')
    return Markup(
        '<div style="border:1px solid #dbe4ee;border-radius:16px;background:#ffffff;overflow:hidden;">'
        + "".join(parts)
        + "</div>"
    )


def render_company_list(items):
    visible_items = [item for item in items if has_company_value(item)]
    if not visible_items:
        return Markup('<span style="color:#8a94a6;">—</span>')

    if all(not isinstance(item, (dict, list, tuple, set)) for item in visible_items):
        points = "".join(
            f'<li style="margin:4px 0;">{format_company_scalar("", item)}</li>'
            for item in visible_items
        )
        return Markup(f'<ul style="margin:0;padding-left:18px;">{points}</ul>')

    cards = []
    for index, item in enumerate(visible_items, start=1):
        title = escape(get_company_item_title(item, index))
        if isinstance(item, dict):
            body = wrap_company_group(render_company_entries(item))
        elif isinstance(item, list):
            body = render_company_list(item)
        else:
            body = Markup(f'<div style="padding:12px 16px;">{format_company_scalar("", item)}</div>')

        cards.append(
            '<div style="border:1px solid #dbe4ee;border-radius:14px;background:#ffffff;overflow:hidden;">'
            f'<div style="padding:10px 14px;background:#f4f7fb;color:#0f172a;font-weight:700;">{title}</div>'
            f"{body}"
            "</div>"
        )

    return Markup('<div style="display:grid;gap:12px;">' + "".join(cards) + "</div>")


def render_company_entries(data):
    parts = []
    visible_items = [(key, value) for key, value in data.items() if has_company_value(value)]

    for index, (key, value) in enumerate(visible_items):
        label = get_company_field_label(key)
        is_first = index == 0

        if isinstance(value, dict):
            parts.append(render_company_card(label, wrap_company_group(render_company_entries(value)), is_first=is_first))
            continue

        if isinstance(value, list):
            parts.append(render_company_card(label, render_company_list(value), is_first=is_first))
            continue

        parts.append(render_company_row(label, format_company_scalar(key, value), is_first=is_first))

    return parts


def render_company_summary(company_data):
    if not isinstance(company_data, dict):
        return ""

    data = company_data.get("data") or {}
    address = data.get("address") or {}
    management = data.get("management") or {}
    state = data.get("state") or {}

    director = None
    if has_company_value(management.get("name")):
        director = management.get("name")
        if has_company_value(management.get("post")):
            director = f"{director}, {management.get('post')}"

    summary_items = [
        ("Компания", company_data.get("unrestricted_value") or company_data.get("value")),
        ("ИНН", data.get("inn")),
        ("КПП", data.get("kpp")),
        ("ОГРН", data.get("ogrn")),
        ("Статус", state.get("status")),
        ("Руководитель", director),
        ("Адрес", address.get("unrestricted_value") or address.get("value")),
    ]

    visible_items = [(label, value) for label, value in summary_items if has_company_value(value)]
    if not visible_items:
        return ""

    blocks = []
    for label, value in visible_items:
        blocks.append(
            '<div style="padding:14px 16px;border:1px solid #dbe4ee;border-radius:14px;background:linear-gradient(180deg,#ffffff 0%,#f8fbff 100%);">'
            f'<div style="margin-bottom:6px;color:#526071;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;">{escape(label)}</div>'
            f'<div style="color:#0f172a;font-size:14px;line-height:1.6;">{format_company_scalar("", value)}</div>'
            '</div>'
        )

    return Markup('<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;">' + "".join(blocks) + '</div>')


def format_company_data(company_data):
    if not isinstance(company_data, dict) or not company_data:
        return Markup('<div style="padding:16px;border:1px dashed #dbe4ee;border-radius:14px;color:#8a94a6;background:#fbfcfe;">Данные компании не сохранены.</div>')

    summary = render_company_summary(company_data)
    details = wrap_company_group(render_company_entries(company_data))
    raw = format_json_payload(company_data)

    return Markup(
        '<div style="display:grid;gap:16px;">'
        + (f'<div>{summary}</div>' if summary else '')
        + f'<div>{details}</div>'
        + '<details style="border:1px solid #dbe4ee;border-radius:14px;background:#ffffff;padding:12px 16px;">'
        + '<summary style="cursor:pointer;font-weight:700;color:#0f172a;">Показать сырой JSON</summary>'
        + f'<div style="margin-top:12px;">{raw}</div>'
        + '</details>'
        + '</div>'
    )


# ========== ВЬЮШКИ ==========

class UserAdmin(ModelView, model=User):
    name = "Пользователь"
    name_plural = "Пользователи"
    icon = "fa-solid fa-users"
    details_template = "user_detail.html"
    edit_template = "user_edit.html"

    column_list = [
        User.id, User.role, User.inn, User.email, User.phone,
        User.first_name, User.last_name,
        User.rating, User.review_count, User.is_active, User.created_at,
    ]
    column_searchable_list = [User.inn, User.email, User.phone, User.first_name, User.last_name]
    column_sortable_list = [User.id, User.role, User.rating, User.created_at]
    column_default_sort = (User.id, True)

    column_details_list = [
        User.id, User.role, User.is_active,
        User.first_name, User.last_name, User.inn,
        User.email, User.phone, User.password,
        User.rating, User.review_count,
        User.created_at, User.updated_at,
        User.orders, User.assigned_orders, User.responses,
        User.payments, User.subscriptions, User.customer_reviews, User.expert_reviews,
    ]

    form_columns = [
        User.role, User.is_active, User.first_name, User.last_name,
        User.inn, User.email, User.phone, User.password,
        User.rating, User.review_count,
    ]

    column_formatters = {
        User.role: lambda m, a: str(m.role),
    }
    column_formatters_detail = {
        User.role: lambda m, a: str(m.role),
    }

    column_labels = {
        User.id: "ID",
        User.role: "Роль",
        User.is_active: "Активен",
        User.first_name: "Имя",
        User.last_name: "Фамилия",
        User.inn: "ИНН",
        User.email: "Email",
        User.phone: "Телефон",
        User.password: "Пароль (хеш)",
        User.company_data: "Данные компании (DaData)",
        User.rating: "Рейтинг",
        User.review_count: "Кол-во отзывов",
        User.created_at: "Создан",
        User.updated_at: "Обновлён",
        User.orders: "Заказы (заказчик)",
        User.assigned_orders: "Заказы (эксперт)",
        User.responses: "Отклики",
        User.payments: "Платежи",
        User.subscriptions: "Подписки",
        User.customer_reviews: "Отзывы (заказчик)",
        User.expert_reviews: "Отзывы (эксперт)",
    }

    def render_company_data(self, company_data):
        return format_company_data(company_data)

    async def on_model_change(self, data, model, is_created, request):
        new_inn = (data.get("inn") or "").strip() or None
        if not new_inn:
            model.company_data = None
            return

        if is_created:
            inn_changed = True
        else:
            history = sa_inspect(model).attrs.inn.history
            inn_changed = history.has_changes()

        if not inn_changed and model.company_data:
            return

        suggestion = await fetch_dadata_party_by_inn(new_inn)
        if suggestion is not None:
            model.company_data = suggestion

    def active_pricing_plans(self):
        with SessionLocal() as db:
            return (
                db.query(PricingPlan)
                .filter(PricingPlan.is_active.is_(True))
                .order_by(PricingPlan.sort_order.asc(), PricingPlan.id.asc())
                .all()
            )

    def current_active_subscription(self, user_id: int):
        with SessionLocal() as db:
            return (
                db.query(UserSubscription)
                .options(selectinload(UserSubscription.plan))
                .filter(
                    UserSubscription.user_id == user_id,
                    UserSubscription.status == SubscriptionStatus.ACTIVE,
                )
                .order_by(UserSubscription.activated_at.desc(), UserSubscription.id.desc())
                .first()
            )


class OrderAdmin(ModelView, model=Order):
    name = "Заказ"
    name_plural = "Заказы"
    icon = "fa-solid fa-clipboard-list"

    column_list = [
        Order.id, Order.title, Order.company, Order.status,
        Order.sum_amount, Order.deadline, Order.customer, Order.assigned_expert,
        Order.created_at,
    ]
    column_searchable_list = [Order.title, Order.company]
    column_sortable_list = [Order.id, Order.status, Order.sum_amount, Order.deadline, Order.created_at]
    column_default_sort = (Order.id, True)

    column_details_list = [
        Order.id, Order.title, Order.company,
        Order.comment, Order.customer, Order.assigned_expert,
        Order.technical_files, Order.sum_amount, Order.deadline,
        Order.status, Order.created_at, Order.updated_at,
        Order.badges, Order.responses, Order.chats,
    ]

    form_columns = [
        Order.title, Order.company, Order.comment,
        Order.customer, Order.assigned_expert,
        Order.sum_amount, Order.deadline, Order.status,
    ]

    column_formatters = {
        Order.sum_amount: lambda m, a: f"{m.sum_amount / 100:.2f} ₽" if m.sum_amount is not None else "0.00 ₽",
        Order.status: lambda m, a: str(m.status),
        Order.technical_files: format_technical_files,
    }
    column_formatters_detail = {
        Order.sum_amount: lambda m, a: f"{m.sum_amount / 100:.2f} ₽" if m.sum_amount is not None else "0.00 ₽",
        Order.status: lambda m, a: str(m.status),
        Order.technical_files: format_technical_files,
    }

    column_labels = {
        Order.id: "ID",
        Order.title: "Название",
        Order.company: "Компания",
        Order.comment: "Описание",
        Order.customer: "Заказчик",
        Order.assigned_expert: "Назначенный эксперт",
        Order.technical_files: "Тех. файлы",
        Order.sum_amount: "Сумма",
        Order.deadline: "Дедлайн",
        Order.status: "Статус",
        Order.created_at: "Создан",
        Order.updated_at: "Обновлён",
        Order.badges: "Бейджи",
        Order.responses: "Отклики",
        Order.chats: "Чаты",
    }


class OrderResponseAdmin(ModelView, model=OrderResponse):
    name = "Отклик"
    name_plural = "Отклики"
    icon = "fa-solid fa-reply"

    column_list = [
        OrderResponse.id, OrderResponse.order, OrderResponse.expert,
        OrderResponse.status, OrderResponse.proposed_sum_amount,
        OrderResponse.proposed_deadline, OrderResponse.expert_confirmed,
        OrderResponse.created_at,
    ]
    column_searchable_list = [OrderResponse.comment]
    column_sortable_list = [OrderResponse.id, OrderResponse.status, OrderResponse.proposed_sum_amount, OrderResponse.created_at]
    column_default_sort = (OrderResponse.id, True)

    column_details_list = [
        OrderResponse.id, OrderResponse.order, OrderResponse.expert,
        OrderResponse.comment, OrderResponse.proposed_sum_amount,
        OrderResponse.proposed_deadline, OrderResponse.technical_files,
        OrderResponse.expert_confirmed, OrderResponse.status,
        OrderResponse.created_at, OrderResponse.updated_at,
        OrderResponse.reviews,
    ]

    form_columns = [
        OrderResponse.order, OrderResponse.expert,
        OrderResponse.comment, OrderResponse.proposed_sum_amount,
        OrderResponse.proposed_deadline, OrderResponse.expert_confirmed,
        OrderResponse.status,
    ]

    column_formatters = {
        OrderResponse.proposed_sum_amount: lambda m, a: f"{m.proposed_sum_amount / 100:.2f} ₽" if m.proposed_sum_amount is not None else "0.00 ₽",
        OrderResponse.status: lambda m, a: str(m.status),
        OrderResponse.technical_files: format_technical_files,
    }
    column_formatters_detail = {
        OrderResponse.proposed_sum_amount: lambda m, a: f"{m.proposed_sum_amount / 100:.2f} ₽" if m.proposed_sum_amount is not None else "0.00 ₽",
        OrderResponse.status: lambda m, a: str(m.status),
        OrderResponse.technical_files: format_technical_files,
    }

    column_labels = {
        OrderResponse.id: "ID",
        OrderResponse.order: "Заказ",
        OrderResponse.expert: "Эксперт",
        OrderResponse.comment: "Комментарий",
        OrderResponse.proposed_sum_amount: "Предложенная сумма",
        OrderResponse.proposed_deadline: "Предложенный дедлайн",
        OrderResponse.technical_files: "Тех. файлы",
        OrderResponse.expert_confirmed: "Эксперт подтвердил",
        OrderResponse.status: "Статус",
        OrderResponse.created_at: "Создан",
        OrderResponse.updated_at: "Обновлён",
        OrderResponse.reviews: "Отзывы",
    }


class ChatAdmin(ModelView, model=Chat):
    name = "Чат"
    name_plural = "Чаты"
    icon = "fa-solid fa-comments"
    details_template = "chat_detail.html"

    column_list = [
        Chat.id, Chat.uuid, Chat.order, Chat.customer,
        Chat.expert, Chat.created_at,
    ]
    column_sortable_list = [Chat.id, Chat.created_at]
    column_default_sort = (Chat.id, True)

    column_details_list = [
        Chat.id, Chat.uuid, Chat.order, Chat.customer, Chat.expert,
        Chat.created_at, Chat.updated_at,
    ]

    form_columns = [Chat.order, Chat.customer, Chat.expert]

    column_labels = {
        Chat.id: "ID",
        Chat.uuid: "UUID",
        Chat.order: "Заказ",
        Chat.customer: "Заказчик",
        Chat.expert: "Эксперт",
        Chat.created_at: "Создан",
        Chat.updated_at: "Обновлён",
    }

    async def get_object_for_details(self, value):
        stmt = self._stmt_by_identifier(value)
        for relation in self._details_relations:
            stmt = stmt.options(selectinload(relation))
        stmt = stmt.options(
            selectinload(Chat.messages).selectinload(ChatMessage.sender),
        )
        return await self._get_object_by_pk(stmt)


class PaymentAdmin(ModelView, model=Payment):
    name = "Платёж"
    name_plural = "Платежи"
    icon = "fa-solid fa-credit-card"

    column_list = [
        Payment.id, Payment.user, Payment.amount,
        Payment.payment_type, Payment.status,
        Payment.yookassa_id, Payment.created_at,
    ]
    column_searchable_list = [Payment.yookassa_id, Payment.description]
    column_sortable_list = [Payment.id, Payment.amount, Payment.status, Payment.payment_type, Payment.created_at]
    column_default_sort = (Payment.id, True)

    column_details_list = [
        Payment.id, Payment.user, Payment.yookassa_id,
        Payment.amount, Payment.payment_type, Payment.status,
        Payment.description, Payment.created_at, Payment.updated_at,
    ]

    form_columns = [
        Payment.user, Payment.yookassa_id, Payment.amount,
        Payment.payment_type, Payment.status, Payment.description,
    ]

    column_formatters = {
        Payment.amount: lambda m, a: f"{m.amount / 100:.2f} ₽" if m.amount is not None else "0.00 ₽",
        Payment.status: lambda m, a: str(m.status),
        Payment.payment_type: lambda m, a: str(m.payment_type),
    }
    column_formatters_detail = {
        Payment.amount: lambda m, a: f"{m.amount / 100:.2f} ₽" if m.amount is not None else "0.00 ₽",
        Payment.status: lambda m, a: str(m.status),
        Payment.payment_type: lambda m, a: str(m.payment_type),
    }

    column_labels = {
        Payment.id: "ID",
        Payment.user: "Пользователь",
        Payment.yookassa_id: "YooKassa ID",
        Payment.amount: "Сумма",
        Payment.payment_type: "Тип",
        Payment.status: "Статус",
        Payment.description: "Описание",
        Payment.created_at: "Создан",
        Payment.updated_at: "Обновлён",
    }


class ReviewAdmin(ModelView, model=Review):
    name = "Отзыв"
    name_plural = "Отзывы"
    icon = "fa-solid fa-star"

    column_list = [
        Review.id, Review.customer, Review.expert,
        Review.rating, Review.comment, Review.created_at,
    ]
    column_searchable_list = [Review.comment]
    column_sortable_list = [Review.id, Review.rating, Review.created_at]
    column_default_sort = (Review.id, True)

    column_details_list = [
        Review.id, Review.order_id, Review.response,
        Review.customer, Review.expert,
        Review.rating, Review.comment, Review.created_at,
    ]

    form_columns = [
        Review.order_id, Review.response, Review.customer,
        Review.expert, Review.rating, Review.comment,
    ]

    column_labels = {
        Review.id: "ID",
        Review.order_id: "ID заказа",
        Review.response: "Отклик",
        Review.customer: "Заказчик",
        Review.expert: "Эксперт",
        Review.rating: "Оценка",
        Review.comment: "Комментарий",
        Review.created_at: "Создан",
    }


class SessionAdmin(ModelView, model=Session):
    name = "Сессия"
    name_plural = "Сессии"
    icon = "fa-solid fa-key"

    column_list = [
        Session.id, Session.session_id, Session.user_id,
        Session.created_at, Session.expires_at,
    ]
    column_sortable_list = [Session.id, Session.created_at, Session.expires_at]
    column_default_sort = (Session.id, True)

    column_details_list = [
        Session.id, Session.session_id, Session.user_id,
        Session.created_at, Session.expires_at, Session.max_expires_at,
    ]

    form_columns = [Session.user_id, Session.expires_at, Session.max_expires_at]

    column_labels = {
        Session.id: "ID",
        Session.session_id: "ID сессии",
        Session.user_id: "ID пользователя",
        Session.created_at: "Создана",
        Session.expires_at: "Истекает",
        Session.max_expires_at: "Макс. срок",
    }


class PasswordResetCodeAdmin(ModelView, model=PasswordResetCode):
    name = "Код сброса пароля"
    name_plural = "Коды сброса пароля"
    icon = "fa-solid fa-unlock"

    column_list = [
        PasswordResetCode.id, PasswordResetCode.user,
        PasswordResetCode.code, PasswordResetCode.is_used,
        PasswordResetCode.created_at, PasswordResetCode.expires_at,
    ]
    column_sortable_list = [PasswordResetCode.id, PasswordResetCode.is_used, PasswordResetCode.created_at]
    column_default_sort = (PasswordResetCode.id, True)

    column_labels = {
        PasswordResetCode.id: "ID",
        PasswordResetCode.user: "Пользователь",
        PasswordResetCode.code: "Код",
        PasswordResetCode.is_used: "Использован",
        PasswordResetCode.created_at: "Создан",
        PasswordResetCode.expires_at: "Истекает",
    }


# ========== ТАРИФЫ ==========


class PricingPlanAdmin(ModelView, model=PricingPlan):
    name = "Тариф"
    name_plural = "Тарифы"
    icon = "fa-solid fa-tags"
    category = "Тарифы"

    column_list = [
        PricingPlan.id, PricingPlan.kind, PricingPlan.name,
        PricingPlan.price_kopecks, PricingPlan.period_label, PricingPlan.duration_days,
        PricingPlan.badge, PricingPlan.highlighted,
        PricingPlan.is_active, PricingPlan.sort_order,
    ]
    column_sortable_list = [PricingPlan.sort_order, PricingPlan.kind, PricingPlan.price_kopecks, PricingPlan.is_active]
    column_default_sort = (PricingPlan.sort_order, False)

    column_details_list = [
        PricingPlan.id, PricingPlan.kind, PricingPlan.name,
        PricingPlan.badge, PricingPlan.price_kopecks, PricingPlan.period_label,
        PricingPlan.duration_days,
        PricingPlan.description, PricingPlan.cta_label, PricingPlan.features,
        PricingPlan.highlighted, PricingPlan.is_active, PricingPlan.sort_order,
        PricingPlan.created_at, PricingPlan.updated_at,
    ]

    form_columns = [
        PricingPlan.kind, PricingPlan.name, PricingPlan.badge,
        PricingPlan.price_kopecks, PricingPlan.period_label, PricingPlan.duration_days,
        PricingPlan.description, PricingPlan.cta_label, PricingPlan.features,
        PricingPlan.highlighted, PricingPlan.is_active, PricingPlan.sort_order,
    ]

    column_formatters = {
        PricingPlan.price_kopecks: lambda m, a: f"{m.price_kopecks / 100:,.2f} ₽".replace(",", " "),
        PricingPlan.kind: lambda m, a: str(m.kind),
    }
    column_formatters_detail = {
        PricingPlan.price_kopecks: lambda m, a: f"{m.price_kopecks / 100:,.2f} ₽".replace(",", " "),
        PricingPlan.kind: lambda m, a: str(m.kind),
    }

    column_labels = {
        PricingPlan.id: "ID",
        PricingPlan.kind: "Тип",
        PricingPlan.name: "Название",
        PricingPlan.badge: "Бейдж",
        PricingPlan.price_kopecks: "Цена (в копейках)",
        PricingPlan.period_label: "Подпись периода",
        PricingPlan.duration_days: "Срок действия (дней, пусто для разового)",
        PricingPlan.description: "Описание",
        PricingPlan.cta_label: "Текст кнопки",
        PricingPlan.features: "Список фич (JSON-массив строк)",
        PricingPlan.highlighted: "Выделенный (градиент)",
        PricingPlan.is_active: "Активен",
        PricingPlan.sort_order: "Порядок",
        PricingPlan.created_at: "Создан",
        PricingPlan.updated_at: "Обновлён",
    }


class UserSubscriptionAdmin(ModelView, model=UserSubscription):
    name = "Подписка"
    name_plural = "Подписки пользователей"
    icon = "fa-solid fa-id-card"
    category = "Тарифы"

    column_list = [
        UserSubscription.id, UserSubscription.user, UserSubscription.plan,
        UserSubscription.kind, UserSubscription.status,
        UserSubscription.activated_at, UserSubscription.expires_at,
        UserSubscription.responses_remaining,
    ]
    column_sortable_list = [
        UserSubscription.id, UserSubscription.status, UserSubscription.activated_at, UserSubscription.expires_at,
    ]
    column_default_sort = (UserSubscription.id, True)

    column_details_list = [
        UserSubscription.id, UserSubscription.user, UserSubscription.plan,
        UserSubscription.kind, UserSubscription.status,
        UserSubscription.activated_at, UserSubscription.expires_at,
        UserSubscription.responses_remaining, UserSubscription.payment,
        UserSubscription.created_at, UserSubscription.updated_at,
    ]

    form_columns = [
        UserSubscription.user, UserSubscription.plan,
        UserSubscription.kind, UserSubscription.status,
        UserSubscription.activated_at, UserSubscription.expires_at,
        UserSubscription.responses_remaining, UserSubscription.payment,
    ]

    column_formatters = {
        UserSubscription.kind: lambda m, a: str(m.kind),
        UserSubscription.status: lambda m, a: str(m.status),
    }
    column_formatters_detail = {
        UserSubscription.kind: lambda m, a: str(m.kind),
        UserSubscription.status: lambda m, a: str(m.status),
    }

    column_labels = {
        UserSubscription.id: "ID",
        UserSubscription.user: "Пользователь",
        UserSubscription.plan: "Тариф",
        UserSubscription.kind: "Тип",
        UserSubscription.status: "Статус",
        UserSubscription.activated_at: "Активирована",
        UserSubscription.expires_at: "Истекает",
        UserSubscription.responses_remaining: "Остаток откликов",
        UserSubscription.payment: "Платёж",
        UserSubscription.created_at: "Создана",
        UserSubscription.updated_at: "Обновлена",
    }


# ========== ЛЕНДИНГ — редактируемый контент ==========


class LandingHeroAdmin(ModelView, model=LandingHero):
    name = "Hero (шапка лендинга)"
    name_plural = "Лендинг · Hero"
    icon = "fa-solid fa-flag"
    category = "Лендинг"

    can_create = True
    can_delete = False

    column_list = [LandingHero.id, LandingHero.title, LandingHero.button_text]
    form_columns = [LandingHero.title, LandingHero.subtitle, LandingHero.button_text]
    column_labels = {
        LandingHero.id: "ID",
        LandingHero.title: "Заголовок",
        LandingHero.subtitle: "Подзаголовок",
        LandingHero.button_text: "Текст кнопки",
    }


class LandingSectionHeaderAdmin(ModelView, model=LandingSectionHeader):
    name = "Шапка секции"
    name_plural = "Лендинг · Шапки секций"
    icon = "fa-solid fa-heading"
    category = "Лендинг"

    column_list = [LandingSectionHeader.block_key, LandingSectionHeader.title]
    form_columns = [LandingSectionHeader.block_key, LandingSectionHeader.title, LandingSectionHeader.subtitle]
    column_labels = {
        LandingSectionHeader.block_key: "Ключ блока",
        LandingSectionHeader.title: "Заголовок",
        LandingSectionHeader.subtitle: "Подзаголовок",
    }


class LandingStepAdmin(ModelView, model=LandingStep):
    name = "Шаг"
    name_plural = "Лендинг · Шаги (как работает / преимущества)"
    icon = "fa-solid fa-list-ol"
    category = "Лендинг"

    column_list = [
        LandingStep.id, LandingStep.block, LandingStep.role,
        LandingStep.position, LandingStep.title,
    ]
    column_sortable_list = [LandingStep.block, LandingStep.role, LandingStep.position]
    column_default_sort = [(LandingStep.block, False), (LandingStep.role, False), (LandingStep.position, False)]
    form_columns = [
        LandingStep.block, LandingStep.role, LandingStep.position,
        LandingStep.title, LandingStep.description, LandingStep.sub_description, LandingStep.icon,
    ]
    column_labels = {
        LandingStep.block: "Блок",
        LandingStep.role: "Роль",
        LandingStep.position: "Порядок",
        LandingStep.title: "Заголовок",
        LandingStep.description: "Описание",
        LandingStep.sub_description: "Доп. текст",
        LandingStep.icon: "Иконка (путь)",
    }


class LandingOrderExampleAdmin(ModelView, model=LandingOrderExample):
    name = "Пример заказа"
    name_plural = "Лендинг · Примеры заказов"
    icon = "fa-solid fa-briefcase"
    category = "Лендинг"

    column_list = [
        LandingOrderExample.position, LandingOrderExample.title,
        LandingOrderExample.price,
    ]
    column_sortable_list = [LandingOrderExample.position]
    column_default_sort = (LandingOrderExample.position, False)
    form_columns = [
        LandingOrderExample.position, LandingOrderExample.title,
        LandingOrderExample.price, LandingOrderExample.description,
    ]
    column_labels = {
        LandingOrderExample.position: "Порядок",
        LandingOrderExample.title: "Заголовок",
        LandingOrderExample.price: "Цена",
        LandingOrderExample.description: "Описание",
    }


class LandingAdvantageAdmin(ModelView, model=LandingAdvantage):
    name = "Преимущество"
    name_plural = "Лендинг · Преимущества"
    icon = "fa-solid fa-award"
    category = "Лендинг"

    column_list = [LandingAdvantage.position, LandingAdvantage.title, LandingAdvantage.icon_key]
    column_sortable_list = [LandingAdvantage.position]
    column_default_sort = (LandingAdvantage.position, False)
    form_columns = [
        LandingAdvantage.position, LandingAdvantage.title,
        LandingAdvantage.description, LandingAdvantage.icon_key, LandingAdvantage.photo,
    ]
    column_labels = {
        LandingAdvantage.position: "Порядок",
        LandingAdvantage.title: "Заголовок",
        LandingAdvantage.description: "Описание",
        LandingAdvantage.icon_key: "Иконка",
        LandingAdvantage.photo: "Фото (путь)",
    }


class LandingIndustryAdmin(ModelView, model=LandingIndustry):
    name = "Отрасль"
    name_plural = "Лендинг · Отрасли"
    icon = "fa-solid fa-industry"
    category = "Лендинг"

    column_list = [LandingIndustry.position, LandingIndustry.title]
    column_sortable_list = [LandingIndustry.position]
    column_default_sort = (LandingIndustry.position, False)
    form_columns = [
        LandingIndustry.position, LandingIndustry.title,
        LandingIndustry.descriptions, LandingIndustry.photo,
    ]
    column_labels = {
        LandingIndustry.position: "Порядок",
        LandingIndustry.title: "Название",
        LandingIndustry.descriptions: "Пункты (JSON-массив строк)",
        LandingIndustry.photo: "Фото (путь)",
    }


class LandingReviewAdmin(ModelView, model=LandingReview):
    name = "Отзыв"
    name_plural = "Лендинг · Отзывы"
    icon = "fa-solid fa-comment"
    category = "Лендинг"

    column_list = [LandingReview.position, LandingReview.reviewer, LandingReview.reviewer_position]
    column_sortable_list = [LandingReview.position]
    column_default_sort = (LandingReview.position, False)
    form_columns = [
        LandingReview.position, LandingReview.reviewer,
        LandingReview.reviewer_position, LandingReview.text,
    ]
    column_labels = {
        LandingReview.position: "Порядок",
        LandingReview.reviewer: "Автор",
        LandingReview.reviewer_position: "Должность",
        LandingReview.text: "Текст отзыва",
    }


class LandingFaqAdmin(ModelView, model=LandingFaq):
    name = "FAQ"
    name_plural = "Лендинг · FAQ"
    icon = "fa-solid fa-circle-question"
    category = "Лендинг"

    column_list = [LandingFaq.position, LandingFaq.question]
    column_sortable_list = [LandingFaq.position]
    column_default_sort = (LandingFaq.position, False)
    form_columns = [LandingFaq.position, LandingFaq.question, LandingFaq.answer]
    column_labels = {
        LandingFaq.position: "Порядок",
        LandingFaq.question: "Вопрос",
        LandingFaq.answer: "Ответ",
    }


class LandingPricingContentAdmin(ModelView, model=LandingPricingContent):
    name = "Тарифы (тексты)"
    name_plural = "Лендинг · Тарифы"
    icon = "fa-solid fa-tags"
    category = "Лендинг"

    can_create = False
    can_delete = False

    column_list = [
        LandingPricingContent.id,
        LandingPricingContent.expert_title,
        LandingPricingContent.customer_title,
    ]

    form_columns = [
        LandingPricingContent.expert_title,
        LandingPricingContent.expert_subtitle,
        LandingPricingContent.expert_footnote,
        LandingPricingContent.customer_title,
        LandingPricingContent.customer_subtitle,
        LandingPricingContent.customer_headline,
        LandingPricingContent.customer_features,
        LandingPricingContent.customer_footnote,
        LandingPricingContent.customer_cta_label,
        LandingPricingContent.customer_cta_href,
        LandingPricingContent.license_holder_title,
        LandingPricingContent.license_holder_subtitle,
        LandingPricingContent.license_holder_headline,
        LandingPricingContent.license_holder_features,
        LandingPricingContent.license_holder_footnote,
        LandingPricingContent.license_holder_cta_label,
        LandingPricingContent.license_holder_cta_href,
    ]

    column_labels = {
        LandingPricingContent.id: "ID",
        LandingPricingContent.expert_title: "Эксперт · Заголовок",
        LandingPricingContent.expert_subtitle: "Эксперт · Подзаголовок",
        LandingPricingContent.expert_footnote: "Эксперт · Сноска под карточками",
        LandingPricingContent.customer_title: "Заказчик · Заголовок",
        LandingPricingContent.customer_subtitle: "Заказчик · Подзаголовок",
        LandingPricingContent.customer_headline: "Заказчик · Большой текст по центру",
        LandingPricingContent.customer_features: "Заказчик · Список преимуществ (JSON-массив строк)",
        LandingPricingContent.customer_footnote: "Заказчик · Сноска",
        LandingPricingContent.customer_cta_label: "Заказчик · Текст кнопки",
        LandingPricingContent.customer_cta_href: "Заказчик · Ссылка кнопки",
        LandingPricingContent.license_holder_title: "Лицензиат · Заголовок",
        LandingPricingContent.license_holder_subtitle: "Лицензиат · Подзаголовок",
        LandingPricingContent.license_holder_headline: "Лицензиат · Большой текст по центру",
        LandingPricingContent.license_holder_features: "Лицензиат · Список преимуществ (JSON-массив строк)",
        LandingPricingContent.license_holder_footnote: "Лицензиат · Сноска",
        LandingPricingContent.license_holder_cta_label: "Лицензиат · Текст кнопки",
        LandingPricingContent.license_holder_cta_href: "Лицензиат · Ссылка кнопки",
    }


class PlatformSettingsAdmin(ModelView, model=PlatformSettings):
    name = "Настройки платформы"
    name_plural = "Настройки платформы"
    icon = "fa-solid fa-toggle-on"
    category = "Настройки"

    can_create = False
    can_delete = False

    column_list = [PlatformSettings.id, PlatformSettings.paid_responses_enabled]
    form_columns = [PlatformSettings.paid_responses_enabled]
    column_labels = {
        PlatformSettings.id: "ID",
        PlatformSettings.paid_responses_enabled: (
            "Платный режим откликов (выкл = эксперты откликаются бесплатно)"
        ),
    }


class ArticleAdmin(ModelView, model=Article):
    name = "Статья"
    name_plural = "Контент · Новости и блог"
    icon = "fa-solid fa-newspaper"
    category = "Контент"

    create_template = "article_edit.html"
    edit_template = "article_edit.html"

    column_list = [
        Article.id,
        Article.kind,
        Article.status,
        Article.title,
        Article.slug,
        Article.published_at,
        Article.updated_at,
    ]
    column_searchable_list = [Article.title, Article.slug]
    column_sortable_list = [Article.id, Article.kind, Article.status, Article.published_at, Article.updated_at]
    column_default_sort = [(Article.published_at, True), (Article.id, True)]

    column_details_list = [
        Article.id, Article.kind, Article.status,
        Article.slug, Article.title, Article.excerpt, Article.cover_image,
        Article.tags, Article.content_html,
        Article.meta_title, Article.meta_description, Article.meta_keywords, Article.og_image,
        Article.published_at, Article.created_at, Article.updated_at,
    ]

    form_columns = [
        Article.kind, Article.status,
        Article.slug, Article.title, Article.excerpt,
        Article.cover_image, Article.tags, Article.content_html,
        Article.meta_title, Article.meta_description, Article.meta_keywords, Article.og_image,
        Article.published_at,
    ]

    column_labels = {
        Article.id: "ID",
        Article.kind: "Тип (новость/блог)",
        Article.status: "Статус",
        Article.slug: "Slug (URL)",
        Article.title: "Заголовок",
        Article.excerpt: "Краткое описание",
        Article.cover_image: "Обложка (URL)",
        Article.tags: "Теги",
        Article.content_html: "HTML-контент",
        Article.meta_title: "SEO · meta title",
        Article.meta_description: "SEO · meta description",
        Article.meta_keywords: "SEO · meta keywords",
        Article.og_image: "SEO · OpenGraph image (URL)",
        Article.published_at: "Опубликовать с (UTC)",
        Article.created_at: "Создана",
        Article.updated_at: "Обновлена",
    }

    column_formatters = {
        Article.kind: lambda m, a: str(m.kind),
        Article.status: lambda m, a: str(m.status),
    }
    column_formatters_detail = {
        Article.kind: lambda m, a: str(m.kind),
        Article.status: lambda m, a: str(m.status),
    }

    async def on_model_change(self, data, model, is_created, request):
        raw_tags = data.get("tags")
        if isinstance(raw_tags, str):
            cleaned = raw_tags.strip()
            try:
                data["tags"] = json.loads(cleaned) if cleaned else []
            except json.JSONDecodeError:
                data["tags"] = []
        elif raw_tags is None:
            data["tags"] = []
        elif not isinstance(raw_tags, list):
            data["tags"] = list(raw_tags)

        slug = (data.get("slug") or "").strip().lower().replace(" ", "-")
        if slug:
            data["slug"] = slug

        status = data.get("status")
        if status and str(status).upper().endswith("PUBLISHED") and not data.get("published_at"):
            data["published_at"] = datetime.now(timezone.utc)


def format_ticket_attachments(value):
    if not value:
        return "—"
    if isinstance(value, list):
        parts = []
        for item in value:
            if isinstance(item, dict):
                name = escape(item.get("name") or "Файл")
                url = item.get("url") or "#"
                parts.append(
                    f'<div style="margin:4px 0"><a href="{url}" target="_blank">{name}</a></div>'
                )
        return Markup("".join(parts)) if parts else "—"
    return str(value)


class SupportTicketAdmin(ModelView, model=SupportTicket):
    name = "Тикет"
    name_plural = "Поддержка · Тикеты"
    icon = "fa-solid fa-life-ring"
    category = "Поддержка"
    edit_template = "support_ticket_edit.html"

    column_list = [
        SupportTicket.id,
        SupportTicket.number,
        SupportTicket.subject,
        SupportTicket.category,
        SupportTicket.status,
        SupportTicket.has_unread_for_admin,
        SupportTicket.user_id,
        SupportTicket.updated_at,
    ]
    column_searchable_list = [SupportTicket.number, SupportTicket.subject]
    column_sortable_list = [
        SupportTicket.id,
        SupportTicket.status,
        SupportTicket.category,
        SupportTicket.updated_at,
        SupportTicket.created_at,
    ]
    column_default_sort = (SupportTicket.updated_at, True)

    column_details_list = [
        SupportTicket.id,
        SupportTicket.number,
        SupportTicket.user,
        SupportTicket.subject,
        SupportTicket.category,
        SupportTicket.status,
        SupportTicket.has_unread_for_user,
        SupportTicket.has_unread_for_admin,
        SupportTicket.created_at,
        SupportTicket.updated_at,
        SupportTicket.messages,
    ]

    form_columns = [
        SupportTicket.subject,
        SupportTicket.category,
        SupportTicket.status,
        SupportTicket.has_unread_for_user,
        SupportTicket.has_unread_for_admin,
    ]

    column_labels = {
        SupportTicket.id: "ID",
        SupportTicket.number: "Номер",
        SupportTicket.user_id: "ID пользователя",
        SupportTicket.user: "Пользователь",
        SupportTicket.subject: "Тема",
        SupportTicket.category: "Категория",
        SupportTicket.status: "Статус",
        SupportTicket.has_unread_for_user: "Не прочитано пользователем",
        SupportTicket.has_unread_for_admin: "Требует ответа",
        SupportTicket.created_at: "Создан",
        SupportTicket.updated_at: "Обновлён",
        SupportTicket.messages: "Сообщения",
    }

    column_formatters = {
        SupportTicket.category: lambda m, a: str(m.category),
        SupportTicket.status: lambda m, a: str(m.status),
    }
    column_formatters_detail = {
        SupportTicket.category: lambda m, a: str(m.category),
        SupportTicket.status: lambda m, a: str(m.status),
    }


class SupportTicketMessageAdmin(ModelView, model=SupportTicketMessage):
    name = "Сообщение"
    name_plural = "Поддержка · Сообщения"
    icon = "fa-solid fa-comment"
    category = "Поддержка"

    can_create = False
    can_edit = False

    column_list = [
        SupportTicketMessage.id,
        SupportTicketMessage.ticket_id,
        SupportTicketMessage.author_kind,
        SupportTicketMessage.author_name,
        SupportTicketMessage.created_at,
    ]
    column_default_sort = (SupportTicketMessage.created_at, True)

    column_details_list = [
        SupportTicketMessage.id,
        SupportTicketMessage.ticket_id,
        SupportTicketMessage.author_kind,
        SupportTicketMessage.author_user_id,
        SupportTicketMessage.author_name,
        SupportTicketMessage.text,
        SupportTicketMessage.attachments,
        SupportTicketMessage.created_at,
    ]

    column_labels = {
        SupportTicketMessage.id: "ID",
        SupportTicketMessage.ticket_id: "ID тикета",
        SupportTicketMessage.author_kind: "Источник",
        SupportTicketMessage.author_user_id: "ID автора",
        SupportTicketMessage.author_name: "Автор",
        SupportTicketMessage.text: "Текст",
        SupportTicketMessage.attachments: "Файлы",
        SupportTicketMessage.created_at: "Создано",
    }

    column_formatters = {
        SupportTicketMessage.author_kind: lambda m, a: str(m.author_kind),
    }
    column_formatters_detail = {
        SupportTicketMessage.author_kind: lambda m, a: str(m.author_kind),
        SupportTicketMessage.attachments: lambda m, a: format_ticket_attachments(m.attachments),
    }


class ExpertRoomMessageAdmin(ModelView, model=ExpertRoomMessage):
    name = "Сообщение чата экспертов"
    name_plural = "Чат экспертов: сообщения"
    icon = "fa-solid fa-comments"
    category = "Чат экспертов"

    can_create = False
    can_edit = False
    can_delete = True

    column_list = [
        ExpertRoomMessage.id,
        ExpertRoomMessage.sender,
        ExpertRoomMessage.text,
        ExpertRoomMessage.created_at,
    ]
    column_default_sort = (ExpertRoomMessage.id, True)
    column_sortable_list = [ExpertRoomMessage.id, ExpertRoomMessage.created_at]
    column_searchable_list = [ExpertRoomMessage.text]

    column_details_list = [
        ExpertRoomMessage.id,
        ExpertRoomMessage.sender,
        ExpertRoomMessage.text,
        ExpertRoomMessage.created_at,
    ]

    column_labels = {
        ExpertRoomMessage.id: "ID",
        ExpertRoomMessage.sender: "Автор",
        ExpertRoomMessage.text: "Текст",
        ExpertRoomMessage.created_at: "Отправлено",
    }


class ExpertRoomChatView(BaseView):
    name = "Чат экспертов · лента"
    icon = "fa-solid fa-message"
    category = "Чат экспертов"

    @expose("/expert-room-chat", methods=["GET"])
    async def chat_view(self, request: Request):
        with SessionLocal() as db:
            messages = (
                db.query(ExpertRoomMessage)
                .options(selectinload(ExpertRoomMessage.sender))
                .order_by(ExpertRoomMessage.created_at.asc())
                .all()
            )
        return await self.templates.TemplateResponse(
            request, "expert_room_chat.html", {"messages": messages}
        )


class ExpertRoomBanAdmin(ModelView, model=ExpertRoomBan):
    name = "Бан в чате экспертов"
    name_plural = "Чат экспертов: баны"
    icon = "fa-solid fa-ban"
    category = "Чат экспертов"

    can_create = True
    can_edit = True
    can_delete = True

    column_list = [
        ExpertRoomBan.id,
        ExpertRoomBan.user,
        ExpertRoomBan.reason,
        ExpertRoomBan.created_at,
    ]
    column_default_sort = (ExpertRoomBan.id, True)
    column_sortable_list = [ExpertRoomBan.id, ExpertRoomBan.created_at]

    form_columns = [ExpertRoomBan.user, ExpertRoomBan.reason]

    column_details_list = [
        ExpertRoomBan.id,
        ExpertRoomBan.user,
        ExpertRoomBan.reason,
        ExpertRoomBan.created_at,
    ]

    column_labels = {
        ExpertRoomBan.id: "ID",
        ExpertRoomBan.user: "Эксперт",
        ExpertRoomBan.reason: "Причина (видна юзеру)",
        ExpertRoomBan.created_at: "Создан",
    }


# --- Регистрация вьюшек ---
admin.add_view(UserAdmin)
admin.add_view(OrderAdmin)
admin.add_view(OrderResponseAdmin)
admin.add_view(ChatAdmin)
admin.add_view(PaymentAdmin)
admin.add_view(PricingPlanAdmin)
admin.add_view(UserSubscriptionAdmin)
admin.add_view(ReviewAdmin)
admin.add_view(SessionAdmin)
admin.add_view(PasswordResetCodeAdmin)

admin.add_view(LandingHeroAdmin)
admin.add_view(LandingSectionHeaderAdmin)
admin.add_view(LandingStepAdmin)
admin.add_view(LandingOrderExampleAdmin)
admin.add_view(LandingAdvantageAdmin)
admin.add_view(LandingIndustryAdmin)
admin.add_view(LandingReviewAdmin)
admin.add_view(LandingFaqAdmin)
admin.add_view(LandingPricingContentAdmin)
admin.add_view(PlatformSettingsAdmin)

admin.add_view(ArticleAdmin)
admin.add_view(SupportTicketAdmin)
admin.add_view(SupportTicketMessageAdmin)
admin.add_view(ExpertRoomChatView)
admin.add_view(ExpertRoomMessageAdmin)
admin.add_view(ExpertRoomBanAdmin)
