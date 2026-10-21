"""Организация подаёт заявку на аудит СУПБ."""

from contextlib import AsyncExitStack
from dataclasses import dataclass

from fastapi import UploadFile

from app.blitz.audit.schemas import AuditCreateSchema, AuditDetailsSchema
from app.blitz.audit.services.files import saved_audit_files, saved_checklist_files
from app.blitz.audit.services.repo import AuditRepository
from app.blitz.catalog import ContractKind, Deadline
from app.blitz.documents.models import DocumentKind
from app.blitz.documents.services.storage import OrderFiles
from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import Actor, BlitzOrder, OrderStatus, ServiceKind
from app.blitz.orders.services.exceptions import InvalidOrderError
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.usecases.create_order import build_company
from app.blitz.orders.services.validators import require_customer
from models.account import Account

OBJECT_NAME_LIMIT = 500


@dataclass(frozen=True)
class AuditAttachments:
    """Отдельные файлы заявки: карточка, свидетельство ОПО, доверенность и СТО."""

    company_card: UploadFile | None
    opo_certificate: UploadFile | None
    power_of_attorney: UploadFile | None
    sto_file: UploadFile | None


def describe_object(details: AuditDetailsSchema) -> str:
    """Что проверяем одной строкой для договора, уведомлений и списков."""

    if details.scope == "all" and details.fleet is not None:
        return f"Все ОПО {details.applicant.organization} ({details.fleet.count})"

    names = "; ".join(f"{item.name} ({item.reg_number})" for item in details.objects)

    return names[:OBJECT_NAME_LIMIT]


def extra_files(
    details: AuditDetailsSchema,
    attachments: AuditAttachments,
) -> list[tuple[DocumentKind, UploadFile]]:
    """Отдельные файлы, нужные этой заявке. Без доверенности или СТО — InvalidOrderError."""

    if details.applicant.by_proxy and attachments.power_of_attorney is None:
        raise InvalidOrderError("Приложите доверенность заявителя")

    if details.params.use_sto and attachments.sto_file is None:
        raise InvalidOrderError("Приложите файл СТО")

    candidates = [
        (DocumentKind.COMPANY_CARD, attachments.company_card, True),
        (DocumentKind.OPO_CERTIFICATE, attachments.opo_certificate, details.scope == "all"),
        (DocumentKind.POWER_OF_ATTORNEY, attachments.power_of_attorney, details.applicant.by_proxy),
        (DocumentKind.STO, attachments.sto_file, bool(details.params.use_sto)),
    ]

    return [(kind, upload) for kind, upload, needed in candidates if needed and upload and upload.filename]


class CreateAuditUseCase:
    """Сохраняет заявку с файлами. Аудиторы получают её сразу, консультацию — менеджер."""

    def __init__(
        self,
        orders: OrderRepository,
        audits: AuditRepository,
        files: OrderFiles,
        notifier: BlitzNotifier,
    ) -> None:
        self.orders = orders
        self.audits = audits
        self.files = files
        self.notifier = notifier

    async def execute(
        self,
        customer: Account,
        data: AuditCreateSchema,
        uploads: list[UploadFile],
        items: list[int],
        attachments: AuditAttachments,
    ) -> BlitzOrder:
        """Неверные пункты перечня, нет доверенности или СТО — InvalidOrderError."""

        require_customer(customer)
        details = data.details
        extras = extra_files(details, attachments)
        checklist = [upload for upload in uploads if upload.filename]
        consultation = details.params.kind == "consultation"

        order = BlitzOrder(
            id=await self.orders.reserve_id(),
            service=ServiceKind.AUDIT,
            customer=customer,
            deadline=Deadline.ANY,
            object_name=describe_object(details),
            contract_kind=ContractKind.AUDIT,
            customer_type=data.customer_type,
            comment=data.comment.strip() if data.comment else None,
            price=data.price,
            audit_details=details.model_dump(mode="json"),
            company=build_company(data.company),
        )
        order.move_to(OrderStatus.CONSULTATION if consultation else OrderStatus.NEW, Actor.CUSTOMER)

        async with AsyncExitStack() as stack:
            documents = await stack.enter_async_context(
                saved_checklist_files(self.files, order.id, checklist, items, customer.id),
            )

            for kind, upload in extras:
                documents += await stack.enter_async_context(
                    saved_audit_files(self.files, order.id, [upload], kind, customer.id),
                )

            order.documents.extend(documents)
            await self.orders.add(order)
            await self.notify(order, consultation)

        return order

    async def notify(self, order: BlitzOrder, consultation: bool) -> None:
        """Консультация — менеджеру. Иначе — аудиторам и менеджеру."""

        if consultation:
            self.notifier.notify_admins(
                order,
                "Заказчику нужна консультация по типу аудита. Свяжитесь с ним и откройте заявку "
                "аудиторам: в админке поставьте статус «Ждёт эксперта».",
            )
            return

        message = f"Новая заявка на аудит СУПБ: {order.object_name}"
        await self.notifier.notify_all(await self.audits.list_auditors(), order, message)
        self.notifier.notify_admins(order, message)
