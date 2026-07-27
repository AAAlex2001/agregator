"Use case: список разъяснений РТН — поиск, фильтры по таксономии, пагинация."

from typing import TypeVar

from fastapi import HTTPException, status

from models.rtn_clarification import (
    Activity,
    ClarificationStatus,
    DocumentType,
    Industry,
    ObjectType,
    OversightArea,
    RtnClarification,
)
from schemas.rtn import RtnListDto, RtnListFiltersQuery, RtnListItemDto
from services.rtn.repository import RtnListFilters, RtnRepository

TaxonomyEnum = TypeVar("TaxonomyEnum", OversightArea, Industry, Activity, ObjectType)


def to_list_item_dto(row: RtnClarification) -> RtnListItemDto:
    "Единая точка сборки карточки списка — переиспользуется в related-выдаче."
    return RtnListItemDto(
        id=row.id,
        slug=row.slug,
        title=row.title,
        excerpt=row.excerpt,
        document_type=row.document_type.value,
        status=row.status.value,
        letter_number=row.letter_number,
        department=row.department,
        source_url=row.source_url,
        pdf_url=row.pdf_url,
        response_pdf_url=row.response_pdf_url,
        tags=[tag.name for tag in row.tags],
        published_at=row.published_at,
    )


class ListRtnClarificationsUseCase:
    def __init__(self, repo: RtnRepository) -> None:
        self.repo = repo

    async def execute(self, filters_query: RtnListFiltersQuery, skip: int, limit: int) -> RtnListDto:
        filters = self.parse_filters(filters_query)
        rows, has_more = await self.repo.list_published(filters, skip, limit)
        items = [to_list_item_dto(row) for row in rows]
        return RtnListDto(items=items, has_more=has_more)

    def parse_filters(self, query: RtnListFiltersQuery) -> RtnListFilters:
        "Переводит значения из query-параметров в enum'ы. document_type/status уже проверены Pydantic Literal."
        return RtnListFilters(
            search=query.search,
            document_types=[DocumentType(value) for value in query.document_types],
            statuses=[ClarificationStatus(value) for value in query.statuses],
            oversight_areas=self.parse_enum_list(OversightArea, query.oversight_areas),
            industries=self.parse_enum_list(Industry, query.industries),
            activities=self.parse_enum_list(Activity, query.activities),
            object_types=self.parse_enum_list(ObjectType, query.object_types),
            published_from=query.published_from,
            published_to=query.published_to,
        )

    def parse_enum_list(self, enum_cls: type[TaxonomyEnum], raw_values: list[str]) -> list[TaxonomyEnum]:
        "Невалидное значение фильтра — это 400, а не 500: пользователь мог собрать битую ссылку."
        try:
            return [enum_cls(value) for value in raw_values]
        except ValueError as error:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Некорректное значение фильтра: {error}",
            ) from error
