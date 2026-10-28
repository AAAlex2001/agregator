from src.poster.comments.exceptions import CommentNotFoundError
from src.poster.comments.repository import CommentRepository
from src.poster.posts.repository import PostRepository


class DeleteCommentByModeratorUseCase:
    """Модератор удаляет комментарий, нарушающий правила."""

    def __init__(self, comments: CommentRepository, posts: PostRepository) -> None:
        """Принимает комментарии и посты."""
        self.comments = comments
        self.posts = posts

    async def execute(self, *, comment_id: int) -> None:
        """Удаляет любой комментарий вместе с ответами в его ветке и убавляет счётчик поста."""
        comment = await self.comments.get(comment_id)

        if comment is None:
            raise CommentNotFoundError()

        removed_count = 1

        if comment.parent_id is None:
            removed_count += await self.comments.count_replies(comment.id)

        await self.comments.delete(comment)
        await self.posts.change_comments_count(comment.post_id, -removed_count)
