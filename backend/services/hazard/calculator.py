"Движок оценки опасности аварий (метод индексов риска). Чистые функции, без I/O."
from dataclasses import dataclass

RISK_LEVELS: list[tuple[float, float, str]] = [
    (0.0, 10.0, "Низкий уровень опасности (риска)"),
    (10.1, 20.0, "Умеренный уровень опасности (риска)"),
    (20.1, 33.0, "Средний уровень опасности (риска)"),
    (33.1, 50.0, "Значительный уровень опасности (риска)"),
    (50.1, 90.0, "Высокий уровень опасности (риска)"),
    (90.1, 100.0, "Чрезвычайно высокий уровень опасности (риска)"),
]


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
    "Фактор для расчёта: группа R0..R9, выбранное значение (None — без оценки) и максимум."
    group: str
    score: float | None
    max_score: float


@dataclass
class BlockResult:
    "Показатель опасности по одному блоку факторов."
    group: str
    value: float
    category: str
    sum_score: float
    sum_max: float


@dataclass
class HazardResult:
    "Итог расчёта: человеческий фактор, блоки по видам аварий, общий и интегральный показатели."
    r0: BlockResult
    blocks: list[BlockResult]
    overall_r: float
    overall_r_category: str
    r_int: float
    r_int_category: str


def calculate(factors: list[FactorInput]) -> HazardResult:
    "Считает R0, Rx по блокам, R=max(Rx) и интегральный Rint с категориями. None в score → 0."
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

    overall_r = max((b.value for b in blocks), default=0.0)
    int_denominator = sum(rx_max.values()) + r0_max
    r_int = (sum(rx_score.values()) + r0_score) / int_denominator * 100 if int_denominator > 1e-9 else 0.0

    return HazardResult(
        r0=r0,
        blocks=blocks,
        overall_r=overall_r,
        overall_r_category=risk_category(overall_r),
        r_int=r_int,
        r_int_category=risk_category(r_int),
    )
