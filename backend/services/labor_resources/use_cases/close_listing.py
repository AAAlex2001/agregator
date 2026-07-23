from fastapi import HTTPException, status

from services.labor_resources.repository import LaborRepository


class CloseLaborListingUseCase:
    def __init__(self, repository: LaborRepository) -> None:
        self.repository = repository

    async def execute(self, listing_id: int, owner_id: int) -> None:
        listing = await self.repository.get_by_id(
            listing_id,
            for_update=True,
        )
        if listing is None or listing.owner_id != owner_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Заявка не найдена",
            )
        if not listing.is_active:
            return
        listing.is_active = False
        await self.repository.flush()
