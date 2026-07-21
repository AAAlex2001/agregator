from datetime import UTC, datetime

from fastapi import HTTPException, status

from schemas.expert_contact import ExpertContactOfferResponse, ExpertContactOfferUpdate
from services.contact_deals.crypto import ContactDealCipher
from services.expert_contacts.formatters import to_offer
from services.expert_contacts.repository import ExpertContactRepository

CONTACT_CONSENT_VERSION = "2026-07-21"


class UpdateExpertContactOfferUseCase:
    def __init__(
        self,
        repository: ExpertContactRepository,
        cipher: ContactDealCipher,
    ) -> None:
        self.repository = repository
        self.cipher = cipher

    async def execute(
        self, expert_id: int, data: ExpertContactOfferUpdate
    ) -> ExpertContactOfferResponse:
        expert = await self.repository.get_active_expert(expert_id)
        if expert is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Настроить продажу контактов может только эксперт",
            )
        if not data.enabled:
            expert.contact_sales_enabled = False
            expert.contact_price_kopecks = None
            expert.contact_payment_details_encrypted = None
            await self.repository.flush()
            return to_offer(expert, self.cipher)

        if not expert.phone and not expert.email:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Добавьте телефон или email в профиле",
            )
        payment_details = (data.payment_details or "").strip()
        if not payment_details and not expert.contact_payment_details_encrypted:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Укажите реквизиты для прямой оплаты",
            )

        expert.contact_sales_enabled = True
        expert.contact_price_kopecks = (data.price_rubles or 0) * 100
        if payment_details:
            expert.contact_payment_details_encrypted = self.cipher.encrypt_text(payment_details)
        expert.contact_disclosure_consent_at = datetime.now(UTC)
        expert.contact_disclosure_consent_version = CONTACT_CONSENT_VERSION
        await self.repository.flush()
        return to_offer(expert, self.cipher)
