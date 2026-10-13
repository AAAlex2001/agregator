"""Сценарий отметок того, кто смотрит посты."""

from models.account import Account
from models.posts import Post
from schemas.posts import ViewerMarks
from services.posts.follow_repository import FollowRepository
from services.posts.repo import PostLikeRepository, PostSaveRepository


class LoadMarksUseCase:
    """Какие посты пользователь лайкнул и сохранил, на каких авторов подписан.

    Гостю — без отметок.
    """

    def __init__(
        self,
        likes: PostLikeRepository,
        saves: PostSaveRepository,
        follows: FollowRepository,
    ) -> None:
        self.likes = likes
        self.saves = saves
        self.follows = follows

    async def execute(self, user: Account | None, posts: list[Post]) -> ViewerMarks:
        """Отметки пользователя для списка постов."""

        if user is None:
            return ViewerMarks()

        post_ids = [post.id for post in posts]
        author_ids = [post.author_id for post in posts]

        return ViewerMarks(
            liked=await self.likes.liked_ids(user.id, post_ids),
            saved=await self.saves.saved_ids(user.id, post_ids),
            following=await self.follows.following_ids(user.id, author_ids),
        )
