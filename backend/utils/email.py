import mimetypes
import os
from dataclasses import dataclass
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr, formatdate, make_msgid
from email import encoders
from pathlib import Path

import aiosmtplib
from dotenv import load_dotenv

load_dotenv()

EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.mail.ru")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "465"))
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
EMAIL_FROM_NAME = os.getenv("EMAIL_FROM_NAME", "Ресурс-Плюс")
if not EMAIL_HOST_USER or not EMAIL_HOST_PASSWORD:
    raise RuntimeError("EMAIL_HOST_USER or EMAIL_HOST_PASSWORD is not set in environment")

EMAIL_MAX_TOTAL_ATTACHMENT_BYTES = 15 * 1024 * 1024


@dataclass(frozen=True)
class EmailAttachment:
    "Файл для прикрепления к письму. path — абсолютный путь на диске, filename — имя в письме."
    path: Path
    filename: str


async def send_email(
    email: str,
    subject: str,
    body: str,
    attachments: list[EmailAttachment] | None = None,
) -> None:
    "Универсальная отправка письма. Вложения пропускаются, если превышают суммарный лимит."
    sender_domain = EMAIL_HOST_USER.split("@")[-1] or "localhost"
    message = MIMEMultipart("mixed")
    message["From"] = formataddr((EMAIL_FROM_NAME, EMAIL_HOST_USER))
    message["To"] = email
    message["Reply-To"] = EMAIL_HOST_USER
    message["Subject"] = subject
    message["Date"] = formatdate(localtime=False)
    message["Message-ID"] = make_msgid(domain=sender_domain)
    message["MIME-Version"] = "1.0"
    message.attach(MIMEText(body, "plain", "utf-8"))

    attach_files_to_message(message, attachments or [])

    use_ssl = EMAIL_PORT == 465
    try:
        await aiosmtplib.send(
            message,
            hostname=EMAIL_HOST,
            port=EMAIL_PORT,
            username=EMAIL_HOST_USER,
            password=EMAIL_HOST_PASSWORD,
            use_tls=use_ssl,
            start_tls=not use_ssl,
            timeout=30,
        )
    except Exception as e:
        raise RuntimeError(f"Ошибка при отправке email: {e}")


def attach_files_to_message(message: MIMEMultipart, attachments: list[EmailAttachment]) -> None:
    total_bytes = 0
    for attachment in attachments:
        if not attachment.path.exists() or not attachment.path.is_file():
            continue

        size = attachment.path.stat().st_size
        if total_bytes + size > EMAIL_MAX_TOTAL_ATTACHMENT_BYTES:
            continue
        total_bytes += size

        ctype, encoding = mimetypes.guess_type(attachment.filename)
        if ctype is None or encoding is not None:
            ctype = "application/octet-stream"
        main_type, sub_type = ctype.split("/", 1)

        with attachment.path.open("rb") as file_handle:
            part = MIMEBase(main_type, sub_type)
            part.set_payload(file_handle.read())

        encoders.encode_base64(part)
        part.add_header(
            "Content-Disposition",
            "attachment",
            filename=attachment.filename,
        )
        message.attach(part)


async def send_code_reset_email(email: str, subject: str, body: str) -> None:
    "Письмо с кодом верификации. Обёртка вокруг send_email без вложений."
    await send_email(email, subject, body)
