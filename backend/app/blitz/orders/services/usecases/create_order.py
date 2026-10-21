"""Заказчик подаёт заявку: что проверить, цена, реквизиты и документация."""

from datetime import date
from decimal import Decimal

from fastapi import UploadFile

from app.blitz.documents.models import DocumentKind
from app.blitz.documents.services.storage import OrderFiles
from app.blitz.documents.services.validators import chosen_files, required_files
from app.blitz.notifications import BlitzNotifier
from app.blitz.orders.models import (
    COMPANY_CUSTOMERS,
    Actor,
    BlitzOrder,
    CustomerType,
    OrderCompany,
    OrderIndividual,
    OrderStatus,
    ServiceKind,
)
from app.blitz.orders.schemas import CompanyInSchema, IndividualInSchema, OrderCreateSchema
from app.blitz.orders.services.matching import expert_fits
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.validators import (
    normalize_account,
    normalize_bic,
    normalize_inn,
    normalize_kpp,
    normalize_ogrn,
    normalize_passport,
    require_customer,
    resolve_category,
    resolve_kind,
    validate_codes,
)
from app.core.money import format_rub
from models.account import Account


class CreateOrderUseCase:
    """Сохраняет заявку с файлами и сообщает подходящим экспертам и администраторам."""

    def __init__(self, orders: OrderRepository, files: OrderFiles, notifier: BlitzNotifier) -> None:
        self.orders = orders
        self.files = files
        self.notifier = notifier

    async def execute(
        self,
        customer: Account,
        data: OrderCreateSchema,
        files: list[UploadFile],
        company_card: UploadFile | None,
    ) -> BlitzOrder:
        """Неверные коды, реквизиты или нет документации — InvalidOrderError."""

        require_customer(customer)
        validate_codes(data.object_code, data.area_code)
        documentation = required_files(files, "Приложите документацию на экспертизу")
        cards = chosen_files([company_card] if company_card else [])

        order = BlitzOrder(
            id=await self.orders.reserve_id(),
            service=ServiceKind.EXPERTISE,
            customer=customer,
            object_code=data.object_code,
            area_code=data.area_code,
            hazard_class=data.hazard_class,
            expert_category=resolve_category(data.hazard_class, data.expert_category),
            deadline=data.deadline,
            object_name=data.object_name.strip(),
            contract_kind=resolve_kind(data.object_code, data.contract_kind),
            customer_type=data.customer_type,
            comment=data.comment.strip() if data.comment else None,
            price=data.price,
            company=build_company(data.company) if data.customer_type in COMPANY_CUSTOMERS else None,
            individual=build_individual(data.individual) if is_individual(data) else None,
        )
        order.move_to(OrderStatus.NEW, Actor.CUSTOMER)

        async with (
            self.files.saved(order.id, documentation, DocumentKind.DOCUMENTATION, customer.id) as docs,
            self.files.saved(order.id, cards, DocumentKind.COMPANY_CARD, customer.id) as card_docs,
        ):
            order.documents.extend([*docs, *card_docs])
            await self.orders.add(order)
            await self.notify(order, data.price)

        return order

    async def notify(self, order: BlitzOrder, price: Decimal) -> None:
        """Экспертам с подходящими удостоверениями и администраторам."""

        today = date.today()
        experts = [
            expert
            for expert in await self.orders.list_experts_with_certificates()
            if expert_fits(expert, order, today)
        ]
        message = f"Новая заявка на экспертизу «{order.object_name}». Цена заказчика — {format_rub(price)}"

        await self.notifier.notify_all(experts, order, message)
        self.notifier.notify_admins(order, f"{message}. Подходящих экспертов: {len(experts)}")


def is_individual(data: OrderCreateSchema) -> bool:
    """Заказчик — физлицо."""

    return data.customer_type == CustomerType.INDIVIDUAL


def build_company(data: CompanyInSchema | None) -> OrderCompany | None:
    """Реквизиты организации: цифровые поля без пробелов и с проверкой длины."""

    if data is None:
        return None

    return OrderCompany(
        full_name=data.full_name.strip(),
        name=data.name.strip(),
        inn=normalize_inn(data.inn),
        kpp=normalize_kpp(data.kpp),
        ogrn=normalize_ogrn(data.ogrn),
        address=data.address.strip(),
        bank=data.bank.strip(),
        bic=normalize_bic(data.bic),
        account=normalize_account(data.account, "Расчётный счёт"),
        corr_account=normalize_account(data.corr_account, "Корреспондентский счёт"),
        signer_position=data.signer_position.strip(),
        signer_name=data.signer_name.strip(),
        signer_genitive=data.signer_genitive.strip(),
        signer_basis=data.signer_basis.strip(),
    )


def build_individual(data: IndividualInSchema | None) -> OrderIndividual | None:
    """Паспортные данные физлица."""

    if data is None:
        return None

    return OrderIndividual(
        full_name=data.full_name.strip(),
        passport_number=normalize_passport(data.passport_number),
        passport_issued_by=data.passport_issued_by.strip(),
        passport_issued_at=data.passport_issued_at,
        address=data.address.strip(),
    )
