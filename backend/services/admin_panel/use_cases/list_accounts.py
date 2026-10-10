"Список учётных записей для админки."

from models.account import Account, UserRole
from schemas.admin_panel import AdminAccountListOut, AdminAccountOut
from services.admin_panel.repository import AdminPanelRepository


def display_name(account: Account) -> str:
    "Имя и фамилия, если не заполнены — email или номер учётной записи."
    name = f"{account.first_name or ''} {account.last_name or ''}".strip()
    return name or account.email or f"Учётная запись №{account.id}"


class ListAccountsUseCase:
    "Страница учётных записей с фильтром по роли и поиском."

    def __init__(self, repo: AdminPanelRepository) -> None:
        self.repo = repo

    async def execute(
        self, role: UserRole | None, query: str | None, skip: int, limit: int
    ) -> AdminAccountListOut:
        "Учётные записи и общее количество под фильтры."
        accounts, total = await self.repo.list_accounts(role, query, skip, limit)
        items = [
            AdminAccountOut(
                id=account.id,
                role=account.role.value,
                name=display_name(account),
                company_name=(account.company_data or {}).get("value"),
                email=account.email,
                phone=account.phone,
                inn=account.inn,
                is_active=account.is_active,
                created_at=account.created_at,
            )
            for account in accounts
        ]
        return AdminAccountListOut(items=items, total=total)
