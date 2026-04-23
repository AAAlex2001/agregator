import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr, formatdate, make_msgid

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


async def send_code_reset_email(email: str, subject: str, body: str) -> None:
    "Отправляет письмо с кодом верификации на указанный email."
    sender_domain = EMAIL_HOST_USER.split("@")[-1] or "localhost"
    message = MIMEMultipart("alternative")
    message["From"] = formataddr((EMAIL_FROM_NAME, EMAIL_HOST_USER))
    message["To"] = email
    message["Reply-To"] = EMAIL_HOST_USER
    message["Subject"] = subject
    message["Date"] = formatdate(localtime=False)
    message["Message-ID"] = make_msgid(domain=sender_domain)
    message["MIME-Version"] = "1.0"
    message.attach(MIMEText(body, "plain", "utf-8"))

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
            timeout=15,
        )
    except Exception as e:
        raise RuntimeError(f"Ошибка при отправке email: {e}")
