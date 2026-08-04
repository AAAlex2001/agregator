"Форматирование отклика в схему ответа API."
from datetime import timedelta

from models.order import OrderStatus
from models.response import OrderResponse, ResponseStatus, VatKind
from schemas.order import BadgeResponse, OrderDocuments
from schemas.response import ExpertResponseItem
from services.orders.documents import OrderDocumentsService
from utils.money import format_kopecks


def to_item(entity: OrderResponse, has_review: bool = False) -> ExpertResponseItem:
    "Собирает карточку отклика для UI из ORM-сущности."
    order = entity.order
    effective_status = entity.status
    date_source = entity.created_at
    if effective_status in {ResponseStatus.ACCEPTED, ResponseStatus.IN_PROGRESS, ResponseStatus.COMPLETED}:
        date_source = entity.updated_at or entity.created_at
    is_finalized = effective_status == ResponseStatus.COMPLETED
    customer_name = ""
    customer_company = ""
    customer_inn = ""
    order_sum = ""
    if order:
        customer_name = order.company or ""
        customer_company = order.company or ""
        customer_inn = order.customer.inn or "" if order.customer is not None else ""
        order_sum = "Не определено" if order.sum_amount == 0 else format_kopecks(order.sum_amount)

    expert = entity.expert
    expert_name = ""
    expert_avatar_url: str | None = None
    expert_rating: float | None = None
    expert_review_count = 0
    expert_public_id = ""
    rejection_reason = entity.rejection_reason
    expert_company_name = ""
    if isinstance(entity.expert_company_data, dict):
        expert_company_name = (entity.expert_company_data.get("value") or "")
    if expert:
        parts = [expert.first_name or "", expert.last_name or ""]
        expert_name = " ".join(p for p in parts if p)
        expert_avatar_url = expert.avatar_url
        profile = expert.expert_profile
        if profile is not None:
            expert_rating = float(profile.rating) if profile.rating is not None else None
            expert_review_count = profile.review_count or 0
        expert_public_id = expert.public_id or ""

    order_locked = False
    if order is not None:
        order_locked = (
            order.assigned_expert_id is not None
            or order.status != OrderStatus.ACTIVE
        )

    return ExpertResponseItem(
        id=entity.id,
        order_id=entity.order_id,
        expert_id=entity.expert_id,
        order_public_id=order.public_id if order else "",
        order_customer_id=order.customer_id if order else 0,
        status=effective_status,
        date=date_source.strftime("%d.%m.%Y"),
        comment=entity.comment,
        proposed_sum=format_kopecks(entity.proposed_sum_amount),
        proposed_start_date=(
            entity.proposed_start_date.strftime("%d.%m.%Y") if entity.proposed_start_date else ""
        ),
        proposed_deadline=entity.proposed_deadline.strftime("%d.%m.%Y"),
        order_title=order.title if order else "",
        order_sum=order_sum,
        order_start_date=(
            order.start_date.strftime("%d.%m.%Y") if order and order.start_date else ""
        ),
        order_date=order.deadline.strftime("%d.%m.%Y") if order else "",
        order_comment=order.comment if order else "",
        order_responses_deadline=(
            order.responses_deadline.isoformat() if order and order.responses_deadline else None
        ),
        order_created_at=order.created_at.isoformat() if order and order.created_at else "",
        customer_name=customer_name,
        customer_company=customer_company,
        customer_inn=customer_inn,
        order_documents=OrderDocumentsService.from_order(order) if order else OrderDocuments(),
        response_files=entity.technical_files if entity.technical_files else [],
        badges=[
            BadgeResponse(text=badge.text, variant=badge.variant.value)
            for badge in (order.badges if order else [])
        ],
        created_at=entity.created_at,
        proposed_sum_amount_raw=entity.proposed_sum_amount,
        proposed_start_date_raw=(
            entity.proposed_start_date.isoformat() if entity.proposed_start_date else ""
        ),
        proposed_deadline_raw=entity.proposed_deadline.isoformat(),
        previous_comment=None if is_finalized else entity.previous_comment,
        previous_proposed_sum=(
            None if is_finalized
            else format_kopecks(entity.previous_proposed_sum_amount)
            if entity.previous_proposed_sum_amount is not None
            else None
        ),
        previous_proposed_start_date=(
            None if is_finalized
            else entity.previous_proposed_start_date.strftime("%d.%m.%Y")
            if entity.previous_proposed_start_date is not None
            else None
        ),
        previous_proposed_deadline=(
            None if is_finalized
            else entity.previous_proposed_deadline.strftime("%d.%m.%Y")
            if entity.previous_proposed_deadline is not None
            else None
        ),
        previous_vat_kind=None if is_finalized else entity.previous_vat_kind,
        previous_response_files=(
            None if is_finalized
            else list(entity.previous_technical_files)
            if isinstance(entity.previous_technical_files, list)
            else None
        ),
        order_previous_title=(
            None if is_finalized or order is None else order.previous_title
        ),
        order_previous_comment=(
            None if is_finalized or order is None else order.previous_comment
        ),
        order_previous_sum=(
            None if is_finalized or order is None or order.previous_sum_amount is None
            else format_kopecks(order.previous_sum_amount)
        ),
        order_previous_date=(
            None if is_finalized or order is None or order.previous_deadline is None
            else order.previous_deadline.strftime("%d.%m.%Y")
        ),
        order_previous_documents=(
            None if is_finalized or order is None
            else OrderDocumentsService.from_order_previous(order)
        ),
        order_previous_badges=(
            None if is_finalized or order is None
            else list(order.previous_badges)
            if isinstance(order.previous_badges, list)
            else None
        ),
        expert_name=expert_name,
        expert_avatar_url=expert_avatar_url,
        expert_rating=expert_rating,
        expert_review_count=expert_review_count,
        expert_public_id=expert_public_id,
        expert_confirmed=entity.expert_confirmed or False,
        has_review=has_review,
        rejection_reason=rejection_reason,
        expert_company_name=expert_company_name,
        expert_inn=entity.expert_inn,
        vat_kind=entity.vat_kind or VatKind.NONE,
        confirm_deadline=(
            ((entity.updated_at or entity.created_at) + timedelta(days=3)).strftime("%d.%m.%Y")
            if effective_status in {ResponseStatus.ACCEPTED, ResponseStatus.IN_PROGRESS}
            else ""
        ),
        order_locked=order_locked,
    )
