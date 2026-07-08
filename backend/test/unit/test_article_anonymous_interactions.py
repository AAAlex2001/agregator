from datetime import UTC, datetime, timedelta
from types import SimpleNamespace

import pytest

from models.article_reaction import ReactionValue
from services.articles.use_cases.article_comments import ArticleCommentsUseCase
from services.articles.use_cases.react_to_article import ReactToArticleUseCase
from services.articles.use_cases.record_article_view import RecordArticleViewUseCase


class FakeArticleRepo:
    def __init__(self):
        self.article = SimpleNamespace(id=1, likes_count=0, dislikes_count=0, views_count=0)

    async def get_published_by_id(self, article_id: int):
        return self.article if article_id == self.article.id else None


class FakeViewRepo:
    def __init__(self):
        self.keys: dict[tuple[int, str], datetime] = {}

    async def get_recent(self, article_id: int, visitor_key: str, since: datetime):
        created_at = self.keys.get((article_id, visitor_key))
        return created_at is not None and created_at >= since

    async def add(self, article_id: int, user_id: int | None, visitor_key: str) -> None:
        self.keys[(article_id, visitor_key)] = datetime.now(UTC)


class FakeReactionRepo:
    def __init__(self):
        self.items = {}

    async def get(self, article_id: int, user_id: int | None, visitor_key: str | None):
        return self.items.get((article_id, user_id, visitor_key))

    async def add(self, article_id: int, user_id: int | None, visitor_key: str | None, value: ReactionValue):
        reaction = SimpleNamespace(article_id=article_id, user_id=user_id, visitor_key=visitor_key, value=value)
        self.items[(article_id, user_id, visitor_key)] = reaction
        return reaction

    async def remove(self, article_id: int, user_id: int | None, visitor_key: str | None) -> None:
        self.items.pop((article_id, user_id, visitor_key), None)


class FakeCommentRepo:
    def __init__(self):
        self.created = None

    async def list_for_article(self, article_id: int):
        return []

    async def get_by_id(self, comment_id: int):
        return self.created if self.created and self.created.id == comment_id else None

    async def add(self, article_id: int, user_id: int | None, visitor_key: str | None, text: str, parent_id: int | None):
        self.created = SimpleNamespace(
            id=1,
            article_id=article_id,
            user_id=user_id,
            visitor_key=visitor_key,
            user=None,
            text=text,
            parent_id=parent_id,
            created_at=datetime.now(UTC),
        )
        return self.created


@pytest.mark.asyncio
async def test_anonymous_view_counts_once_per_day():
    articles = FakeArticleRepo()
    views = FakeViewRepo()
    use_case = RecordArticleViewUseCase(articles, views)

    first = await use_case.record(1, user_id=None, visitor_key="anon-1")
    second = await use_case.record(1, user_id=None, visitor_key="anon-1")

    assert first.views_count == 1
    assert second.views_count == 1

    views.keys[(1, "anon-1")] = datetime.now(UTC) - timedelta(days=2)
    third = await use_case.record(1, user_id=None, visitor_key="anon-1")
    assert third.views_count == 2


@pytest.mark.asyncio
async def test_anonymous_reaction_uses_visitor_key():
    articles = FakeArticleRepo()
    reactions = FakeReactionRepo()
    use_case = ReactToArticleUseCase(articles, reactions)

    article, current = await use_case.react(1, user_id=None, visitor_key="anon-1", value=ReactionValue.LIKE)
    assert article.likes_count == 1
    assert current == ReactionValue.LIKE

    article, current = await use_case.react(1, user_id=None, visitor_key="anon-1", value=ReactionValue.LIKE)
    assert article.likes_count == 0
    assert current is None


@pytest.mark.asyncio
async def test_anonymous_comment_is_created_without_user():
    comments = FakeCommentRepo()
    use_case = ArticleCommentsUseCase(FakeArticleRepo(), comments)

    comment = await use_case.add(1, user_id=None, visitor_key="anon-1", text=" Привет ", parent_id=None)

    assert comment.user_id is None
    assert comment.visitor_key == "anon-1"
    assert comment.user is None
    assert comment.text == "Привет"
