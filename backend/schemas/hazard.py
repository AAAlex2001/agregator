"Схемы оценки опасности аварий: справочник факторов, запрос расчёта и результат."
from datetime import datetime

from pydantic import BaseModel, Field


class HazardOptionDto(BaseModel):
    "Вариант ответа фактора."
    value: float | None = None
    label: str


class HazardFactorDto(BaseModel):
    "Фактор справочника с вариантами выбора."
    code: str
    group: str
    name: str
    max_score: float
    default_value: float | None = None
    options: list[HazardOptionDto] = Field(default_factory=list)


class HazardGroupDto(BaseModel):
    "Группа факторов (вид аварии) с заголовком."
    group: str
    title: str
    factors: list[HazardFactorDto] = Field(default_factory=list)


class HazardCatalogResponse(BaseModel):
    "Полный справочник факторов для профиля, сгруппированный по видам аварий."
    profile: str
    groups: list[HazardGroupDto] = Field(default_factory=list)


class HazardCalculateRequest(BaseModel):
    "Запрос расчёта: профиль и выбранные значения по коду фактора (None — без оценки)."
    profile: str = Field("rudnik")
    selections: dict[str, float | None] = Field(default_factory=dict)


class HazardReportRequest(HazardCalculateRequest):
    "Запрос PDF-отчёта: расчёт + название (для истории и имени файла)."
    report_name: str = "Оценка опасности аварий"


class HazardBlockDto(BaseModel):
    "Показатель опасности по блоку: процент и лингвистическая категория."
    group: str
    title: str
    value: float
    category: str
    sum_score: float
    sum_max: float


class HazardCalculateResponse(BaseModel):
    "Результат расчёта: человеческий фактор, блоки, общий и интегральный показатели."
    profile: str
    r0: HazardBlockDto
    blocks: list[HazardBlockDto] = Field(default_factory=list)
    overall_r: float
    overall_r_category: str
    r_int: float
    r_int_category: str


class HazardReportBlock(BaseModel):
    "Показатель блока в снимке отчёта (для карточки истории)."
    group: str
    title: str
    value: float
    category: str


class HazardReportItem(BaseModel):
    "Карточка сохранённого отчёта в истории эксперта."
    id: int
    name: str
    profile: str
    overall_r: float
    overall_category: str
    blocks: list[HazardReportBlock] = Field(default_factory=list)
    created_at: datetime

    class Config:
        from_attributes = True


class HazardReportListResponse(BaseModel):
    "История отчётов эксперта."
    items: list[HazardReportItem] = Field(default_factory=list)
