"Use case: «Смотрите также» — похожие разъяснения по тегам и отрасли."

from schemas.rtn import RtnListItemDto
from services.rtn.repository import RtnRepository
from services.rtn.use_cases.list_clarifications import to_list_item_dto


class ListRelatedRtnClarificationsUseCase:
    def __init__(self, repo: RtnRepository) -> None:
        self.repo = repo

    async def execute(self, slug: str, limit: int) -> list[RtnListItemDto]:
        current = await self.repo.get_published_by_slug(slug)
        if current is None:
            return []
        rows = await self.repo.list_related(current, limit)
        return [to_list_item_dto(row) for row in rows]
