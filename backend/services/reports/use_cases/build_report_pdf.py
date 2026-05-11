from datetime import date, datetime, timezone
from pathlib import Path

from fastapi import HTTPException, status
from jinja2 import Environment, FileSystemLoader, select_autoescape
from weasyprint import HTML

from models.order import Order
from models.response import OrderResponse, ResponseStatus, VatKind
from services.reports.repository import ReportRepository


VAT_LABELS = {
    VatKind.NONE: "Без НДС",
    VatKind.VAT_5: "С НДС 5%",
    VatKind.VAT_7: "С НДС 7%",
    VatKind.VAT_22: "С НДС 22%",
}

TEMPLATE_DIR = Path(__file__).resolve().parent.parent / "templates"


def format_sum(amount_kopecks: int | None) -> str:
    if not amount_kopecks:
        return "Не определено"
    roubles = amount_kopecks // 100
    formatted = f"{roubles:,}".replace(",", " ")
    if amount_kopecks % 100:
        return f"{formatted},{amount_kopecks % 100:02d} ₽"
    return f"{formatted} ₽"


def format_date(value: date | None) -> str:
    if value is None:
        return "—"
    return value.strftime("%d.%m.%Y")


def expert_full_name(response: OrderResponse) -> str:
    expert = response.expert
    if expert is None:
        return "Неизвестный эксперт"
    parts = [expert.first_name or "", expert.last_name or ""]
    name = " ".join(part for part in parts if part).strip()
    return name or "Эксперт"


class BuildReportPdfUseCase:
    "Собирает HTML по шаблону и рендерит в PDF через WeasyPrint."

    def __init__(self, repo: ReportRepository):
        self.repo = repo
        self.env = Environment(
            loader=FileSystemLoader(str(TEMPLATE_DIR)),
            autoescape=select_autoescape(["html"]),
        )

    async def execute(self, order_id: int, customer_id: int) -> bytes:
        order = await self.repo.get_for_customer(order_id, customer_id)
        if order is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Отчёт не найден",
            )

        html = self.render_html(order)
        return HTML(string=html).write_pdf()

    def render_html(self, order: Order) -> str:
        responses = list(order.responses or [])
        winner_response = self.find_winner(order, responses)
        other_responses = [r for r in responses if r is not winner_response]

        template = self.env.get_template("order_report.html")
        return template.render(
            order=order,
            customer_name=order.company or "—",
            order_sum=format_sum(order.sum_amount),
            order_deadline=format_date(order.deadline),
            participants_count=len(responses),
            winner=self.build_card(winner_response) if winner_response else None,
            others=[self.build_card(r) for r in other_responses],
            generated_at=datetime.now(timezone.utc).strftime("%d.%m.%Y"),
        )

    @staticmethod
    def find_winner(order: Order, responses: list[OrderResponse]) -> OrderResponse | None:
        if order.assigned_expert_id is None:
            return None
        for response in responses:
            if response.expert_id != order.assigned_expert_id:
                continue
            if response.status not in {ResponseStatus.IN_PROGRESS, ResponseStatus.COMPLETED}:
                continue
            return response
        return None

    @staticmethod
    def build_card(response: OrderResponse) -> dict:
        files = [Path(path.split("?")[0]).name for path in (response.technical_files or [])]
        return {
            "expert_name": expert_full_name(response),
            "proposed_sum": format_sum(response.proposed_sum_amount),
            "proposed_deadline": format_date(response.proposed_deadline),
            "response_date": response.created_at.strftime("%d.%m.%Y") if response.created_at else "—",
            "vat_label": VAT_LABELS.get(response.vat_kind, "Без НДС"),
            "comment": response.comment or "",
            "files": files,
        }
