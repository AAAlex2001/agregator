"Use case: комментарии к статье — список, добавление (с ответами), удаление своего."

from fastapi import HTTPException, status

from models.article_comment import ArticleComment
from services.articles.repository import ArticleCommentRepository, ArticleRepository


class ArticleCommentsUseCase:
    def __init__(self, articles: ArticleRepository, comments: ArticleCommentRepository) -> None:
        self.articles = articles
        self.comments = comments

    async def list_comments(self, article_id: int) -> list[ArticleComment]:
        return await self.comments.list_for_article(article_id)

    async def add(
        self,
        article_id: int,
        user_id: int | None,
        visitor_key: str,
        text: str,
        parent_id: int | None,
    ) -> ArticleComment:
        article = await self.articles.get_published_by_id(article_id)
        if article is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Статья не найдена")

        if parent_id is not None:
            parent = await self.comments.get_by_id(parent_id)
            if parent is None or parent.article_id != article_id:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Комментарий-родитель не найден")

        created = await self.comments.add(article_id, user_id, visitor_key, text.strip(), parent_id)
        # перечитываем, чтобы подтянулся автор (lazy=selectin)
        fresh = await self.comments.get_by_id(created.id)
        return fresh if fresh is not None else created

    async def delete(self, comment_id: int, user_id: int | None, visitor_key: str | None) -> None:
        comment = await self.comments.get_by_id(comment_id)
        if comment is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Комментарий не найден")
        is_owner = comment.user_id == user_id if user_id is not None else comment.visitor_key == visitor_key
        if not is_owner:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нельзя удалить чужой комментарий")
        await self.comments.delete(comment)
