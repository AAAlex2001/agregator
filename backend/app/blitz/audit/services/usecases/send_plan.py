"""Новая версия Плана: Программа аудита в Word и заявка на согласовании у заказчика."""

from app.blitz.audit.schemas import PlanInSchema, PlanSchema
from app.blitz.audit.services.auditors import team_of
from app.blitz.audit.services.negotiation import details_of
from app.blitz.audit.services.plan_document import build_plan_document, plan_filename
from app.blitz.documents.models import DocumentKind
from app.blitz.documents.services.storage import OrderFiles
from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import Actor, BlitzOrder, OrderStatus
from app.blitz.orders.services.exceptions import InvalidOrderError
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.rules import require_assigned, require_status
from app.core.clock import now
from models.account import Account


class SendPlanUseCase:
    """Новая версия Плана: Программа аудита в Word и заявка на согласовании у заказчика."""

    def __init__(self, orders: OrderRepository, files: OrderFiles, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.files = files
        self.notifier = notifier

    async def execute(self, lead: Account, order: BlitzOrder, data: PlanInSchema) -> BlitzOrder:
        """Нет дат выездного этапа, хотя заказчик его выбрал, — InvalidOrderError."""

        require_assigned(order, lead)
        require_status(order, OrderStatus.PLAN, "Сейчас План аудита не ожидается")

        details = details_of(order)
        if "onsite" in details.stages and data.onsite_start is None:
            raise InvalidOrderError("Заказчик выбрал выездной этап: укажите его даты")

        version = int((order.audit_plan or {}).get("version", 0)) + 1
        plan = PlanSchema(**data.model_dump(), version=version)
        content = build_plan_document(order, details, plan, team_of(order), now())
        document = self.files.generated(
            order.id,
            content,
            plan_filename(order, version),
            DocumentKind.AUDIT_PLAN,
            lead.id,
        )

        order.documents.append(document)
        order.audit_plan = plan.model_dump(mode="json")
        order.plan_comment = None
        order.move_to(OrderStatus.PLAN_REVIEW, Actor.EXPERT, f"Отправлена версия {version}")
        await self.orders.save()

        await self.notifier.notify(
            order.customer,
            order,
            "План аудита готов: состав группы, график и ресурсы. Согласуйте его или попросите поправить",
        )

        return order
