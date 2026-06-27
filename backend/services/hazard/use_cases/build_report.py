"Use case: полный PDF-отчёт об оценке опасности аварий (WeasyPrint), 1-в-1 со структурой оригинала."
import re
from datetime import UTC, datetime
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape
from weasyprint import HTML

from schemas.hazard import HazardReportRequest
from services.hazard.calculator import RISK_LEVELS, FactorInput, calculate
from services.hazard.constants import (
    GROUP_TABLE_DESC,
    HAZARD_DESCRIPTIONS,
    RISK_TABLE,
    SUMMARY_NAMES,
)
from services.hazard.repository import HazardRepository

TEMPLATE_DIR = Path(__file__).resolve().parent.parent / "templates"
PROFILE_TITLES = {"rudnik": "рудник", "shahta": "шахта"}
SUB = str.maketrans("0123456789", "₀₁₂₃₄₅₆₇₈₉")


class BuildHazardReportUseCase:
    "Считает показатели и рендерит полный PDF-отчёт по шаблону оригинала."

    def __init__(self, repo: HazardRepository) -> None:
        self.repo = repo
        self.env = Environment(
            loader=FileSystemLoader(str(TEMPLATE_DIR)),
            autoescape=select_autoescape(["html"]),
        )

    async def execute(self, request: HazardReportRequest) -> bytes:
        "Запускает основной сценарий use case."
        factors = await self.repo.list_factors(request.profile)

        inputs: list[FactorInput] = []
        groups: dict[str, list[dict]] = {}
        for factor in factors:
            selected = request.selections.get(factor.code, factor.default_value)
            inputs.append(FactorInput(group=factor.group_code, score=selected, max_score=factor.max_score))

            criterion = factor.options[0].get("label", "") if factor.options else ""
            for option in factor.options:
                value = option.get("value")
                if (value is None and selected is None) or (
                    value is not None and selected is not None and abs(float(value) - float(selected)) < 1e-4
                ):
                    criterion = option.get("label", "")
                    break

            groups.setdefault(factor.group_code, []).append({
                "idx": factor.code.split(".")[1] if "." in factor.code else factor.code,
                "name": re.sub(r"^R\d+\.\d+\s*", "", factor.name).strip(),
                "criterion": criterion,
                "score": selected or 0.0,
                "max": factor.max_score,
            })

        result = calculate(inputs)
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

        calc_rows = [{
            "kind": "r0",
            "desc": GROUP_TABLE_DESC["R0"],
            "num": round(result.r0.sum_score, 2),
            "den": round(result.r0.sum_max, 2),
            "pct": result.r0.value,
        }]
        for group in ordered_blocks:
            block = blocks[group]
            calc_rows.append({
                "kind": "rx",
                "sub": group[1:],
                "desc": SUMMARY_NAMES.get(group, group),
                "rx_score": round(block.sum_score, 2),
                "rx_max": round(block.sum_max, 2),
                "r0_score": round(result.r0.sum_score, 2),
                "r0_max": round(result.r0.sum_max, 2),
                "pct": block.value,
            })

        total_score = sum(block.sum_score for block in result.blocks) + result.r0.sum_score
        total_max = sum(block.sum_max for block in result.blocks) + result.r0.sum_max

        summary = [{"name": SUMMARY_NAMES["R0"], "kind": "block", "sub": "0",
                    "value": result.r0.value, "category": result.r0.category}]
        for group in ordered_blocks:
            block = blocks[group]
            summary.append({"name": SUMMARY_NAMES.get(group, group), "kind": "block", "sub": group[1:],
                            "value": block.value, "category": block.category})
        summary.append({"name": "Показатель опасности (риска) аварий на объекте", "kind": "overall",
                        "value": result.overall_r, "category": result.overall_r_category, "highlight": True})
        summary.append({"name": "Интегральный показатель опасности (риска) аварий", "kind": "int",
                        "value": result.r_int, "category": result.r_int_category})

        html = self.env.get_template("hazard_report.html").render(
            meta={
                "profile_title": PROFILE_TITLES.get(request.profile, request.profile),
                "generated_at": datetime.now(UTC).strftime("%d.%m.%Y %H:%M"),
            },
            hazards=[HAZARD_DESCRIPTIONS.get(g, g) for g in ordered_groups],
            ioa_groups=ioa_groups,
            calc_rows=calc_rows,
            rint={"num": round(total_score, 2), "den": round(total_max, 2),
                  "pct": result.r_int, "category": result.r_int_category},
            overall_r=result.overall_r,
            summary=summary,
            risk_table=RISK_TABLE,
            risk_levels=RISK_LEVELS,
        )
        return HTML(string=html).write_pdf()
