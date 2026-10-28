from pydantic import BaseModel


class LikesResponse(BaseModel):
    """Стоит ли лайк того, кто смотрит, и сколько лайков у поста."""

    likes_count: int
    liked: bool
