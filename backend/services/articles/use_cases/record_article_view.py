"Use case: учёт уникального просмотра статьи зарегистрированным пользователем."

from fastapi import HTTPException, status

from models.article import Article
from services.articles.repository import ArticleRepository, ArticleViewRepository


class RecordArticleViewUseCase:
    def __init__(self, articles: ArticleRepository, views: ArticleViewRepository) -> None:
        self.articles = articles
        self.views = views

    async def record(self, article_id: int, user_id: int) -> Article:
        "Первый просмотр пользователя увеличивает счётчик; повторные — нет."
        article = await self.articles.get_published_by_id(article_id)
        if article is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Статья не найдена")

        if not await self.views.exists(article_id, user_id):
            await self.views.add(article_id, user_id)
            article.views_count += 1

        return article
