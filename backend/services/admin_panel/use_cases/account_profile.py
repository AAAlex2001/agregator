"Профиль учётной записи в админке: просмотр и правка."

from datetime import UTC, datetime
from typing import Any

from fastapi import HTTPException, status

from models.account import Account
from schemas.admin_panel import AdminAccountDetailOut, AdminAccountUpdate, AdminCompanyOut
from services.admin_panel.repository import AdminPanelRepository
from services.dadata import DaDataService


class GetAccountUseCase:
    "Профиль учётной записи с активностью и действующей подпиской."

    def __init__(self, repo: AdminPanelRepository) -> None:
        self.repo = repo

    async def execute(self, account_id: int) -> AdminAccountDetailOut:
        "Профиль по id, если записи нет — 404."
        account = await self.repo.get_account(account_id)
        if account is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Учётная запись не найдена")
        return await build_detail(self.repo, account)


class UpdateAccountUseCase:
    "Правка имени, контактов, ИНН и доступа. При смене ИНН карточка компании обновляется из DaData."

    def __init__(self, repo: AdminPanelRepository, dadata: DaDataService) -> None:
        self.repo = repo
        self.dadata = dadata

    async def execute(self, account_id: int, data: AdminAccountUpdate) -> AdminAccountDetailOut:
        "Проверяет контакты, сохраняет поля и возвращает обновлённый профиль."
        account = await self.repo.get_account(account_id)
        if account is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Учётная запись не найдена")

        email = (data.email or "").strip().lower() or None
        phone = (data.phone or "").strip() or None
        inn = (data.inn or "").strip() or None
        if email is None and phone is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Нужен email или телефон"
            )
        if await self.repo.is_contact_taken(account, email, phone):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Такой email или телефон уже есть у другой учётной записи этой роли",
            )

        if inn != account.inn:
            suggestions = await self.dadata.suggest_parties(inn, count=1) if inn else []
            account.company_data = dict(suggestions[0]) if suggestions else None

        account.first_name = (data.first_name or "").strip() or None
        account.last_name = (data.last_name or "").strip() or None
        account.email = email
        account.email_verified = data.email_verified
        account.phone = phone
        account.inn = inn
        account.is_active = data.is_active
        await self.repo.flush()
        return await build_detail(self.repo, account)


async def build_detail(repo: AdminPanelRepository, account: Account) -> AdminAccountDetailOut:
    "Профиль для ответа: поля записи, число заказов и откликов, действующая подписка."
    subscription = await repo.get_active_subscription(account.id)
    return AdminAccountDetailOut(
        id=account.id,
        role=account.role.value,
        first_name=account.first_name,
        last_name=account.last_name,
        email=account.email,
        email_verified=account.email_verified,
        phone=account.phone,
        inn=account.inn,
        company=company_card(account.company_data),
        is_active=account.is_active,
        has_telegram=account.telegram_id is not None,
        orders_count=await repo.count_customer_orders(account.id),
        responses_count=await repo.count_expert_responses(account.id),
        subscription_name=subscription.plan.name if subscription else None,
        subscription_expires_at=subscription.expires_at if subscription else None,
        created_at=account.created_at,
        updated_at=account.updated_at,
    )


def company_card(company_data: dict[str, Any] | None) -> AdminCompanyOut | None:
    "Главное из подсказки DaData: название, реквизиты, статус, руководитель, адрес, ОКВЭД."
    if not company_data:
        return None
    data = company_data.get("data") or {}
    name = data.get("name") or {}
    management = data.get("management") or {}
    state = data.get("state") or {}
    registered = state.get("registration_date")
    return AdminCompanyOut(
        name=name.get("full_with_opf") or company_data.get("value") or "",
        inn=data.get("inn"),
        kpp=data.get("kpp"),
        ogrn=data.get("ogrn"),
        status=state.get("status"),
        registration_date=datetime.fromtimestamp(registered / 1000, UTC).date() if registered else None,
        manager=", ".join(filter(None, [management.get("post"), management.get("name")])) or None,
        address=(data.get("address") or {}).get("value"),
        okved=data.get("okved"),
    )
