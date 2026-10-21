"""Блиц-эксперт и аудит без базы и сети: справочник, подбор, деньги, оплата, договор, сценарии, торг."""

import asyncio
from datetime import date
from decimal import Decimal
from io import BytesIO

import pytest
from docx import Document
from pydantic import ValidationError

from app.blitz.audit.schemas import AuditCreateSchema, AuditDetailsSchema
from app.blitz.audit.services.exceptions import AuditorRequiredError
from app.blitz.audit.services.usecases.answer_counter import AnswerCounterUseCase
from app.blitz.audit.services.usecases.answer_offer import AnswerOfferUseCase
from app.blitz.audit.services.usecases.propose_price import ProposePriceUseCase
from app.blitz.audit.services.usecases.set_team import SetTeamUseCase
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
from app.blitz.orders.services.access import can_take
from app.blitz.orders.services.exceptions import (
    CustomerRequiredError,
    InvalidOrderError,
    OrderAccessError,
    OrderStateError,
)
from app.blitz.orders.services.matching import expert_fits
from app.blitz.orders.services.presenter import HIDDEN_AUDITOR, details, summary
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
from app.blitz.pricing.models import Tariff
from app.blitz.pricing.services.usecases.change_price import ChangePriceUseCase
from app.blitz.pricing.services.usecases.save_audit_tariff import SaveAuditTariffUseCase
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
LEAD = account(5, UserRole.EXPERT)


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
    result.team = []

    return result


def audit_details(negotiation: str = "yes") -> dict[str, object]:
    """Анкета аудита одного ОПО с бюджетом заказчика."""

    details = AuditDetailsSchema.model_validate(
        {
            "applicant": {
                "full_name": "Иванов Иван Иванович",
                "position": "Главный инженер",
                "organization": "ООО «Ромашка»",
                "inn": "7707083893",
                "phone": "+79990000000",
                "email": "safety@romashka.ru",
            },
            "scope": "one",
            "objects": [
                {
                    "reg_number": "А01-00001-0001",
                    "name": "Площадка котельной",
                    "hazard_class": "III",
                    "address": "Москва, ул. Ленина, 1",
                    "industry": "Теплоснабжение",
                    "hazard_signs": ["pressure"],
                },
            ],
            "stages": ["planning", "documents", "report"],
            "params": {"kind": "basic", "use_sto": False},
            "timing": {"kind": "month"},
            "budget": {"mode": "custom", "negotiation": negotiation},
        },
    )

    return details.model_dump(mode="json")


def audit_order(status: OrderStatus = OrderStatus.NEW, **fields: object) -> BlitzOrder:
    """Заявка организации на аудит СУПБ."""

    values: dict[str, object] = {
        "service": ServiceKind.AUDIT,
        "object_code": None,
        "area_code": None,
        "expert_category": None,
        "deadline": "any",
        "object_name": "Площадка котельной (А01-00001-0001)",
        "contract_kind": ContractKind.AUDIT,
        "price": Decimal("300000.00"),
        "audit_details": audit_details(),
    }
    values.update(fields)

    return order(status, **values)


class FakeOrders:
    """Репозиторий без базы."""

    def __init__(self, expert: Account | None = None) -> None:
        self.saved = 0
        self.expert = expert

    async def save(self) -> None:
        self.saved += 1

    async def get_expert(self, expert_id: int) -> Account | None:
        return self.expert


class FakeAudits:
    """Аудиторы без базы: аудитор — LEAD и переданные в списке."""

    def __init__(self, auditors: list[Account] | None = None) -> None:
        self.auditors = auditors or []

    async def is_auditor(self, account_id: int) -> bool:
        return account_id == LEAD.id or any(item.id == account_id for item in self.auditors)

    async def list_auditors(self) -> list[Account]:
        return [LEAD, *self.auditors]


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
    assert normalize_passport("45 06-123456", "individual.passport_number") == "4506 123456"

    with pytest.raises(InvalidOrderError):
        normalize_passport("123", "individual.passport_number")


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

    asyncio.run(usecase.execute(EXPERT, fresh, None, False))

    assert fresh.status == OrderStatus.EXPERT_READY
    assert fresh.expert is EXPERT
    assert fresh.history[-1].actor == Actor.EXPERT
    assert notifier.sent[0][0] == CUSTOMER.id


def test_unfitting_expert_cannot_accept() -> None:
    usecase = AcceptOrderUseCase(FakeOrders(), FakeNotifier())

    with pytest.raises(OrderAccessError):
        asyncio.run(usecase.execute(STRANGER, order(), None, False))


def test_taken_order_cannot_be_accepted_twice() -> None:
    usecase = AcceptOrderUseCase(FakeOrders(), FakeNotifier())
    taken = order(OrderStatus.EXPERT_READY)

    with pytest.raises(OrderStateError):
        asyncio.run(usecase.execute(EXPERT, taken, None, False))


def test_customer_cancels_only_before_contract() -> None:
    usecase = CancelOrderUseCase(FakeOrders(), FakeNotifier())
    fresh = order()

    asyncio.run(usecase.by_customer(CUSTOMER, fresh, "Передумал"))

    assert fresh.status == OrderStatus.CANCELED
    assert fresh.cancel_reason == "Передумал"

    with pytest.raises(OrderStateError):
        asyncio.run(usecase.by_customer(CUSTOMER, order(OrderStatus.CONTRACT), "Передумал"))


def test_admin_status_needs_expert() -> None:
    usecase = SetOrderStatusUseCase(FakeOrders(), FakeAudits(), FakeNotifier())

    with pytest.raises(InvalidOrderError):
        asyncio.run(usecase.execute(order(), OrderStatus.IN_PROGRESS, None))


def test_price_change_cancels_open_invoices_and_keeps_history() -> None:
    notifier = FakeNotifier()
    contract = order(OrderStatus.CONTRACT)
    contract.expert = EXPERT
    invoice = Invoice(id=1, stage=PaymentStage.ADVANCE, amount=Decimal("75000.00"), created_at=now())
    contract.invoices.append(invoice)
    usecase = ChangePriceUseCase(FakeOrders(), notifier)

    asyncio.run(usecase.execute(contract, Decimal("180000.00"), "Добавили объём"))

    assert contract.price == Decimal("180000.00")
    assert contract.invoices[0].canceled_at is not None
    assert contract.price_changes[0].old_price == Decimal("150000.00")
    assert {recipient for recipient, message in notifier.sent} == {CUSTOMER.id, EXPERT.id}


def test_price_cannot_go_below_paid() -> None:
    working = order(OrderStatus.IN_PROGRESS, paid_amount=Decimal("75000.00"))
    usecase = ChangePriceUseCase(FakeOrders(), FakeNotifier())

    with pytest.raises(InvalidOrderError, match="Уже оплачено"):
        asyncio.run(usecase.execute(working, Decimal("50000"), "Скидка"))


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


def test_audit_advance_leads_to_plan() -> None:
    contract = audit_order(OrderStatus.CONTRACT)

    message = accept_payment(contract, PaymentStage.ADVANCE, Decimal("150000.00"))

    assert contract.status == OrderStatus.PLAN
    assert message is not None
    assert "План аудита" in message


def test_audit_contract_has_own_template_and_number() -> None:
    signed_at = now()
    ready = audit_order(OrderStatus.EXPERT_READY)

    document = Document(BytesIO(build_paper(Paper.CONTRACT, ready, 20, signed_at)))
    text = "\n".join(paragraph.text for paragraph in document.paragraphs)

    assert "{{" not in text
    assert f"БА-{signed_at.year}-0007" in text
    assert "аудита системы управления промышленной безопасностью" in text


def test_only_auditor_proposes_audit_price() -> None:
    usecase = ProposePriceUseCase(FakeOrders(), FakeAudits(), FakeNotifier())
    fresh = audit_order(price=None)

    with pytest.raises(AuditorRequiredError):
        asyncio.run(usecase.execute(STRANGER, fresh, Decimal("250000")))

    asyncio.run(usecase.execute(LEAD, fresh, Decimal("250000")))

    assert fresh.status == OrderStatus.OFFER
    assert fresh.expert is LEAD
    assert fresh.offer_price == Decimal("250000")


def test_fixed_budget_is_not_negotiated() -> None:
    usecase = ProposePriceUseCase(FakeOrders(), FakeAudits(), FakeNotifier())
    fixed = audit_order(audit_details=audit_details("no"))

    with pytest.raises(OrderStateError):
        asyncio.run(usecase.execute(LEAD, fixed, Decimal("400000")))


def test_counter_price_must_be_lower_than_offer() -> None:
    usecase = AnswerOfferUseCase(FakeOrders(), FakeNotifier())
    offered = audit_order(OrderStatus.OFFER, offer_price=Decimal("400000"))
    offered.expert = LEAD

    with pytest.raises(InvalidOrderError):
        asyncio.run(usecase.execute(CUSTOMER, offered, "counter", Decimal("450000")))

    asyncio.run(usecase.execute(CUSTOMER, offered, "counter", Decimal("350000")))

    assert offered.status == OrderStatus.COUNTER
    assert offered.counter_price == Decimal("350000")


def test_accepted_offer_becomes_price() -> None:
    offered = audit_order(OrderStatus.OFFER, price=None, offer_price=Decimal("400000"))
    offered.expert = LEAD

    asyncio.run(AnswerOfferUseCase(FakeOrders(), FakeNotifier()).execute(CUSTOMER, offered, "accept", None))

    assert offered.status == OrderStatus.EXPERT_READY
    assert offered.price == Decimal("400000")
    assert offered.offer_price is None


def test_declined_counter_returns_order_to_leads() -> None:
    countered = audit_order(
        OrderStatus.COUNTER,
        expert_id=LEAD.id,
        offer_price=Decimal("400000"),
        counter_price=Decimal("350000"),
    )
    countered.expert = LEAD

    asyncio.run(AnswerCounterUseCase(FakeOrders(), FakeNotifier()).execute(LEAD, countered, False))

    assert countered.status == OrderStatus.NEW
    assert countered.expert is None
    assert countered.counter_price is None


def test_team_takes_only_auditors() -> None:
    auditor = account(6, UserRole.EXPERT)
    contract = audit_order(OrderStatus.CONTRACT, expert_id=LEAD.id)
    contract.expert = LEAD
    usecase = SetTeamUseCase(FakeOrders(), FakeAudits([auditor]), FakeNotifier())

    with pytest.raises(InvalidOrderError):
        asyncio.run(usecase.execute(LEAD, contract, [STRANGER.id]))

    asyncio.run(usecase.execute(LEAD, contract, [auditor.id, LEAD.id]))

    assert [member.account_id for member in contract.team] == [auditor.id]


def test_customer_sees_auditor_names_from_plan() -> None:
    contract = audit_order(OrderStatus.CONTRACT)
    contract.expert = LEAD

    assert summary(contract, CUSTOMER).expert_name == HIDDEN_AUDITOR
    assert details(contract, CUSTOMER).team == []

    contract.audit_plan = {"version": 1}

    assert summary(contract, CUSTOMER).expert_name == LEAD.display_name
    assert details(contract, CUSTOMER).team[0].lead


def test_consultation_opens_to_auditors() -> None:
    notifier = FakeNotifier()
    consultation = audit_order(OrderStatus.CONSULTATION)

    usecase = SetOrderStatusUseCase(FakeOrders(), FakeAudits(), notifier)

    asyncio.run(usecase.execute(consultation, OrderStatus.NEW, None))

    assert consultation.status == OrderStatus.NEW
    assert LEAD.id in {recipient for recipient, message in notifier.sent}


def test_audit_statuses_are_not_for_expertise() -> None:
    usecase = SetOrderStatusUseCase(FakeOrders(), FakeAudits(), FakeNotifier())

    with pytest.raises(InvalidOrderError):
        asyncio.run(usecase.execute(order(), OrderStatus.CONSULTATION, None))


def test_audit_is_ordered_by_company_with_minimum_price() -> None:
    requisites = {
        "full_name": "Общество с ограниченной ответственностью «Ромашка»",
        "name": "ООО «Ромашка»",
        "inn": "7707083893",
        "ogrn": "1027700132195",
        "address": "Москва, ул. Ленина, 1",
        "bank": "ПАО Сбербанк",
        "bic": "044525225",
        "account": "40702810938000000001",
        "corr_account": "30101810400000000225",
        "signer_position": "Директор",
        "signer_name": "Иванов Иван Иванович",
        "signer_genitive": "директора Иванова Ивана Ивановича",
        "signer_basis": "Устава",
    }
    base = {"details": audit_details(), "company": requisites}

    AuditCreateSchema.model_validate({**base, "price": "100000"})

    with pytest.raises(ValidationError, match="не менее"):
        AuditCreateSchema.model_validate({**base, "price": "99000"})

    with pytest.raises(ValidationError, match="организация"):
        AuditCreateSchema.model_validate(
            {**base, "price": "100000", "customer_type": CustomerType.INDIVIDUAL},
        )


class FakeTariffs:
    """Тариф аудита без базы."""

    def __init__(self) -> None:
        self.tariff: Tariff | None = None

    async def audit(self) -> Tariff | None:
        return self.tariff

    def add(self, tariff: Tariff) -> None:
        self.tariff = tariff

    async def delete(self, tariff: Tariff) -> None:
        self.tariff = None

    async def save(self) -> None:
        return None


def test_audit_tariff_is_not_below_minimum() -> None:
    tariffs = FakeTariffs()
    usecase = SaveAuditTariffUseCase(tariffs)

    with pytest.raises(InvalidOrderError, match="не менее"):
        asyncio.run(usecase.execute(Decimal("90000")))

    saved = asyncio.run(usecase.execute(Decimal("150000")))

    assert saved is not None
    assert saved.price == Decimal("150000")
    assert asyncio.run(usecase.execute(None)) is None
    assert tariffs.tariff is None

def test_any_auditor_takes_new_audit() -> None:
    fresh = audit_order()

    assert can_take(fresh, STRANGER, TODAY, True)
    assert not can_take(fresh, STRANGER, TODAY, False)
    assert not can_take(audit_order(OrderStatus.OFFER), STRANGER, TODAY, True)
