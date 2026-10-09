"Отписка в массовых письмах: видимая ссылка и заголовки one-click (RFC 8058)."

from config import email_config
from utils.signed_tokens import make_unsubscribe_token


def unsubscribe_url(email: str) -> str:
    "Подписанная ссылка отписки: адрес попадёт в общий стоп-лист рассылок."
    base = email_config.public_base_url.rstrip("/")
    return f"{base}/api/email/unsubscribe?token={make_unsubscribe_token(email)}"


def list_unsubscribe_headers(url: str, mailto: str) -> dict[str, str]:
    "Заголовки, по которым Gmail и Яндекс показывают кнопку «Отписаться» и не считают письмо спамом."
    return {
        "List-Unsubscribe": f"<{url}>, <mailto:{mailto}?subject=unsubscribe>",
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    }
