from dataclasses import dataclass
from pathlib import Path

from config import email_config


@dataclass(frozen=True)
class EmailAttachment:
    "Файл для прикрепления к письму."
    path: Path
    filename: str


@dataclass(frozen=True)
class EmailMessage:
    "Нейтральная модель письма. Транспорт её отправляет."
    to: str
    subject: str
    text: str
    html: str | None
    attachments: tuple[EmailAttachment, ...]
    from_email: str
    from_name: str
    reply_to: str


async def send_email(
    email: str,
    subject: str,
    text_body: str,
    html_body: str | None = None,
    attachments: list[EmailAttachment] | None = None,
    from_email: str | None = None,
    reply_to: str | None = None,
) -> None:
    "Отправляет письмо. from_email/reply_to по умолчанию из конфига; кампании их переопределяют."
    from utils.email_transport import email_transport

    sender = from_email or email_config.email_from
    message = EmailMessage(
        to=email,
        subject=subject,
        text=text_body,
        html=html_body,
        attachments=tuple(attachments or []),
        from_email=sender,
        from_name=email_config.email_from_name,
        reply_to=reply_to or email_config.email_reply_to or sender,
    )
    await email_transport.send(message)
