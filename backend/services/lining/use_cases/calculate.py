"Use case: расчёт показателей оценки крепи по входным данным эксперта."
from schemas.lining import (
    LiningBlockDto,
    LiningCalculateRequest,
    LiningCalculateResponse,
    LiningElementResultDto,
)
from services.lining.calculator import ElementSpec, FactorInput, calculate
from services.lining.constants import CRITERIA_WEIGHTS, ELEMENTS, GROUP_TITLES
from services.lining.repository import LiningRepository


class CalculateLiningUseCase:
    "Сопоставляет ввод эксперта со справочником факторов и считает показатели и срок службы."

    def __init__(self, repo: LiningRepository) -> None:
        self.repo = repo

    async def execute(self, request: LiningCalculateRequest) -> LiningCalculateResponse:
        "Запускает основной сценарий use case. Фактор «Нет (без оценки)» (None) в расчёт не идёт."
        factors = await self.repo.list_factors(request.profile)
        inputs: list[FactorInput] = []
        for factor in factors:
            selected = request.selections.get(factor.code, factor.default_value)
            if selected is None:
                continue
            inputs.append(FactorInput(group=factor.group_code, score=selected, max_score=factor.max_score))

        elements = [ElementSpec(e["id"], e["name"], e["lam_sub"], e["t_sub"]) for e in ELEMENTS]
        element_categories = {int(k): int(v) for k, v in request.element_categories.items()}
        expert_scores = {int(k): int(v) for k, v in request.expert_scores.items()}
        result = calculate(inputs, elements, element_categories, request.service_life_years, CRITERIA_WEIGHTS, expert_scores)

        return LiningCalculateResponse(
            profile=request.profile,
            r0=LiningBlockDto(
                group="R0",
                title=GROUP_TITLES["R0"],
                value=round(result.r0.value, 1),
                category=result.r0.category,
                sum_score=round(result.r0.sum_score, 4),
                sum_max=round(result.r0.sum_max, 4),
            ),
            blocks=[
                LiningBlockDto(
                    group=block.group,
                    title=GROUP_TITLES.get(block.group, block.group),
                    value=round(block.value, 1),
                    category=block.category,
                    sum_score=round(block.sum_score, 4),
                    sum_max=round(block.sum_max, 4),
                )
                for block in result.blocks
            ],
            overall_r=round(result.overall_r, 1),
            overall_r_category=result.overall_r_category,
            r_int=round(result.r_int, 1),
            r_int_category=result.r_int_category,
            elements=[
                LiningElementResultDto(
                    element_id=element.element_id,
                    name=element.name,
                    category=element.category,
                    reliability=element.reliability,
                    lam=round(element.lam, 4),
                    t_capital=round(element.t_capital, 3) if element.t_capital is not None else None,
                    t_emergency=round(element.t_emergency, 1) if element.t_emergency is not None else None,
                )
                for element in result.elements
            ],
            final_capital=round(result.final_capital, 1),
            final_emergency=round(result.final_emergency, 1),
            beta=round(result.beta, 2),
        )
