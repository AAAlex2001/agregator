"Use case: create response."
from datetime import UTC, datetime

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from models.order import Order, OrderStatus
from models.response import OrderResponse, ResponseStatus
from schemas.notification import ResponseUpdateKind
from schemas.response import ResponseCreate
from services.responses.in_app_notifier import ResponseInAppNotifier
from services.responses.repository import ResponseRepository
from services.responses.use_cases.get_response_by_id import GetResponseByIdUseCase
from services.responses.validators import ResponseValidator, check_budget, check_dates
from services.subscriptions import SubscriptionAccess
from utils.inn import is_valid_inn


class CreateResponseUseCase:
    "Сценарий приложения: координирует репозитории и сервисы."
    def __init__(
        self,
        repo: ResponseRepository,
        validator: ResponseValidator,
        get_response: GetResponseByIdUseCase,
        in_app: ResponseInAppNotifier,
        subscription_access: SubscriptionAccess | None = None,
    ) -> None:
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
        "Запускает основной сценарий use case."
        await self.validator.ensure_expert(expert_id)
        order = await self.ensure_order_open(order_id)

        check_budget(order, data.proposed_sum_amount)
        check_dates(order, data.proposed_start_date, data.proposed_deadline)
        expert_inn, expert_company_data = self.resolve_contract_company(order, data)
        self.check_responses_deadline(order)
        await self.check_not_duplicated(order_id, expert_id)

        subscription = None
        if self.subscription_access is not None:
            subscription = await self.subscription_access.require_for_response(expert_id)

        entity = self.build_entity(
            order_id,
            expert_id,
            data,
            expert_inn=expert_inn,
            expert_company_data=expert_company_data,
        )
        await self.repo.add(entity)
        await self.flush_or_reject()

        if subscription is not None and self.subscription_access is not None:
            await self.subscription_access.consume_for_response(subscription)

        created = await self.get_response.execute(entity.id)
        await self.in_app.response_updated(created, kind=ResponseUpdateKind.CREATED)
        return created

    async def ensure_order_open(self, order_id: int) -> Order:
        "Бросает HTTPException, если условие не выполнено."
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
    def check_responses_deadline(order: Order) -> None:
        "Проверяет условие и возвращает результат."
        if order.responses_deadline and datetime.now(UTC) > order.responses_deadline:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Срок приёма откликов истёк",
            )

    @staticmethod
    def resolve_contract_company(
        order: Order,
        data: ResponseCreate,
    ) -> tuple[str | None, dict[str, object] | None]:
        "Публичный метод сервисного слоя."
        if not order.requires_license:
            return None, None

        if not is_valid_inn(data.expert_inn):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Выберите вашу компанию из списка",
            )
        if not isinstance(data.expert_company_data, dict):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Выберите вашу компанию из списка",
            )
        return data.expert_inn, data.expert_company_data

    async def check_not_duplicated(self, order_id: int, expert_id: int) -> None:
        "Проверяет условие и возвращает результат."
        existing = await self.repo.find_existing_response(order_id, expert_id)
        if existing is None:
            return
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Вы уже откликнулись на этот заказ",
        )

    @staticmethod
    def build_entity(
        order_id: int,
        expert_id: int,
        data: ResponseCreate,
        expert_inn: str | None,
        expert_company_data: dict[str, object] | None,
    ) -> OrderResponse:
        "Строит объект из входных данных."
        return OrderResponse(
            order_id=order_id,
            expert_id=expert_id,
            comment=data.comment,
            proposed_sum_amount=data.proposed_sum_amount,
            proposed_start_date=data.proposed_start_date,
            proposed_deadline=data.proposed_deadline,
            status=ResponseStatus.REVIEW,
            expert_inn=expert_inn,
            expert_company_data=expert_company_data,
            vat_kind=data.vat_kind,
        )

    async def flush_or_reject(self) -> None:
        "Сбрасывает изменения в БД или бросает 400 при конфликте."
        try:
            await self.repo.flush()
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Отклик уже существует",
            )
