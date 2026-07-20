"Use case: send new order email."
from models.order import Order, OrderWorkType
from models.user import User
from schemas.email import NewOrderContext, OrderBrief
from services.email.dispatcher import EmailDispatcher
from services.email.formatting import greeting_for
from services.email.repository import EmailRepository
from services.order_notification_types import notification_types_for_order

TEMPLATE = "new_order"
SUBJECT = "Новая заявка на Ресурс-Плюс"
CTA_URL = "https://plus-resurs.com/expert/orders"
TG_CTA = "Чтобы посмотреть заявку и откликнуться, откройте приложение."
FALLBACK_SUBJECT_PREFIX = "Вам может быть интересен этот заказ"
FALLBACK_NOTICE = (
    "Заказ опубликован без указания направлений, поэтому мы отправили его всем экспертам. "
    "Откройте карточку и откликнитесь, если работа подходит вашему профилю."
)


class SendNewOrderEmailUseCase:
    "Письмо о новой заявке только экспертам с подходящими настройками направлений."

    def __init__(self, repo: EmailRepository, dispatcher: EmailDispatcher) -> None:
        self.repo = repo
        self.dispatcher = dispatcher

    async def execute(self, order_id: int, force_all_experts: bool = False) -> None:
        "Запускает основной сценарий use case."
        order = await self.repo.find_order(order_id)
        if order is None:
            return

        order_types = notification_types_for_order(order)
        fallback_to_all = force_all_experts or (
            order.work_type == OrderWorkType.EXPERTISE and not order_types
        )

        experts = (
            await self.repo.list_all_experts()
            if fallback_to_all
            else await self.repo.list_experts_subscribed_to_order_types()
        )
        order_title = order.title or f"Заказ #{order.id}"
        subject = (
            f"{FALLBACK_SUBJECT_PREFIX}: {order_title}"
            if fallback_to_all
            else SUBJECT
        )
        for expert in experts:
            wanted = set(expert.notify_order_types or [])
            if not fallback_to_all and not wanted & order_types:
                continue
            self.dispatcher.notify(
                expert,
                None,
                TEMPLATE,
                subject,
                self.build_context(order, expert, fallback_to_all),
                TG_CTA,
            )

    def build_context(
        self,
        order: Order,
        expert: User,
        fallback_to_all: bool = False,
    ) -> NewOrderContext:
        "Строит объект из входных данных."
        return NewOrderContext(
            expert_greeting=greeting_for(expert),
            order_title=order.title or f"Заказ #{order.id}",
            cta_url=CTA_URL,
            fallback_notice=FALLBACK_NOTICE if fallback_to_all else "",
            order=OrderBrief(
                company=order.company or "",
                sum_amount=order.sum_amount,
                deadline=order.deadline,
                comment=order.comment or "",
                badges=[badge.text for badge in order.badges],
            ),
        )
