from models.contact_deal import ContactAccessDeal, ContactDealStatus
from models.user import User
from schemas.expert_contact import ExpertContactCardResponse, ExpertContactOfferResponse
from services.contact_deals.contract import party_name
from services.contact_deals.crypto import ContactDealCipher


def mask_phone(value: str | None) -> str | None:
    if not value:
        return None
    digits = "".join(character for character in value if character.isdigit())
    suffix = digits[-2:] if len(digits) >= 2 else ""
    return f"+7 ••• •••-••-{suffix}" if suffix else "Номер скрыт"


def mask_email(value: str | None) -> str | None:
    if not value or "@" not in value:
        return None
    local, domain = value.split("@", 1)
    first = local[:1] or "•"
    return f"{first}•••@{domain}"


def to_offer(expert: User, cipher: ContactDealCipher) -> ExpertContactOfferResponse:
    encrypted_payment_details = expert.contact_payment_details_encrypted
    return ExpertContactOfferResponse(
        enabled=expert.contact_sales_enabled,
        price_rubles=(
            expert.contact_price_kopecks // 100
            if expert.contact_price_kopecks is not None
            else None
        ),
        has_payment_details=bool(encrypted_payment_details),
        payment_details=(
            cipher.decrypt_text(encrypted_payment_details)
            if encrypted_payment_details
            else None
        ),
        consent_at=expert.contact_disclosure_consent_at,
    )


def to_expert_contact(
    expert: User,
    deal: ContactAccessDeal | None,
    actor_id: int | None,
    cipher: ContactDealCipher,
) -> ExpertContactCardResponse:
    is_mine = actor_id is not None and expert.id == actor_id
    released = deal is not None and deal.status == ContactDealStatus.CONTACTS_RELEASED
    contacts = (
        {"phone": expert.phone, "email": expert.email}
        if is_mine
        else cipher.decrypt_json(deal.seller_contacts_encrypted)
        if released and deal is not None
        else {}
    )
    return ExpertContactCardResponse(
        id=expert.id,
        public_id=expert.public_id,
        name=party_name(expert),
        avatar_url=expert.avatar_url,
        city=expert.location_city,
        certificates=expert.expert_certificates or [],
        rating=float(expert.rating) if expert.rating is not None else None,
        review_count=expert.review_count,
        masked_phone=(
            "Телефон доступен после оплаты"
            if expert.contact_sales_enabled and not released and not is_mine
            else mask_phone(expert.phone)
        ),
        masked_email=(
            "Email доступен после оплаты"
            if expert.contact_sales_enabled and not released and not is_mine
            else mask_email(expert.email)
        ),
        phone=contacts.get("phone"),
        email=contacts.get("email"),
        sales_enabled=expert.contact_sales_enabled,
        price_rubles=(
            expert.contact_price_kopecks // 100
            if expert.contact_price_kopecks is not None
            else None
        ),
        is_mine=is_mine,
        deal_id=deal.id if deal is not None else None,
        deal_status=deal.status if deal is not None else None,
    )
