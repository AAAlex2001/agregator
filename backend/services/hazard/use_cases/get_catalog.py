"Use case: справочник факторов профиля (кастомный или дефолтный), сгруппированный по видам аварий."
from schemas.hazard import (
    HazardCatalogResponse,
    HazardFactorDto,
    HazardGroupDto,
    HazardOptionDto,
)
from services.hazard.constants import GROUP_TITLES
from services.hazard.repository import HazardRepository


class GetHazardCatalogUseCase:
    "Отдаёт справочник факторов эксперта для фронтенда (кастомный набор либо дефолт)."

    def __init__(self, repo: HazardRepository) -> None:
        self.repo = repo

    async def execute(self, profile: str, expert_id: int) -> HazardCatalogResponse:
        "Запускает основной сценарий use case."
        factors = await self.repo.resolve_factors(expert_id, profile)
        customized = await self.repo.is_customized(expert_id, profile)
        groups: dict[str, HazardGroupDto] = {}
        for factor in factors:
            group = groups.get(factor.group_code)
            if group is None:
                group = HazardGroupDto(group=factor.group_code, title=GROUP_TITLES.get(factor.group_code, factor.group_code))
                groups[factor.group_code] = group
            group.factors.append(HazardFactorDto(
                code=factor.code,
                group=factor.group_code,
                name=factor.name,
                max_score=factor.max_score,
                default_value=factor.default_value,
                options=[HazardOptionDto(value=o.get("value"), label=o.get("label") or "") for o in factor.options],
            ))
        ordered = sorted(groups.values(), key=lambda g: int(g.group[1:]) if g.group[1:].isdigit() else 99)
        return HazardCatalogResponse(profile=profile, customized=customized, groups=ordered)
