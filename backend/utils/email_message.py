"Нейтральные модели письма — общие для отправителя и транспорта."
from dataclasses import dataclass, field
from pathlib import Path


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
    headers: dict[str, str] = field(default_factory=dict)
