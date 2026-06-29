"Публичные ручки соц-функций статьи: реакции 👍/👎 и комментарии."

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user, get_current_user_optional
from models.article_comment import ArticleComment
from models.article_reaction import ReactionValue
from schemas.article_interactions import (
    CommentCreate,
    CommentListResponse,
    CommentResponse,
    ReactionRequest,
    ReactionResponse,
    ViewResponse,
)
from services.articles.repository import (
    ArticleCommentRepository,
    ArticleReactionRepository,
    ArticleRepository,
    ArticleViewRepository,
)
from services.articles.use_cases.article_comments import ArticleCommentsUseCase
from services.articles.use_cases.react_to_article import ReactToArticleUseCase
from services.articles.use_cases.record_article_view import RecordArticleViewUseCase

router = APIRouter(tags=["article-interactions"])


def author_name(comment: ArticleComment) -> str:
    parts = [part for part in (comment.user.first_name, comment.user.last_name) if part]
    return " ".join(parts) if parts else "Пользователь"


def to_comment_response(comment: ArticleComment, current_user_id: int | None) -> CommentResponse:
    return CommentResponse(
        id=comment.id,
        parent_id=comment.parent_id,
        text=comment.text,
        author_name=author_name(comment),
        created_at=comment.created_at,
        is_mine=current_user_id is not None and comment.user_id == current_user_id,
    )


@router.get("/public/articles/{article_id}/reactions", response_model=ReactionResponse)
async def get_reactions(
    article_id: int,
    user_id: int | None = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
) -> ReactionResponse:
    use_case = ReactToArticleUseCase(ArticleRepository(db), ArticleReactionRepository(db))
    article, my_reaction = await use_case.read(article_id, user_id)
    return ReactionResponse(
        likes_count=article.likes_count,
        dislikes_count=article.dislikes_count,
        my_reaction=my_reaction.value if my_reaction else None,
    )


@router.post("/public/articles/{article_id}/reaction", response_model=ReactionResponse)
async def react(
    article_id: int,
    data: ReactionRequest,
    user_id: int = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ReactionResponse:
    use_case = ReactToArticleUseCase(ArticleRepository(db), ArticleReactionRepository(db))
    article, my_reaction = await use_case.react(article_id, user_id, ReactionValue(data.value))
    return ReactionResponse(
        likes_count=article.likes_count,
        dislikes_count=article.dislikes_count,
        my_reaction=my_reaction.value if my_reaction else None,
    )


@router.post("/public/articles/{article_id}/view", response_model=ViewResponse)
async def record_view(
    article_id: int,
    user_id: int = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ViewResponse:
    use_case = RecordArticleViewUseCase(ArticleRepository(db), ArticleViewRepository(db))
    article = await use_case.record(article_id, user_id)
    return ViewResponse(views_count=article.views_count)


@router.get("/public/articles/{article_id}/comments", response_model=CommentListResponse)
async def list_comments(
    article_id: int,
    user_id: int | None = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
) -> CommentListResponse:
    use_case = ArticleCommentsUseCase(ArticleRepository(db), ArticleCommentRepository(db))
    comments = await use_case.list_comments(article_id)
    return CommentListResponse(items=[to_comment_response(comment, user_id) for comment in comments])


@router.post(
    "/public/articles/{article_id}/comments",
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_comment(
    article_id: int,
    data: CommentCreate,
    user_id: int = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CommentResponse:
    use_case = ArticleCommentsUseCase(ArticleRepository(db), ArticleCommentRepository(db))
    comment = await use_case.add(article_id, user_id, data.text, data.parent_id)
    return to_comment_response(comment, user_id)


@router.delete("/public/articles/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: int,
    user_id: int = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Response:
    use_case = ArticleCommentsUseCase(ArticleRepository(db), ArticleCommentRepository(db))
    await use_case.delete(comment_id, user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
