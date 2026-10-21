"""Блиц-эксперт без базы и сети: справочник, подбор, деньги, этапы оплаты, договор, сценарии."""

import asyncio
from datetime import date
from decimal import Decimal
from io import BytesIO

import pytest
from docx import Document

from app.blitz.billing.models import Invoice, PaymentStage
from app.blitz.billing.services.stages import accept_payment, advance_of, amount_due
from app.blitz.billing.services.usecases.issue_invoice import IssueInvoiceUseCase
from app.blitz.catalog import ContractKind, kinds_for, object_covers
from app.blitz.contracts.services.document import Paper, build_paper
from app.blitz.orders.models import (
    Actor,
    BlitzOrder,
    CustomerType,
    OrderCompany,
    OrderIndividual,
    OrderStatus,
    ServiceKind,
)
from app.blitz.orders.services.exceptions import (
    CustomerRequiredError,
    InvalidOrderError,
    OrderAccessError,
    OrderStateError,
)
from app.blitz.orders.services.matching import expert_fits
from app.blitz.orders.services.presenter import details
from app.blitz.orders.services.usecases.accept_order import AcceptOrderUseCase
from app.blitz.orders.services.usecases.cancel_order import CancelOrderUseCase
from app.blitz.orders.services.usecases.set_order_status import SetOrderStatusUseCase
from app.blitz.orders.services.validators import (
    normalize_passport,
    require_customer,
    resolve_category,
    resolve_kind,
    validate_codes,
)
from app.blitz.pricing.services.usecases.change_price import ChangePriceUseCase
from app.core.clock import now
from app.core.money import amount_in_words, format_amount, number_to_words, vat_included
from models.account import Account, UserRole
from models.expert import Expert

TODAY = date(2026, 10, 21)


def account(account_id: int, role: UserRole, certificates: list[dict[str, str]] | None = None) -> Account:
    """Аккаунт с ролью и удостоверениями в анкете эксперта."""

    user = Account(
        id=account_id,
        role=role,
        first_name=f"Аккаунт {account_id}",
        phone="+79990000000",
        email=f"user{account_id}@mail.ru",
    )
    user.expert_profile = Expert(certificates=certificates) if role == UserRole.EXPERT else None

    return user


CUSTOMER = account(1, UserRole.CUSTOMER)
EXPERT = account(
    2,
    UserRole.EXPERT,
    [{"area": "Э12", "object": "КЛ/ТП", "category": "2", "expires_at": "2027-01-01"}],
)
STRANGER = account(3, UserRole.EXPERT, [{"area": "Э1", "object": "ТУ", "category": "1"}])


def company() -> OrderCompany:
    """Реквизиты организации."""

    return OrderCompany(
        full_name="Общество с ограниченной ответственностью «Ромашка»",
        name="ООО «Ромашка»",
        inn="7707083893",
        kpp="770701001",
        ogrn="1027700132195",
        address="Москва, ул. Ленина, 1",
        bank="ПАО Сбербанк",
        bic="044525225",
        account="40702810938000000001",
        corr_account="30101810400000000225",
        signer_position="Директор",
        signer_name="Иванов Иван Иванович",
        signer_genitive="директора Иванова Ивана Ивановича",
        signer_basis="Устава",
    )


def order(status: OrderStatus = OrderStatus.NEW, **fields: object) -> BlitzOrder:
    """Заявка организации на КЛ по области Э12."""

    values: dict[str, object] = {
        "id": 7,
        "service": ServiceKind.EXPERTISE,
        "customer_id": CUSTOMER.id,
        "object_code": "КЛ",
        "area_code": "Э12",
        "expert_category": 2,
        "deadline": "week",
        "object_name": "Проект консервации котельной",
        "contract_kind": ContractKind.CONSERVATION,
        "customer_type": CustomerType.LEGAL,
        "price": Decimal("150000.00"),
        "paid_amount": Decimal(0),
        "status": status,
        "company": company(),
        "created_at": now(),
        "updated_at": now(),
        "result": None,
    }
    values.update(fields)
    result = BlitzOrder(**values)
    result.customer = CUSTOMER
    result.history = []
    result.invoices = []
    result.documents = []
    result.remarks = []
    result.price_changes = []

    return result


class FakeOrders:
    """Репозиторий без базы."""

    def __init__(self, expert: Account | None = None) -> None:
        self.saved = 0
        self.expert = expert

    async def save(self) -> None:
        self.saved += 1

    async def get_expert(self, expert_id: int) -> Account | None:
        return self.expert


class FakeNotifier:
    """Запоминает, кому и что сообщили."""

    def __init__(self) -> None:
        self.sent: list[tuple[int, str]] = []
        self.admins: list[str] = []

    async def notify(self, recipient: Account | None, order: BlitzOrder, message: str) -> None:
        if recipient is not None:
            self.sent.append((recipient.id, message))

    async def notify_all(self, recipients: list[Account], order: BlitzOrder, message: str) -> None:
        for recipient in recipients:
            await self.notify(recipient, order, message)

    def notify_admins(self, order: BlitzOrder, message: str) -> None:
        self.admins.append(message)


def test_joined_objects_cover_split_ones() -> None:
    assert object_covers("КЛ/ТП", "КЛ")
    assert object_covers("ТП", "КЛ/ТП")
    assert not object_covers("КЛ", "ТП")
    assert not object_covers("ТУ", "КЛ")


def test_contract_kinds_follow_object() -> None:
    assert kinds_for("Д") == (ContractKind.DECLARATION,)
    assert resolve_kind("ТП", None) == ContractKind.REEQUIPMENT
    assert resolve_kind("КЛ", None) is None

    with pytest.raises(InvalidOrderError):
        resolve_kind("Д", ContractKind.BUILDING)


def test_codes_are_checked_against_catalog() -> None:
    validate_codes("КЛ", "Э4")
    validate_codes(None, None)

    with pytest.raises(InvalidOrderError, match="не проводится"):
        validate_codes("Д", "Э12")
    with pytest.raises(InvalidOrderError, match="Неизвестная"):
        validate_codes("КЛ", "Э99")


def test_category_comes_from_hazard_class() -> None:
    assert resolve_category(4, None) == 3
    assert resolve_category(None, 2) == 2
    assert resolve_category(None, None) is None


def test_passport_is_normalized() -> None:
    assert normalize_passport("45 06-123456") == "4506 123456"

    with pytest.raises(InvalidOrderError):
        normalize_passport("123")


def test_expert_fits_by_area_object_and_category() -> None:
    assert expert_fits(EXPERT, order(), TODAY)
    assert not expert_fits(STRANGER, order(), TODAY)
    assert not expert_fits(EXPERT, order(expert_category=1), TODAY)
    assert expert_fits(STRANGER, order(object_code=None, area_code=None, expert_category=None), TODAY)


def test_expired_certificate_does_not_count() -> None:
    certificate = {"area": "Э12", "object": "КЛ", "category": "1", "expires_at": "2025-01-01"}
    expired = account(4, UserRole.EXPERT, [certificate])

    assert not expert_fits(expired, order(), TODAY)


def test_money_in_words() -> None:
    assert number_to_words(21) == "двадцать один"
    assert number_to_words(152_000) == "сто пятьдесят две тысячи"
    assert amount_in_words(Decimal("20000.50")) == "Двадцать тысяч рублей 50 копеек"
    assert format_amount(Decimal("1234567.08")) == "1 234 567,08"
    assert vat_included(Decimal("120"), 20) == Decimal("20.00")


def test_odd_kopeck_goes_to_final_payment() -> None:
    assert advance_of(Decimal("100.01")) == Decimal("50.01")


def test_advance_moves_order_to_work() -> None:
    contract = order(OrderStatus.CONTRACT)

    message = accept_payment(contract, PaymentStage.ADVANCE, Decimal("75000.00"))

    assert contract.status == OrderStatus.IN_PROGRESS
    assert contract.paid_amount == Decimal("75000.00")
    assert message is not None


def test_partial_payment_is_counted_but_does_not_move() -> None:
    contract = order(OrderStatus.CONTRACT)

    assert accept_payment(contract, PaymentStage.ADVANCE, Decimal("1000.00")) is None
    assert contract.status == OrderStatus.CONTRACT
    assert amount_due(contract, PaymentStage.ADVANCE) == Decimal("74000.00")


def test_final_payment_is_price_minus_paid() -> None:
    ready = order(OrderStatus.CONCLUSION_READY, paid_amount=Decimal("75000.00"), price=Decimal("200000.00"))

    assert amount_due(ready, PaymentStage.FINAL) == Decimal("125000.00")


def test_contract_is_filled_for_company_and_individual() -> None:
    signed_at = now()
    ready = order(OrderStatus.EXPERT_READY)
    person = order(
        OrderStatus.EXPERT_READY,
        customer_type=CustomerType.INDIVIDUAL,
        company=None,
        individual=OrderIndividual(
            full_name="Петров Пётр Петрович",
            passport_number="4506 123456",
            passport_issued_by="ОВД района",
            passport_issued_at=date(2015, 5, 5),
            address="Новосибирск, ул. Кирова, 2",
        ),
    )

    for item in (ready, person):
        for paper in Paper:
            document = Document(BytesIO(build_paper(paper, item, 20, signed_at)))
            text = "\n".join(paragraph.text for paragraph in document.paragraphs)
            cells = "\n".join(
                paragraph.text
                for table in document.tables
                for row in table.rows
                for cell in row.cells
                for paragraph in cell.paragraphs
            )
            assert "{{" not in text + cells
            assert f"БЭ-{signed_at.year}-0007" in text + cells


def test_only_customer_creates_orders() -> None:
    with pytest.raises(CustomerRequiredError):
        require_customer(EXPERT)


def test_expert_accepts_fitting_order() -> None:
    notifier = FakeNotifier()
    usecase = AcceptOrderUseCase(FakeOrders(), notifier)
    fresh = order()

    asyncio.run(usecase.execute(EXPERT, fresh, None))

    assert fresh.status == OrderStatus.EXPERT_READY
    assert fresh.expert is EXPERT
    assert fresh.history[-1].actor == Actor.EXPERT
    assert notifier.sent[0][0] == CUSTOMER.id


def test_unfitting_expert_cannot_accept() -> None:
    usecase = AcceptOrderUseCase(FakeOrders(), FakeNotifier())

    with pytest.raises(OrderAccessError):
        asyncio.run(usecase.execute(STRANGER, order(), None))


def test_taken_order_cannot_be_accepted_twice() -> None:
    usecase = AcceptOrderUseCase(FakeOrders(), FakeNotifier())
    taken = order(OrderStatus.EXPERT_READY)

    with pytest.raises(OrderStateError):
        asyncio.run(usecase.execute(EXPERT, taken, None))


def test_customer_cancels_only_before_contract() -> None:
    usecase = CancelOrderUseCase(FakeOrders(), FakeNotifier())
    fresh = order()

    asyncio.run(usecase.by_customer(CUSTOMER, fresh, "Передумал"))

    assert fresh.status == OrderStatus.CANCELED
    assert fresh.cancel_reason == "Передумал"

    with pytest.raises(OrderStateError):
        asyncio.run(usecase.by_customer(CUSTOMER, order(OrderStatus.CONTRACT), "Передумал"))


def test_admin_status_needs_expert() -> None:
    usecase = SetOrderStatusUseCase(FakeOrders(), FakeNotifier())

    with pytest.raises(InvalidOrderError):
        asyncio.run(usecase.execute(order(), OrderStatus.IN_PROGRESS, None))


def test_price_change_cancels_open_invoices_and_keeps_history() -> None:
    notifier = FakeNotifier()
    contract = order(OrderStatus.CONTRACT)
    contract.expert = EXPERT
    contract.invoices.append(Invoice(id=1, stage=PaymentStage.ADVANCE, amount=Decimal("75000.00"), created_at=now()))

    asyncio.run(ChangePriceUseCase(FakeOrders(), notifier).execute(contract, Decimal("180000.00"), "Добавили объём"))

    assert contract.price == Decimal("180000.00")
    assert contract.invoices[0].canceled_at is not None
    assert contract.price_changes[0].old_price == Decimal("150000.00")
    assert {recipient for recipient, message in notifier.sent} == {CUSTOMER.id, EXPERT.id}


def test_price_cannot_go_below_paid() -> None:
    working = order(OrderStatus.IN_PROGRESS, paid_amount=Decimal("75000.00"))

    with pytest.raises(InvalidOrderError, match="Уже оплачено"):
        asyncio.run(ChangePriceUseCase(FakeOrders(), FakeNotifier()).execute(working, Decimal("50000"), "Скидка"))


def test_invoice_is_reused_until_amount_changes() -> None:
    contract = order(OrderStatus.CONTRACT)
    usecase = IssueInvoiceUseCase(FakeOrders())

    first = asyncio.run(usecase.execute(CUSTOMER, contract))
    again = asyncio.run(usecase.execute(CUSTOMER, contract))
    contract.price = Decimal("200000.00")
    changed = asyncio.run(usecase.execute(CUSTOMER, contract))

    assert first is again
    assert first.amount == Decimal("75000.00")
    assert first.canceled_at is not None
    assert changed.amount == Decimal("100000.00")


def test_individual_pays_by_card_not_invoice() -> None:
    person = order(OrderStatus.CONTRACT, customer_type=CustomerType.INDIVIDUAL, company=None)

    with pytest.raises(OrderStateError, match="картой"):
        asyncio.run(IssueInvoiceUseCase(FakeOrders()).execute(CUSTOMER, person))


def test_expert_choosing_order_does_not_see_requisites() -> None:
    fresh = order()

    assert details(fresh, STRANGER).company is None
    assert details(fresh, CUSTOMER).company is not None
