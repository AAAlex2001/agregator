"""Сценарий веток комментариев постранично — у поста."""

from models.account import Account
from models.posts import Post, PostComment
from schemas.posts import CommentSchema, CommentThreadPageSchema, CommentThreadSchema
from services.posts.comment_repo import CommentLikeRepository, PostCommentRepository


class LoadThreadsUseCase:
    """Страница веток: корневые комментарии по порядку и все ответы в каждой.

    Лайки отмечаются для того, кто смотрит.
    """

    def __init__(self, comments: PostCommentRepository, likes: CommentLikeRepository) -> None:
        self.comments = comments
        self.likes = likes

    async def liked(self, user: Account | None, items: list[PostComment]) -> set[int]:
        """Какие комментарии пользователь лайкнул. Гостю — никакие."""

        if user is None:
            return set()

        comment_ids = [item.id for item in items]
        return await self.likes.liked_ids(user.id, comment_ids)

    async def execute(
        self,
        post: Post,
        user: Account | None,
        limit: int,
        offset: int,
    ) -> CommentThreadPageSchema:
        """Собирает страницу веток и отметки лайков читателя."""

        roots, total = await self.comments.list_roots(post.id, limit, offset)
        replies = await self.comments.list_replies([root.id for root in roots])
        liked = await self.liked(user, [*roots, *replies])

        threads = []
        for root in roots:
            thread_replies = [reply for reply in replies if reply.parent_id == root.id]
            thread = CommentThreadSchema(
                comment=CommentSchema.for_viewer(root, liked),
                replies=[CommentSchema.for_viewer(reply, liked) for reply in thread_replies],
            )
            threads.append(thread)

        return CommentThreadPageSchema(
            items=threads,
            total=total,
            comments_count=post.comments_count,
        )
