"Use case: update order."
from typing import Any

from models.order import Order, OrderBadge
from schemas.order import OrderUpdate
from services.email import SendOrderUpdatedEmailUseCase
from services.email.changes import summarize_order_changes
from services.orders.documents import OrderDocumentsService
from services.orders.repository import OrderRepository
from services.orders.use_cases.get_order_by_id import GetOrderByIdUseCase
from services.orders.validators import OrderValidator


class UpdateOrderUseCase:
    "Обновление заказа без работы с файлами. Файлы — в UpdateOrderWithFilesUseCase."

    PREVIOUS_TRACKED = {
        "title": "previous_title",
        "comment": "previous_comment",
        "sum_amount": "previous_sum_amount",
        "deadline": "previous_deadline",
    }

    def __init__(
        self,
        repo: OrderRepository,
        get_order: GetOrderByIdUseCase,
        validator: OrderValidator,
        send_updated_email: SendOrderUpdatedEmailUseCase | None = None,
    ) -> None:
        self.repo = repo
        self.get_order = get_order
        self.validator = validator
        self.send_updated_email = send_updated_email

    async def execute(
        self,
        order_id: int,
        data: OrderUpdate,
        current_user_id: int,
        notify: bool = True,
    ) -> Order:
        "Запускает основной сценарий use case."
        await self.validator.ensure_user_can_modify_order(order_id, current_user_id)

        order = await self.get_order.execute(order_id)
        snapshot = self.snapshot(order)

        update_data = data.model_dump(exclude_unset=True)
        update_data.pop("notify_responders", None)
        badges_data = update_data.pop("badges", None)
        documents = data.documents if "documents" in update_data else None
        update_data.pop("documents", None)
        if update_data.get("requires_expert") is None:
            update_data.pop("requires_expert", None)
        if update_data.get("requires_license") is None:
            update_data.pop("requires_license", None)

        if documents is not None:
            current_documents = OrderDocumentsService.from_order(order)
            if current_documents != documents:
                OrderDocumentsService.write_previous(order, current_documents)
            OrderDocumentsService.write(order, documents)

        if badges_data is not None:
            current_badges = [
                {"text": b.text, "variant": b.variant.value if hasattr(b.variant, "value") else b.variant}
                for b in (order.badges or [])
            ]
            if [{"text": x["text"], "variant": x["variant"]} for x in badges_data] != current_badges:
                order.previous_badges = current_badges

        self.validator.ensure_requirements_selected(
            data.requires_expert if data.requires_expert is not None else order.requires_expert,
            data.requires_license if data.requires_license is not None else order.requires_license,
        )
        self.apply_scalar_updates(order, update_data)

        if badges_data is not None:
            await self.replace_badges(order_id, badges_data)

        await self.repo.flush()
        updated = await self.get_order.execute(order_id)

        if notify and data.notify_responders:
            await self.send_email_if_changed(updated, snapshot)
        return updated

    @staticmethod
    def snapshot(order: Order) -> dict[str, Any]:
        "Публичный метод сервисного слоя."
        return {
            "sum_amount": order.sum_amount,
            "deadline": order.deadline,
            "comment": order.comment or "",
            "files_count": OrderDocumentsService.count(OrderDocumentsService.from_order(order)),
        }

    async def send_email_if_changed(self, updated: Order, before: dict[str, Any]) -> None:
        "Отправляет уведомление получателю."
        if self.send_updated_email is None:
            return
        summary = summarize_order_changes(
            before["sum_amount"],
            updated.sum_amount,
            before["deadline"],
            updated.deadline,
            before["comment"],
            updated.comment or "",
            before["files_count"],
            OrderDocumentsService.count(OrderDocumentsService.from_order(updated)),
        )
        if not summary:
            return
        await self.send_updated_email.execute(updated.id, summary)

    @classmethod
    def apply_scalar_updates(cls, order: Order, update_data: dict[str, Any]) -> None:
        "Публичный метод сервисного слоя."
        for field, value in update_data.items():
            previous_field = cls.PREVIOUS_TRACKED.get(field)
            if previous_field is not None:
                current = getattr(order, field, None)
                if current != value:
                    setattr(order, previous_field, current)
            setattr(order, field, value)

    async def replace_badges(self, order_id: int, badges_data: list[dict[str, Any]]) -> None:
        "Заменяет существующее значение новым."
        await self.repo.delete_badges_by_order(order_id)
        badges = [
            OrderBadge(order_id=order_id, text=item["text"], variant=item["variant"])
            for item in badges_data
        ]
        await self.repo.add_badges(badges)
