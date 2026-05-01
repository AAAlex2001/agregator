from fastapi import HTTPException, status

from services.orders.repository import OrderRepository


class OrderValidator:
    "Доменные правила. Никакой работы с БД кроме обращений к репозиторию."

    def __init__(self, repo: OrderRepository):
        self.repo = repo

    async def ensure_customer_exists(self, customer_id: int) -> None:
        exists = await self.repo.user_exists(customer_id)
        if exists:
            return
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заказчик не найден",
        )

    @staticmethod
    def ensure_user_can_create_order(customer_id: int, current_user_id: int) -> None:
        if customer_id == current_user_id:
            return
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нельзя создать заказ от имени другого пользователя",
        )

    async def ensure_user_can_modify_order(self, order_id: int, user_id: int) -> None:
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

    @staticmethod
    def ensure_files_present(files: list | None) -> None:
        if files:
            return
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Не переданы файлы для загрузки",
        )
