"Formatters: сборка DTO держателя лицензии из пары аккаунт + профиль."
from models.account import Account
from models.license_holder import LicenseHolder
from schemas.license_holder import LicenseHolderListItem


def license_holder_to_list_item(account: Account, profile: LicenseHolder) -> LicenseHolderListItem:
    "Собирает карточку каталога: общие поля — из аккаунта, лицензионные — из профиля."
    return LicenseHolderListItem(
        id=account.id,
        inn=account.inn,
        company_data=account.company_data,
        avatar_url=account.avatar_url,
        email=account.email,
        phone=account.phone,
        license_number=profile.license_number,
        license_file_url=profile.license_file_url,
        license_areas=profile.license_areas,
        license_rental_kind=profile.license_rental_kind,
        license_rental_percent=profile.license_rental_percent,
        license_rental_fixed_amount=profile.license_rental_fixed_amount,
        mining_license_number=profile.mining_license_number,
        mining_license_file_url=profile.mining_license_file_url,
        sro_design_file_url=profile.sro_design_file_url,
        lab_accreditation_number=profile.lab_accreditation_number,
        lab_accreditation_file_url=profile.lab_accreditation_file_url,
        company_card_url=profile.company_card_url,
    )
