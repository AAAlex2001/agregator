"""Аудит СУПБ: сценарии заявки, торга, группы, Плана и документов по перечню."""

from fastapi import Depends

from app.blitz.audit.services.exceptions import AuditLeadRequiredError
from app.blitz.audit.services.repo import AuditRepository
from app.blitz.audit.services.usecases.answer_counter import AnswerCounterUseCase
from app.blitz.audit.services.usecases.answer_offer import AnswerOfferUseCase
from app.blitz.audit.services.usecases.approve_plan import ApprovePlanUseCase
from app.blitz.audit.services.usecases.create_audit import CreateAuditUseCase
from app.blitz.audit.services.usecases.propose_price import ProposePriceUseCase
from app.blitz.audit.services.usecases.request_plan_changes import RequestPlanChangesUseCase
from app.blitz.audit.services.usecases.send_plan import SendPlanUseCase
from app.blitz.audit.services.usecases.set_lead import SetAuditLeadUseCase
from app.blitz.audit.services.usecases.set_team import SetTeamUseCase
from app.blitz.audit.services.usecases.upload_documents import UploadAuditDocumentsUseCase
from app.blitz.documents.services.storage import OrderFiles
from app.blitz.notifications import BlitzNotifier, get_blitz_notifier
from app.blitz.orders.dependencies import get_audit_lead, get_audit_repository, get_order_repository
from app.blitz.orders.services.repo import OrderRepository


def require_audit_lead(audit_lead: bool = Depends(get_audit_lead)) -> None:
    """Пускает только руководителя аудиторской группы."""

    if not audit_lead:
        raise AuditLeadRequiredError


def get_create_audit_usecase(
    orders: OrderRepository = Depends(get_order_repository),
    audits: AuditRepository = Depends(get_audit_repository),
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> CreateAuditUseCase:
    """Подача заявки на аудит."""

    return CreateAuditUseCase(orders, audits, OrderFiles(), notifier)


def get_propose_price_usecase(
    orders: OrderRepository = Depends(get_order_repository),
    audits: AuditRepository = Depends(get_audit_repository),
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> ProposePriceUseCase:
    """Цена руководителя группы."""

    return ProposePriceUseCase(orders, audits, notifier)


def get_answer_offer_usecase(
    orders: OrderRepository = Depends(get_order_repository),
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> AnswerOfferUseCase:
    """Ответ заказчика на цену."""

    return AnswerOfferUseCase(orders, notifier)


def get_answer_counter_usecase(
    orders: OrderRepository = Depends(get_order_repository),
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> AnswerCounterUseCase:
    """Ответ руководителя на цену заказчика."""

    return AnswerCounterUseCase(orders, notifier)


def get_set_team_usecase(
    orders: OrderRepository = Depends(get_order_repository),
    audits: AuditRepository = Depends(get_audit_repository),
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> SetTeamUseCase:
    """Состав аудиторской группы."""

    return SetTeamUseCase(orders, audits, notifier)


def get_send_plan_usecase(
    orders: OrderRepository = Depends(get_order_repository),
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> SendPlanUseCase:
    """Отправка Плана аудита."""

    return SendPlanUseCase(orders, OrderFiles(), notifier)


def get_approve_plan_usecase(
    orders: OrderRepository = Depends(get_order_repository),
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> ApprovePlanUseCase:
    """Согласование Плана заказчиком."""

    return ApprovePlanUseCase(orders, notifier)


def get_request_plan_changes_usecase(
    orders: OrderRepository = Depends(get_order_repository),
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> RequestPlanChangesUseCase:
    """Правки к Плану от заказчика."""

    return RequestPlanChangesUseCase(orders, notifier)


def get_upload_documents_usecase(
    orders: OrderRepository = Depends(get_order_repository),
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> UploadAuditDocumentsUseCase:
    """Документы по перечню."""

    return UploadAuditDocumentsUseCase(orders, OrderFiles(), notifier)


def get_set_lead_usecase(audits: AuditRepository = Depends(get_audit_repository)) -> SetAuditLeadUseCase:
    """Назначение руководителя группы администратором."""

    return SetAuditLeadUseCase(audits)
