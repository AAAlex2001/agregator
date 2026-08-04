"Бизнес-валидации для orders."
from fastapi import HTTPException, status
from pydantic import BaseModel, ValidationError

from models.account import UserRole
from models.order import OrderStatus, OrderWorkType
from services.directions.registry import get_direction
from services.orders.repository import OrderRepository


class OrderValidator:
    "Доменные правила. Никакой работы с БД кроме обращений к репозиторию."

    def __init__(self, repo: OrderRepository) -> None:
        self.repo = repo

    async def ensure_user_can_create_order(self, customer_id: int, current_user_id: int) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if customer_id != current_user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Нельзя создать заказ от имени другого пользователя",
            )
        role = await self.repo.get_user_role(current_user_id)
        if role != UserRole.CUSTOMER:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Создавать заказы может только заказчик",
            )

    @staticmethod
    def ensure_requirements_selected(requires_expert: bool, requires_license: bool) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if requires_expert or requires_license:
            return
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Выберите, что требуется: эксперт и/или лицензия",
        )

    async def ensure_user_can_modify_order(self, order_id: int, user_id: int) -> None:
        "Бросает HTTPException, если условие не выполнено."
        order = await self.repo.get_by_id(order_id)
        if order is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Заказ не найден",
            )
        if order.customer_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Нет прав на изменение этого заказа",
            )
        if order.assigned_expert_id is not None or order.status != OrderStatus.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Заказ нельзя изменить или удалить — уже выбран исполнитель",
            )

    async def ensure_user_can_view_order(self, order_id: int, user_id: int) -> None:
        "Бросает HTTPException, если условие не выполнено."
        order = await self.repo.get_by_id(order_id)
        if order is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Заказ не найден",
            )
        if order.customer_id == user_id or order.assigned_expert_id == user_id:
            return
        role = await self.repo.get_user_role(user_id)
        if role == UserRole.EXPERT:
            if order.status == OrderStatus.ACTIVE and order.assigned_expert_id is None:
                return
            if await self.repo.expert_has_response(order.id, user_id):
                return
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет прав на просмотр этого заказа",
        )

    @staticmethod
    def validate_direction_details(
        work_type: OrderWorkType, details: dict | None
    ) -> BaseModel | None:
        "Валидирует поля направления заказа; без направления или без своих полей возвращает None."
        direction = get_direction(work_type.value)
        if direction is None or not direction.has_details:
            return None
        if details is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Заполните поля направления",
            )
        try:
            return direction.details_input_schema.model_validate(details)
        except ValidationError:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Некорректные поля направления",
            )
