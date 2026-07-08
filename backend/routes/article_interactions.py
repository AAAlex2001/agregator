"Публичные ручки соц-функций статьи: реакции, просмотры и комментарии."

from uuid import uuid4

from fastapi import APIRouter, Cookie, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user_optional
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

ARTICLE_VISITOR_COOKIE = "article_visitor_id"
ARTICLE_VISITOR_MAX_AGE = 60 * 60 * 24 * 365


def get_article_visitor_key(
    response: Response,
    article_visitor_id: str | None = Cookie(None),
) -> str:
    visitor_id = article_visitor_id if article_visitor_id and len(article_visitor_id) <= 64 else uuid4().hex
    if visitor_id != article_visitor_id:
        response.set_cookie(
            ARTICLE_VISITOR_COOKIE,
            visitor_id,
            max_age=ARTICLE_VISITOR_MAX_AGE,
            httponly=True,
            samesite="lax",
            path="/",
        )
    return f"anon:{visitor_id}"


def interaction_key(user_id: int | None, visitor_key: str) -> str:
    return f"user:{user_id}" if user_id is not None else visitor_key


def author_name(comment: ArticleComment) -> str:
    if comment.user is None:
        return "Аноним"
    parts = [part for part in (comment.user.first_name, comment.user.last_name) if part]
    return " ".join(parts) if parts else "Пользователь"


def to_comment_response(
    comment: ArticleComment,
    current_user_id: int | None,
    visitor_key: str | None,
) -> CommentResponse:
    is_mine = comment.user_id == current_user_id if current_user_id is not None else comment.visitor_key == visitor_key
    return CommentResponse(
        id=comment.id,
        parent_id=comment.parent_id,
        text=comment.text,
        author_name=author_name(comment),
        created_at=comment.created_at,
        is_mine=is_mine,
    )


@router.get("/public/articles/{article_id}/reactions", response_model=ReactionResponse)
async def get_reactions(
    article_id: int,
    user_id: int | None = Depends(get_current_user_optional),
    visitor_key: str = Depends(get_article_visitor_key),
    db: AsyncSession = Depends(get_db),
) -> ReactionResponse:
    current_key = interaction_key(user_id, visitor_key)
    use_case = ReactToArticleUseCase(ArticleRepository(db), ArticleReactionRepository(db))
    article, my_reaction = await use_case.read(article_id, user_id, current_key)
    return ReactionResponse(
        likes_count=article.likes_count,
        dislikes_count=article.dislikes_count,
        my_reaction=my_reaction.value if my_reaction else None,
    )


@router.post("/public/articles/{article_id}/reaction", response_model=ReactionResponse)
async def react(
    article_id: int,
    data: ReactionRequest,
    user_id: int | None = Depends(get_current_user_optional),
    visitor_key: str = Depends(get_article_visitor_key),
    db: AsyncSession = Depends(get_db),
) -> ReactionResponse:
    current_key = interaction_key(user_id, visitor_key)
    use_case = ReactToArticleUseCase(ArticleRepository(db), ArticleReactionRepository(db))
    article, my_reaction = await use_case.react(article_id, user_id, current_key, ReactionValue(data.value))
    return ReactionResponse(
        likes_count=article.likes_count,
        dislikes_count=article.dislikes_count,
        my_reaction=my_reaction.value if my_reaction else None,
    )


@router.post("/public/articles/{article_id}/view", response_model=ViewResponse)
async def record_view(
    article_id: int,
    user_id: int | None = Depends(get_current_user_optional),
    visitor_key: str = Depends(get_article_visitor_key),
    db: AsyncSession = Depends(get_db),
) -> ViewResponse:
    current_key = interaction_key(user_id, visitor_key)
    use_case = RecordArticleViewUseCase(ArticleRepository(db), ArticleViewRepository(db))
    article = await use_case.record(article_id, user_id, current_key)
    return ViewResponse(views_count=article.views_count)


@router.get("/public/articles/{article_id}/comments", response_model=CommentListResponse)
async def list_comments(
    article_id: int,
    user_id: int | None = Depends(get_current_user_optional),
    visitor_key: str = Depends(get_article_visitor_key),
    db: AsyncSession = Depends(get_db),
) -> CommentListResponse:
    current_key = interaction_key(user_id, visitor_key)
    use_case = ArticleCommentsUseCase(ArticleRepository(db), ArticleCommentRepository(db))
    comments = await use_case.list_comments(article_id)
    return CommentListResponse(items=[to_comment_response(comment, user_id, current_key) for comment in comments])


@router.post(
    "/public/articles/{article_id}/comments",
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_comment(
    article_id: int,
    data: CommentCreate,
    user_id: int | None = Depends(get_current_user_optional),
    visitor_key: str = Depends(get_article_visitor_key),
    db: AsyncSession = Depends(get_db),
) -> CommentResponse:
    current_key = interaction_key(user_id, visitor_key)
    use_case = ArticleCommentsUseCase(ArticleRepository(db), ArticleCommentRepository(db))
    comment = await use_case.add(article_id, user_id, current_key, data.text, data.parent_id)
    return to_comment_response(comment, user_id, current_key)


@router.delete("/public/articles/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: int,
    user_id: int | None = Depends(get_current_user_optional),
    visitor_key: str = Depends(get_article_visitor_key),
    db: AsyncSession = Depends(get_db),
) -> Response:
    current_key = interaction_key(user_id, visitor_key)
    use_case = ArticleCommentsUseCase(ArticleRepository(db), ArticleCommentRepository(db))
    await use_case.delete(comment_id, user_id, current_key)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
