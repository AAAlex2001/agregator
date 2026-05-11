from typing import Optional

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user, get_current_user_optional
from models.order import OrderStatus
from services.email import (
    EmailDispatcher,
    EmailRepository,
    SendNewOrderEmailUseCase,
    SendOrderUpdatedEmailUseCase,
)
from services.orders import (
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
    UploadOrderFilesUseCase,
)
from schemas.order import (
    OrderCreate,
    OrderUpdate,
    OrderResponse,
    OrderListResponse,
)
from utils.order_forms import build_order_create_data, build_order_update_data

router = APIRouter(prefix="/orders", tags=["orders"])


def build_repo(db: AsyncSession) -> OrderRepository:
    return OrderRepository(db)


def build_get_order(db: AsyncSession) -> GetOrderByIdUseCase:
    return GetOrderByIdUseCase(build_repo(db))


def build_send_new_order_email(
    db: AsyncSession, background_tasks: BackgroundTasks
) -> SendNewOrderEmailUseCase:
    return SendNewOrderEmailUseCase(
        repo=EmailRepository(db),
        dispatcher=EmailDispatcher(background_tasks),
    )


def build_send_order_updated_email(
    db: AsyncSession, background_tasks: BackgroundTasks
) -> SendOrderUpdatedEmailUseCase:
    return SendOrderUpdatedEmailUseCase(
        repo=EmailRepository(db),
        dispatcher=EmailDispatcher(background_tasks),
    )


@router.get("/search", response_model=OrderListResponse)
async def search_orders_public(
    q: str = Query(..., min_length=1, max_length=200),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    "Публичный поиск по всем заказам платформы (любого статуса). Доступен без авторизации."
    use_case = SearchOrdersUseCase(build_repo(db))
    orders, has_more = await use_case.execute(q, skip, limit)
    return OrderListResponse(
        items=[OrderResponse.from_order(o) for o in orders],
        has_more=has_more,
    )


@router.get("/", response_model=OrderListResponse)
async def get_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[OrderStatus] = None,
    db: AsyncSession = Depends(get_db),
    user_id: Optional[int] = Depends(get_current_user_optional),
):
    "Список заказов. Публичный: для гостя — все ACTIVE без assignment; для авторизованного — фильтрация по роли."
    use_case = ListOrdersUseCase(build_repo(db))
    orders, has_more = await use_case.execute(skip, limit, status, user_id)
    return OrderListResponse(
        items=[OrderResponse.from_order(o) for o in orders],
        has_more=has_more,
    )


@router.get("/archive", response_model=OrderListResponse)
async def get_archived_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    use_case = ListArchivedOrdersUseCase(build_repo(db))
    items, has_more = await use_case.execute(skip, limit, current_user_id=user_id)
    return OrderListResponse(
        items=[
            OrderResponse.from_archived_order(it.order, it.accepted_response, it.has_review)
            for it in items
        ],
        has_more=has_more,
    )


@router.get("/public/{public_id}", response_model=OrderResponse)
async def get_order_public(
    public_id: str,
    db: AsyncSession = Depends(get_db),
):
    use_case = GetOrderByPublicIdUseCase(build_repo(db))
    order = await use_case.execute(public_id)
    return OrderResponse.from_order(order)


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    repo = build_repo(db)
    await OrderValidator(repo).ensure_user_can_view_order(order_id, user_id)
    order = await build_get_order(db).execute(order_id)
    return OrderResponse.from_order(order)


@router.post("/", response_model=OrderResponse)
async def create_order(
    data: OrderCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    data.customer_id = user_id
    repo = build_repo(db)
    use_case = CreateOrderUseCase(
        repo=repo,
        validator=OrderValidator(repo),
        send_new_order_email=build_send_new_order_email(db, background_tasks),
    )
    order = await use_case.execute(data, current_user_id=user_id)
    return OrderResponse.from_order(order)


@router.post("/create-with-files", response_model=OrderResponse)
async def create_order_with_files(
    background_tasks: BackgroundTasks,
    title: str = Form(...),
    company: str = Form(""),
    comment: str = Form(""),
    sum_amount: int = Form(...),
    deadline: str = Form(...),
    responses_deadline: str = Form(""),
    badge_codes_json: str = Form("[]"),
    files: list[UploadFile] = File(default=[]),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    data = build_order_create_data(
        title=title,
        company=company,
        comment=comment,
        customer_id=user_id,
        sum_amount=sum_amount,
        deadline=deadline,
        responses_deadline=responses_deadline,
        badge_codes_json=badge_codes_json,
    )
    repo = build_repo(db)
    create = CreateOrderUseCase(
        repo=repo,
        validator=OrderValidator(repo),
        send_new_order_email=build_send_new_order_email(db, background_tasks),
    )
    use_case = CreateOrderWithFilesUseCase(
        create_order=create,
        repo=repo,
        files=OrderFileStorage(),
    )
    order = await use_case.execute(
        data,
        uploads=files if files else None,
        current_user_id=user_id,
    )
    return OrderResponse.from_order(order)


@router.patch("/{order_id}", response_model=OrderResponse)
async def update_order(
    order_id: int,
    data: OrderUpdate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
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
    deadline: str = Form(...),
    responses_deadline: str = Form(""),
    badge_codes_json: str = Form("[]"),
    keep_files: str = Form("[]"),
    files: list[UploadFile] = File(default=[]),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    data = build_order_update_data(
        title=title,
        company=company,
        comment=comment,
        sum_amount=sum_amount,
        deadline=deadline,
        responses_deadline=responses_deadline,
        badge_codes_json=badge_codes_json,
        keep_files=keep_files,
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
    use_case = UpdateOrderWithFilesUseCase(
        update_order=update,
        get_order=get_order,
        repo=repo,
        files=OrderFileStorage(),
        send_updated_email=send_updated,
    )
    order = await use_case.execute(
        order_id,
        data,
        uploads=files if files else None,
        current_user_id=user_id,
    )
    return OrderResponse.from_order(order)


@router.post("/{order_id}/files", response_model=OrderResponse)
async def upload_order_files(
    order_id: int,
    files: list[UploadFile] = File(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    repo = build_repo(db)
    use_case = UploadOrderFilesUseCase(
        repo=repo,
        get_order=GetOrderByIdUseCase(repo),
        files=OrderFileStorage(),
        validator=OrderValidator(repo),
    )
    order = await use_case.execute(order_id, files, current_user_id=user_id)
    return OrderResponse.from_order(order)


@router.delete("/{order_id}")
async def delete_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    repo = build_repo(db)
    use_case = DeleteOrderUseCase(
        repo=repo,
        get_order=GetOrderByIdUseCase(repo),
        validator=OrderValidator(repo),
    )
    await use_case.execute(order_id, current_user_id=user_id)
    return {"ok": True}
