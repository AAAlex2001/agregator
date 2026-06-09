"Use case: рассылка письма всем подписанным пользователям о новой статье в блоге."

import logging

from schemas.email import NewBlogPostEmailContext
from services.email.dispatcher import EmailDispatcher
from services.email.formatting import greeting_for
from services.email.repository import EmailRepository

logger = logging.getLogger(__name__)

TEMPLATE = "new_blog_post"
SUBJECT = "Новая статья на Ресурс-Плюс"
CTA_URL_TEMPLATE = "https://plus-resurs.com/landing/blog/{slug}"


class SendNewBlogPostEmailUseCase:
    "Шлёт письмо о новой публикации в блоге всем юзерам с включённым флагом email_on_new_blog_post."

    def __init__(self, repo: EmailRepository, dispatcher: EmailDispatcher) -> None:
        self.repo = repo
        self.dispatcher = dispatcher

    async def execute(self, slug: str, blog_title: str, preview: str) -> int:
        "Рассылает письмо. Возвращает число получателей."
        recipients = await self.repo.list_users_for_new_blog_post_email()
        cta_url = CTA_URL_TEMPLATE.format(slug=slug)
        for user in recipients:
            context = NewBlogPostEmailContext(
                recipient_greeting=greeting_for(user),
                blog_title=blog_title,
                preview=preview,
                cta_url=cta_url,
            )
            self.dispatcher.dispatch(user.email, TEMPLATE, SUBJECT, context)
        logger.info("Sent new-blog-post email to %d users (slug=%s)", len(recipients), slug)
        return len(recipients)
