"Бизнес-валидации для orders."
from fastapi import HTTPException, status
from sqlalchemy import select

from models.order import OrderStatus
from models.response import OrderResponse as OrderResponseModel
from models.user import UserRole
from services.orders.repository import OrderRepository


class OrderValidator:
    "Доменные правила. Никакой работы с БД кроме обращений к репозиторию."

    def __init__(self, repo: OrderRepository) -> None:
        self.repo = repo

    async def ensure_customer_exists(self, customer_id: int) -> None:
        "Бросает HTTPException, если условие не выполнено."
        exists = await self.repo.user_exists(customer_id)
        if exists:
            return
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заказчик не найден",
        )

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
            # эксперт видит активные открытые заказы или те, по которым уже отвечал
            if order.status == OrderStatus.ACTIVE and order.assigned_expert_id is None:
                return
            has_response_q = select(OrderResponseModel.id).where(
                OrderResponseModel.order_id == order.id,
                OrderResponseModel.expert_id == user_id,
            )
            existing = (await self.repo.db.execute(has_response_q)).first()
            if existing is not None:
                return
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет прав на просмотр этого заказа",
        )

    @staticmethod
    def ensure_files_present(files: list[object] | None) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if files:
            return
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Не переданы файлы для загрузки",
        )
