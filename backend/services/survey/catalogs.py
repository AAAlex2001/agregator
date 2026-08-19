"""Справочники инженерных изысканий: виды изысканий и области аттестации РТН."""
from dataclasses import dataclass

from schemas.survey import SurveyCatalogOption, SurveyCatalogsResponse, SurveyKindOption
from services.design.catalogs import RTN_ATTESTATION_AREAS


@dataclass(frozen=True)
class SurveyKindItem:
    "Вид изысканий: ключ для хранения, принятое сокращение и название."
    code: str
    short: str
    title: str


SURVEY_KINDS: tuple[SurveyKindItem, ...] = (
    SurveyKindItem("IGI", "ИГИ", "Инженерно-геологические изыскания"),
    SurveyKindItem("IGDI", "ИГДИ", "Инженерно-геодезические изыскания"),
    SurveyKindItem("IGMI", "ИГМИ", "Гидрометеорологические изыскания"),
    SurveyKindItem("IEI", "ИЭИ", "Инженерно-экологические изыскания"),
    SurveyKindItem("IGFI", "ИГФИ", "Инженерно-геофизические изыскания"),
    SurveyKindItem("ARCH", "АРХ", "Археологические исследования"),
)

SURVEY_KIND_TITLES: dict[str, str] = {item.code: item.title for item in SURVEY_KINDS}
SURVEY_KIND_SHORTS: dict[str, str] = {item.code: item.short for item in SURVEY_KINDS}


def build_survey_catalogs() -> SurveyCatalogsResponse:
    "Собирает справочники направления для формы анкеты и фильтров."
    return SurveyCatalogsResponse(
        kinds=[SurveyKindOption.model_validate(item) for item in SURVEY_KINDS],
        rtn_areas=[SurveyCatalogOption.model_validate(item) for item in RTN_ATTESTATION_AREAS],
    )
