from typing import Any

from pydantic import BaseModel, Field


class LicenseHolderListItem(BaseModel):
    id: int
    inn: str | None = None
    company_data: dict[str, Any] | None = None
    avatar_url: str | None = None
    email: str | None = None
    phone: str | None = None
    license_number: str | None = None
    license_file_url: str | None = None
    license_areas: list[str] | None = None
    license_rental_kind: str | None = None
    license_rental_percent: float | None = None
    license_rental_fixed_amount: int | None = None
    company_card_url: str | None = None

    class Config:
        from_attributes = True


class LicenseHolderListResponse(BaseModel):
    items: list[LicenseHolderListItem] = Field(default_factory=list)
    total: int = 0
