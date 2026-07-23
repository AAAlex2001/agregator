from fastapi import HTTPException, status

from models.labor import LaborListingKind
from schemas.labor import LaborListingListResponse, LaborListingResponse
from services.labor_resources.formatters import listing_to_response
from services.labor_resources.repository import LaborRepository


class GetPublicLaborListingUseCase:
    def __init__(self, repository: LaborRepository) -> None:
        self.repository = repository

    async def execute(self, public_id: str) -> LaborListingResponse:
        listing = await self.repository.get_public(public_id)
        if listing is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Заявка не найдена",
            )
        return listing_to_response(listing, actor_id=0)


class ListLaborListingsUseCase:
    def __init__(self, repository: LaborRepository) -> None:
        self.repository = repository

    async def execute(
        self,
        kind: LaborListingKind,
        actor_id: int,
        mine: bool,
    ) -> LaborListingListResponse:
        items = await self.repository.list_for_actor(kind, actor_id, mine)
        return LaborListingListResponse(
            items=[
                listing_to_response(
                    item,
                    actor_id,
                    include_responders=mine,
                )
                for item in items
            ],
            total=len(items),
        )
