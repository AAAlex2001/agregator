from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from schemas.registration import PartySuggestionRequest, PartySuggestionResponse, UserRegistration, UserResponse
from services.dadata import DaDataService
from services.registration import RegistrationService


router = APIRouter(prefix="/register", tags=["auth"])


@router.post("/", response_model=UserResponse)
async def register_user(
    data: UserRegistration,
    db: AsyncSession = Depends(get_db),
):
    service = RegistrationService(db)
    user = await service.create_user(data)
    return user


@router.post("/party-suggestions", response_model=list[PartySuggestionResponse])
async def get_party_suggestions(payload: PartySuggestionRequest):
    service = DaDataService()
    suggestions = await service.suggest_parties(payload.query, payload.count)
    items: list[PartySuggestionResponse] = []

    for item in suggestions:
        data = item.get("data") or {}
        items.append(
            PartySuggestionResponse(
                value=item.get("value", ""),
                unrestricted_value=item.get("unrestricted_value", item.get("value", "")),
                data={
                    "inn": data.get("inn"),
                    "kpp": data.get("kpp"),
                    "ogrn": data.get("ogrn"),
                    "name": (data.get("name") or {}).get("full_with_opf") if isinstance(data.get("name"), dict) else None,
                    "short_name": (data.get("name") or {}).get("short_with_opf") if isinstance(data.get("name"), dict) else None,
                },
            )
        )

    return items
