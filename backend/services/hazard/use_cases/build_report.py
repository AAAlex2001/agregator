"Use case: PDF-отчёт об оценке опасности аварий (WeasyPrint)."
from datetime import UTC, datetime
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape
from weasyprint import HTML

from schemas.hazard import HazardCalculateRequest
from services.hazard.calculator import RISK_LEVELS
from services.hazard.repository import HazardRepository
from services.hazard.use_cases.calculate import CalculateHazardUseCase

TEMPLATE_DIR = Path(__file__).resolve().parent.parent / "templates"
PROFILE_TITLES = {"rudnik": "рудник", "shahta": "шахта"}


class BuildHazardReportUseCase:
    "Считает показатели и рендерит PDF-отчёт по шаблону."

    def __init__(self, repo: HazardRepository) -> None:
        self.calculator = CalculateHazardUseCase(repo)
        self.env = Environment(
            loader=FileSystemLoader(str(TEMPLATE_DIR)),
            autoescape=select_autoescape(["html"]),
        )

    async def execute(self, request: HazardCalculateRequest, title: str = "") -> bytes:
        "Запускает основной сценарий use case."
        result = await self.calculator.execute(request)

        rows = [{"name": result.r0.title, "symbol": "R₀", "value": result.r0.value, "category": result.r0.category}]
        for block in result.blocks:
            rows.append({"name": block.title, "symbol": block.group, "value": block.value, "category": block.category})
        rows.append({"name": "Показатель опасности (риска) аварий на объекте", "symbol": "R",
                     "value": result.overall_r, "category": result.overall_r_category, "highlight": True})
        rows.append({"name": "Интегральный показатель опасности (риска) аварий", "symbol": "Rᶦⁿᵗ",
                     "value": result.r_int, "category": result.r_int_category})

        html = self.env.get_template("hazard_report.html").render(
            title=title or "Отчёт об оценке опасности аварий",
            profile_title=PROFILE_TITLES.get(request.profile, request.profile),
            rows=rows,
            risk_levels=RISK_LEVELS,
            generated_at=datetime.now(UTC).strftime("%d.%m.%Y"),
        )
        return HTML(string=html).write_pdf()
