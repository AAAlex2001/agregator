"Use case: рассылка письма всем подписанным пользователям о новой статье в блоге."

import logging

from schemas.email import NewBlogPostEmailContext
from services.email.dispatcher import EmailDispatcher
from services.email.formatting import greeting_for
from services.email.repository import EmailRepository

logger = logging.getLogger(__name__)

TEMPLATE = "new_blog_post"
CTA_URL_TEMPLATE = "https://plus-resurs.com/landing/blog/{slug}"
BLOG_FROM_EMAIL = "expert@plus-resurs.com"
TG_CTA = "Чтобы прочитать статью, откройте раздел «Блог» в приложении."


class SendNewBlogPostEmailUseCase:
    "Шлёт письмо о новой публикации в блоге всем юзерам с включённым флагом email_on_new_blog_post."

    def __init__(self, repo: EmailRepository, dispatcher: EmailDispatcher) -> None:
        self.repo = repo
        self.dispatcher = dispatcher

    async def execute(self, slug: str, blog_title: str, preview: str) -> int:
        "Рассылает письмо. Возвращает число получателей."
        recipients = await self.repo.list_users_for_new_blog_post_email()
        cta_url = CTA_URL_TEMPLATE.format(slug=slug)
        subject = blog_title.strip() or "Новая публикация на Ресурс-Плюс"
        for user in recipients:
            context = NewBlogPostEmailContext(
                recipient_greeting=greeting_for(user),
                blog_title=blog_title,
                preview=preview,
                cta_url=cta_url,
            )
            self.dispatcher.notify(
                user,
                "email_on_new_blog_post",
                TEMPLATE,
                subject,
                context,
                TG_CTA,
                from_email=BLOG_FROM_EMAIL,
                reply_to=BLOG_FROM_EMAIL,
            )
        logger.info("Sent new-blog-post email to %d users (slug=%s)", len(recipients), slug)
        return len(recipients)
