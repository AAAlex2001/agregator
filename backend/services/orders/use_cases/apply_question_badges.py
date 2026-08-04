"Use case: apply question badges."
from models.account import UserRole
from models.order import Order
from schemas.order import OrderCard
from services.orders.repository import OrderRepository


async def apply_question_badges(
    repo: OrderRepository,
    orders: list[Order],
    items: list[OrderCard],
    user_id: int | None,
) -> None:
    "Проставляет карточкам счётчики вопросов: заказчику — без ответа, эксперту — отвеченные ему."
    if user_id is None or not orders:
        return
    role = await repo.get_user_role(user_id)
    order_ids = [order.id for order in orders]
    if role == UserRole.CUSTOMER:
        counts = await repo.count_unanswered_questions(order_ids)
        for item in items:
            item.unanswered_questions = counts.get(item.id, 0)
    if role == UserRole.EXPERT:
        counts = await repo.count_expert_answered_questions(order_ids, user_id)
        for item in items:
            item.my_answered_questions = counts.get(item.id, 0)
