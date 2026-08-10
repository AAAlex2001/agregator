"Repository: доступ к БД для experts."
from dataclasses import dataclass
from datetime import datetime
from typing import Any

from sqlalchemy import ColumnElement, Float, Select, cast, exists, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute, selectinload

from models.account import Account, UserRole
from models.audit import ExpertAuditProfile
from models.cadastral import ExpertCadastralProfile
from models.expert import Expert
from models.forensic import ExpertForensicProfile
from models.laboratory import ExpertLaboratoryProfile
from models.order import Order, OrderStatus, OrderWorkType
from models.research import ExpertResearchProfile
from models.response import OrderResponse as OrderResponseModel
from models.response import ResponseStatus
from models.tech_diag import ExpertTechDiagProfile
from services.experts.map_summary import build_direction_summary
from utils.pagination import paginate_with_has_more

SORT_BY_RATING = "rating"
SORT_BY_COMPLETED_ORDERS = "completed_orders"
SORT_BY_REVIEW_COUNT = "review_count"
SORT_DIR_DESC = "desc"
SORT_DIR_ASC = "asc"

RATING_PRIOR_WEIGHT = 5.0
RATING_PRIOR_MEAN = 4.5

DEFAULT_MAP_FIELDS = ("name", "area", "object", "category")

EXPERT_DIRECTION_PROFILES = {
    OrderWorkType.AUDIT_SUPB.value: ExpertAuditProfile,
    OrderWorkType.CADASTRAL.value: ExpertCadastralProfile,
    OrderWorkType.FORENSIC.value: ExpertForensicProfile,
    OrderWorkType.RESEARCH.value: ExpertResearchProfile,
    OrderWorkType.LABORATORY.value: ExpertLaboratoryProfile,
    OrderWorkType.TECH_DIAG.value: ExpertTechDiagProfile,
}


def build_completed_orders_expr() -> ColumnElement[int]:
    "Подзапрос числа завершённых заказов эксперта, коррелированный с Account."
    return (
        select(func.count(Order.id))
        .where(
            Order.assigned_expert_id == Account.id,
            Order.status == OrderStatus.ARCHIVED,
        )
        .correlate(Account)
        .scalar_subquery()
        .label("completed_orders_count")
    )


def format_cert_for_map(cert: dict[str, str], fields: list[str]) -> str:
    "Строка удостоверения для карты — только те части, что эксперт разрешил показывать."
    head = []
    if "area" in fields and cert.get("area"):
        head.append(cert["area"])
    if "object" in fields and cert.get("object"):
        head.append(cert["object"])
    text = " ".join(head)
    if "category" in fields and cert.get("category"):
        category = f"{cert['category']} кат."
        text = f"{text} · {category}" if text else category
    return text


@dataclass(frozen=True)
class ExpertSummaryRow:
    "Денормализованные данные эксперта для карточки. Никаких контактов."

    public_id: str
    full_name: str
    avatar_url: str | None
    rating: float | None
    review_count: int
    completed_orders_count: int
    joined_at: datetime
    last_order: Order | None
    last_order_response: OrderResponseModel | None


@dataclass(frozen=True)
class ExpertOrderHistoryItem:
    "Один заказ из истории эксперта вместе с принятым откликом по нему."

    order: Order
    accepted_response: OrderResponseModel | None


@dataclass(frozen=True)
class ExpertLocationRow:
    "Эксперт с координатами базирования — точка на карте."

    public_id: str
    full_name: str
    avatar_url: str | None
    rating: float | None
    city: str | None
    lat: float
    lng: float
    travels_to_other_regions: bool
    certificates: list[str] | None
    certificate_codes: list[str]
    phone: str | None
    email: str | None
    contacts_paid: bool
    contact_price_rubles: int | None


class ExpertsRepository:
    "Все обращения к БД по сущности эксперт. Никакой бизнес-логики, только запросы."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_summaries(
        self,
        skip: int,
        limit: int,
        query: str | None,
        sort_by: str = SORT_BY_RATING,
        sort_dir: str = SORT_DIR_DESC,
    ) -> tuple[list[ExpertSummaryRow], bool]:
        "Карточки экспертов с агрегатами. Только эксперты с отзывами (review_count > 0)."
        completed_orders_expr = build_completed_orders_expr()

        base_query: Select[tuple[Account, Expert, int]] = (
            select(Account, Expert, completed_orders_expr)
            .join(Expert, Expert.account_id == Account.id)
            .where(
                Account.role == UserRole.EXPERT,
                Account.is_active.is_(True),
                Expert.review_count > 0,
            )
        )

        if query and query.strip():
            pattern = f"%{query.strip()}%"
            base_query = base_query.where(
                Account.first_name.ilike(pattern) | Account.last_name.ilike(pattern)
            )

        sort_column = self.resolve_sort_column(sort_by, completed_orders_expr)
        is_desc = sort_dir != SORT_DIR_ASC
        primary = sort_column.desc().nullslast() if is_desc else sort_column.asc().nullsfirst()
        review_secondary = (
            Expert.review_count.desc() if is_desc else Expert.review_count.asc()
        )
        base_query = base_query.order_by(primary, review_secondary, Account.created_at.desc())

        rows = (await self.db.execute(base_query.offset(skip).limit(limit + 1))).all()
        has_more = len(rows) > limit
        rows = rows[:limit]

        expert_ids = [account.id for account, _, _ in rows]
        last_orders_by_expert = await self.fetch_last_orders(expert_ids)

        summaries: list[ExpertSummaryRow] = []
        for account, expert, completed_orders_count in rows:
            last_order = last_orders_by_expert.get(account.id)
            last_response = (
                self.find_accepted_response(last_order, account.id)
                if last_order is not None
                else None
            )
            summaries.append(
                self.build_summary_row(
                    account, expert, completed_orders_count, last_order, last_response
                )
            )
        return summaries, has_more

    async def get_summary(self, public_id: str) -> ExpertSummaryRow | None:
        "Возвращает запрошенную сущность."
        row = (
            await self.db.execute(
                select(Account, Expert, build_completed_orders_expr())
                .join(Expert, Expert.account_id == Account.id)
                .where(
                    Account.public_id == public_id,
                    Account.role == UserRole.EXPERT,
                )
            )
        ).one_or_none()

        if row is None:
            return None
        account, expert, completed_orders_count = row
        last_orders_by_expert = await self.fetch_last_orders([account.id])
        last_order = last_orders_by_expert.get(account.id)
        last_response = (
            self.find_accepted_response(last_order, account.id) if last_order is not None else None
        )
        return self.build_summary_row(
            account, expert, completed_orders_count, last_order, last_response
        )

    async def list_with_location(
        self, direction: str | None = None, limit: int = 1000
    ) -> list[ExpertLocationRow]:
        "Активные эксперты с заданными координатами базирования — для карты."
        query: Select[tuple[Account, Expert]] = (
            select(Account, Expert)
            .join(Expert, Expert.account_id == Account.id)
            .where(
                Account.role == UserRole.EXPERT,
                Account.is_active.is_(True),
                Expert.location_lat.is_not(None),
                Expert.location_lng.is_not(None),
                Expert.show_on_map.is_(True),
            )
            .order_by(Account.created_at.desc())
            .limit(limit)
        )
        profile_model = EXPERT_DIRECTION_PROFILES.get(direction or "")
        if profile_model is not None:
            query = query.where(
                exists(select(profile_model.id).where(profile_model.expert_id == Expert.id))
            )
        rows = (await self.db.execute(query)).all()
        return [self.build_location_row(account, expert, direction) for account, expert in rows]

    def build_location_row(
        self, account: Account, expert: Expert, direction: str | None = None
    ) -> ExpertLocationRow:
        "Строит точку карты из аккаунта и профиля — показывает только те поля, что эксперт сам выбрал (map_fields)."
        first = account.first_name or ""
        last = account.last_name or ""
        full_name = " ".join(part for part in (first, last) if part).strip() or "Эксперт"

        fields = expert.map_fields if expert.map_fields is not None else list(DEFAULT_MAP_FIELDS)
        show_name = "name" in fields
        contacts_paid = bool(expert.contact_sales_enabled)
        show_contacts = "contacts" in fields and not contacts_paid
        certificate_fields = ["area", "object", "category"] if contacts_paid else fields

        certificates = []
        certificate_codes = []
        if direction in EXPERT_DIRECTION_PROFILES:
            certificates = build_direction_summary(expert, direction, fields)
        else:
            for cert in expert.certificates or []:
                text = format_cert_for_map(cert, certificate_fields)
                if text:
                    certificates.append(text)
                if cert.get("area") and cert.get("object"):
                    certificate_codes.append(f"{cert['area']} {cert['object']}")

        return ExpertLocationRow(
            public_id=account.public_id,
            full_name=full_name if show_name else "Эксперт",
            avatar_url=account.avatar_url,
            rating=float(expert.rating) if expert.rating is not None else None,
            city=expert.location_city,
            lat=float(expert.location_lat),
            lng=float(expert.location_lng),
            travels_to_other_regions=bool(expert.travels_to_other_regions),
            certificates=certificates or None,
            certificate_codes=certificate_codes,
            phone=account.phone if show_contacts else None,
            email=account.email if show_contacts else None,
            contacts_paid=contacts_paid,
            contact_price_rubles=(
                expert.contact_price_kopecks // 100
                if contacts_paid and expert.contact_price_kopecks is not None
                else None
            ),
        )

    async def get_expert_id_by_public_id(self, public_id: str) -> int | None:
        "Возвращает запрошенную сущность."
        return (
            await self.db.execute(
                select(Account.id).where(
                    Account.public_id == public_id,
                    Account.role == UserRole.EXPERT,
                )
            )
        ).scalar_one_or_none()

    async def list_orders_history(
        self,
        expert_id: int,
        skip: int,
        limit: int,
    ) -> tuple[list[ExpertOrderHistoryItem], bool]:
        "Возвращает список сущностей с пагинацией/фильтрами."
        list_query: Select[tuple[Order]] = (
            select(Order)
            .options(
                selectinload(Order.badges),
                selectinload(Order.customer),
                selectinload(Order.assigned_expert),
                selectinload(Order.responses).selectinload(OrderResponseModel.expert),
            )
            .where(
                Order.assigned_expert_id == expert_id,
                Order.status == OrderStatus.ARCHIVED,
            )
            .order_by(Order.updated_at.desc())
        )

        orders, has_more = await paginate_with_has_more(self.db, list_query, skip, limit)
        items = [
            ExpertOrderHistoryItem(
                order=order,
                accepted_response=self.find_accepted_response(order, expert_id),
            )
            for order in orders
        ]
        return items, has_more

    async def fetch_last_orders(self, expert_ids: list[int]) -> dict[int, Order]:
        "Для каждого эксперта вернуть его последний ARCHIVED заказ. Один запрос на всех."
        if not expert_ids:
            return {}
        query: Select[tuple[Order]] = (
            select(Order)
            .options(
                selectinload(Order.badges),
                selectinload(Order.customer),
                selectinload(Order.assigned_expert),
                selectinload(Order.responses).selectinload(OrderResponseModel.expert),
            )
            .where(
                Order.assigned_expert_id.in_(expert_ids),
                Order.status == OrderStatus.ARCHIVED,
            )
            .distinct(Order.assigned_expert_id)
            .order_by(Order.assigned_expert_id, Order.updated_at.desc())
        )
        orders = list((await self.db.execute(query)).scalars().all())
        return {
            order.assigned_expert_id: order
            for order in orders
            if order.assigned_expert_id is not None
        }

    def resolve_sort_column(
        self, sort_by: str, completed_orders_expr: ColumnElement[Any]
    ) -> InstrumentedAttribute[Any] | ColumnElement[Any]:
        "Возвращает SQL-выражение для сортировки экспертов по заданному критерию."
        if sort_by == SORT_BY_COMPLETED_ORDERS:
            return completed_orders_expr
        if sort_by == SORT_BY_REVIEW_COUNT:
            return Expert.review_count
        rating_f = func.coalesce(cast(Expert.rating, Float), cast(0.0, Float))
        prior = cast(RATING_PRIOR_WEIGHT * RATING_PRIOR_MEAN, Float)
        weight = cast(RATING_PRIOR_WEIGHT, Float)
        return (Expert.review_count * rating_f + prior) / (Expert.review_count + weight)

    def build_summary_row(
        self,
        account: Account,
        expert: Expert,
        completed_orders_count: int | None,
        last_order: Order | None,
        last_response: OrderResponseModel | None,
    ) -> ExpertSummaryRow:
        "Строит объект из входных данных."
        first = account.first_name or ""
        last = account.last_name or ""
        full_name = " ".join(part for part in (first, last) if part).strip() or "Эксперт"
        return ExpertSummaryRow(
            public_id=account.public_id,
            full_name=full_name,
            avatar_url=account.avatar_url,
            rating=float(expert.rating) if expert.rating is not None else None,
            review_count=int(expert.review_count or 0),
            completed_orders_count=int(completed_orders_count or 0),
            joined_at=account.created_at,
            last_order=last_order,
            last_order_response=last_response,
        )

    def find_accepted_response(
        self,
        order: Order,
        expert_id: int,
    ) -> OrderResponseModel | None:
        "Отклик принятого эксперта по архивному заказу (статус IN_PROGRESS либо COMPLETED)."
        for response in order.responses:
            if response.expert_id != expert_id:
                continue
            if response.status not in {ResponseStatus.IN_PROGRESS, ResponseStatus.COMPLETED}:
                continue
            return response
        return None
