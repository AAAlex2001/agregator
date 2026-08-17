"""Сводка анкеты направления для метки эксперта на карте.

Ключи с префиксом направления живут в общем списке Expert.map_fields рядом со
старыми ключами экспертизы. Пока эксперт не настраивал направление, показывается
весь его набор.
"""
from models.expert import Expert
from models.order import OrderWorkType
from services.design.catalogs import DESIGN_SPECIALTY_SHORTS, RTN_AREA_TITLES
from services.ecology.catalogs import ECOLOGY_WORK_TYPE_TITLES
from services.research.catalogs import BRANCH_TITLES, DEGREE_WORDS, TITLE_TITLES, format_degree
from services.tech_diag.catalogs import CONTROL_OBJECTS, NDT_METHODS

AUDIT_KEYS = ("audit_qualifications", "audit_attestation_areas", "audit_safety_areas")
CADASTRAL_KEYS = (
    "cadastral_education",
    "cadastral_certificate_number",
    "cadastral_registry_number",
    "cadastral_workplace",
    "cadastral_equipment",
)
FORENSIC_KEYS = (
    "forensic_education",
    "forensic_extra_education",
    "forensic_experience",
    "forensic_degree",
)
RESEARCH_KEYS = ("research_degree", "research_title", "research_field")
LABORATORY_KEYS = ("laboratory_accreditation_area",)
TECH_DIAG_KEYS = ("tech_diag_certificates", "tech_diag_methods", "tech_diag_control_objects")
DESIGN_KEYS = (
    "design_specialties",
    "design_education",
    "design_nrs",
    "design_nok",
    "design_rtn_areas",
)
ECOLOGY_KEYS = ("ecology_work_types", "ecology_skills")

NDT_METHOD_TITLES = {item.code: item.title for item in NDT_METHODS}
CONTROL_OBJECT_TITLES = {item.code: item.title for item in CONTROL_OBJECTS}


def chosen_keys(fields: list[str], direction_keys: tuple[str, ...]) -> set[str]:
    "Выбранные ключи направления; если эксперт их не настраивал — весь набор."
    chosen = {key for key in fields if key in direction_keys}
    return chosen or set(direction_keys)


def audit_summary(expert: Expert, keys: set[str]) -> list[str]:
    "Метка аудитора: квалификации, области аттестации и направления промбезопасности."
    profile = expert.audit_profile
    if profile is None:
        return ["Аудитор СУПБ"]
    parts = []
    if "audit_qualifications" in keys:
        parts.extend(profile.audit_qualifications or [])
    if "audit_attestation_areas" in keys and profile.expert_attestation_areas:
        parts.append("Аттестации: " + ", ".join(profile.expert_attestation_areas))
    if "audit_safety_areas" in keys:
        parts.extend(profile.industrial_safety_areas or [])
    return parts or ["Аудитор СУПБ"]


def cadastral_summary(expert: Expert, keys: set[str]) -> list[str]:
    "Метка кадастрового инженера: образование, аттестат, реестр, работа, оборудование."
    profile = expert.cadastral_profile
    parts = ["Кадастровый инженер"]
    if profile is None:
        return parts
    if "cadastral_education" in keys and profile.education:
        parts.append(profile.education[:200])
    if "cadastral_certificate_number" in keys and profile.certificate_number:
        parts.append(f"Аттестат № {profile.certificate_number}")
    if "cadastral_registry_number" in keys and profile.registry_number:
        parts.append(f"Реестровый № {profile.registry_number}")
    if "cadastral_workplace" in keys and profile.workplace:
        parts.append(profile.workplace[:200])
    if "cadastral_equipment" in keys and profile.has_equipment:
        parts.append("Есть необходимое оборудование")
    return parts


def forensic_summary(expert: Expert, keys: set[str]) -> list[str]:
    "Метка судебного эксперта: образование, дополнительное образование, опыт, степень."
    profile = expert.forensic_profile
    parts = ["Судебный эксперт"]
    if profile is None:
        return parts
    if "forensic_education" in keys and profile.education:
        parts.append(profile.education[:200])
    if "forensic_extra_education" in keys and profile.extra_education:
        parts.append(profile.extra_education[:200])
    if "forensic_degree" in keys and profile.degree:
        parts.append(profile.degree)
    if "forensic_experience" in keys and profile.has_similar_experience:
        parts.append("Опыт аналогичных экспертиз")
    return parts


def research_summary(expert: Expert, keys: set[str]) -> list[str]:
    "Метка исполнителя НИР: учёная степень, звание и направление научной деятельности."
    profile = expert.research_profile
    if profile is None:
        return ["Исполнитель НИР"]
    parts = []
    if "research_degree" in keys and profile.academic_degree:
        parts.append(format_degree(profile.academic_degree, profile.science_branches))
    if "research_title" in keys and profile.academic_title:
        parts.append(TITLE_TITLES.get(profile.academic_title, profile.academic_title))
    if "research_field" in keys and profile.research_field:
        parts.append(profile.research_field[:200])
    return parts or ["Исполнитель НИР"]


def laboratory_summary(expert: Expert, keys: set[str]) -> list[str]:
    "Метка лаборатории: область аккредитации."
    profile = expert.laboratory_profile
    area = (profile.accreditation_area or "").strip() if profile is not None else ""
    if "laboratory_accreditation_area" in keys and area:
        return [area[:200]]
    return ["Лабораторные исследования"]


def tech_diag_summary(expert: Expert, keys: set[str]) -> list[str]:
    "Метка специалиста НК: удостоверения, виды и объекты контроля."
    profile = expert.tech_diag_profile
    if profile is None:
        return ["Специалист НК"]
    parts = []
    if "tech_diag_methods" in keys and profile.methods:
        titles = [NDT_METHOD_TITLES.get(code, code) for code in profile.methods]
        parts.append("Виды НК: " + ", ".join(titles))
    if "tech_diag_control_objects" in keys and profile.control_objects:
        titles = [CONTROL_OBJECT_TITLES.get(code, code) for code in profile.control_objects]
        parts.append("Объекты контроля: " + ", ".join(titles))
    if "tech_diag_certificates" in keys and profile.qualification_certificates:
        parts.append(profile.qualification_certificates[:200])
    return parts or ["Специалист НК"]


def design_summary(expert: Expert, keys: set[str]) -> list[str]:
    "Метка проектировщика: специальности, образование, НРС, НОК и области аттестации РТН."
    profile = expert.design_profile
    if profile is None:
        return ["Проектировщик"]
    parts = []
    if "design_specialties" in keys and profile.specialties:
        shorts = [DESIGN_SPECIALTY_SHORTS.get(code, code) for code in profile.specialties]
        parts.append("Специальности: " + ", ".join(shorts))
    if "design_education" in keys and profile.education:
        parts.append(profile.education[:200])
    if "design_nrs" in keys and profile.nrs_number:
        parts.append(f"НРС № {profile.nrs_number}")
    if "design_nok" in keys and profile.nok_passed:
        parts.append("Пройдена независимая оценка квалификации")
    if "design_rtn_areas" in keys and profile.rtn_areas:
        codes = [code for code in profile.rtn_areas if code in RTN_AREA_TITLES]
        if codes:
            parts.append("Аттестация РТН: " + ", ".join(codes))
    return parts or ["Проектировщик"]


def ecology_summary(expert: Expert, keys: set[str]) -> list[str]:
    "Метка эколога: виды работ и практические навыки."
    profile = expert.ecology_profile
    if profile is None:
        return ["Эколог"]
    parts = []
    if "ecology_work_types" in keys and profile.work_types:
        titles = [ECOLOGY_WORK_TYPE_TITLES.get(code, code) for code in profile.work_types]
        parts.append("Виды работ: " + ", ".join(titles))
    if "ecology_skills" in keys and profile.practical_skills:
        parts.append(profile.practical_skills[:200])
    return parts or ["Эколог"]


def direction_tags(expert: Expert, direction: str) -> list[str]:
    "Ключи анкеты направления для фильтров на карте — независимо от настроек метки."
    if direction == OrderWorkType.ECOLOGY.value and expert.ecology_profile is not None:
        return list(expert.ecology_profile.work_types or [])
    if direction == OrderWorkType.DESIGN.value and expert.design_profile is not None:
        return list(expert.design_profile.specialties or [])
    if direction == OrderWorkType.TECH_DIAG.value and expert.tech_diag_profile is not None:
        profile = expert.tech_diag_profile
        return [*(profile.methods or []), *(profile.control_objects or [])]
    if direction == OrderWorkType.AUDIT_SUPB.value and expert.audit_profile is not None:
        profile = expert.audit_profile
        return [*(profile.audit_qualifications or []), *(profile.industrial_safety_areas or [])]
    if direction == OrderWorkType.CADASTRAL.value and expert.cadastral_profile is not None:
        return ["EQUIPMENT"] if expert.cadastral_profile.has_equipment else []
    if direction == OrderWorkType.FORENSIC.value and expert.forensic_profile is not None:
        profile = expert.forensic_profile
        tags = [f"WORKPLACE_{profile.workplace_kind.value}"]
        if profile.has_degree:
            tags.append("DEGREE")
        if profile.has_similar_experience:
            tags.append("EXPERIENCE")
        return tags
    if direction == OrderWorkType.RESEARCH.value and expert.research_profile is not None:
        profile = expert.research_profile
        codes = [profile.academic_degree, *profile.science_branches, profile.academic_title]
        return [code for code in codes if code in DEGREE_WORDS or code in BRANCH_TITLES or code in TITLE_TITLES]
    return []


def build_direction_summary(expert: Expert, direction: str, fields: list[str]) -> list[str]:
    "Строки метки по анкете направления с учётом настроек «что показывать на карте»."
    if direction == OrderWorkType.AUDIT_SUPB.value:
        return audit_summary(expert, chosen_keys(fields, AUDIT_KEYS))
    if direction == OrderWorkType.CADASTRAL.value:
        return cadastral_summary(expert, chosen_keys(fields, CADASTRAL_KEYS))
    if direction == OrderWorkType.FORENSIC.value:
        return forensic_summary(expert, chosen_keys(fields, FORENSIC_KEYS))
    if direction == OrderWorkType.RESEARCH.value:
        return research_summary(expert, chosen_keys(fields, RESEARCH_KEYS))
    if direction == OrderWorkType.LABORATORY.value:
        return laboratory_summary(expert, chosen_keys(fields, LABORATORY_KEYS))
    if direction == OrderWorkType.TECH_DIAG.value:
        return tech_diag_summary(expert, chosen_keys(fields, TECH_DIAG_KEYS))
    if direction == OrderWorkType.DESIGN.value:
        return design_summary(expert, chosen_keys(fields, DESIGN_KEYS))
    if direction == OrderWorkType.ECOLOGY.value:
        return ecology_summary(expert, chosen_keys(fields, ECOLOGY_KEYS))
    return []
