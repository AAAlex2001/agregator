"""Справочники техдиагностирования: виды НК и объекты контроля по СДАНК-02-2020."""
from dataclasses import dataclass

from schemas.tech_diag import TechDiagCatalogOption, TechDiagCatalogsResponse


@dataclass(frozen=True)
class CatalogItem:
    "Позиция справочника: код для хранения и название для интерфейса."
    code: str
    title: str


NDT_METHODS: tuple[CatalogItem, ...] = (
    CatalogItem("AE", "Акустико-эмиссионный (АЭ)"),
    CatalogItem("EC", "Электромагнитный контроль (ЭК)"),
    CatalogItem("LT", "Контроль течеисканием (ПВТ)"),
    CatalogItem("MT", "Магнитопорошковый контроль (МК)"),
    CatalogItem("ET", "Вихретоковый (ВК)"),
    CatalogItem("PT", "Контроль с применением проникающей жидкости (ПВК)"),
    CatalogItem("RT", "Радиографический контроль (РК)"),
    CatalogItem("UT", "Ультразвуковой контроль (УК)"),
    CatalogItem("VT", "Визуальный и измерительный контроль (ВИК)"),
    CatalogItem("VD", "Вибродиагностический (ВД)"),
)

CONTROL_OBJECTS: tuple[CatalogItem, ...] = (
    CatalogItem("1", "Оборудование, работающее под избыточным давлением"),
    CatalogItem("2", "Системы газоснабжения (газораспределения)"),
    CatalogItem("3", "Подъёмные сооружения"),
    CatalogItem("4", "Объекты горнорудной промышленности"),
    CatalogItem("5", "Объекты угольной промышленности"),
    CatalogItem("6", "Оборудование нефтяной и газовой промышленности"),
    CatalogItem("7", "Оборудование металлургической промышленности"),
    CatalogItem("8", "Оборудование взрывопожароопасных и химически опасных производств"),
    CatalogItem("9", "Объекты железнодорожного транспорта"),
    CatalogItem("10", "Оборудование для хранения и переработки растительного сырья"),
    CatalogItem("11", "Здания и сооружения (строительные объекты)"),
    CatalogItem("12", "Оборудование электроэнергетики"),
)


def build_tech_diag_catalogs() -> TechDiagCatalogsResponse:
    """Собирает справочники направления для анкет."""
    return TechDiagCatalogsResponse(
        methods=[TechDiagCatalogOption.model_validate(item) for item in NDT_METHODS],
        control_objects=[TechDiagCatalogOption.model_validate(item) for item in CONTROL_OBJECTS],
    )
