from datetime import datetime

from pydantic import BaseModel, Field, model_validator

from models.contact_deal import ContactDealStatus
from schemas.labor import LaborCertificate


class ExpertContactOfferUpdate(BaseModel):
    enabled: bool
    price_rubles: int | None = Field(None, ge=1, le=1_000_000)
    payment_details: str | None = Field(None, max_length=1000)
    disclosure_consent: bool = False

    @model_validator(mode="after")
    def validate_enabled_offer(self) -> "ExpertContactOfferUpdate":
        if not self.enabled:
            return self
        if self.price_rubles is None:
            raise ValueError("Укажите стоимость доступа к контактам")
        if not self.disclosure_consent:
            raise ValueError("Подтвердите согласие на передачу контактов покупателю")
        return self


class ExpertContactCardResponse(BaseModel):
    id: int
    public_id: str
    name: str
    avatar_url: str | None = None
    city: str | None = None
    certificates: list[LaborCertificate]
    rating: float | None = None
    review_count: int
    masked_phone: str | None = None
    masked_email: str | None = None
    phone: str | None = None
    email: str | None = None
    sales_enabled: bool
    price_rubles: int | None = None
    is_mine: bool
    deal_id: int | None = None
    deal_status: ContactDealStatus | None = None


class ExpertContactListResponse(BaseModel):
    items: list[ExpertContactCardResponse]
    total: int


class ExpertContactOfferResponse(BaseModel):
    enabled: bool
    price_rubles: int | None = None
    has_payment_details: bool
    payment_details: str | None = None
    consent_at: datetime | None = None
