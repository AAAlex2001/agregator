"Use case: создание/обновление разъяснения РТН — нормализация полей, привязка тегов и таксономии."

from datetime import UTC, datetime
from typing import Any

from models.rtn_clarification import (
    Activity,
    ClarificationStatus,
    DocumentType,
    Industry,
    ObjectType,
    OversightArea,
    PublicationStatus,
    RtnClarification,
)
from schemas.admin_rtn import RtnClarificationWrite
from services.articles.use_cases.save_article import SlugTakenError
from services.rtn.repository import RtnRepository, RtnTaxonomySelection
from services.tags import TagRepository

__all__ = ["SaveRtnClarificationUseCase", "SlugTakenError"]


class SaveRtnClarificationUseCase:
    def __init__(self, repo: RtnRepository, tag_repo: TagRepository) -> None:
        self.repo = repo
        self.tag_repo = tag_repo

    async def create(self, data: RtnClarificationWrite) -> RtnClarification:
        values = self.normalize(data)
        if await self.repo.slug_exists(values["slug"]):
            raise SlugTakenError

        tags = await self.tag_repo.get_or_create_many(data.tags)
        clarification = await self.repo.create(values, tags)
        await self.repo.set_taxonomy_selection(clarification.id, self.build_selection(data))
        return clarification

    async def update(self, clarification: RtnClarification, data: RtnClarificationWrite) -> RtnClarification:
        values = self.normalize(data)
        slug_changed = values["slug"] != clarification.slug
        if slug_changed and await self.repo.slug_exists(values["slug"], exclude_id=clarification.id):
            raise SlugTakenError

        tags = await self.tag_repo.get_or_create_many(data.tags)
        updated = await self.repo.update(clarification, values, tags)
        await self.repo.set_taxonomy_selection(updated.id, self.build_selection(data))
        return updated

    def normalize(self, data: RtnClarificationWrite) -> dict[str, Any]:
        published_at = data.published_at
        if data.publication_status == "PUBLISHED" and published_at is None:
            published_at = datetime.now(UTC)
        request_files = [item.model_dump() for item in data.request_files]
        response_files = [item.model_dump() for item in data.response_files]
        if not request_files and data.pdf_url.strip():
            request_files = [{"name": "Обращение в ведомство.pdf", "url": data.pdf_url.strip()}]
        if not response_files and data.response_pdf_url.strip():
            response_files = [{"name": "Официальный ответ.pdf", "url": data.response_pdf_url.strip()}]
        return {
            "document_type": DocumentType(data.document_type),
            "status": ClarificationStatus(data.status),
            "publication_status": PublicationStatus(data.publication_status),
            "slug": data.slug.strip().lower().replace(" ", "-"),
            "title": data.title.strip(),
            "excerpt": data.excerpt,
            "question_text": data.question_text,
            "answer_html": data.answer_html,
            "letter_number": data.letter_number.strip(),
            "department": data.department.strip(),
            "source_url": data.source_url.strip(),
            # Legacy-поля сохраняем синхронными с первым файлом для совместимости
            # при поэтапном развёртывании backend/frontend.
            "pdf_url": request_files[0]["url"] if request_files else data.pdf_url.strip(),
            "response_pdf_url": response_files[0]["url"] if response_files else data.response_pdf_url.strip(),
            "request_files": request_files,
            "response_files": response_files,
            "referenced_regulations": [item.model_dump() for item in data.referenced_regulations],
            "meta_title": data.meta_title.strip(),
            "meta_description": data.meta_description,
            "meta_keywords": data.meta_keywords,
            "published_at": published_at,
        }

    def build_selection(self, data: RtnClarificationWrite) -> RtnTaxonomySelection:
        return RtnTaxonomySelection(
            oversight_areas=[OversightArea(value) for value in data.oversight_areas],
            industries=[Industry(value) for value in data.industries],
            activities=[Activity(value) for value in data.activities],
            object_types=[ObjectType(value) for value in data.object_types],
        )
