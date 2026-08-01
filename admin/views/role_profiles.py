"Админ-вьюшки ролевых профилей: заказчик, исполнитель, держатель разрешительных документов."

from sqladmin import ModelView

from models import Customer, Expert, LicenseHolder


def format_kopecks(model: object, attribute: str) -> str:
    "Копейки в рублях для колонок с ценой."
    value = getattr(model, attribute, None)
    return f"{value / 100:.2f} ₽" if value is not None else "—"


class CustomerAdmin(ModelView, model=Customer):
    "Профиль заказчика: письма по событиям, адресованным заказчику."

    name = "Профиль заказчика"
    name_plural = "Профили заказчиков"
    icon = "fa-solid fa-briefcase"
    can_create = False
    can_delete = False

    column_list = [
        Customer.id, Customer.account,
        Customer.email_on_response_created, Customer.email_on_response_updated,
        Customer.email_on_expert_rejected, Customer.email_on_question_asked,
    ]
    column_sortable_list = [Customer.id, Customer.created_at]
    column_default_sort = (Customer.id, True)

    column_details_list = [
        Customer.id, Customer.account,
        Customer.email_on_response_created, Customer.email_on_response_updated,
        Customer.email_on_expert_rejected, Customer.email_on_question_asked,
        Customer.created_at, Customer.updated_at,
    ]

    form_columns = [
        Customer.email_on_response_created, Customer.email_on_response_updated,
        Customer.email_on_expert_rejected, Customer.email_on_question_asked,
    ]

    column_labels = {
        Customer.id: "ID",
        Customer.account: "Аккаунт",
        Customer.email_on_response_created: "Письмо: новый отклик",
        Customer.email_on_response_updated: "Письмо: отклик изменён",
        Customer.email_on_expert_rejected: "Письмо: отклик отклонён",
        Customer.email_on_question_asked: "Письмо: новый вопрос по заказу",
        Customer.created_at: "Создан",
        Customer.updated_at: "Обновлён",
    }


class ExpertAdmin(ModelView, model=Expert):
    "Профиль исполнителя: рейтинг, карта, продажа контактов, письма исполнителю."

    name = "Профиль исполнителя"
    name_plural = "Профили исполнителей"
    icon = "fa-solid fa-user-gear"
    can_create = False
    can_delete = False

    column_list = [
        Expert.id, Expert.account, Expert.rating, Expert.review_count,
        Expert.location_city, Expert.show_on_map,
        Expert.contact_sales_enabled, Expert.contact_price_kopecks,
    ]
    column_sortable_list = [Expert.id, Expert.rating, Expert.review_count, Expert.created_at]
    column_default_sort = (Expert.id, True)

    column_details_list = [
        Expert.id, Expert.account, Expert.rating, Expert.review_count,
        Expert.certificates,
        Expert.location_address, Expert.location_city,
        Expert.location_lat, Expert.location_lng,
        Expert.travels_to_other_regions, Expert.show_on_map, Expert.map_fields,
        Expert.contact_sales_enabled, Expert.contact_price_kopecks,
        Expert.contact_disclosure_consent_at, Expert.contact_disclosure_consent_version,
        Expert.notify_order_types,
        Expert.email_on_order_updated, Expert.email_on_bidding_finished,
        Expert.email_on_question_answered, Expert.email_on_labor_listing,
        Expert.created_at, Expert.updated_at,
    ]

    form_columns = [
        Expert.rating, Expert.review_count,
        Expert.location_address, Expert.location_city,
        Expert.location_lat, Expert.location_lng,
        Expert.travels_to_other_regions, Expert.show_on_map, Expert.map_fields,
        Expert.contact_sales_enabled, Expert.contact_price_kopecks,
        Expert.notify_order_types,
        Expert.email_on_order_updated, Expert.email_on_bidding_finished,
        Expert.email_on_question_answered, Expert.email_on_labor_listing,
    ]

    column_formatters = {
        Expert.contact_price_kopecks: lambda m, a: format_kopecks(m, "contact_price_kopecks"),
    }
    column_formatters_detail = {
        Expert.contact_price_kopecks: lambda m, a: format_kopecks(m, "contact_price_kopecks"),
    }

    column_labels = {
        Expert.id: "ID",
        Expert.account: "Аккаунт",
        Expert.rating: "Рейтинг",
        Expert.review_count: "Кол-во отзывов",
        Expert.certificates: "Сертификаты",
        Expert.location_address: "Адрес",
        Expert.location_city: "Город",
        Expert.location_lat: "Широта",
        Expert.location_lng: "Долгота",
        Expert.travels_to_other_regions: "Выезжает в другие регионы",
        Expert.show_on_map: "Показывать на карте",
        Expert.map_fields: "Поля, видимые на карте",
        Expert.contact_sales_enabled: "Продаёт контакты",
        Expert.contact_price_kopecks: "Цена контакта",
        Expert.contact_disclosure_consent_at: "Согласие на раскрытие контактов",
        Expert.contact_disclosure_consent_version: "Версия согласия",
        Expert.notify_order_types: "Направления и виды работ для рассылки о новых заказах",
        Expert.email_on_order_updated: "Письмо: заказ изменён",
        Expert.email_on_bidding_finished: "Письмо: торги завершены",
        Expert.email_on_question_answered: "Письмо: ответ на вопрос",
        Expert.email_on_labor_listing: "Письмо: новая вакансия/резюме",
        Expert.created_at: "Создан",
        Expert.updated_at: "Обновлён",
    }


class LicenseHolderAdmin(ModelView, model=LicenseHolder):
    "Профиль держателя разрешительных документов: лицензии, условия аренды, письма."

    name = "Профиль держателя документов"
    name_plural = "Профили держателей документов"
    icon = "fa-solid fa-file-contract"
    can_create = False
    can_delete = False

    column_list = [
        LicenseHolder.id, LicenseHolder.account,
        LicenseHolder.license_number, LicenseHolder.mining_license_number,
        LicenseHolder.lab_accreditation_number, LicenseHolder.license_rental_kind,
    ]
    column_sortable_list = [LicenseHolder.id, LicenseHolder.created_at]
    column_default_sort = (LicenseHolder.id, True)

    column_details_list = [
        LicenseHolder.id, LicenseHolder.account,
        LicenseHolder.license_number, LicenseHolder.license_file_url, LicenseHolder.license_areas,
        LicenseHolder.mining_license_number, LicenseHolder.mining_license_file_url,
        LicenseHolder.sro_design_file_url,
        LicenseHolder.lab_accreditation_number, LicenseHolder.lab_accreditation_file_url,
        LicenseHolder.company_card_url,
        LicenseHolder.license_rental_kind, LicenseHolder.license_rental_percent,
        LicenseHolder.license_rental_fixed_amount,
        LicenseHolder.email_on_order_updated, LicenseHolder.email_on_bidding_finished,
        LicenseHolder.email_on_labor_listing,
        LicenseHolder.created_at, LicenseHolder.updated_at,
    ]

    form_columns = [
        LicenseHolder.license_number, LicenseHolder.license_file_url, LicenseHolder.license_areas,
        LicenseHolder.mining_license_number, LicenseHolder.mining_license_file_url,
        LicenseHolder.sro_design_file_url,
        LicenseHolder.lab_accreditation_number, LicenseHolder.lab_accreditation_file_url,
        LicenseHolder.company_card_url,
        LicenseHolder.license_rental_kind, LicenseHolder.license_rental_percent,
        LicenseHolder.license_rental_fixed_amount,
        LicenseHolder.email_on_order_updated, LicenseHolder.email_on_bidding_finished,
        LicenseHolder.email_on_labor_listing,
    ]

    column_formatters = {
        LicenseHolder.license_rental_fixed_amount: lambda m, a: format_kopecks(m, "license_rental_fixed_amount"),
    }
    column_formatters_detail = {
        LicenseHolder.license_rental_fixed_amount: lambda m, a: format_kopecks(m, "license_rental_fixed_amount"),
    }

    column_labels = {
        LicenseHolder.id: "ID",
        LicenseHolder.account: "Аккаунт",
        LicenseHolder.license_number: "Номер лицензии",
        LicenseHolder.license_file_url: "Файл лицензии",
        LicenseHolder.license_areas: "Области аттестации",
        LicenseHolder.mining_license_number: "Номер горной лицензии",
        LicenseHolder.mining_license_file_url: "Файл горной лицензии",
        LicenseHolder.sro_design_file_url: "Файл СРО (проектирование)",
        LicenseHolder.lab_accreditation_number: "Номер аккредитации лаборатории",
        LicenseHolder.lab_accreditation_file_url: "Файл аккредитации лаборатории",
        LicenseHolder.company_card_url: "Карточка компании",
        LicenseHolder.license_rental_kind: "Способ расчёта аренды",
        LicenseHolder.license_rental_percent: "Процент от суммы заказа",
        LicenseHolder.license_rental_fixed_amount: "Фиксированная стоимость",
        LicenseHolder.email_on_order_updated: "Письмо: заказ изменён",
        LicenseHolder.email_on_bidding_finished: "Письмо: торги завершены",
        LicenseHolder.email_on_labor_listing: "Письмо: новая вакансия/резюме",
        LicenseHolder.created_at: "Создан",
        LicenseHolder.updated_at: "Обновлён",
    }
