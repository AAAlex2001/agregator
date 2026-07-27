"Repository: доступ к БД для разъяснений РТН, их таксономии, комментариев и реакций."

from dataclasses import dataclass, field
from datetime import date
from typing import Any

from sqlalchemy import Select, Table, case, delete, select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from models.rtn_change_report import RtnChangeReport, RtnChangeReportStatus
from models.rtn_clarification import (
    Activity,
    ClarificationStatus,
    DocumentType,
    Industry,
    ObjectType,
    OversightArea,
    PublicationStatus,
    RtnClarification,
    rtn_clarification_activities,
    rtn_clarification_industries,
    rtn_clarification_object_types,
    rtn_clarification_oversight_areas,
)
from models.rtn_comment import RtnComment
from models.rtn_comment_reaction import CommentReactionValue, RtnCommentReaction
from models.rtn_question import RtnQuestion, RtnQuestionStatus
from models.tag import Tag
from models.user import User, UserRole
from utils.pagination import paginate_with_has_more

# Значение одного из 4 таксономических измерений карточки.
TaxonomyValue = OversightArea | Industry | Activity | ObjectType

# Каждая запись: (junction-таблица, имя колонки значения). Используется, чтобы не повторять
# один и тот же код фильтрации/сохранения 4 раза для oversight_areas/industries/activities/object_types.
TAXONOMY_TABLES: dict[str, tuple[Table, str]] = {
    "oversight_areas": (rtn_clarification_oversight_areas, "area"),
    "industries": (rtn_clarification_industries, "industry"),
    "activities": (rtn_clarification_activities, "activity"),
    "object_types": (rtn_clarification_object_types, "object_type"),
}


@dataclass(frozen=True)
class RtnListFilters:
    "Набор фильтров каталога разъяснений. Пустой список/None — фильтр не применяется."

    search: str | None = None
    document_types: list[DocumentType] = field(default_factory=list)
    statuses: list[ClarificationStatus] = field(default_factory=list)
    oversight_areas: list[OversightArea] = field(default_factory=list)
    industries: list[Industry] = field(default_factory=list)
    activities: list[Activity] = field(default_factory=list)
    object_types: list[ObjectType] = field(default_factory=list)
    published_from: date | None = None
    published_to: date | None = None


@dataclass(frozen=True)
class RtnTaxonomySelection:
    "Выбранные значения по всем 4 таксономическим измерениям одной карточки."

    oversight_areas: list[OversightArea] = field(default_factory=list)
    industries: list[Industry] = field(default_factory=list)
    activities: list[Activity] = field(default_factory=list)
    object_types: list[ObjectType] = field(default_factory=list)


class RtnRepository:
    "Все SQL-запросы по разъяснениям РТН. Никакой бизнес-логики."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_published(
        self,
        filters: RtnListFilters,
        skip: int,
        limit: int,
    ) -> tuple[list[RtnClarification], bool]:
        "Публичный каталог: только опубликованные карточки, с поиском и фильтрами."
        query = select(RtnClarification).where(RtnClarification.publication_status == PublicationStatus.PUBLISHED)
        query = self.apply_filters(query, filters)
        query = query.order_by(RtnClarification.published_at.desc(), RtnClarification.id.desc())
        return await paginate_with_has_more(self.db, query, skip, limit)

    async def list_all(self, publication_status: PublicationStatus | None) -> list[RtnClarification]:
        "Админская выборка: любой статус публикации, весь список без пагинации."
        query = select(RtnClarification)
        if publication_status is not None:
            query = query.where(RtnClarification.publication_status == publication_status)
        query = query.order_by(RtnClarification.updated_at.desc(), RtnClarification.id.desc())
        result = await self.db.execute(query)
        return list(result.scalars().unique().all())

    def apply_filters(self, query: Select[tuple[RtnClarification]], filters: RtnListFilters) -> Select[tuple[RtnClarification]]:
        "Накладывает поиск, простые и таксономические фильтры на запрос списка."
        if filters.search:
            pattern = f"%{filters.search}%"
            query = query.where(
                RtnClarification.title.ilike(pattern)
                | RtnClarification.letter_number.ilike(pattern)
            )
        if filters.document_types:
            query = query.where(RtnClarification.document_type.in_(filters.document_types))
        if filters.statuses:
            query = query.where(RtnClarification.status.in_(filters.statuses))
        if filters.published_from:
            query = query.where(RtnClarification.published_at >= filters.published_from)
        if filters.published_to:
            query = query.where(RtnClarification.published_at <= filters.published_to)

        query = self.apply_taxonomy_filter(query, "oversight_areas", filters.oversight_areas)
        query = self.apply_taxonomy_filter(query, "industries", filters.industries)
        query = self.apply_taxonomy_filter(query, "activities", filters.activities)
        query = self.apply_taxonomy_filter(query, "object_types", filters.object_types)
        return query

    def apply_taxonomy_filter(
        self,
        query: Select[tuple[RtnClarification]],
        dimension: str,
        values: list[TaxonomyValue],
    ) -> Select[tuple[RtnClarification]]:
        "EXISTS-фильтр по одному измерению: карточка проходит, если содержит хотя бы одно из выбранных значений."
        if not values:
            return query
        table, column_name = TAXONOMY_TABLES[dimension]
        column = table.c[column_name]
        match_exists = (
            select(table.c.clarification_id)
            .where(table.c.clarification_id == RtnClarification.id, column.in_(values))
            .exists()
        )
        return query.where(match_exists)

    async def get_published_by_slug(self, slug: str) -> RtnClarification | None:
        query = select(RtnClarification).where(
            RtnClarification.slug == slug,
            RtnClarification.publication_status == PublicationStatus.PUBLISHED,
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_by_id(self, clarification_id: int) -> RtnClarification | None:
        query = select(RtnClarification).where(RtnClarification.id == clarification_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_published_by_id(self, clarification_id: int) -> RtnClarification | None:
        query = select(RtnClarification).where(
            RtnClarification.id == clarification_id,
            RtnClarification.publication_status == PublicationStatus.PUBLISHED,
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def list_related(self, clarification: RtnClarification, limit: int) -> list[RtnClarification]:
        "«Смотрите также»: опубликованные карточки с пересечением по тегам или отрасли."
        tag_ids = [tag.id for tag in clarification.tags]
        industries = await self.get_taxonomy_values(clarification.id, "industries")

        if not tag_ids and not industries:
            return []

        query = select(RtnClarification).where(
            RtnClarification.publication_status == PublicationStatus.PUBLISHED,
            RtnClarification.id != clarification.id,
        )
        tag_match = RtnClarification.tags.any(Tag.id.in_(tag_ids)) if tag_ids else None
        industry_match = self.apply_taxonomy_filter(
            select(RtnClarification.id), "industries", industries
        ).exists() if industries else None

        if tag_match is not None and industry_match is not None:
            query = query.where(tag_match | industry_match)
        elif tag_match is not None:
            query = query.where(tag_match)
        elif industry_match is not None:
            query = query.where(industry_match)

        query = query.order_by(RtnClarification.published_at.desc(), RtnClarification.id.desc()).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().unique().all())

    async def slug_exists(self, slug: str, exclude_id: int | None = None) -> bool:
        query = select(RtnClarification.id).where(RtnClarification.slug == slug)
        if exclude_id is not None:
            query = query.where(RtnClarification.id != exclude_id)
        result = await self.db.execute(query.limit(1))
        return result.scalar_one_or_none() is not None

    async def create(self, values: dict[str, Any], tags: list[Tag]) -> RtnClarification:
        clarification = RtnClarification(**values, tags=tags)
        self.db.add(clarification)
        await self.db.flush()
        return clarification

    async def update(
        self, clarification: RtnClarification, values: dict[str, Any], tags: list[Tag]
    ) -> RtnClarification:
        for key, value in values.items():
            setattr(clarification, key, value)
        clarification.tags = tags
        await self.db.flush()
        return clarification

    async def delete(self, clarification: RtnClarification) -> None:
        await self.db.delete(clarification)

    async def get_taxonomy_values(self, clarification_id: int, dimension: str) -> list[TaxonomyValue]:
        table, column_name = TAXONOMY_TABLES[dimension]
        column = table.c[column_name]
        query = select(column).where(table.c.clarification_id == clarification_id)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_taxonomy_selection(self, clarification_id: int) -> RtnTaxonomySelection:
        "Собирает выбранные значения по всем 4 измерениям — для деталки и формы редактирования."
        oversight_areas = await self.get_taxonomy_values(clarification_id, "oversight_areas")
        industries = await self.get_taxonomy_values(clarification_id, "industries")
        activities = await self.get_taxonomy_values(clarification_id, "activities")
        object_types = await self.get_taxonomy_values(clarification_id, "object_types")
        return RtnTaxonomySelection(
            oversight_areas=oversight_areas,
            industries=industries,
            activities=activities,
            object_types=object_types,
        )

    async def set_taxonomy_selection(self, clarification_id: int, selection: RtnTaxonomySelection) -> None:
        "Полностью заменяет привязки карточки ко всем 4 измерениям (используется при create/update)."
        await self.replace_taxonomy_values(clarification_id, "oversight_areas", selection.oversight_areas)
        await self.replace_taxonomy_values(clarification_id, "industries", selection.industries)
        await self.replace_taxonomy_values(clarification_id, "activities", selection.activities)
        await self.replace_taxonomy_values(clarification_id, "object_types", selection.object_types)

    async def replace_taxonomy_values(
        self, clarification_id: int, dimension: str, values: list[TaxonomyValue]
    ) -> None:
        table, column_name = TAXONOMY_TABLES[dimension]
        delete_query = delete(table).where(table.c.clarification_id == clarification_id)
        await self.db.execute(delete_query)
        if not values:
            return
        insert_query = pg_insert(table).values(
            [{"clarification_id": clarification_id, column_name: value} for value in values]
        )
        await self.db.execute(insert_query)


class RtnCommentRepository:
    "Комментарии к разъяснениям. user грузится сразу (lazy=selectin) — для имени и роли автора."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_for_clarification(
        self,
        clarification_id: int,
        sort_by: str | None = None,
        sort_dir: str = "desc",
    ) -> list[RtnComment]:
        query = select(RtnComment).where(RtnComment.clarification_id == clarification_id)
        query = self.apply_sort(query, sort_by, sort_dir)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    def apply_sort(
        self,
        query: Select[tuple[RtnComment]],
        sort_by: str | None,
        sort_dir: str,
    ) -> Select[tuple[RtnComment]]:
        "Без sort_by — хронологический порядок (старые сверху), как в обычной ветке обсуждения."
        if sort_by is None:
            return query.order_by(RtnComment.created_at.asc(), RtnComment.id.asc())

        is_desc = sort_dir != "asc"

        if sort_by == "useful_count":
            score = RtnComment.useful_count + RtnComment.agree_count
            score_order = score.desc() if is_desc else score.asc()
            return query.order_by(score_order, RtnComment.created_at.desc())

        if sort_by == "is_expert":
            query = query.outerjoin(User, User.id == RtnComment.user_id)
            expert_flag = case((User.role == UserRole.EXPERT, 1), else_=0)
            expert_order = expert_flag.desc() if is_desc else expert_flag.asc()
            return query.order_by(expert_order, RtnComment.created_at.desc())

        date_order = RtnComment.created_at.desc() if is_desc else RtnComment.created_at.asc()
        return query.order_by(date_order)

    async def get_by_id(self, comment_id: int) -> RtnComment | None:
        query = select(RtnComment).where(RtnComment.id == comment_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def add(
        self,
        clarification_id: int,
        user_id: int | None,
        visitor_key: str | None,
        text: str,
        parent_id: int | None,
        attachments: list[Any],
    ) -> RtnComment:
        comment = RtnComment(
            clarification_id=clarification_id,
            user_id=user_id,
            visitor_key=visitor_key or "",
            text=text,
            parent_id=parent_id,
            attachments=attachments,
        )
        self.db.add(comment)
        await self.db.flush()
        return comment

    async def delete(self, comment: RtnComment) -> None:
        await self.db.delete(comment)


class RtnCommentReactionRepository:
    "Реакции («Полезно» / «Есть уточнение» / «Согласен с практикой») на комментарии обсуждения."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get(self, comment_id: int, visitor_key: str) -> RtnCommentReaction | None:
        query = select(RtnCommentReaction).where(
            RtnCommentReaction.comment_id == comment_id,
            RtnCommentReaction.visitor_key == visitor_key,
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_my_reactions(
        self, comment_ids: list[int], visitor_key: str
    ) -> dict[int, CommentReactionValue]:
        "Реакции текущего посетителя по списку комментариев одним запросом (вместо N+1 в списке)."
        if not comment_ids:
            return {}
        query = select(RtnCommentReaction.comment_id, RtnCommentReaction.value).where(
            RtnCommentReaction.comment_id.in_(comment_ids),
            RtnCommentReaction.visitor_key == visitor_key,
        )
        result = await self.db.execute(query)
        return dict(result.all())

    async def add(
        self,
        comment_id: int,
        user_id: int | None,
        visitor_key: str,
        value: CommentReactionValue,
    ) -> RtnCommentReaction:
        reaction = RtnCommentReaction(comment_id=comment_id, user_id=user_id, visitor_key=visitor_key, value=value)
        self.db.add(reaction)
        await self.db.flush()
        return reaction

    async def remove(self, comment_id: int, visitor_key: str) -> None:
        query = delete(RtnCommentReaction).where(
            RtnCommentReaction.comment_id == comment_id,
            RtnCommentReaction.visitor_key == visitor_key,
        )
        await self.db.execute(query)


class RtnQuestionRepository:
    "Вопросы, заданные посетителями через форму «Не нашли ответ?»."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def add(
        self,
        user_id: int | None,
        visitor_key: str,
        contact_email: str,
        question_text: str,
    ) -> RtnQuestion:
        question = RtnQuestion(
            user_id=user_id,
            visitor_key=visitor_key,
            contact_email=contact_email,
            question_text=question_text,
        )
        self.db.add(question)
        await self.db.flush()
        return question

    async def list_all(self, status_filter: RtnQuestionStatus | None) -> list[RtnQuestion]:
        query = select(RtnQuestion).order_by(RtnQuestion.created_at.desc())
        if status_filter is not None:
            query = query.where(RtnQuestion.status == status_filter)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_by_id(self, question_id: int) -> RtnQuestion | None:
        query = select(RtnQuestion).where(RtnQuestion.id == question_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()


class RtnChangeReportRepository:
    "Сообщения об устаревших разъяснениях через форму «Сообщить об изменении»."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def add(
        self,
        clarification_id: int,
        user_id: int | None,
        visitor_key: str,
        description: str,
    ) -> RtnChangeReport:
        report = RtnChangeReport(
            clarification_id=clarification_id,
            user_id=user_id,
            visitor_key=visitor_key,
            description=description,
        )
        self.db.add(report)
        await self.db.flush()
        return report

    async def list_all(self, status_filter: RtnChangeReportStatus | None) -> list[RtnChangeReport]:
        query = select(RtnChangeReport).order_by(RtnChangeReport.created_at.desc())
        if status_filter is not None:
            query = query.where(RtnChangeReport.status == status_filter)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_by_id(self, report_id: int) -> RtnChangeReport | None:
        query = select(RtnChangeReport).where(RtnChangeReport.id == report_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
