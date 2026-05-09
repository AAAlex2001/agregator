from typing import Any, Optional
from pydantic import BaseModel, Field


class LicenseHolderListItem(BaseModel):
    id: int
    inn: Optional[str] = None
    company_data: Optional[dict[str, Any]] = None
    avatar_url: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    license_number: Optional[str] = None
    license_file_url: Optional[str] = None
    license_areas: Optional[list[str]] = None
    license_rental_kind: Optional[str] = None
    license_rental_percent: Optional[float] = None
    license_rental_fixed_amount: Optional[int] = None

    class Config:
        from_attributes = True


class LicenseHolderListResponse(BaseModel):
    items: list[LicenseHolderListItem] = Field(default_factory=list)
    total: int = 0
