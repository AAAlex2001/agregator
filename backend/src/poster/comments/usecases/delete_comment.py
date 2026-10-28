from src.accounts.models import Account
from src.poster.comments.exceptions import CommentNotFoundError
from src.poster.comments.repository import CommentRepository
from src.poster.posts.repository import PostRepository


class DeleteCommentUseCase:
    """Удаление своего комментария."""

    def __init__(self, comments: CommentRepository, posts: PostRepository) -> None:
        """Принимает комментарии и посты."""
        self.comments = comments
        self.posts = posts

    async def execute(self, *, user: Account, comment_id: int) -> None:
        """Удаляет комментарий вместе с ответами в его ветке и убавляет счётчик поста."""
        comment = await self.comments.get_for_author(comment_id, user.id)

        if comment is None:
            raise CommentNotFoundError()

        removed_count = 1

        if comment.parent_id is None:
            removed_count += await self.comments.count_replies(comment.id)

        await self.comments.delete(comment)
        await self.posts.change_comments_count(comment.post_id, -removed_count)
