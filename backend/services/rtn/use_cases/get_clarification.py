"Use case: детальная карточка разъяснения по slug — с полной таксономией и нормативными ссылками."

from fastapi import HTTPException, status

from schemas.rtn import RegulationLinkDto, RtnDetailDto, RtnTaxonomyOptionDto
from services.rtn.repository import RtnRepository, TaxonomyValue
from services.rtn.taxonomy import ACTIVITY_LABELS, INDUSTRY_LABELS, OBJECT_TYPE_LABELS, OVERSIGHT_AREA_LABELS


class GetRtnClarificationUseCase:
    def __init__(self, repo: RtnRepository) -> None:
        self.repo = repo

    async def execute(self, slug: str) -> RtnDetailDto:
        clarification = await self.repo.get_published_by_slug(slug)
        if clarification is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Разъяснение не найдено")

        selection = await self.repo.get_taxonomy_selection(clarification.id)
        return RtnDetailDto(
            id=clarification.id,
            slug=clarification.slug,
            title=clarification.title,
            excerpt=clarification.excerpt,
            document_type=clarification.document_type.value,
            status=clarification.status.value,
            question_text=clarification.question_text,
            answer_html=clarification.answer_html,
            letter_number=clarification.letter_number,
            department=clarification.department,
            source_url=clarification.source_url,
            pdf_url=clarification.pdf_url,
            response_pdf_url=clarification.response_pdf_url,
            referenced_regulations=[RegulationLinkDto(**item) for item in clarification.referenced_regulations],
            tags=[tag.name for tag in clarification.tags],
            oversight_areas=self.to_options(OVERSIGHT_AREA_LABELS, selection.oversight_areas),
            industries=self.to_options(INDUSTRY_LABELS, selection.industries),
            activities=self.to_options(ACTIVITY_LABELS, selection.activities),
            object_types=self.to_options(OBJECT_TYPE_LABELS, selection.object_types),
            meta_title=clarification.meta_title,
            meta_description=clarification.meta_description,
            meta_keywords=clarification.meta_keywords,
            published_at=clarification.published_at,
            updated_at=clarification.updated_at,
            views_count=clarification.views_count,
        )

    def to_options(
        self,
        labels: dict[TaxonomyValue, str],
        values: list[TaxonomyValue],
    ) -> list[RtnTaxonomyOptionDto]:
        return [RtnTaxonomyOptionDto(value=value.value, label=labels[value]) for value in values]
