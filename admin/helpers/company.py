"Форматтеры для отображения данных компании DaData в админке и вспомогательные функции для других сложных полей."

import json
from datetime import UTC, datetime
from typing import Any

from markupsafe import Markup, escape


def format_technical_files(m: Any, a: Any) -> Any:
    "Форматирует поле technical_files: список ссылок/превью картинок для column_formatters."
    files = getattr(m, "technical_files", None)
    if not files:
        return "—"
    if isinstance(files, list):
        parts = []
        for f in files:
            if isinstance(f, str):
                name = f.rsplit("/", 1)[-1]
                ext = name.rsplit(".", 1)[-1].lower() if "." in name else ""
                if ext in ("jpg", "jpeg", "png", "gif", "webp", "svg"):
                    parts.append(
                        f'<div style="margin:4px 0">'
                        f'<a href="{f}" target="_blank">'
                        f'<img src="{f}" style="max-width:200px;max-height:150px;border-radius:6px;border:1px solid #ddd;" />'
                        f'</a>'
                        f'<br><small>{name}</small></div>'
                    )
                else:
                    parts.append(f'<div style="margin:4px 0"><a href="{f}" target="_blank">{name}</a></div>')
            else:
                parts.append(str(f))
        return Markup("".join(parts))
    return str(files)


def format_json_payload(value: Any) -> Any:
    "Форматирует произвольный JSON-объект как <pre>-блок для деталей записи."
    if not value:
        return "—"
    pretty = json.dumps(value, ensure_ascii=False, indent=2)
    return Markup(
        f'<pre style="white-space:pre-wrap;word-break:break-word;max-width:960px;font-size:12px;line-height:1.5">{escape(pretty)}</pre>'
    )


COMPANY_FIELD_LABELS = {
    "value": "Наименование",
    "unrestricted_value": "Полное наименование",
    "data": "Карточка компании",
    "inn": "ИНН",
    "kpp": "КПП",
    "ogrn": "ОГРН",
    "ogrn_date": "Дата присвоения ОГРН",
    "type": "Тип",
    "branch_type": "Тип подразделения",
    "branch_count": "Количество филиалов",
    "source": "Источник",
    "qc": "Код качества",
    "hid": "Идентификатор DaData",
    "capital": "Уставный капитал",
    "invalid": "Признак недостоверности",
    "management": "Руководство",
    "name": "Название",
    "post": "Должность",
    "start_date": "Дата назначения",
    "disqualified": "Дисквалификация",
    "founders": "Учредители",
    "managers": "Руководители",
    "predecessors": "Предшественники",
    "successors": "Правопреемники",
    "state": "Состояние",
    "status": "Статус",
    "actuality_date": "Дата актуальности",
    "registration_date": "Дата регистрации",
    "liquidation_date": "Дата ликвидации",
    "opf": "Организационно-правовая форма",
    "code": "Код",
    "full": "Полное название",
    "short": "Краткое название",
    "full_with_opf": "Полное название с ОПФ",
    "short_with_opf": "Краткое название с ОПФ",
    "latin": "Латиницей",
    "okpo": "ОКПО",
    "okato": "ОКАТО",
    "oktmo": "ОКТМО",
    "okogu": "ОКОГУ",
    "okfs": "ОКФС",
    "okved": "ОКВЭД",
    "okved_type": "Тип ОКВЭД",
    "okveds": "Дополнительные ОКВЭД",
    "authorities": "Регистрационные органы",
    "documents": "Документы",
    "licenses": "Лицензии",
    "finance": "Финансы",
    "finance_history": "Финансовая история",
    "address": "Адрес",
    "postal_code": "Почтовый индекс",
    "country": "Страна",
    "country_iso_code": "ISO код страны",
    "federal_district": "Федеральный округ",
    "region_fias_id": "FIAS региона",
    "region_kladr_id": "КЛАДР региона",
    "region_iso_code": "Код региона ISO",
    "region_with_type": "Регион",
    "region_type": "Тип региона",
    "region_type_full": "Полный тип региона",
    "region": "Регион",
    "area_fias_id": "FIAS района",
    "area_kladr_id": "КЛАДР района",
    "area_with_type": "Район",
    "area_type": "Тип района",
    "area_type_full": "Полный тип района",
    "area": "Район",
    "city_fias_id": "FIAS города",
    "city_kladr_id": "КЛАДР города",
    "city_with_type": "Город",
    "city_type": "Тип города",
    "city_type_full": "Полный тип города",
    "city": "Город",
    "city_area": "Городская зона",
    "city_district_fias_id": "FIAS городского района",
    "city_district_kladr_id": "КЛАДР городского района",
    "city_district_with_type": "Городской район",
    "city_district_type": "Тип городского района",
    "city_district_type_full": "Полный тип городского района",
    "city_district": "Городской район",
    "settlement_fias_id": "FIAS населённого пункта",
    "settlement_kladr_id": "КЛАДР населённого пункта",
    "settlement_with_type": "Населённый пункт",
    "settlement_type": "Тип населённого пункта",
    "settlement_type_full": "Полный тип населённого пункта",
    "settlement": "Населённый пункт",
    "street_fias_id": "FIAS улицы",
    "street_kladr_id": "КЛАДР улицы",
    "street_with_type": "Улица",
    "street_type": "Тип улицы",
    "street_type_full": "Полный тип улицы",
    "street": "Улица",
    "stead_fias_id": "FIAS участка",
    "stead_cadnum": "Кадастровый номер участка",
    "stead_type": "Тип участка",
    "stead_type_full": "Полный тип участка",
    "stead": "Участок",
    "house_fias_id": "FIAS дома",
    "house_kladr_id": "КЛАДР дома",
    "house_cadnum": "Кадастровый номер дома",
    "house_flat_count": "Количество помещений",
    "house_type": "Тип дома",
    "house_type_full": "Полный тип дома",
    "house": "Дом",
    "block_type": "Тип корпуса",
    "block_type_full": "Полный тип корпуса",
    "block": "Корпус",
    "entrance": "Подъезд",
    "floor": "Этаж",
    "flat_fias_id": "FIAS помещения",
    "flat_cadnum": "Кадастровый номер помещения",
    "flat_type": "Тип помещения",
    "flat_type_full": "Полный тип помещения",
    "flat": "Помещение",
    "flat_area": "Площадь помещения",
    "square_meter_price": "Цена за м²",
    "flat_price": "Стоимость помещения",
    "room_fias_id": "FIAS комнаты",
    "room_cadnum": "Кадастровый номер комнаты",
    "room_type": "Тип комнаты",
    "room_type_full": "Полный тип комнаты",
    "room": "Комната",
    "postal_box": "Абонентский ящик",
    "fias_id": "FIAS ID",
    "fias_code": "FIAS код",
    "fias_level": "Уровень FIAS",
    "fias_actuality_state": "Статус актуальности FIAS",
    "kladr_id": "КЛАДР ID",
    "geoname_id": "Geoname ID",
    "capital_marker": "Признак столицы",
    "tax_office": "Код налоговой",
    "tax_office_legal": "Код налоговой (юр. лицо)",
    "timezone": "Часовой пояс",
    "geo_lat": "Широта",
    "geo_lon": "Долгота",
    "beltway_hit": "В пределах МКАД",
    "beltway_distance": "Расстояние до МКАД",
    "metro": "Метро",
    "line": "Линия",
    "distance": "Расстояние",
    "divisions": "Подразделения",
    "qc_geo": "Качество геокодирования",
    "qc_complete": "Полнота адреса",
    "qc_house": "Качество номера дома",
    "history_values": "История адресов",
    "unparsed_parts": "Нераспознанные части",
    "phones": "Телефоны",
    "emails": "Email",
    "sites": "Сайты",
    "employee_count": "Численность сотрудников",
}

COMPANY_DATE_FIELDS = {
    "start_date",
    "actuality_date",
    "registration_date",
    "liquidation_date",
    "ogrn_date",
}


def get_company_field_label(key: str) -> str:
    "Возвращает человекочитаемую подпись поля компании по ключу DaData."
    return COMPANY_FIELD_LABELS.get(key, key.replace("_", " ").capitalize())


def has_company_value(value: Any) -> bool:
    "Проверяет, что значение пригодно для отображения (не пусто и не None)."
    if value is None:
        return False
    if isinstance(value, str):
        return value.strip() != ""
    if isinstance(value, (list, tuple, set, dict)):
        return len(value) > 0
    return True


def format_company_timestamp(value: Any) -> str | None:
    "Преобразует unix-метку DaData (секунды/миллисекунды/строка) в дату DD.MM.YYYY HH:MM."
    try:
        if isinstance(value, str):
            cleaned = value.strip()
            if not cleaned or not cleaned.lstrip("-").isdigit():
                return None
            value = int(cleaned)
        elif not isinstance(value, (int, float)):
            return None

        timestamp = float(value)
        if abs(timestamp) > 10_000_000_000:
            timestamp /= 1000

        return datetime.fromtimestamp(timestamp, tz=UTC).strftime("%d.%m.%Y %H:%M")
    except (OverflowError, OSError, ValueError):
        return None


def format_company_scalar(key: str, value: Any) -> Any:
    "Безопасное HTML-форматирование скалярного значения карточки компании."
    if not has_company_value(value):
        return Markup('<span style="color:#8a94a6;">—</span>')

    if key in COMPANY_DATE_FIELDS:
        formatted_date = format_company_timestamp(value)
        if formatted_date:
            return escape(formatted_date)

    if isinstance(value, bool):
        return "Да" if value else "Нет"

    if isinstance(value, float):
        return escape(f"{value:.2f}".rstrip("0").rstrip("."))

    return escape(str(value))


def get_company_item_title(item: Any, index: int) -> str:
    "Подбирает заголовок для элемента вложенного списка (учредители/филиалы)."
    if isinstance(item, dict):
        for path in (
            ("name", "full_with_opf"),
            ("name", "short_with_opf"),
            ("name", "full"),
            ("name", "short"),
            ("data", "city"),
            ("data", "street_with_type"),
        ):
            current: Any = item
            for part in path:
                if not isinstance(current, dict):
                    current = None
                    break
                current = current.get(part)
            if has_company_value(current):
                return str(current)

        for key in ("value", "unrestricted_value", "name", "post", "type", "city", "street_with_type"):
            current = item.get(key)
            if has_company_value(current):
                return str(current)

    return f"Элемент {index}"


def render_company_row(label: str, value_html: Any, is_first: bool = False) -> str:
    "Одна строка таблицы карточки компании (ключ-значение)."
    border = "" if is_first else "border-top:1px solid #e8edf3;"
    return (
        f'<div style="{border}display:grid;grid-template-columns:minmax(220px,280px) minmax(0,1fr);gap:16px;padding:12px 16px;align-items:start;">'
        f'<div style="color:#526071;font-size:13px;font-weight:700;line-height:1.5;">{escape(label)}</div>'
        f'<div style="color:#0f172a;font-size:14px;line-height:1.6;white-space:pre-wrap;word-break:break-word;">{value_html}</div>'
        "</div>"
    )


def render_company_card(title: str, body_html: Any, is_first: bool = False) -> str:
    "Карточка-секция с заголовком для вложенных групп DaData."
    border = "" if is_first else "border-top:1px solid #e8edf3;"
    return (
        f'<div style="{border}padding:14px 16px;background:#fbfcfe;">'
        f'<div style="margin-bottom:12px;color:#0f172a;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;">{escape(title)}</div>'
        f"{body_html}"
        "</div>"
    )


def wrap_company_group(parts: list[str]) -> Any:
    "Оборачивает набор HTML-строк в общий контейнер карточки."
    if not parts:
        return Markup('<div style="padding:12px 16px;color:#8a94a6;">Нет данных</div>')
    return Markup(
        '<div style="border:1px solid #dbe4ee;border-radius:16px;background:#ffffff;overflow:hidden;">'
        + "".join(parts)
        + "</div>"
    )


def render_company_list(items: list[Any]) -> Any:
    "Рендерит список значений: маркированный список для скаляров, карточки для словарей."
    visible_items = [item for item in items if has_company_value(item)]
    if not visible_items:
        return Markup('<span style="color:#8a94a6;">—</span>')

    if all(not isinstance(item, (dict, list, tuple, set)) for item in visible_items):
        points = "".join(
            f'<li style="margin:4px 0;">{format_company_scalar("", item)}</li>'
            for item in visible_items
        )
        return Markup(f'<ul style="margin:0;padding-left:18px;">{points}</ul>')

    cards = []
    for index, item in enumerate(visible_items, start=1):
        title = escape(get_company_item_title(item, index))
        if isinstance(item, dict):
            body: Any = wrap_company_group(render_company_entries(item))
        elif isinstance(item, list):
            body = render_company_list(item)
        else:
            body = Markup(f'<div style="padding:12px 16px;">{format_company_scalar("", item)}</div>')

        cards.append(
            '<div style="border:1px solid #dbe4ee;border-radius:14px;background:#ffffff;overflow:hidden;">'
            f'<div style="padding:10px 14px;background:#f4f7fb;color:#0f172a;font-weight:700;">{title}</div>'
            f"{body}"
            "</div>"
        )

    return Markup('<div style="display:grid;gap:12px;">' + "".join(cards) + "</div>")


def render_company_entries(data: dict[str, Any]) -> list[str]:
    "Рекурсивный обход словаря DaData: возвращает список HTML-блоков карточки."
    parts: list[str] = []
    visible_items = [(key, value) for key, value in data.items() if has_company_value(value)]

    for index, (key, value) in enumerate(visible_items):
        label = get_company_field_label(key)
        is_first = index == 0

        if isinstance(value, dict):
            parts.append(render_company_card(label, wrap_company_group(render_company_entries(value)), is_first=is_first))
            continue

        if isinstance(value, list):
            parts.append(render_company_card(label, render_company_list(value), is_first=is_first))
            continue

        parts.append(render_company_row(label, format_company_scalar(key, value), is_first=is_first))

    return parts


def render_company_summary(company_data: Any) -> Any:
    "Шапка с ключевыми реквизитами компании (ИНН/ОГРН/руководитель/адрес)."
    if not isinstance(company_data, dict):
        return ""

    data = company_data.get("data") or {}
    address = data.get("address") or {}
    management = data.get("management") or {}
    state = data.get("state") or {}

    director = None
    if has_company_value(management.get("name")):
        director = management.get("name")
        if has_company_value(management.get("post")):
            director = f"{director}, {management.get('post')}"

    summary_items = [
        ("Компания", company_data.get("unrestricted_value") or company_data.get("value")),
        ("ИНН", data.get("inn")),
        ("КПП", data.get("kpp")),
        ("ОГРН", data.get("ogrn")),
        ("Статус", state.get("status")),
        ("Руководитель", director),
        ("Адрес", address.get("unrestricted_value") or address.get("value")),
    ]

    visible_items = [(label, value) for label, value in summary_items if has_company_value(value)]
    if not visible_items:
        return ""

    blocks = []
    for label, value in visible_items:
        blocks.append(
            '<div style="padding:14px 16px;border:1px solid #dbe4ee;border-radius:14px;background:linear-gradient(180deg,#ffffff 0%,#f8fbff 100%);">'
            f'<div style="margin-bottom:6px;color:#526071;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;">{escape(label)}</div>'
            f'<div style="color:#0f172a;font-size:14px;line-height:1.6;">{format_company_scalar("", value)}</div>'
            '</div>'
        )

    return Markup('<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;">' + "".join(blocks) + '</div>')


def format_company_data(company_data: Any) -> Any:
    "Полное представление карточки компании DaData: шапка + детали + сырой JSON."
    if not isinstance(company_data, dict) or not company_data:
        return Markup('<div style="padding:16px;border:1px dashed #dbe4ee;border-radius:14px;color:#8a94a6;background:#fbfcfe;">Данные компании не сохранены.</div>')

    summary = render_company_summary(company_data)
    details = wrap_company_group(render_company_entries(company_data))
    raw = format_json_payload(company_data)

    return Markup(
        '<div style="display:grid;gap:16px;">'
        + (f'<div>{summary}</div>' if summary else '')
        + f'<div>{details}</div>'
        + '<details style="border:1px solid #dbe4ee;border-radius:14px;background:#ffffff;padding:12px 16px;">'
        + '<summary style="cursor:pointer;font-weight:700;color:#0f172a;">Показать сырой JSON</summary>'
        + f'<div style="margin-top:12px;">{raw}</div>'
        + '</details>'
        + '</div>'
    )
