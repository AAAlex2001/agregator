from fastapi import HTTPException, status

from services.contact_deals import ContactDealCipher


def build_contact_cipher() -> ContactDealCipher:
    try:
        return ContactDealCipher()
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Сервис защищенного хранения временно недоступен",
        ) from exc
