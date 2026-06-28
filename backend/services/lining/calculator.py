"Движок оценки крепи: показатели риска, постоянная износа, срок службы, экспертная надёжность. Чистые функции, без I/O."
import math
from dataclasses import dataclass

RISK_LEVELS: list[tuple[float, float, str]] = [
    (0.0, 10.0, "Низкий уровень опасности (риска)"),
    (10.1, 20.0, "Умеренный уровень опасности (риска)"),
    (20.1, 33.0, "Средний уровень опасности (риска)"),
    (33.1, 50.0, "Значительный уровень опасности (риска)"),
    (50.1, 90.0, "Высокий уровень опасности (риска)"),
    (90.1, 100.0, "Чрезвычайно высокий уровень опасности (риска)"),
]

DAMAGE_RELIABILITY: dict[int, float] = {1: 1.0, 2: 0.95, 3: 0.85, 4: 0.75, 5: 0.65}
CAPITAL_COEFF = 0.16
EMERGENCY_COEFF = 0.22


def risk_category(value: float) -> str:
    "Лингвистический уровень риска по проценту."
    if value != value:  # NaN
        return "Не определено"
    for low, high, level in RISK_LEVELS:
        if (low - 1e-9) <= value <= (high + 1e-9):
            return level
    return "Категория не определена"


@dataclass
class FactorInput:
    "Фактор риска R0/R2/R7: группа, выбранное значение (None — без оценки) и максимум."
    group: str
    score: float | None
    max_score: float


@dataclass
class ElementSpec:
    "Описание элемента крепи: id 1..14, название, подстрочные символы λ и t."
    element_id: int
    name: str
    lam_sub: str
    t_sub: str


@dataclass
class BlockResult:
    "Показатель опасности по одному блоку факторов."
    group: str
    value: float
    category: str
    sum_score: float
    sum_max: float


@dataclass
class ElementResult:
    "Результат по элементу крепи: категория состояния, λ и сроки службы (None — «Не требует»)."
    element_id: int
    name: str
    lam_sub: str
    t_sub: str
    category: int
    reliability: float
    lam: float
    t_capital: float | None
    t_emergency: float | None


@dataclass
class LiningResult:
    "Итог: показатели риска, коэффициенты, постоянная износа и срок службы по элементам, экспертная надёжность."
    r0: BlockResult
    blocks: list[BlockResult]
    overall_r: float
    overall_r_category: str
    r_int: float
    r_int_category: str
    r1: float
    r2: float
    r3: float
    elements: list[ElementResult]
    final_capital: float
    final_emergency: float
    beta: float


def calculate(
    factors: list[FactorInput],
    elements: list[ElementSpec],
    element_categories: dict[int, int],
    service_life_years: float,
    criteria_weights: dict[int, float],
    expert_scores: dict[int, int],
) -> LiningResult:
    "Считает проценты риска R0/R2/R7, λ и сроки службы каждого элемента, итоговые сроки и экспертную β."
    r0_score = sum((f.score or 0.0) for f in factors if f.group == "R0")
    r0_max = sum(f.max_score for f in factors if f.group == "R0")

    rx_score: dict[str, float] = {}
    rx_max: dict[str, float] = {}
    for factor in factors:
        if factor.group == "R0":
            continue
        rx_score[factor.group] = rx_score.get(factor.group, 0.0) + (factor.score or 0.0)
        rx_max[factor.group] = rx_max.get(factor.group, 0.0) + factor.max_score

    r0_pct = r0_score / r0_max * 100 if r0_max > 1e-9 else 0.0
    r0 = BlockResult("R0", r0_pct, risk_category(r0_pct), r0_score, r0_max)

    blocks: list[BlockResult] = []
    for group in sorted(rx_score, key=lambda g: int(g[1:])):
        denominator = rx_max[group] + r0_max
        pct = (rx_score[group] + r0_score) / denominator * 100 if denominator > 1e-9 else 0.0
        blocks.append(BlockResult(group, pct, risk_category(pct), rx_score[group], rx_max[group]))

    overall_r = max([r0.value, *(b.value for b in blocks)])
    int_denominator = sum(rx_max.values()) + r0_max
    r_int = (sum(rx_score.values()) + r0_score) / int_denominator * 100 if int_denominator > 1e-9 else 0.0

    pct_by_group = {b.group: b.value for b in blocks}
    epsilon = 1e-6
    r1 = min(r0_pct / 100.0, 1.0 - epsilon)
    r2 = min(pct_by_group.get("R2", 0.0) / 100.0, 1.0 - epsilon)
    r3 = min(pct_by_group.get("R7", 0.0) / 100.0, 1.0 - epsilon)
    life_denominator = max(service_life_years, epsilon) * (1.0 - r1) * (1.0 - r2) * (1.0 - r3)

    element_results: list[ElementResult] = []
    for spec in elements:
        category = int(element_categories.get(spec.element_id, 1) or 1)
        reliability = DAMAGE_RELIABILITY.get(category, 1.0)
        lam = -math.log(reliability) / life_denominator if reliability > 0 and life_denominator > 0 else 0.0
        t_capital = CAPITAL_COEFF / lam if lam > 0 else None
        t_emergency = EMERGENCY_COEFF / lam if lam > 0 else None
        element_results.append(ElementResult(
            element_id=spec.element_id,
            name=spec.name,
            lam_sub=spec.lam_sub,
            t_sub=spec.t_sub,
            category=category,
            reliability=reliability,
            lam=lam,
            t_capital=t_capital,
            t_emergency=t_emergency,
        ))

    finite_capital = [e.t_capital for e in element_results if e.t_capital and e.t_capital > 0]
    finite_emergency = [e.t_emergency for e in element_results if e.t_emergency and e.t_emergency > 0]
    final_capital = min(finite_capital) if finite_capital else 0.0
    final_emergency = min(finite_emergency) if finite_emergency else 0.0

    beta = sum(weight * expert_scores.get(cid, 1) for cid, weight in criteria_weights.items()) / 5.0

    return LiningResult(
        r0=r0,
        blocks=blocks,
        overall_r=overall_r,
        overall_r_category=risk_category(overall_r),
        r_int=r_int,
        r_int_category=risk_category(r_int),
        r1=r1,
        r2=r2,
        r3=r3,
        elements=element_results,
        final_capital=final_capital,
        final_emergency=final_emergency,
        beta=beta,
    )
