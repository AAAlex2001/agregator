"Схемы оценки крепи: справочник факторов и элементов, запрос расчёта/отчёта и результаты."
from datetime import datetime

from pydantic import BaseModel, Field


class LiningOptionDto(BaseModel):
    "Вариант ответа фактора."
    value: float | None = None
    label: str


class LiningFactorDto(BaseModel):
    "Фактор риска с вариантами выбора."
    code: str
    group: str
    name: str
    max_score: float
    default_value: float | None = None
    options: list[LiningOptionDto] = Field(default_factory=list)


class LiningGroupDto(BaseModel):
    "Группа факторов риска (R0/R2/R7) с заголовком."
    group: str
    title: str
    factors: list[LiningFactorDto] = Field(default_factory=list)


class LiningElementDto(BaseModel):
    "Элемент крепи: выбор категории состояния 1..5."
    id: int
    group: str
    name: str


class LiningDamageCategoryDto(BaseModel):
    "Категория технического состояния: относительная надёжность и описание."
    id: int
    reliability: float
    epsilon: float
    description: str


class LiningCriterionDto(BaseModel):
    "Критерий экспертной оценки надёжности с удельным весом."
    id: int
    section: str
    name: str
    weight: float


class LiningCatalogResponse(BaseModel):
    "Полный справочник инструмента: факторы, элементы, категории повреждений, экспертные критерии."
    profile: str
    groups: list[LiningGroupDto] = Field(default_factory=list)
    elements: list[LiningElementDto] = Field(default_factory=list)
    element_group_titles: dict[str, str] = Field(default_factory=dict)
    damage_categories: list[LiningDamageCategoryDto] = Field(default_factory=list)
    expert_criteria: list[LiningCriterionDto] = Field(default_factory=list)
    expert_score_labels: dict[int, str] = Field(default_factory=dict)


class LiningCalculateRequest(BaseModel):
    "Запрос расчёта оценки крепи: факторы, категории элементов, срок эксплуатации, экспертные баллы."
    profile: str = Field("rudnik")
    selections: dict[str, float | None] = Field(default_factory=dict)
    element_categories: dict[str, int] = Field(default_factory=dict)
    service_life_years: float = 5.0
    expert_scores: dict[str, int] = Field(default_factory=dict)


class LiningReportRequest(LiningCalculateRequest):
    "Запрос PDF-отчёта: расчёт + название и редактируемая шапка документа."
    report_name: str = "Оценка крепи горной выработки"
    author: str = ""
    intro_line1: str = ""
    intro_line2: str = ""
    intro_line3: str = ""
    justification: str = ""
    manufacturer: str = ""


class LiningBlockDto(BaseModel):
    "Показатель опасности по блоку: процент и лингвистическая категория."
    group: str
    title: str
    value: float
    category: str
    sum_score: float
    sum_max: float


class LiningElementResultDto(BaseModel):
    "Результат по элементу: категория, постоянная износа λ и срок службы (None — «Не требует»)."
    element_id: int
    name: str
    category: int
    reliability: float
    lam: float
    t_capital: float | None = None
    t_emergency: float | None = None


class LiningCalculateResponse(BaseModel):
    "Результат расчёта: показатели риска, постоянная износа и срок службы по элементам, экспертная надёжность."
    profile: str
    r0: LiningBlockDto
    blocks: list[LiningBlockDto] = Field(default_factory=list)
    overall_r: float
    overall_r_category: str
    r_int: float
    r_int_category: str
    elements: list[LiningElementResultDto] = Field(default_factory=list)
    final_capital: float
    final_emergency: float
    beta: float


class LiningReportBlock(BaseModel):
    "Показатель блока в снимке отчёта (для карточки истории)."
    group: str
    title: str
    value: float
    category: str


class LiningReportItem(BaseModel):
    "Карточка сохранённого отчёта в истории эксперта."
    id: int
    name: str
    overall_r: float
    overall_category: str
    final_capital: float
    final_emergency: float
    blocks: list[LiningReportBlock] = Field(default_factory=list)
    created_at: datetime

    class Config:
        from_attributes = True


class LiningReportListResponse(BaseModel):
    "История отчётов эксперта."
    items: list[LiningReportItem] = Field(default_factory=list)
