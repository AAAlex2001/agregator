from typing import Any

from pydantic import BaseModel, Field


class LicenseHolderListItem(BaseModel):
    "Карточка держателя лицензии в публичном списке."
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
    mining_license_number: str | None = None
    mining_license_file_url: str | None = None
    sro_design_file_url: str | None = None
    lab_accreditation_number: str | None = None
    lab_accreditation_file_url: str | None = None
    company_card_url: str | None = None

    class Config:
        from_attributes = True


class LicenseHolderListResponse(BaseModel):
    "Постраничный ответ со списком держателей лицензий."
    items: list[LicenseHolderListItem] = Field(default_factory=list)
    total: int = 0
