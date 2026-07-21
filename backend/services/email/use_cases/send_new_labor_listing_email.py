"""Рассылка новой заявки из раздела трудовых ресурсов."""

from models.labor import (
    EmploymentTerm,
    LaborListing,
    LaborListingKind,
)
from models.user import User, UserRole
from schemas.email import NewLaborListingContext
from services.email.dispatcher import EmailDispatcher
from services.email.formatting import greeting_for
from services.email.repository import EmailRepository

TEMPLATE = "new_labor_listing"
PREFERENCE_FIELD = "email_on_labor_listing"
SUBJECT = "Новая заявка в разделе трудовых ресурсов"
TG_CTA = "Чтобы посмотреть заявку, откройте приложение."


class SendNewLaborListingEmailUseCase:
    def __init__(
        self,
        repo: EmailRepository,
        dispatcher: EmailDispatcher,
    ) -> None:
        self.repo = repo
        self.dispatcher = dispatcher

    async def execute(self, listing_id: int) -> None:
        listing = await self.repo.find_labor_listing(listing_id)
        if listing is None:
            return

        recipient_role = self.recipient_role(listing.kind)
        recipients = await self.repo.list_active_users_by_role(recipient_role)

        for recipient in recipients:
            self.dispatcher.notify(
                recipient,
                PREFERENCE_FIELD,
                TEMPLATE,
                SUBJECT,
                self.build_context(listing, recipient),
                TG_CTA,
            )

    @staticmethod
    def recipient_role(kind: LaborListingKind) -> UserRole:
        if kind == LaborListingKind.EXPERT_WANTED:
            return UserRole.EXPERT
        return UserRole.LICENSE_HOLDER

    def build_context(
        self,
        listing: LaborListing,
        recipient: User,
    ) -> NewLaborListingContext:
        expert_wanted = listing.kind == LaborListingKind.EXPERT_WANTED
        heading = (
            "Организация ищет эксперта в штат"
            if expert_wanted
            else "Эксперт готов к трудоустройству"
        )
        intro = (
            "Появилась новая заявка на поиск эксперта."
            if expert_wanted
            else "Эксперт опубликовал готовность к трудовому договору."
        )
        employment_term = (
            "На постоянной основе"
            if listing.employment_term == EmploymentTerm.PERMANENT
            else f"Срочный договор: {listing.fixed_term}"
        )
        certificates = [
            self.format_certificate(certificate)
            for certificate in listing.certificates
        ]

        return NewLaborListingContext(
            recipient_greeting=greeting_for(recipient),
            heading=heading,
            intro=intro,
            region=listing.region,
            employment_term=employment_term,
            certificates=certificates,
            cta_url=(
                "https://plus-resurs.com/labor/employment"
                if expert_wanted
                else "https://plus-resurs.com/labor/expert-search"
            ),
        )

    @staticmethod
    def format_certificate(certificate: dict[str, object]) -> str:
        area = str(certificate.get("area") or "")
        expert_object = str(certificate.get("object") or "")
        category = str(certificate.get("category") or "")
        parts = [part for part in (area, expert_object) if part]
        if category:
            parts.append(f"{category} кат.")
        return " · ".join(parts)
