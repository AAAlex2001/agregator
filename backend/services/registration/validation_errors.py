"""Понятные русские сообщения об ошибках регистрации."""

from collections.abc import Iterable

from pydantic import ValidationError

REGISTRATION_FIELD_LABELS: dict[str, str] = {
    "role": "роль",
    "email": "электронная почта",
    "password": "пароль",
    "password_confirm": "подтверждение пароля",
    "phone": "номер телефона",
    "inn": "ИНН",
    "company_data": "организация",
    "first_name": "имя",
    "last_name": "фамилия",
    "location_lat": "местоположение",
    "location_lng": "местоположение",
    "location_address": "адрес",
    "location_city": "город",
    "travels_to_other_regions": "готовность к выездам",
    "show_on_map": "отображение на карте",
    "map_fields": "данные для отображения на карте",
    "directions": "направления работы",
    "expertise_profile": "анкета эксперта промышленной безопасности",
    "certificates": "удостоверения эксперта",
    "area": "область аттестации",
    "object": "объект экспертизы",
    "category": "категория эксперта",
    "expires_at": "срок действия удостоверения",
    "audit_expert_profile": "анкета аудитора СУПБ",
    "industrial_safety_areas": "области промышленной безопасности",
    "expert_attestation_areas": "области аттестации эксперта",
    "audit_qualifications": "квалификация аудитора",
    "audit_customer_profile": "анкета заказчика аудита СУПБ",
    "position": "должность",
    "opo_license_number": "номер лицензии ОПО",
    "cadastral_profile": "анкета кадастрового инженера",
    "education": "образование",
    "registry_joined_at": "дата вступления в реестр",
    "certificate_number": "номер свидетельства или аттестата",
    "registry_number": "реестровый номер",
    "has_equipment": "наличие оборудования",
    "city": "город",
    "workplace": "место работы",
    "forensic_profile": "анкета судебного эксперта",
    "extra_education": "дополнительное образование",
    "has_similar_experience": "опыт аналогичных работ",
    "has_degree": "наличие учёной степени",
    "degree": "учёная степень",
    "workplace_kind": "тип места работы",
    "workplace_name": "наименование места работы",
    "research_profile": "анкета научного специалиста",
    "academic_degree": "учёная степень",
    "academic_title": "учёное звание",
    "research_field": "область исследований",
    "laboratory_profile": "анкета лаборатории",
    "accreditation_area": "область аккредитации",
    "comment": "комментарий",
    "tech_diag_profile": "анкета технического диагностирования",
    "qualification_certificates": "квалификационные удостоверения",
    "methods": "методы работ",
    "control_objects": "объекты контроля",
    "design_profile": "анкета проектирования",
    "specialties": "специальности",
    "nok_passed": "прохождение НОК",
    "nrs_number": "номер в НРС",
    "sro_gip_declared": "сведения СРО",
    "qualification_courses": "курсы повышения квалификации",
    "rtn_areas": "области Ростехнадзора",
    "contact_sales_enabled": "платный доступ к контактам",
    "contact_price_rubles": "стоимость доступа к контактам",
    "contact_payment_details": "условия оплаты доступа к контактам",
    "contact_disclosure_consent": "согласие на раскрытие контактов",
    "privacy_consent": "согласие с Политикой конфиденциальности",
    "terms_consent": "согласие с Пользовательским соглашением",
    "personal_data_consent": "согласие на обработку персональных данных",
    "license_number": "номер лицензии",
    "license_areas": "объекты экспертизы",
    "license_rental_kind": "способ расчёта стоимости",
    "license_rental_percent": "процент от суммы договора",
    "license_rental_fixed_amount": "фиксированная стоимость",
    "mining_license_number": "номер лицензии на недропользование",
    "lab_accreditation_number": "номер аккредитации лаборатории",
    "audit_profile": "анкета держателя документов по аудиту СУПБ",
    "accreditation_areas": "области аккредитации",
    "organization_city": "город организации",
    "sro_name": "наименование СРО",
    "sro_registry_number": "номер в реестре СРО",
    "hazardous_objects_right": "право работ на опасных объектах",
    "nuclear_objects_right": "право работ на атомных объектах",
    "liability_level": "уровень ответственности",
    "pricing_kind": "способ расчёта стоимости",
    "pricing_percent": "процент от суммы договора",
    "pricing_fixed_amount": "фиксированная стоимость",
}

REGISTRATION_PATH_LABELS: dict[str, str] = {
    "cadastral_profile.certificate_number": "номер аттестата кадастрового инженера",
    "audit_profile.certificate_number": "номер свидетельства об аккредитации",
    "expertise_profile.certificates.object": "объект экспертизы промышленной безопасности",
    "tech_diag_profile.methods": "методы технического диагностирования",
    "tech_diag_profile.organization_city": "город организации технического диагностирования",
    "design_profile.pricing_kind": "способ расчёта стоимости проектных работ",
    "design_profile.pricing_percent": "процент от стоимости проектных работ",
    "design_profile.pricing_fixed_amount": "фиксированная стоимость проектных работ",
}


def normalize_error_path(location: Iterable[object]) -> str:
    return ".".join(str(part) for part in location if not isinstance(part, int))


def registration_validation_message(exc: ValidationError) -> str:
    """Преобразует первую ошибку Pydantic в короткое русское сообщение."""
    error = exc.errors()[0]
    error_type = str(error.get("type", ""))
    location = error.get("loc") or ()
    path = normalize_error_path(location)
    field = str(location[-1]) if location else ""
    label = REGISTRATION_PATH_LABELS.get(path) or REGISTRATION_FIELD_LABELS.get(field)
    message = str(error.get("msg", "")).removeprefix("Value error, ").strip()

    if error_type == "json_invalid":
        return "Не удалось прочитать данные регистрации"
    if field == "email":
        return "Укажите корректный адрес электронной почты"
    if field == "company_data":
        return "Выберите организацию из подсказок по ИНН"
    if field == "role":
        return "Выберите корректную роль"
    if field == "inn" and error_type in {
        "missing",
        "string_too_short",
        "string_too_long",
        "string_pattern_mismatch",
    }:
        return "ИНН должен содержать 10 или 12 цифр"
    if field == "password" and error_type == "string_too_short":
        return "Пароль должен содержать не менее 6 символов"
    if field == "phone" and error_type == "string_too_short":
        return "Укажите номер телефона полностью"
    if error_type == "value_error" and message:
        return message
    if not label:
        return "Проверьте данные регистрации"
    if error_type == "missing":
        return f"Заполните поле «{label}»"
    if error_type in {"string_too_short", "too_short"}:
        return f"Поле «{label}» заполнено не полностью"
    if error_type in {"string_too_long", "too_long"}:
        return f"Поле «{label}» содержит слишком много символов"
    if error_type in {"greater_than", "greater_than_equal", "less_than", "less_than_equal"}:
        return f"Проверьте значение поля «{label}»"
    return f"Проверьте поле «{label}»"
