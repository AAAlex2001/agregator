from datetime import UTC, datetime

from fastapi import HTTPException, status

from models.expert import CONTACT_DISCLOSURE_CONSENT_VERSION
from schemas.expert_contact import ExpertContactOfferResponse, ExpertContactOfferUpdate
from services.contact_deals.crypto import ContactDealCipher
from services.expert_contacts.formatters import to_offer
from services.expert_contacts.repository import ExpertContactRepository


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
        expert = await self.repository.get_active_expert(expert_id, for_update=True)
        if expert is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Настроить продажу контактов может только эксперт",
            )
        profile = expert.expert_profile
        if not data.enabled:
            profile.contact_sales_enabled = False
            profile.contact_price_kopecks = None
            profile.contact_payment_details_encrypted = None
            await self.repository.flush()
            return to_offer(expert, self.cipher)

        if not expert.phone and not expert.email:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Добавьте телефон или email в профиле",
            )
        payment_details = (data.payment_details or "").strip()
        if not payment_details and not profile.contact_payment_details_encrypted:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Укажите реквизиты для прямой оплаты",
            )

        profile.contact_sales_enabled = True
        profile.contact_price_kopecks = (data.price_rubles or 0) * 100
        if payment_details:
            profile.contact_payment_details_encrypted = self.cipher.encrypt_text(payment_details)
        profile.contact_disclosure_consent_at = datetime.now(UTC)
        profile.contact_disclosure_consent_version = CONTACT_DISCLOSURE_CONSENT_VERSION
        await self.repository.flush()
        return to_offer(expert, self.cipher)
