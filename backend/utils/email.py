import os
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.mail.ru")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "465"))
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
if not EMAIL_HOST_USER or not EMAIL_HOST_PASSWORD:
    raise RuntimeError("EMAIL_HOST_USER or EMAIL_HOST_PASSWORD is not set in environment")


async def send_code_reset_email(email: str, id: int, body: str) -> None:
    "Отправляет письмо с кодом верификации на указанный email"
    message = MIMEMultipart()
    message["From"] = EMAIL_HOST_USER
    message["To"] = email
    message["Subject"] = str(id)
    message.attach(MIMEText(body, "plain"))

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
