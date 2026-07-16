from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest

from services.email.use_cases.send_new_blog_post_email import SendNewBlogPostEmailUseCase


@pytest.mark.asyncio
async def test_blog_email_uses_public_article_url():
    user = SimpleNamespace(first_name="Александр", last_name=None)
    repo = MagicMock()
    repo.list_users_for_new_blog_post_email = AsyncMock(return_value=[user])
    dispatcher = MagicMock()

    use_case = SendNewBlogPostEmailUseCase(repo=repo, dispatcher=dispatcher)
    sent = await use_case.execute(
        slug="ekspertiza-promyshlennoj-bezopasnosti-zakazy-etp",
        blog_title="Экспертиза промышленной безопасности",
        preview="Описание статьи",
    )

    assert sent == 1
    context = dispatcher.notify.call_args[0][4]
    assert context.cta_url == (
        "https://plus-resurs.com/blog/"
        "ekspertiza-promyshlennoj-bezopasnosti-zakazy-etp"
    )
    assert "/landing/" not in context.cta_url
