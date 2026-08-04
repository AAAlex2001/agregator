"Use case: голос 👍/👎 за статью. Тоггл/смена + поддержание счётчиков на статье."

from collections.abc import Awaitable, Callable
from typing import Protocol

from fastapi import HTTPException, status

from models.article import Article
from models.article_reaction import ReactionValue
from services.articles.repository import ArticleReactionRepository, ArticleRepository


class ReactionRecord[V](Protocol):
    "Сохранённая реакция с изменяемым значением."
    value: V


async def toggle_reaction[V](
    existing: ReactionRecord[V] | None,
    value: V,
    add: Callable[[V], Awaitable[object]],
    remove: Callable[[], Awaitable[object]],
    apply_delta: Callable[[V, int], None],
) -> V | None:
    "Нет реакции → ставим; та же → снимаем; другая → меняем. Возвращает актуальную реакцию."
    if existing is None:
        await add(value)
        apply_delta(value, 1)
        return value
    if existing.value == value:
        await remove()
        apply_delta(value, -1)
        return None
    apply_delta(existing.value, -1)
    existing.value = value
    apply_delta(value, 1)
    return value


class ReactToArticleUseCase:
    def __init__(self, articles: ArticleRepository, reactions: ArticleReactionRepository) -> None:
        self.articles = articles
        self.reactions = reactions

    async def react(
        self,
        article_id: int,
        user_id: int | None,
        visitor_key: str,
        value: ReactionValue,
    ) -> tuple[Article, ReactionValue | None]:
        "Тоггл голоса; строка статьи блокируется на время обновления счётчиков."
        article = await self.ensure_published(article_id, for_update=True)
        existing = await self.reactions.get(article_id, visitor_key)
        current = await toggle_reaction(
            existing,
            value,
            add=lambda v: self.reactions.add(article_id, user_id, visitor_key, v),
            remove=lambda: self.reactions.remove(article_id, visitor_key),
            apply_delta=lambda v, delta: self.apply_delta(article, v, delta),
        )
        return article, current

    async def read(
        self,
        article_id: int,
        visitor_key: str | None,
    ) -> tuple[Article, ReactionValue | None]:
        "Текущие счётчики статьи и голос посетителя."
        article = await self.ensure_published(article_id)
        if visitor_key is None:
            return article, None
        existing = await self.reactions.get(article_id, visitor_key)
        return article, (existing.value if existing else None)

    async def ensure_published(self, article_id: int, for_update: bool = False) -> Article:
        "Возвращает опубликованную статью или 404."
        if for_update:
            article = await self.articles.get_published_by_id_for_update(article_id)
        else:
            article = await self.articles.get_published_by_id(article_id)
        if article is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Статья не найдена")
        return article

    def apply_delta(self, article: Article, value: ReactionValue, delta: int) -> None:
        if value == ReactionValue.LIKE:
            article.likes_count += delta
        else:
            article.dislikes_count += delta
