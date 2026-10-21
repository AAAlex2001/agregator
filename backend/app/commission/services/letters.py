"""Письма комиссии: кандидату о получении заявки и о решении, администраторам о новой заявке."""

from pydantic import BaseModel

from app.commission.models import ApplicationStatus, CommissionApplication
from app.core.config import get_settings
from services.email.dispatcher import EmailDispatcher

TEMPLATE = "commission_message"

DECISION_TEXTS = {
    ApplicationStatus.REVIEWING: "Комиссия начала рассматривать вашу заявку.",
    ApplicationStatus.ACCEPTED: "Комиссия приняла вашу кандидатуру. Мы свяжемся с вами и обсудим работу.",
    ApplicationStatus.REJECTED: "К сожалению, сейчас комиссия не может принять вашу кандидатуру.",
}


class CommissionEmailContext(BaseModel):
    """Письмо комиссии: заголовок и текст."""

    title: str
    message: str


def attestations_text(application: CommissionApplication) -> str:
    """Аттестации строками: «Э12 КЛ/ТП, 2 категория»."""

    return "\n".join(
        f"{item['area_code']} {item['object_code']}, {item['category']} категория"
        for item in application.attestations
    )


class CommissionLetters:
    """Отправляет письма комиссии в фоне после ответа."""

    def __init__(self, emails: EmailDispatcher) -> None:
        self.emails = emails

    def received(self, application: CommissionApplication) -> None:
        """Кандидату: заявка получена. Администраторам: новая заявка с контактами и аттестациями."""

        self.send(
            application.email,
            f"Заявка №{application.id} в конкурсную комиссию получена",
            f"{application.full_name}, спасибо! Комиссия рассмотрит вашу кандидатуру "
            "и ответит на эту почту.",
        )

        summary = (
            f"{application.full_name}\nТелефон: {application.phone}\nПочта: {application.email}\n\n"
            f"Аттестации:\n{attestations_text(application)}"
        )
        if application.message:
            summary += f"\n\nО себе:\n{application.message}"

        for email in get_settings().admin_emails:
            self.send(email, f"Конкурсная комиссия: заявка №{application.id}", summary)

    def decided(self, application: CommissionApplication) -> None:
        """Кандидату: решение комиссии и комментарий."""

        text = DECISION_TEXTS.get(ApplicationStatus(application.status))
        if text is None:
            return

        if application.decision:
            text += f"\n\n{application.decision}"

        self.send(application.email, f"Решение по заявке №{application.id} в конкурсную комиссию", text)

    def send(self, email: str, title: str, message: str) -> None:
        """Поставить письмо в очередь."""

        self.emails.dispatch(email, TEMPLATE, title, CommissionEmailContext(title=title, message=message))
