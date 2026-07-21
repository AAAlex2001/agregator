from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field, SecretStr

from models.contact_deal import (
    ContactDealParty,
    ContactDealReleaseActor,
    ContactDealStatus,
    ContactReceiptStatus,
    ContactSignatureMethod,
)


class ContactDealCreateRequest(BaseModel):
    seller_id: int = Field(..., gt=0)


class ContactDealSignRequest(BaseModel):
    password: SecretStr = Field(..., min_length=1, max_length=256)
    accepted: Literal[True]


class ContactReceiptRejectRequest(BaseModel):
    reason: str = Field(..., min_length=3, max_length=1000)


class AdminContactDealReleaseRequest(BaseModel):
    note: str = Field(..., min_length=3, max_length=2000)


class ContactDealSignatureResponse(BaseModel):
    party: ContactDealParty
    method: ContactSignatureMethod
    signer_name: str
    document_hash: str
    signed_at: datetime


class ContactReceiptResponse(BaseModel):
    id: int
    public_id: str
    original_name: str
    content_type: str
    size_bytes: int
    sha256: str
    status: ContactReceiptStatus
    rejection_reason: str | None = None
    created_at: datetime
    reviewed_at: datetime | None = None
    download_url: str


class ContactDealListItemResponse(BaseModel):
    id: int
    public_id: str
    seller_id: int
    status: ContactDealStatus
    seller_name: str
    buyer_name: str
    price_rubles: int
    actor_party: ContactDealParty | None
    created_at: datetime
    updated_at: datetime


class ContactDealDetailResponse(ContactDealListItemResponse):
    contract: dict[str, Any]
    contract_hash: str
    signatures: list[ContactDealSignatureResponse]
    receipts: list[ContactReceiptResponse]
    payment_details: str | None = None
    seller_contacts: dict[str, str | None] | None = None
    buyer_reported_paid_at: datetime | None = None
    seller_confirmed_at: datetime | None = None
    released_at: datetime | None = None
    released_by: ContactDealReleaseActor | None = None
    release_note: str | None = None


class ContactDealListResponse(BaseModel):
    items: list[ContactDealListItemResponse]
    total: int


class AdminContactDealListItemResponse(ContactDealListItemResponse):
    receipt_count: int


class AdminContactDealListResponse(BaseModel):
    items: list[AdminContactDealListItemResponse]
    total: int
