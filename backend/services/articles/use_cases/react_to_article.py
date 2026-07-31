"Use case: голос 👍/👎 за статью. Тоггл/смена + поддержание счётчиков на статье."

from fastapi import HTTPException, status

from models.article import Article
from models.article_reaction import ReactionValue
from services.articles.repository import ArticleReactionRepository, ArticleRepository

#123

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
        "Нет голоса → ставим; тот же → снимаем; другой → меняем. Возвращает статью и текущий голос пользователя."
        article = await self.ensure_published(article_id)
        existing = await self.reactions.get(article_id, user_id, visitor_key)

        if existing is None:
            await self.reactions.add(article_id, user_id, visitor_key, value)
            self.apply_delta(article, value, 1)
            return article, value

        if existing.value == value:
            await self.reactions.remove(article_id, user_id, visitor_key)
            self.apply_delta(article, value, -1)
            return article, None

        self.apply_delta(article, existing.value, -1)
        existing.value = value
        self.apply_delta(article, value, 1)
        return article, value

    async def read(
        self,
        article_id: int,
        user_id: int | None,
        visitor_key: str | None,
    ) -> tuple[Article, ReactionValue | None]:
        "Текущие счётчики статьи и голос пользователя (если авторизован)."
        article = await self.ensure_published(article_id)
        if user_id is None and visitor_key is None:
            return article, None
        existing = await self.reactions.get(article_id, user_id, visitor_key)
        return article, (existing.value if existing else None)

    async def ensure_published(self, article_id: int) -> Article:
        article = await self.articles.get_published_by_id(article_id)
        if article is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Статья не найдена")
        return article

    def apply_delta(self, article: Article, value: ReactionValue, delta: int) -> None:
        if value == ReactionValue.LIKE:
            article.likes_count += delta
        else:
            article.dislikes_count += delta
