"""Аудит СУПБ в кабинете: заявка, торг по цене, группа, План и документы по перечню."""

from fastapi import APIRouter, Depends, File, Form, Response, UploadFile
from pydantic import Json

from app.auth.sessions.dependencies import require_user
from app.blitz.audit.checklist import AUDIT_DOCUMENTS
from app.blitz.audit.dependencies import (
    get_answer_counter_usecase,
    get_answer_offer_usecase,
    get_approve_plan_usecase,
    get_create_audit_usecase,
    get_propose_price_usecase,
    get_request_plan_changes_usecase,
    get_send_plan_usecase,
    get_set_team_usecase,
    get_upload_documents_usecase,
    require_audit_lead,
)
from app.blitz.audit.schemas import (
    AuditCatalogSchema,
    AuditCreateSchema,
    AuditPriceSchema,
    CounterAnswerSchema,
    OfferAnswerSchema,
    PlanChangesSchema,
    PlanInSchema,
    TeamSchema,
)
from app.blitz.audit.services.auditors import describe
from app.blitz.audit.services.repo import AuditRepository
from app.blitz.audit.services.report import build_documents_report, report_filename
from app.blitz.audit.services.usecases.answer_counter import AnswerCounterUseCase
from app.blitz.audit.services.usecases.answer_offer import AnswerOfferUseCase
from app.blitz.audit.services.usecases.approve_plan import ApprovePlanUseCase
from app.blitz.audit.services.usecases.create_audit import AuditAttachments, CreateAuditUseCase
from app.blitz.audit.services.usecases.propose_price import ProposePriceUseCase
from app.blitz.audit.services.usecases.request_plan_changes import RequestPlanChangesUseCase
from app.blitz.audit.services.usecases.send_plan import SendPlanUseCase
from app.blitz.audit.services.usecases.set_team import SetTeamUseCase
from app.blitz.audit.services.usecases.upload_documents import UploadAuditDocumentsUseCase
from app.blitz.documents.services.download import DOCX_TYPE, generated_response
from app.blitz.orders.dependencies import get_audit_repository, get_locked_order, get_viewed_order
from app.blitz.orders.models import BlitzOrder, ServiceKind
from app.blitz.orders.schemas import OrderSchema, TeamMemberSchema
from app.blitz.orders.services.exceptions import OrderNotFoundError
from app.blitz.orders.services.presenter import details, is_party
from app.core.clock import now
from models.account import Account

router = APIRouter(tags=["blitz-audit"])


@router.get("/audit/catalog")
async def get_audit_catalog() -> AuditCatalogSchema:
    """Справочники анкеты аудита и перечень документов."""

    return AuditCatalogSchema.build(AUDIT_DOCUMENTS)


@router.post("/audit", status_code=201)
async def create_audit(
    payload: Json[AuditCreateSchema] = Form(...),
    files: list[UploadFile] = File(default=[]),
    items: list[int] = Form(default=[]),
    company_card: UploadFile | None = File(None),
    opo_certificate: UploadFile | None = File(None),
    power_of_attorney: UploadFile | None = File(None),
    sto_file: UploadFile | None = File(None),
    user: Account = Depends(require_user),
    usecase: CreateAuditUseCase = Depends(get_create_audit_usecase),
) -> OrderSchema:
    """Заявка на аудит: анкета в payload, документы по перечню в files с номерами пунктов в items."""

    attachments = AuditAttachments(company_card, opo_certificate, power_of_attorney, sto_file)
    order = await usecase.execute(user, payload, files, items, attachments)

    return details(order, user)


@router.get("/audit/auditors", dependencies=[Depends(require_audit_lead)])
async def list_auditors(audits: AuditRepository = Depends(get_audit_repository)) -> list[TeamMemberSchema]:
    """Аудиторы, из которых руководитель набирает группу."""

    leads = await audits.lead_ids()

    return [describe(account, account.id in leads) for account in await audits.list_auditors()]


@router.post("/orders/{order_id}/offer")
async def propose_price(
    data: AuditPriceSchema,
    order: BlitzOrder = Depends(get_locked_order),
    user: Account = Depends(require_user),
    usecase: ProposePriceUseCase = Depends(get_propose_price_usecase),
) -> OrderSchema:
    """Руководитель группы предлагает свою цену."""

    return details(await usecase.execute(user, order, data.price), user)


@router.post("/orders/{order_id}/offer/answer")
async def answer_offer(
    data: OfferAnswerSchema,
    order: BlitzOrder = Depends(get_locked_order),
    user: Account = Depends(require_user),
    usecase: AnswerOfferUseCase = Depends(get_answer_offer_usecase),
) -> OrderSchema:
    """Заказчик принимает цену, предлагает свою или отказывается."""

    return details(await usecase.execute(user, order, data.answer, data.price), user)


@router.post("/orders/{order_id}/counter/answer")
async def answer_counter(
    data: CounterAnswerSchema,
    order: BlitzOrder = Depends(get_locked_order),
    user: Account = Depends(require_user),
    usecase: AnswerCounterUseCase = Depends(get_answer_counter_usecase),
) -> OrderSchema:
    """Руководитель группы принимает цену заказчика или отказывается от заявки."""

    return details(await usecase.execute(user, order, data.accept), user)


@router.put("/orders/{order_id}/team")
async def set_team(
    data: TeamSchema,
    order: BlitzOrder = Depends(get_locked_order),
    user: Account = Depends(require_user),
    usecase: SetTeamUseCase = Depends(get_set_team_usecase),
) -> OrderSchema:
    """Руководитель задаёт состав группы."""

    return details(await usecase.execute(user, order, data.account_ids), user)


@router.post("/orders/{order_id}/plan")
async def send_plan(
    data: PlanInSchema,
    order: BlitzOrder = Depends(get_locked_order),
    user: Account = Depends(require_user),
    usecase: SendPlanUseCase = Depends(get_send_plan_usecase),
) -> OrderSchema:
    """Руководитель отправляет План аудита на согласование."""

    return details(await usecase.execute(user, order, data), user)


@router.post("/orders/{order_id}/plan/approve")
async def approve_plan(
    order: BlitzOrder = Depends(get_locked_order),
    user: Account = Depends(require_user),
    usecase: ApprovePlanUseCase = Depends(get_approve_plan_usecase),
) -> OrderSchema:
    """Заказчик согласует План."""

    return details(await usecase.execute(user, order), user)


@router.post("/orders/{order_id}/plan/changes")
async def request_plan_changes(
    data: PlanChangesSchema,
    order: BlitzOrder = Depends(get_locked_order),
    user: Account = Depends(require_user),
    usecase: RequestPlanChangesUseCase = Depends(get_request_plan_changes_usecase),
) -> OrderSchema:
    """Заказчик просит поправить План."""

    return details(await usecase.execute(user, order, data.comment), user)


@router.post("/orders/{order_id}/checklist")
async def upload_documents(
    files: list[UploadFile] = File(default=[]),
    items: list[int] = Form(default=[]),
    order: BlitzOrder = Depends(get_locked_order),
    user: Account = Depends(require_user),
    usecase: UploadAuditDocumentsUseCase = Depends(get_upload_documents_usecase),
) -> OrderSchema:
    """Заказчик загружает документы по перечню: номер пункта для каждого файла в items."""

    return details(await usecase.execute(user, order, files, items), user)


@router.get("/orders/{order_id}/documents-report")
async def download_documents_report(
    order: BlitzOrder = Depends(get_viewed_order),
    user: Account = Depends(require_user),
) -> Response:
    """Отчёт о представленных документах в Word для заказчика и аудиторов."""

    if order.service != ServiceKind.AUDIT or not is_party(order, user):
        raise OrderNotFoundError

    return generated_response(build_documents_report(order, now()), report_filename(order), DOCX_TYPE)
