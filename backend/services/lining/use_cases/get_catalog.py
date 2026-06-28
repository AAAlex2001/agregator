"Use case: полный справочник инструмента оценки крепи (факторы + элементы + категории + критерии)."
from schemas.lining import (
    LiningCatalogResponse,
    LiningCriterionDto,
    LiningDamageCategoryDto,
    LiningElementDto,
    LiningFactorDto,
    LiningGroupDto,
    LiningOptionDto,
)
from services.lining.constants import (
    DAMAGE_CATEGORIES,
    ELEMENT_GROUP_TITLES,
    ELEMENTS,
    EXPERT_CRITERIA,
    EXPERT_SCORE_LABELS,
    GROUP_TITLES,
)
from services.lining.repository import LiningRepository


class GetLiningCatalogUseCase:
    "Отдаёт полный справочник инструмента для фронтенда."

    def __init__(self, repo: LiningRepository) -> None:
        self.repo = repo

    async def execute(self, profile: str) -> LiningCatalogResponse:
        "Запускает основной сценарий use case."
        factors = await self.repo.list_factors(profile)
        groups: dict[str, LiningGroupDto] = {}
        for factor in factors:
            group = groups.get(factor.group_code)
            if group is None:
                group = LiningGroupDto(group=factor.group_code, title=GROUP_TITLES.get(factor.group_code, factor.group_code))
                groups[factor.group_code] = group
            group.factors.append(LiningFactorDto(
                code=factor.code,
                group=factor.group_code,
                name=factor.name,
                max_score=factor.max_score,
                default_value=factor.default_value,
                options=[LiningOptionDto(value=o.get("value"), label=o.get("label") or "") for o in factor.options],
            ))
        ordered = sorted(groups.values(), key=lambda g: int(g.group[1:]) if g.group[1:].isdigit() else 99)
        return LiningCatalogResponse(
            profile=profile,
            groups=ordered,
            elements=[LiningElementDto(id=e["id"], group=e["group"], name=e["name"]) for e in ELEMENTS],
            element_group_titles=ELEMENT_GROUP_TITLES,
            damage_categories=[
                LiningDamageCategoryDto(id=c["id"], reliability=c["reliability"], epsilon=c["epsilon"], description=c["description"])
                for c in DAMAGE_CATEGORIES
            ],
            expert_criteria=[
                LiningCriterionDto(id=c["id"], section=c["section"], name=c["name"], weight=c["weight"])
                for c in EXPERT_CRITERIA
            ],
            expert_score_labels=EXPERT_SCORE_LABELS,
        )
