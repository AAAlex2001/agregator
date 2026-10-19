"""Ветки комментариев поста постранично."""

from app.poster.comments.models import PostComment
from app.poster.comments.schemas import CommentSchema, CommentThreadPageSchema, CommentThreadSchema
from app.poster.comments.services.repo import CommentLikeRepository, PostCommentRepository
from app.poster.publications.models import Post
from models.account import Account


def build_thread(root: PostComment, replies: list[PostComment], liked: set[int]) -> CommentThreadSchema:
    """Ветка корневого комментария с его ответами по порядку."""

    own_replies = [reply for reply in replies if reply.parent_id == root.id]

    return CommentThreadSchema(
        comment=CommentSchema.for_viewer(root, liked),
        replies=[CommentSchema.for_viewer(reply, liked) for reply in own_replies],
    )


class LoadThreadsUseCase:
    """Страница веток: корневые комментарии по порядку и все ответы в каждой."""

    def __init__(self, comments: PostCommentRepository, likes: CommentLikeRepository) -> None:
        self.comments = comments
        self.likes = likes

    async def liked(self, user: Account | None, items: list[PostComment]) -> set[int]:
        """Какие комментарии лайкнул тот, кто смотрит. Гостю — никакие."""

        if user is None:
            return set()

        return await self.likes.liked_ids(user.id, [item.id for item in items])

    async def execute(
        self,
        post: Post,
        user: Account | None,
        limit: int,
        offset: int,
    ) -> CommentThreadPageSchema:
        """Страница веток с отметками лайков читателя."""

        roots, total = await self.comments.list_roots(post.id, limit, offset)
        replies = await self.comments.list_replies([root.id for root in roots])
        liked = await self.liked(user, [*roots, *replies])

        return CommentThreadPageSchema(
            items=[build_thread(root, replies, liked) for root in roots],
            total=total,
            comments_count=post.comments_count,
        )
