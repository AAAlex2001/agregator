from models.contact_deal import ContactDealStatus
from schemas.contact_deal import AdminContactDealListItemResponse, ContactDealListItemResponse
from services.contact_deals.formatters import to_admin_list_item, to_list_item
from services.contact_deals.repository import ContactDealRepository


class ListContactDealsUseCase:
    def __init__(self, repository: ContactDealRepository) -> None:
        self.repository = repository

    async def execute(self, user_id: int) -> list[ContactDealListItemResponse]:
        deals = await self.repository.list_for_user(user_id)
        return [to_list_item(deal, user_id) for deal in deals]


class ListAdminContactDealsUseCase:
    def __init__(self, repository: ContactDealRepository) -> None:
        self.repository = repository

    async def execute(
        self, status_filter: ContactDealStatus | None
    ) -> list[AdminContactDealListItemResponse]:
        rows = await self.repository.list_admin(status_filter)
        return [to_admin_list_item(deal, receipt_count) for deal, receipt_count in rows]
