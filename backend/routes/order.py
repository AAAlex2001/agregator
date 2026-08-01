
from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, Query, UploadFile, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user, get_current_user_optional
from dependencies.rate_limit import rate_limit
from models.account import UserRole
from models.order import Order, OrderStatus, OrderWorkType
from schemas.common import OkResponse
from schemas.guest_order import GuestOrderRequest, GuestOrderResponse
from schemas.order import (
    OrderCreate,
    OrderListResponse,
    OrderResponse,
    OrderUpdate,
)
from services.email import (
    EmailDispatcher,
    EmailRepository,
    SendNewOrderEmailUseCase,
    SendOrderUpdatedEmailUseCase,
)
from services.login import (
    SESSION_COOKIE_MAX_AGE_SECONDS,
    CreateSessionUseCase,
    LoginRepository,
)
from services.notifications import (
    CreateNewOrderNotificationUseCase,
    NotificationRepository,
)
from services.orders import (
    CreateGuestOrderUseCase,
    CreateOrderUseCase,
    CreateOrderWithFilesUseCase,
    DeleteOrderUseCase,
    GetOrderByIdUseCase,
    GetOrderByPublicIdUseCase,
    ListArchivedOrdersUseCase,
    ListOrdersUseCase,
    OrderFileStorage,
    OrderRepository,
    OrderValidator,
    SearchOrdersUseCase,
    UpdateOrderUseCase,
    UpdateOrderWithFilesUseCase,
)
from services.orders.document_copy import OrderDocumentCopyService
from services.registration import (
    RegisterGuestCustomerUseCase,
    RegistrationNotifier,
    RegistrationRepository,
    RegistrationValidator,
)
from services.verification import VerificationService
from utils.order_forms import build_order_create_data, build_order_update_data, parse_keep_documents

router = APIRouter(prefix="/orders", tags=["orders"])


def build_repo(db: AsyncSession) -> OrderRepository:
    return OrderRepository(db)


def build_get_order(db: AsyncSession) -> GetOrderByIdUseCase:
    return GetOrderByIdUseCase(build_repo(db))


async def apply_question_badges(
    repo: OrderRepository,
    orders: list[Order],
    items: list[OrderResponse],
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


def build_send_new_order_email(
    db: AsyncSession, background_tasks: BackgroundTasks
) -> SendNewOrderEmailUseCase:
    return SendNewOrderEmailUseCase(
        repo=EmailRepository(db),
        dispatcher=EmailDispatcher(background_tasks),
    )


def build_create_new_order_notification(db: AsyncSession) -> CreateNewOrderNotificationUseCase:
    return CreateNewOrderNotificationUseCase(repo=NotificationRepository(db))


def build_send_order_updated_email(
    db: AsyncSession, background_tasks: BackgroundTasks
) -> SendOrderUpdatedEmailUseCase:
    return SendOrderUpdatedEmailUseCase(
        repo=EmailRepository(db),
        dispatcher=EmailDispatcher(background_tasks),
    )


def parse_guest_order_payload(payload: str = Form(...)) -> GuestOrderRequest:
    "Парсит JSON-строку формы в pydantic-модель; ошибки идут как стандартный 422."
    try:
        return GuestOrderRequest.model_validate_json(payload)
    except ValidationError as exc:
        raise RequestValidationError(exc.errors()) from exc


@router.post(
    "/guest",
    response_model=GuestOrderResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(rate_limit("guest_order", max_calls=3, window_seconds=300))],
)
async def create_guest_order(
    background_tasks: BackgroundTasks,
    data: GuestOrderRequest = Depends(parse_guest_order_payload),
    documents: list[UploadFile] = File(default=[]),
    db: AsyncSession = Depends(get_db),
) -> JSONResponse:
    "Заявка с лендинга: заводит заказчика без пароля, публикует заказ и сразу выдаёт сессию."
    registration_repo = RegistrationRepository(db)
    repo = build_repo(db)
    create_order = CreateOrderUseCase(
        repo=repo,
        validator=OrderValidator(repo),
        send_new_order_email=build_send_new_order_email(db, background_tasks),
        create_new_order_notification=build_create_new_order_notification(db),
    )
    use_case = CreateGuestOrderUseCase(
        register_customer=RegisterGuestCustomerUseCase(
            registration_repo, RegistrationValidator(registration_repo)
        ),
        create_order=CreateOrderWithFilesUseCase(
            create_order=create_order,
            repo=repo,
            files=OrderFileStorage(),
        ),
        notifier=RegistrationNotifier(VerificationService(db)),
    )
    account, order = await use_case.execute(data, documents, background_tasks)
    session = await CreateSessionUseCase(LoginRepository(db)).execute(account.id)
    await db.commit()

    payload = GuestOrderResponse(
        order_public_id=order.public_id,
        email=account.email,
        role=account.role.value,
    )
    response = JSONResponse(
        content=payload.model_dump(mode="json"),
        status_code=status.HTTP_201_CREATED,
    )
    for key, value in (("session_id", session.session_id), ("user_role", account.role.value)):
        response.set_cookie(
            key=key,
            value=value,
            httponly=True,
            secure=True,
            samesite="none",
            max_age=SESSION_COOKIE_MAX_AGE_SECONDS,
            path="/",
        )
    return response


@router.get(
    "/search",
    response_model=OrderListResponse,
    dependencies=[Depends(rate_limit("order_search", max_calls=30, window_seconds=60))],
)
async def search_orders_public(
    q: str | None = Query(None, min_length=1, max_length=200),
    badge_code: str | None = Query(None, min_length=1, max_length=50),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
) -> OrderListResponse:
    "Публичный поиск по всем заказам платформы (любого статуса). Доступен без авторизации."
    use_case = SearchOrdersUseCase(build_repo(db))
    orders, has_more = await use_case.execute(q, skip, limit, badge_code)
    return OrderListResponse(
        items=[OrderResponse.from_order(o) for o in orders],
        has_more=has_more,
    )


@router.get("/", response_model=OrderListResponse)
async def get_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: OrderStatus | None = None,
    sort_by: str | None = Query(None),
    sort_dir: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    user_id: int | None = Depends(get_current_user_optional),
) -> OrderListResponse:
    "Список заказов. Публичный: для гостя — все ACTIVE без assignment; для авторизованного — фильтрация по роли."
    repo = build_repo(db)
    use_case = ListOrdersUseCase(repo)
    orders, has_more = await use_case.execute(skip, limit, status, user_id, sort_by, sort_dir)
    items = [OrderResponse.from_order(o) for o in orders]
    await apply_question_badges(repo, orders, items, user_id)
    return OrderListResponse(items=items, has_more=has_more)


@router.get("/archive", response_model=OrderListResponse)
async def get_archived_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> OrderListResponse:
    "Возвращает архив заказов текущего пользователя с пагинацией."
    repo = build_repo(db)
    use_case = ListArchivedOrdersUseCase(repo)
    archived, has_more = await use_case.execute(skip, limit, current_user_id=user_id)
    items = [
        OrderResponse.from_archived_order(it.order, it.accepted_response, it.has_review)
        for it in archived
    ]
    await apply_question_badges(repo, [it.order for it in archived], items, user_id)
    return OrderListResponse(items=items, has_more=has_more)


@router.get("/public/{public_id}", response_model=OrderResponse)
async def get_order_public(
    public_id: str,
    db: AsyncSession = Depends(get_db),
) -> OrderResponse:
    "Возвращает публичный заказ по public_id без авторизации."
    use_case = GetOrderByPublicIdUseCase(build_repo(db))
    order = await use_case.execute(public_id)
    return OrderResponse.from_order(order)


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> OrderResponse:
    "Возвращает заказ по id; 403 если у пользователя нет доступа."
    repo = build_repo(db)
    await OrderValidator(repo).ensure_user_can_view_order(order_id, user_id)
    order = await build_get_order(db).execute(order_id)
    return OrderResponse.from_order(order)


@router.post(
    "/",
    response_model=OrderResponse,
    dependencies=[Depends(rate_limit("order_create", max_calls=10, window_seconds=60))],
)
async def create_order(
    data: OrderCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> OrderResponse:
    "Создаёт заказ от имени текущего пользователя и рассылает уведомления."
    data.customer_id = user_id
    repo = build_repo(db)
    use_case = CreateOrderUseCase(
        repo=repo,
        validator=OrderValidator(repo),
        send_new_order_email=build_send_new_order_email(db, background_tasks),
        create_new_order_notification=build_create_new_order_notification(db),
    )
    order = await use_case.execute(data, current_user_id=user_id)
    return OrderResponse.from_order(order)


@router.post(
    "/create-with-files",
    response_model=OrderResponse,
    dependencies=[Depends(rate_limit("order_create", max_calls=10, window_seconds=60))],
)
async def create_order_with_files(
    background_tasks: BackgroundTasks,
    title: str = Form(...),
    company: str = Form(""),
    comment: str = Form(""),
    sum_amount: int = Form(...),
    start_date: str = Form(""),
    deadline: str = Form(...),
    responses_deadline: str = Form(""),
    requires_expert: bool = Form(True),
    requires_license: bool = Form(True),
    work_type: OrderWorkType = Form(OrderWorkType.EXPERTISE),
    details_json: str = Form(""),
    badge_codes_json: str = Form("[]"),
    copy_source_order_id: int | None = Form(None),
    copy_documents_json: str = Form("{}"),
    technical_files: list[UploadFile] = File(default=[]),
    contract_files: list[UploadFile] = File(default=[]),
    company_files: list[UploadFile] = File(default=[]),
    other_files: list[UploadFile] = File(default=[]),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> OrderResponse:
    "Создаёт заказ с прикреплёнными файлами через multipart/form-data."
    data = build_order_create_data(
        title=title,
        company=company,
        comment=comment,
        customer_id=user_id,
        sum_amount=sum_amount,
        start_date=start_date,
        deadline=deadline,
        responses_deadline=responses_deadline,
        badge_codes_json=badge_codes_json,
        requires_expert=requires_expert,
        requires_license=requires_license,
        work_type=work_type,
        details_json=details_json,
    )
    repo = build_repo(db)
    create = CreateOrderUseCase(
        repo=repo,
        validator=OrderValidator(repo),
        send_new_order_email=build_send_new_order_email(db, background_tasks),
        create_new_order_notification=build_create_new_order_notification(db),
    )
    files = OrderFileStorage()
    use_case = CreateOrderWithFilesUseCase(
        create_order=create,
        repo=repo,
        files=files,
        document_copy=OrderDocumentCopyService(repo, files),
    )
    order = await use_case.execute(
        data,
        technical=technical_files,
        contract=contract_files,
        company=company_files,
        other=other_files,
        current_user_id=user_id,
        copy_source_order_id=copy_source_order_id,
        copy_documents=parse_keep_documents(copy_documents_json),
    )
    return OrderResponse.from_order(order)


@router.patch("/{order_id}", response_model=OrderResponse)
async def update_order(
    order_id: int,
    data: OrderUpdate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> OrderResponse:
    "Частично обновляет заказ; уведомляет откликнувшихся об изменениях."
    repo = build_repo(db)
    get_order = GetOrderByIdUseCase(repo)
    validator = OrderValidator(repo)
    use_case = UpdateOrderUseCase(
        repo=repo,
        get_order=get_order,
        validator=validator,
        send_updated_email=build_send_order_updated_email(db, background_tasks),
    )
    order = await use_case.execute(order_id, data, current_user_id=user_id)
    return OrderResponse.from_order(order)


@router.patch("/{order_id}/update-with-files", response_model=OrderResponse)
async def update_order_with_files(
    order_id: int,
    background_tasks: BackgroundTasks,
    title: str = Form(...),
    company: str = Form(""),
    comment: str = Form(""),
    sum_amount: int = Form(...),
    start_date: str = Form(""),
    deadline: str = Form(...),
    responses_deadline: str = Form(""),
    requires_expert: bool | None = Form(None),
    requires_license: bool | None = Form(None),
    work_type: OrderWorkType | None = Form(None),
    details_json: str = Form(""),
    badge_codes_json: str = Form("[]"),
    keep_documents_json: str = Form("{}"),
    copy_source_order_id: int | None = Form(None),
    copy_documents_json: str = Form("{}"),
    notify_responders: bool = Form(True),
    technical_files: list[UploadFile] = File(default=[]),
    contract_files: list[UploadFile] = File(default=[]),
    company_files: list[UploadFile] = File(default=[]),
    other_files: list[UploadFile] = File(default=[]),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> OrderResponse:
    "Обновляет заказ с заменой/добавлением файлов через multipart/form-data."
    data = build_order_update_data(
        title=title,
        company=company,
        comment=comment,
        sum_amount=sum_amount,
        start_date=start_date,
        deadline=deadline,
        responses_deadline=responses_deadline,
        badge_codes_json=badge_codes_json,
        keep_documents_json=keep_documents_json,
        requires_expert=requires_expert,
        requires_license=requires_license,
        work_type=work_type,
        details_json=details_json,
        notify_responders=notify_responders,
    )
    repo = build_repo(db)
    get_order = GetOrderByIdUseCase(repo)
    validator = OrderValidator(repo)
    send_updated = build_send_order_updated_email(db, background_tasks)
    update = UpdateOrderUseCase(
        repo=repo,
        get_order=get_order,
        validator=validator,
    )
    files = OrderFileStorage()
    use_case = UpdateOrderWithFilesUseCase(
        update_order=update,
        get_order=get_order,
        repo=repo,
        files=files,
        send_updated_email=send_updated,
        document_copy=OrderDocumentCopyService(repo, files),
    )
    order = await use_case.execute(
        order_id,
        data,
        technical=technical_files,
        contract=contract_files,
        company=company_files,
        other=other_files,
        current_user_id=user_id,
        copy_source_order_id=copy_source_order_id,
        copy_documents=parse_keep_documents(copy_documents_json),
    )
    return OrderResponse.from_order(order)


@router.delete("/{order_id}", response_model=OkResponse)
async def delete_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> OkResponse:
    "Удаляет заказ; доступно только владельцу при допустимом статусе."
    repo = build_repo(db)
    use_case = DeleteOrderUseCase(
        repo=repo,
        get_order=GetOrderByIdUseCase(repo),
        validator=OrderValidator(repo),
    )
    await use_case.execute(order_id, current_user_id=user_id)
    return OkResponse()
