"""Справочник экологии: виды разрабатываемой документации и работ."""
from dataclasses import dataclass

from schemas.ecology import EcologyCatalogOption, EcologyCatalogsResponse


@dataclass(frozen=True)
class CatalogItem:
    "Позиция справочника: код для хранения и название для интерфейса."
    code: str
    title: str


ECOLOGY_WORK_TYPES: tuple[CatalogItem, ...] = (
    CatalogItem("КЭР", "Комплексное экологическое разрешение"),
    CatalogItem("ПНООЛР", "Проект нормативов образования отходов и лимитов на их размещение"),
    CatalogItem("НДВ", "Проект нормативов допустимых выбросов"),
    CatalogItem("СЗЗ", "Проект санитарно-защитных зон"),
    CatalogItem("ПЭК", "Осуществление производственного экологического контроля"),
    CatalogItem("НДС", "Проект нормативов допустимых сбросов"),
    CatalogItem("ОРО", "Мониторинг объектов размещения отходов"),
    CatalogItem("РППВО", "Получение решения на право пользования водным объектом"),
    CatalogItem("НВОС_П", "Постановка на учёт объекта негативного воздействия на окружающую среду"),
    CatalogItem("НВОС_С", "Снятие с учёта объекта негативного воздействия на окружающую среду"),
    CatalogItem("ПО", "Подготовка паспорта отходов"),
    CatalogItem("ВРИ", "Разработка внутренних регламентов и инструкций"),
    CatalogItem("ОФ", "Создание отчётных форм: 2-ТП (отходы), 2-ТП (воздух), 2-ТП (водхоз), 4-ОС, отчёт по ПЭК"),
)

ECOLOGY_WORK_TYPE_TITLES = {item.code: item.title for item in ECOLOGY_WORK_TYPES}


def build_ecology_catalogs() -> EcologyCatalogsResponse:
    """Собирает справочник направления для анкет и заявки."""
    return EcologyCatalogsResponse(
        work_types=[EcologyCatalogOption.model_validate(item) for item in ECOLOGY_WORK_TYPES],
    )
