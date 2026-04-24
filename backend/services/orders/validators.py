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
    def ensure_files_present(files: list | None) -> None:
        if files:
            return
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Не переданы файлы для загрузки",
        )
