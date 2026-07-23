from models.contact_deal import (
    ContactAccessDeal,
    ContactDealParty,
    ContactDealStatus,
    ContactPaymentReceipt,
)
from schemas.contact_deal import (
    AdminContactDealListItemResponse,
    ContactDealDetailResponse,
    ContactDealListItemResponse,
    ContactDealSignatureResponse,
    ContactReceiptResponse,
)
from services.contact_deals.contract import party_name
from services.contact_deals.crypto import ContactDealCipher


def to_list_item(
    deal: ContactAccessDeal, actor_id: int | None
) -> ContactDealListItemResponse:
    actor_party = None
    if actor_id == deal.seller_id:
        actor_party = ContactDealParty.SELLER
    elif actor_id == deal.buyer_id:
        actor_party = ContactDealParty.BUYER
    return ContactDealListItemResponse(
        id=deal.id,
        public_id=deal.public_id,
        seller_id=deal.seller_id,
        status=deal.status,
        seller_name=party_name(deal.seller),
        buyer_name=party_name(deal.buyer),
        price_rubles=deal.price_kopecks // 100,
        actor_party=actor_party,
        created_at=deal.created_at,
        updated_at=deal.updated_at,
    )


def to_admin_list_item(
    deal: ContactAccessDeal, receipt_count: int
) -> AdminContactDealListItemResponse:
    base = to_list_item(deal, None)
    return AdminContactDealListItemResponse(**base.model_dump(), receipt_count=receipt_count)


def to_detail(
    deal: ContactAccessDeal,
    actor_id: int | None,
    cipher: ContactDealCipher,
    admin: bool = False,
) -> ContactDealDetailResponse:
    base = to_list_item(deal, actor_id)
    signatures = [
        ContactDealSignatureResponse(
            party=signature.party,
            method=signature.method,
            signer_name=signature.signer_name,
            document_hash=signature.document_hash,
            signed_at=signature.signed_at,
        )
        for signature in sorted(deal.signatures, key=lambda signature: signature.signed_at)
    ]
    receipts = [
        to_receipt(deal, receipt, admin)
        for receipt in sorted(deal.receipts, key=lambda receipt: receipt.created_at)
    ]
    both_signed = {signature.party for signature in deal.signatures} == {
        ContactDealParty.BUYER,
        ContactDealParty.SELLER,
    }
    can_see_payment = admin or actor_id == deal.seller_id or (
        actor_id == deal.buyer_id and both_signed
    )
    can_see_contacts = admin or actor_id == deal.seller_id or (
        actor_id == deal.buyer_id and deal.status.value == "CONTACTS_RELEASED"
    )
    has_review = any(
        review.customer_id == actor_id
        for review in deal.reviews
    )
    can_review = (
        actor_id == deal.buyer_id
        and not has_review
        and deal.status
        in {
            ContactDealStatus.PAYMENT_REPORTED,
            ContactDealStatus.PAYMENT_REJECTED,
            ContactDealStatus.CONTACTS_RELEASED,
        }
    )
    return ContactDealDetailResponse(
        **base.model_dump(),
        contract=deal.contract_snapshot,
        contract_hash=deal.contract_hash,
        signatures=signatures,
        receipts=receipts,
        payment_details=(
            cipher.decrypt_text(deal.payment_details_encrypted) if can_see_payment else None
        ),
        seller_contacts=(
            cipher.decrypt_json(deal.seller_contacts_encrypted) if can_see_contacts else None
        ),
        buyer_reported_paid_at=deal.buyer_reported_paid_at,
        seller_confirmed_at=deal.seller_confirmed_at,
        released_at=deal.released_at,
        released_by=deal.released_by,
        release_note=deal.release_note,
        can_review=can_review,
        has_review=has_review,
    )


def to_receipt(
    deal: ContactAccessDeal,
    receipt: ContactPaymentReceipt,
    admin: bool,
) -> ContactReceiptResponse:
    prefix = "/api/internal/contact-deals" if admin else "/api/contact-deals"
    return ContactReceiptResponse(
        id=receipt.id,
        public_id=receipt.public_id,
        original_name=receipt.original_name,
        content_type=receipt.content_type,
        size_bytes=receipt.size_bytes,
        sha256=receipt.sha256,
        status=receipt.status,
        rejection_reason=receipt.rejection_reason,
        created_at=receipt.created_at,
        reviewed_at=receipt.reviewed_at,
        download_url=f"{prefix}/{deal.id}/receipts/{receipt.id}",
    )
