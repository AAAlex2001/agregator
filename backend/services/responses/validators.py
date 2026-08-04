"Бизнес-валидации для responses."
from datetime import date

from fastapi import HTTPException, status

from models.account import Account, UserRole
from models.order import Order
from services.responses.repository import ResponseRepository


def check_budget(order: Order, proposed_sum_amount: int) -> None:
    "Бросает 400, если предложенная стоимость превышает бюджет заказчика."
    if order.sum_amount > 0 and proposed_sum_amount > order.sum_amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Стоимость не может превышать бюджет заказчика",
        )


def check_dates(
    order: Order, proposed_start_date: date | None, proposed_deadline: date
) -> None:
    "Бросает 400, если предложенные сроки выходят за рамки сроков заказчика."
    if proposed_deadline > order.deadline:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Срок окончания работ не может быть позже срока заказчика",
        )
    if (
        proposed_start_date is not None
        and order.start_date is not None
        and proposed_start_date < order.start_date
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Срок начала работ не может быть раньше срока заказчика",
        )
    if proposed_start_date is not None and proposed_start_date > proposed_deadline:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Срок начала работ не может быть позже срока окончания",
        )


class ResponseValidator:
    "Проверяет участников (эксперт/заказчик/актёр). Работает только с репозиторием."

    def __init__(self, repo: ResponseRepository) -> None:
        self.repo = repo

    async def ensure_expert(self, expert_id: int) -> Account:
        "Бросает HTTPException, если условие не выполнено."
        user = await self.require_user(expert_id)
        if user.is_active and user.role == UserRole.EXPERT:
            return user
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для откликов",
        )

    async def ensure_customer(self, customer_id: int) -> Account:
        "Бросает HTTPException, если условие не выполнено."
        user = await self.require_user(customer_id)
        if user.is_active and user.role == UserRole.CUSTOMER:
            return user
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для откликов",
        )

    async def require_active_user(self, user_id: int) -> Account:
        "Возвращает требуемую сущность или бросает 404/403."
        user = await self.require_user(user_id)
        if user.is_active:
            return user
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Пользователь неактивен",
        )

    async def require_user(self, user_id: int) -> Account:
        "Возвращает требуемую сущность или бросает 404."
        user = await self.repo.find_user(user_id)
        if user is not None:
            return user
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден",
        )
