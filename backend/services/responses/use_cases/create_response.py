from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from models.order import Order, OrderStatus
from models.response import OrderResponse, ResponseStatus
from schemas.notification import ResponseUpdateKind
from schemas.response import ResponseCreate
from services.responses.in_app_notifier import ResponseInAppNotifier
from services.responses.repository import ResponseRepository
from services.responses.use_cases.get_response_by_id import GetResponseByIdUseCase
from services.responses.validators import ResponseValidator
from services.subscriptions import SubscriptionAccess


class CreateResponseUseCase:
    def __init__(
        self,
        repo: ResponseRepository,
        validator: ResponseValidator,
        get_response: GetResponseByIdUseCase,
        in_app: ResponseInAppNotifier,
        subscription_access: SubscriptionAccess | None = None,
    ):
        self.repo = repo
        self.validator = validator
        self.get_response = get_response
        self.in_app = in_app
        self.subscription_access = subscription_access

    async def execute(
        self,
        order_id: int,
        expert_id: int,
        data: ResponseCreate,
    ) -> OrderResponse:
        await self.validator.ensure_expert(expert_id)
        order = await self.ensure_order_open(order_id)

        self.check_budget(order, data.proposed_sum_amount)
        self.check_deadline(order, data.proposed_deadline)
        self.check_responses_deadline(order)
        await self.check_not_duplicated(order_id, expert_id)

        subscription = None
        if self.subscription_access is not None:
            subscription = await self.subscription_access.require_for_response(expert_id)

        entity = self.build_entity(order_id, expert_id, data)
        await self.repo.add(entity)
        await self.flush_or_reject()

        if subscription is not None and self.subscription_access is not None:
            await self.subscription_access.consume_for_response(subscription)

        created = await self.get_response.execute(entity.id)
        await self.in_app.response_updated(created, kind=ResponseUpdateKind.CREATED)
        return created

    async def ensure_order_open(self, order_id: int) -> Order:
        order = await self.repo.get_order_by_id(order_id)
        if order is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Заказ не найден",
            )
        if order.status != OrderStatus.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Нельзя откликнуться на неактивный заказ",
            )
        return order

    @staticmethod
    def check_budget(order: Order, proposed: int) -> None:
        if order.sum_amount > 0 and proposed > order.sum_amount:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Стоимость не может превышать бюджет заказчика",
            )

    @staticmethod
    def check_deadline(order: Order, proposed_deadline) -> None:
        if proposed_deadline > order.deadline:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Срок не может быть позже дедлайна заказчика",
            )

    @staticmethod
    def check_responses_deadline(order: Order) -> None:
        if order.responses_deadline and datetime.now(timezone.utc) > order.responses_deadline:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Срок приёма откликов истёк",
            )

    async def check_not_duplicated(self, order_id: int, expert_id: int) -> None:
        existing = await self.repo.find_existing_response(order_id, expert_id)
        if existing is None:
            return
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Вы уже откликнулись на этот заказ",
        )

    @staticmethod
    def build_entity(order_id: int, expert_id: int, data: ResponseCreate) -> OrderResponse:
        return OrderResponse(
            order_id=order_id,
            expert_id=expert_id,
            comment=data.comment,
            proposed_sum_amount=data.proposed_sum_amount,
            proposed_start_date=data.proposed_start_date,
            proposed_deadline=data.proposed_deadline,
            status=ResponseStatus.REVIEW,
            expert_inn=data.expert_inn,
            expert_company_data=data.expert_company_data,
            vat_kind=data.vat_kind,
        )

    async def flush_or_reject(self) -> None:
        try:
            await self.repo.flush()
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Отклик уже существует",
            )
