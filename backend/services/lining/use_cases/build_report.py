"Use case: полный PDF-отчёт оценки крепи (WeasyPrint), 1-в-1 со структурой оригинальной программы."
import re
from datetime import UTC, datetime
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape
from weasyprint import HTML

from schemas.lining import LiningReportRequest
from services.lining.calculator import ElementSpec, FactorInput, calculate
from services.lining.constants import (
    CRITERIA_WEIGHTS,
    ELEMENTS,
    EXPERT_CRITERIA,
    GROUP_TABLE_DESC,
    HAZARD_DESCRIPTIONS,
    SUMMARY_NAMES,
)
from services.lining.repository import LiningRepository

TEMPLATE_DIR = Path(__file__).resolve().parent.parent / "templates"


def comma(value: float, digits: int) -> str:
    "Число с запятой как десятичным разделителем (как в оригинальном отчёте)."
    return f"{value:.{digits}f}".replace(".", ",")


class BuildLiningReportUseCase:
    "Считает показатели и рендерит полный PDF-отчёт по шаблону оригинала."

    def __init__(self, repo: LiningRepository) -> None:
        self.repo = repo
        self.env = Environment(
            loader=FileSystemLoader(str(TEMPLATE_DIR)),
            autoescape=select_autoescape(["html"]),
        )

    async def execute(self, request: LiningReportRequest) -> bytes:
        "Запускает основной сценарий use case."
        factors = await self.repo.list_factors(request.profile)

        inputs: list[FactorInput] = []
        groups: dict[str, list[dict]] = {}
        for factor in factors:
            selected = request.selections.get(factor.code, factor.default_value)
            if selected is None:
                continue
            inputs.append(FactorInput(group=factor.group_code, score=selected, max_score=factor.max_score))

            criterion = factor.options[0].get("label", "") if factor.options else ""
            for option in factor.options:
                value = option.get("value")
                if value is not None and abs(float(value) - float(selected)) < 1e-4:
                    criterion = option.get("label", "")
                    break

            groups.setdefault(factor.group_code, []).append({
                "idx": factor.code.split(".")[1] if "." in factor.code else factor.code,
                "name": re.sub(r"^R\d+\.\d+\s*", "", factor.name).strip(),
                "criterion": criterion,
                "score": selected or 0.0,
                "max": factor.max_score,
            })

        elements = [ElementSpec(e["id"], e["name"], e["lam_sub"], e["t_sub"]) for e in ELEMENTS]
        element_categories = {int(k): int(v) for k, v in request.element_categories.items()}
        expert_scores = {int(k): int(v) for k, v in request.expert_scores.items()}
        result = calculate(inputs, elements, element_categories, request.service_life_years, CRITERIA_WEIGHTS, expert_scores)

        blocks = {block.group: block for block in result.blocks}
        ordered_groups = sorted(groups, key=lambda g: int(g[1:]))
        ordered_blocks = sorted(blocks, key=lambda g: int(g[1:]))

        ioa_groups = []
        for group in ordered_groups:
            block = result.r0 if group == "R0" else blocks[group]
            ioa_groups.append({
                "num": group[1:],
                "desc": GROUP_TABLE_DESC.get(group, group),
                "factors": groups[group],
                "sum_score": round(block.sum_score, 2),
                "sum_max": round(block.sum_max, 2),
            })

        lam_rows = [{"num": e.element_id, "name": e.name, "sub": e.lam_sub, "value": comma(e.lam, 4)} for e in result.elements]
        capital_rows = [{
            "num": e.element_id, "name": e.name, "sub": e.t_sub,
            "value": "Не требует" if e.t_capital is None else comma(e.t_capital, 3),
        } for e in result.elements]
        emergency_rows = [{
            "num": e.element_id, "name": e.name, "sub": e.t_sub,
            "value": "Не требует" if e.t_emergency is None else comma(e.t_emergency, 1),
        } for e in result.elements]

        summary = [{"name": SUMMARY_NAMES["R0"], "kind": "block", "sub": "0",
                    "value": result.r0.value, "category": result.r0.category}]
        for group in ordered_blocks:
            block = blocks[group]
            summary.append({"name": SUMMARY_NAMES.get(group, group), "kind": "block", "sub": group[1:],
                            "value": block.value, "category": block.category})
        summary.append({"name": "Показатель опасности (риска) аварий на горной выработке", "kind": "overall",
                        "value": result.overall_r, "category": result.overall_r_category, "highlight": True})
        summary.append({"name": "Интегральный показатель опасности (риска) аварий", "kind": "int",
                        "value": result.r_int, "category": result.r_int_category})

        expert_sections: list[dict] = []
        for criterion in EXPERT_CRITERIA:
            score = expert_scores.get(criterion["id"], 1)
            row = {
                "num": criterion["id"],
                "name": criterion["name"],
                "weight": comma(criterion["weight"], 2),
                "score": score,
                "p": comma(criterion["weight"] * score, 2),
            }
            if not expert_sections or expert_sections[-1]["title"] != criterion["section"]:
                expert_sections.append({"title": criterion["section"], "rows": []})
            expert_sections[-1]["rows"].append(row)

        html = self.env.get_template("lining_report.html").render(
            meta={
                "report_name": request.report_name,
                "author": request.author,
                "intro_line1": request.intro_line1,
                "intro_line2": request.intro_line2,
                "intro_line3": request.intro_line3,
                "justification": request.justification,
                "manufacturer": request.manufacturer,
                "service_life_years": comma(request.service_life_years, 1),
                "generated_at": datetime.now(UTC).strftime("%d.%m.%Y %H:%M"),
            },
            hazards=[HAZARD_DESCRIPTIONS.get(g, g) for g in ordered_groups],
            lam_rows=lam_rows,
            capital_rows=capital_rows,
            emergency_rows=emergency_rows,
            final_capital=comma(result.final_capital, 1),
            final_emergency=comma(result.final_emergency, 1),
            ioa_groups=ioa_groups,
            summary=summary,
            expert_sections=expert_sections,
            beta=comma(result.beta, 2),
        )
        return HTML(string=html).write_pdf()
