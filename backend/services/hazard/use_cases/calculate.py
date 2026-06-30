"Use case: расчёт показателей опасности по выбранным значениям факторов."
from schemas.hazard import HazardBlockDto, HazardCalculateRequest, HazardCalculateResponse
from services.hazard.calculator import FactorInput, calculate
from services.hazard.constants import GROUP_TITLES
from services.hazard.repository import HazardRepository


class CalculateHazardUseCase:
    "Сопоставляет выбор эксперта с его набором факторов и считает показатели риска."

    def __init__(self, repo: HazardRepository) -> None:
        self.repo = repo

    async def execute(self, request: HazardCalculateRequest) -> HazardCalculateResponse:
        "Запускает основной сценарий use case. Исключённые группы не участвуют в расчёте."
        factors = await self.repo.list_factors(request.profile)
        excluded = set(request.excluded_groups or [])
        inputs = [
            FactorInput(
                group=factor.group_code,
                score=request.selections.get(factor.code, factor.default_value),
                max_score=factor.max_score,
            )
            for factor in factors
            if factor.group_code not in excluded
        ]
        result = calculate(inputs)

        r0 = HazardBlockDto(
            group="R0",
            title=GROUP_TITLES["R0"],
            value=round(result.r0.value, 1),
            category=result.r0.category,
            sum_score=round(result.r0.sum_score, 4),
            sum_max=round(result.r0.sum_max, 4),
        )
        blocks = [
            HazardBlockDto(
                group=block.group,
                title=GROUP_TITLES.get(block.group, block.group),
                value=round(block.value, 1),
                category=block.category,
                sum_score=round(block.sum_score, 4),
                sum_max=round(block.sum_max, 4),
            )
            for block in result.blocks
        ]
        return HazardCalculateResponse(
            profile=request.profile,
            r0=r0,
            blocks=blocks,
            overall_r=round(result.overall_r, 1),
            overall_r_category=result.overall_r_category,
            r_int=round(result.r_int, 1),
            r_int_category=result.r_int_category,
        )
