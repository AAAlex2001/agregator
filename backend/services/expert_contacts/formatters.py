from models.account import Account
from models.contact_deal import ContactAccessDeal, ContactDealStatus
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


def to_offer(expert: Account, cipher: ContactDealCipher) -> ExpertContactOfferResponse:
    profile = expert.expert_profile
    encrypted_payment_details = profile.contact_payment_details_encrypted
    return ExpertContactOfferResponse(
        enabled=profile.contact_sales_enabled,
        price_rubles=(
            profile.contact_price_kopecks // 100
            if profile.contact_price_kopecks is not None
            else None
        ),
        has_payment_details=bool(encrypted_payment_details),
        payment_details=(
            cipher.decrypt_text(encrypted_payment_details)
            if encrypted_payment_details
            else None
        ),
        consent_at=profile.contact_disclosure_consent_at,
    )


def to_expert_contact(
    expert: Account,
    deal: ContactAccessDeal | None,
    actor_id: int | None,
    cipher: ContactDealCipher,
) -> ExpertContactCardResponse:
    profile = expert.expert_profile
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
        city=profile.location_city,
        certificates=profile.certificates or [],
        rating=float(profile.rating) if profile.rating is not None else None,
        review_count=profile.review_count,
        masked_phone=(
            "Телефон доступен после оплаты"
            if profile.contact_sales_enabled and not released and not is_mine
            else mask_phone(expert.phone)
        ),
        masked_email=(
            "Email доступен после оплаты"
            if profile.contact_sales_enabled and not released and not is_mine
            else mask_email(expert.email)
        ),
        phone=contacts.get("phone"),
        email=contacts.get("email"),
        sales_enabled=profile.contact_sales_enabled,
        price_rubles=(
            profile.contact_price_kopecks // 100
            if profile.contact_price_kopecks is not None
            else None
        ),
        is_mine=is_mine,
        deal_id=deal.id if deal is not None else None,
        deal_status=deal.status if deal is not None else None,
    )
