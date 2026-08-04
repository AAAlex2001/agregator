"Таксономия РТН: подписи enum-справочников для фильтров каталога разъяснений."

from enum import Enum

from models.rtn_clarification import (
    Activity,
    ClarificationStatus,
    DocumentType,
    Industry,
    ObjectType,
    OversightArea,
)

OVERSIGHT_AREA_LABELS: dict[OversightArea, str] = {
    OversightArea.INDUSTRIAL_SAFETY: "Федеральный государственный надзор в области промышленной безопасности",
    OversightArea.HYDRO_SAFETY: "Федеральный государственный надзор в области безопасности гидротехнических сооружений",
    OversightArea.NUCLEAR: "Федеральный государственный надзор в области использования атомной энергии",
    OversightArea.ENERGY: "Федеральный государственный энергетический надзор",
    OversightArea.MINING: "Федеральный государственный горный надзор",
    OversightArea.CONSTRUCTION: "Федеральный государственный строительный надзор",
    OversightArea.SRO: "Надзор за деятельностью саморегулируемых организаций (СРО)",
    OversightArea.LICENSING: "Лицензионный контроль (надзор)",
}

INDUSTRY_LABELS: dict[Industry, str] = {
    Industry.COAL: "Объекты угольной промышленности",
    Industry.MINING_UNDERGROUND: "Объекты горнорудной и нерудной промышленности, объекты подземного строительства",
    Industry.OIL_GAS_EXTRACTION: "Объекты нефтегазодобывающей промышленности",
    Industry.OIL_REFINING: (
        "Объекты нефтехимической, нефтегазоперерабатывающей промышленности "
        "и объекты нефтепродуктообеспечения"
    ),
    Industry.PIPELINE_GAS_STORAGE: "Объекты магистрального трубопроводного транспорта и подземного хранения газа",
    Industry.GAS_DISTRIBUTION: "Объекты газораспределения и газопотребления",
    Industry.METALLURGY: "Металлургические и коксохимические производства и объекты",
    Industry.CHEMICAL: "Производства и объекты химического комплекса",
    Industry.DEFENSE: "Производства и объекты оборонно-промышленного комплекса",
    Industry.HAZMAT_TRANSPORT: "Объекты (участки) транспортирования опасных веществ",
    Industry.PLANT_MATERIAL_STORAGE: "Взрывопожароопасные объекты хранения и переработки растительного сырья",
    Industry.EXPLOSIVES: (
        "Объекты, связанные с производством, хранением и применением "
        "взрывчатых материалов промышленного назначения"
    ),
    Industry.PRESSURE_EQUIPMENT: "Объекты, на которых используется оборудование, работающее под избыточным давлением",
    Industry.LIFTING_MECHANISMS: (
        "Объекты, на которых используются стационарно установленные "
        "грузоподъемные механизмы и подъемные сооружения"
    ),
    Industry.SURVEYING_SUBSOIL: "Маркшейдерские работы и безопасность недропользования",
    Industry.HAZARD_LIFTS: (
        "Опасные объекты (лифты, подъемные платформы для инвалидов, "
        "пассажирские конвейеры, эскалаторы вне метрополитенов)"
    ),
    Industry.POWER_PLANTS: "Электрические станции, котельные, электрические и тепловые установки и сети",
    Industry.HYDRO_STRUCTURES: "Гидротехнические сооружения",
    Industry.CONSTRUCTION_OBJECTS: "Строительство, реконструкция объектов капитального строительства",
    Industry.SRO_CONSTRUCTION: (
        "Деятельность саморегулируемых организаций в области инженерных изысканий, "
        "архитектурно-строительном проектировании, строительстве, реконструкции, "
        "капитальном ремонте, сносе объектов капитального строительства"
    ),
    Industry.SRO_ENERGY_AUDIT: "Деятельность саморегулируемых организаций в области энергетического обследования",
}

ACTIVITY_LABELS: dict[Activity, str] = {
    Activity.LICENSING: "Лицензионно-разрешительная",
    Activity.EXPERT: "Экспертная",
    Activity.OPO_REGISTRY: "Регистрация объектов в государственном реестре ОПО",
    Activity.DECLARATIONS: "Декларации промышленной безопасности",
    Activity.ATTESTATION_INDUSTRIAL: "Аттестация экспертов в области промышленной безопасности",
    Activity.ATTESTATION_HYDRO: "Аттестация экспертов в области безопасности гидротехнических сооружений",
    Activity.ATTESTATION_COMBINED: (
        "Аттестация в области промышленной безопасности, по вопросам безопасности "
        "гидротехнических сооружений, безопасности в сфере электроэнергетики"
    ),
}

OBJECT_TYPE_LABELS: dict[ObjectType, str] = {
    ObjectType.GAS_NETWORKS: "Сети газопотребления и газораспределения",
    ObjectType.LIFTING_STRUCTURES: "Подъемные сооружения (ПС)",
    ObjectType.PRESSURE_EQUIPMENT: "Оборудование, работающее под избыточным давлением",
    ObjectType.POWER_OBJECTS: "Энергетические объекты",
    ObjectType.SUPPORT_STRUCTURES: "Опорные конструкции, здания и сооружения на ОПО",
    ObjectType.SAFETY_SYSTEMS: "Системы и средства обеспечения безопасности",
    ObjectType.TECHNICAL_DEVICES: "Технические устройства",
}

DOCUMENT_TYPE_LABELS: dict[DocumentType, str] = {
    DocumentType.OFFICIAL_CLARIFICATION: "Официальные разъяснения",
    DocumentType.INFO_LETTER: "Информационное письмо",
    DocumentType.RESPONSE_TO_REQUEST: "Ответ на обращение организации",
}

STATUS_LABELS: dict[ClarificationStatus, str] = {
    ClarificationStatus.ACTIVE: "Актуально",
    ClarificationStatus.EXPIRED: "Утратило силу",
}


def serialize_options[E: Enum](labels: dict[E, str]) -> list[dict[str, str]]:
    "Enum-подписи -> список {value, label} в порядке объявления enum, для отдачи в API фильтров."
    return [{"value": member.value, "label": label} for member, label in labels.items()]


def build_taxonomy() -> dict[str, list[dict[str, str]]]:
    "Полный справочник фильтров каталога «Ростехнадзор отвечает» одним объектом для фронта."
    return {
        "oversight_areas": serialize_options(OVERSIGHT_AREA_LABELS),
        "industries": serialize_options(INDUSTRY_LABELS),
        "activities": serialize_options(ACTIVITY_LABELS),
        "object_types": serialize_options(OBJECT_TYPE_LABELS),
        "document_types": serialize_options(DOCUMENT_TYPE_LABELS),
        "statuses": serialize_options(STATUS_LABELS),
    }
