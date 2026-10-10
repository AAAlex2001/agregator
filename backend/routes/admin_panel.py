"Дашборд, заказы и учётные записи для admin-next. За X-Internal-Token; логин держит сама админка."

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.internal_auth import require_internal_token
from models.account import UserRole
from models.order import OrderStatus, OrderWorkType
from schemas.admin_panel import (
    AdminAccountDetailOut,
    AdminAccountListOut,
    AdminAccountUpdate,
    AdminOrderListOut,
    DashboardOut,
)
from services.admin_panel import (
    AdminPanelRepository,
    GetAccountUseCase,
    GetDashboardUseCase,
    ListAccountsUseCase,
    ListOrdersUseCase,
    UpdateAccountUseCase,
)
from services.dadata import DaDataService

router = APIRouter(
    prefix="/internal",
    tags=["admin-panel"],
    dependencies=[Depends(require_internal_token)],
)


@router.get("/dashboard", response_model=DashboardOut)
async def get_dashboard(db: AsyncSession = Depends(get_db)) -> DashboardOut:
    "Сводка платформы: регистрации, заказы и отклики."
    return await GetDashboardUseCase(AdminPanelRepository(db)).execute()


@router.get("/orders", response_model=AdminOrderListOut)
async def list_orders(
    status: OrderStatus | None = Query(None),
    work_type: OrderWorkType | None = Query(None),
    q: str | None = Query(None, max_length=200),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
) -> AdminOrderListOut:
    "Заказы новыми сверху: фильтры по статусу и направлению, поиск по названию и компании."
    return await ListOrdersUseCase(AdminPanelRepository(db)).execute(status, work_type, q, skip, limit)


@router.get("/accounts", response_model=AdminAccountListOut)
async def list_accounts(
    role: UserRole | None = Query(None),
    q: str | None = Query(None, max_length=200),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
) -> AdminAccountListOut:
    "Учётные записи новыми сверху: фильтр по роли, поиск по имени, email, телефону и ИНН."
    return await ListAccountsUseCase(AdminPanelRepository(db)).execute(role, q, skip, limit)


@router.get("/accounts/{account_id}", response_model=AdminAccountDetailOut)
async def get_account(account_id: int, db: AsyncSession = Depends(get_db)) -> AdminAccountDetailOut:
    "Профиль учётной записи: контакты, компания, активность и действующая подписка."
    return await GetAccountUseCase(AdminPanelRepository(db)).execute(account_id)


@router.put("/accounts/{account_id}", response_model=AdminAccountDetailOut)
async def update_account(
    account_id: int,
    data: AdminAccountUpdate,
    db: AsyncSession = Depends(get_db),
) -> AdminAccountDetailOut:
    "Правка имени, контактов, ИНН и доступа учётной записи."
    return await UpdateAccountUseCase(AdminPanelRepository(db), DaDataService()).execute(account_id, data)
