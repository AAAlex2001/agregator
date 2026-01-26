import os
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

EMAIL_HOST = os.getenv("EMAIL_HOST", "")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", ""))
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
if not EMAIL_HOST_USER or not EMAIL_HOST_PASSWORD:
    raise RuntimeError("EMAIL_HOST_USER or EMAIL_HOST_PASSWORD is not set in environment")

async def send_code_reset_email(email: str, id: int, body: str) -> None:
    """Отправляет письмо с кодом верификации на указанный email

    Args:
        email: Email получателя
        subject: Тема письма
        body: Текст письма
    """
    message = MIMEMultipart()
    message["From"] = EMAIL_HOST_USER
    message["To"] = email
    message["Subject"] = str(id)

    message.attach(MIMEText(body, "plain"))

    try:
        await aiosmtplib.send(
            message,
            hostname=EMAIL_HOST,
            port=EMAIL_PORT,
            username=EMAIL_HOST_USER,
            password=EMAIL_HOST_PASSWORD,
            use_tls=True,
            source_address=(EMAIL_HOST_USER, 0),
        )
    except Exception as e:
        raise RuntimeError(f"Ошибка при отправке email: {str(e)}")