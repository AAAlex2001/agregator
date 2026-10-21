"""Справочник Блиц-эксперта: области аттестации, объекты экспертизы, виды договора и сроки.

Коды совпадают с удостоверениями в анкете эксперта: область «Э12», объект «КЛ/ТП».
В областях с раздельной документацией вместо «КЛ/ТП» выдаются отдельно «КЛ» и «ТП».
Категория эксперта по классу опасности: первая работает с любым классом, вторая — со II–IV,
третья — с III и IV, поэтому по классу считается минимально достаточная категория.
"""

from dataclasses import dataclass
from enum import StrEnum


class ContractKind(StrEnum):
    """Предмет договора: от него зависит пункт 1.1 договора."""

    JUSTIFICATION = "justification"
    REEQUIPMENT = "reequipment"
    CONSERVATION = "conservation"
    LIQUIDATION = "liquidation"
    DECLARATION = "declaration"
    TECHNICAL_DEVICE = "technical_device"
    BUILDING = "building"
    AUDIT = "audit"


class Deadline(StrEnum):
    """Пожелание заказчика по сроку."""

    TODAY = "today"
    THREE_DAYS = "three_days"
    WEEK = "week"
    ANY = "any"


@dataclass(frozen=True)
class ExpertiseObject:
    """Объект экспертизы: код с удостоверения, название и пояснение для заказчика."""

    code: str
    title: str
    description: str
    kinds: tuple[ContractKind, ...]


@dataclass(frozen=True)
class Area:
    """Область аттестации и объекты, по которым она выдаётся."""

    code: str
    title: str
    objects: tuple[str, ...]


OBJECTS = (
    ExpertiseObject(
        "КЛ",
        "Документация на консервацию и ликвидацию",
        "Проект консервации или ликвидации опасного производственного объекта",
        (ContractKind.CONSERVATION, ContractKind.LIQUIDATION),
    ),
    ExpertiseObject(
        "ТП",
        "Документация на техническое перевооружение",
        "Проект замены или модернизации оборудования на действующем объекте",
        (ContractKind.REEQUIPMENT,),
    ),
    ExpertiseObject(
        "КЛ/ТП",
        "Документация на консервацию, ликвидацию и техперевооружение",
        "Проекты консервации, ликвидации и технического перевооружения одной областью",
        (ContractKind.CONSERVATION, ContractKind.LIQUIDATION, ContractKind.REEQUIPMENT),
    ),
    ExpertiseObject(
        "Д",
        "Декларация промышленной безопасности",
        "Проверка декларации для объектов I и II класса опасности",
        (ContractKind.DECLARATION,),
    ),
    ExpertiseObject(
        "ОБ",
        "Обоснование безопасности",
        "Экспертиза обоснования, когда объект отступает от требований правил",
        (ContractKind.JUSTIFICATION,),
    ),
    ExpertiseObject(
        "ТУ",
        "Технические устройства",
        "Оборудование, применяемое на опасном производственном объекте",
        (ContractKind.TECHNICAL_DEVICE,),
    ),
    ExpertiseObject(
        "ЗС",
        "Здания и сооружения",
        "Здания и сооружения на опасном производственном объекте",
        (ContractKind.BUILDING,),
    ),
)

SPLIT_DOCS = ("КЛ", "ТП", "ТУ", "ЗС", "Д", "ОБ")
JOINED_DOCS = ("КЛ/ТП", "ТУ", "ЗС", "Д", "ОБ")
JOINED_DOCS_NO_DECLARATION = ("КЛ/ТП", "ТУ", "ЗС", "ОБ")

AREAS = (
    Area("Э1", "ОПО угольной, сланцевой и торфяной промышленности", JOINED_DOCS_NO_DECLARATION),
    Area("Э2", "ОПО горнорудной и нерудной промышленности", JOINED_DOCS),
    Area("Э3.1", "ОПО, где обращаются взрывчатые материалы промышленного назначения", JOINED_DOCS),
    Area(
        "Э3.2",
        "ОПО, где обращаются взрывчатые вещества, порох, ракетные топлива и боеприпасы",
        JOINED_DOCS,
    ),
    Area("Э4", "ОПО нефтегазодобывающего комплекса", SPLIT_DOCS),
    Area("Э5", "ОПО магистрального трубопроводного транспорта", SPLIT_DOCS),
    Area("Э6", "ОПО геологоразведочных и геофизических работ", JOINED_DOCS),
    Area("Э7", "ОПО химической, нефтехимической и нефтеперерабатывающей промышленности", SPLIT_DOCS),
    Area("Э8", "ОПО нефтепродуктообеспечения", SPLIT_DOCS),
    Area("Э9", "Химически опасные ОПО систем водоподготовки", JOINED_DOCS),
    Area("Э10", "ОПО пищевой и масложировой промышленности", JOINED_DOCS),
    Area("Э11", "ОПО газоснабжения", SPLIT_DOCS),
    Area(
        "Э12",
        "ОПО тепло- и электроэнергетики, оборудование под давлением более 0,07 МПа",
        JOINED_DOCS_NO_DECLARATION,
    ),
    Area("Э13", "ОПО металлургической промышленности", JOINED_DOCS),
    Area("Э14.1", "ОПО с грузовыми подвесными канатными дорогами", JOINED_DOCS_NO_DECLARATION),
    Area("Э14.2", "ОПО с пассажирскими канатными дорогами и фуникулёрами", JOINED_DOCS_NO_DECLARATION),
    Area("Э14.3", "ОПО с эскалаторами в метрополитенах", JOINED_DOCS_NO_DECLARATION),
    Area("Э14.4", "ОПО со стационарными грузоподъёмными механизмами", JOINED_DOCS_NO_DECLARATION),
    Area("Э15", "ОПО хранения и переработки растительного сырья", JOINED_DOCS_NO_DECLARATION),
)

CONTRACT_SUBJECTS = {
    ContractKind.JUSTIFICATION: "обоснования безопасности ОПО",
    ContractKind.REEQUIPMENT: "документации на техническое перевооружение ОПО",
    ContractKind.CONSERVATION: "документации на консервацию ОПО",
    ContractKind.LIQUIDATION: "документации на ликвидацию ОПО",
    ContractKind.DECLARATION: "декларации промышленной безопасности",
    ContractKind.TECHNICAL_DEVICE: "технического устройства, применяемого на ОПО",
    ContractKind.BUILDING: "здания (сооружения) на ОПО",
    ContractKind.AUDIT: "опасных производственных объектов",
}

CONTRACT_TITLES = {
    ContractKind.JUSTIFICATION: "Обоснование безопасности",
    ContractKind.REEQUIPMENT: "Техническое перевооружение",
    ContractKind.CONSERVATION: "Консервация",
    ContractKind.LIQUIDATION: "Ликвидация",
    ContractKind.DECLARATION: "Декларация",
    ContractKind.TECHNICAL_DEVICE: "Техническое устройство",
    ContractKind.BUILDING: "Здание или сооружение",
}

AUDIT_TITLE = "Аудит СУПБ"

DEADLINE_TITLES = {
    Deadline.TODAY: "Сегодня",
    Deadline.THREE_DAYS: "До 3 дней",
    Deadline.WEEK: "Неделя",
    Deadline.ANY: "Неважно",
}

DEADLINE_DAYS = {Deadline.TODAY: 1, Deadline.THREE_DAYS: 3, Deadline.WEEK: 5, Deadline.ANY: 5}

HAZARD_CLASS_CATEGORY = {1: 1, 2: 2, 3: 3, 4: 3}
CATEGORIES = (1, 2, 3)

AREA_BY_CODE = {area.code: area for area in AREAS}
OBJECT_BY_CODE = {item.code: item for item in OBJECTS}
ALL_KINDS = tuple(kind for kind in ContractKind if kind != ContractKind.AUDIT)
JOINED_OBJECTS = frozenset({"КЛ", "ТП", "КЛ/ТП"})


def kinds_for(object_code: str | None) -> tuple[ContractKind, ...]:
    """Виды договора, подходящие объекту. Объект неизвестен — подходит любой."""

    item = OBJECT_BY_CODE.get(object_code or "")

    return item.kinds if item else ALL_KINDS


def object_covers(certificate_object: str, order_object: str) -> bool:
    """Подходит ли объект удостоверения объекту заявки. «КЛ/ТП» покрывает «КЛ» и «ТП» и наоборот."""

    if certificate_object == order_object:
        return True

    pair = {certificate_object, order_object}

    return pair <= JOINED_OBJECTS and "КЛ/ТП" in pair
