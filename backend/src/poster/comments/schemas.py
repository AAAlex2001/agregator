from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from src.accounts.models import Account
from src.poster.comments.models import MAX_COMMENT_LENGTH, PostComment
from src.poster.posts.schemas import AuthorResponse


class CreateCommentRequest(BaseModel):
    """Новый комментарий. reply_to_id — комментарий, на который отвечают."""

    model_config = ConfigDict(str_strip_whitespace=True)

    text: str = Field(min_length=1, max_length=MAX_COMMENT_LENGTH)
    reply_to_id: int | None = None


class UpdateCommentRequest(BaseModel):
    """Новый текст своего комментария."""

    model_config = ConfigDict(str_strip_whitespace=True)

    text: str = Field(min_length=1, max_length=MAX_COMMENT_LENGTH)


class CommentResponse(BaseModel):
    """Комментарий: автор, текст, кому ответ и лайки."""

    id: int
    post_id: int
    author: AuthorResponse
    text: str
    parent_id: int | None
    reply_to_name: str | None
    likes_count: int
    liked: bool
    created_at: datetime

    @classmethod
    def from_comment(
        cls,
        comment: PostComment,
        authors: dict[int, Account],
        liked_ids: set[int],
    ) -> "CommentResponse":
        """Собирает ответ из комментария, его автора и лайков того, кто смотрит."""
        reply_to_name = None

        if comment.reply_to is not None:
            reply_to_name = authors[comment.reply_to.author_id].display_name

        return cls(
            id=comment.id,
            post_id=comment.post_id,
            author=AuthorResponse.from_account(authors[comment.author_id]),
            text=comment.text,
            parent_id=comment.parent_id,
            reply_to_name=reply_to_name,
            likes_count=comment.likes_count,
            liked=comment.id in liked_ids,
            created_at=comment.created_at,
        )


class CommentThreadResponse(BaseModel):
    """Ветка: первый комментарий и все ответы под ним."""

    comment: CommentResponse
    replies: list[CommentResponse]


class CommentPageResponse(BaseModel):
    """Страница веток, сколько веток всего и сколько у поста комментариев вместе с ответами."""

    items: list[CommentThreadResponse]
    total: int
    comments_count: int


class CommentLikesResponse(BaseModel):
    """Стоит ли лайк того, кто смотрит, и сколько лайков у комментария."""

    likes_count: int
    liked: bool


def comment_author_ids(comments: list[PostComment]) -> set[int]:
    """Собирает id авторов комментариев и тех, кому они отвечают."""
    ids = {comment.author_id for comment in comments}
    ids |= {comment.reply_to.author_id for comment in comments if comment.reply_to is not None}

    return ids
