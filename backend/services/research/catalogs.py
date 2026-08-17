"""Справочники НИР: учёные степени, отрасли науки и учёные звания."""
from dataclasses import dataclass

from schemas.research import ResearchCatalogOption, ResearchCatalogsResponse


@dataclass(frozen=True)
class CatalogItem:
    "Позиция справочника: код для хранения и название для интерфейса."
    code: str
    title: str


ACADEMIC_DEGREES: tuple[CatalogItem, ...] = (
    CatalogItem("CANDIDATE", "Кандидат наук"),
    CatalogItem("DOCTOR", "Доктор наук"),
)

ACADEMIC_TITLES: tuple[CatalogItem, ...] = (
    CatalogItem("DOCENT", "Доцент"),
    CatalogItem("PROFESSOR", "Профессор"),
)

SCIENCE_BRANCHES: tuple[CatalogItem, ...] = (
    CatalogItem("ARCHITECTURE", "архитектуры"),
    CatalogItem("BIOLOGICAL", "биологических наук"),
    CatalogItem("VETERINARY", "ветеринарных наук"),
    CatalogItem("MILITARY", "военных наук"),
    CatalogItem("GEOGRAPHICAL", "географических наук"),
    CatalogItem("GEOLOGICAL_MINERALOGICAL", "геолого-минералогических наук"),
    CatalogItem("ART_HISTORY", "искусствоведения"),
    CatalogItem("HISTORICAL", "исторических наук"),
    CatalogItem("CULTUROLOGY", "культурологии"),
    CatalogItem("MEDICAL", "медицинских наук"),
    CatalogItem("PEDAGOGICAL", "педагогических наук"),
    CatalogItem("POLITICAL", "политических наук"),
    CatalogItem("PSYCHOLOGICAL", "психологических наук"),
    CatalogItem("AGRICULTURAL", "сельскохозяйственных наук"),
    CatalogItem("SOCIOLOGICAL", "социологических наук"),
    CatalogItem("THEOLOGY", "теологии"),
    CatalogItem("TECHNICAL", "технических наук"),
    CatalogItem("PHARMACEUTICAL", "фармацевтических наук"),
    CatalogItem("PHYSICAL_MATHEMATICAL", "физико-математических наук"),
    CatalogItem("PHILOLOGICAL", "филологических наук"),
    CatalogItem("PHILOSOPHICAL", "философских наук"),
    CatalogItem("CHEMICAL", "химических наук"),
    CatalogItem("ECONOMIC", "экономических наук"),
    CatalogItem("LEGAL", "юридических наук"),
)

DEGREE_WORDS = {"CANDIDATE": "Кандидат", "DOCTOR": "Доктор"}
TITLE_TITLES = {item.code: item.title for item in ACADEMIC_TITLES}
BRANCH_TITLES = {item.code: item.title for item in SCIENCE_BRANCHES}


def format_degree(degree_code: str, branch_codes: list[str]) -> str:
    """Собирает читаемую степень: «Кандидат биологических наук» или сырой текст анкеты."""
    word = DEGREE_WORDS.get(degree_code)
    if word is None:
        return degree_code
    branches = [BRANCH_TITLES[code] for code in branch_codes if code in BRANCH_TITLES]
    return f"{word} {', '.join(branches) if branches else 'наук'}"


def build_research_catalogs() -> ResearchCatalogsResponse:
    """Собирает справочники направления для анкеты."""
    return ResearchCatalogsResponse(
        academic_degrees=[ResearchCatalogOption.model_validate(item) for item in ACADEMIC_DEGREES],
        science_branches=[ResearchCatalogOption.model_validate(item) for item in SCIENCE_BRANCHES],
        academic_titles=[ResearchCatalogOption.model_validate(item) for item in ACADEMIC_TITLES],
    )
