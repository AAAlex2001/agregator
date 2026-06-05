"Use case: build report pdf."
import os
from datetime import UTC, date, datetime
from pathlib import Path
from typing import Any

from fastapi import HTTPException, status
from jinja2 import Environment, FileSystemLoader, select_autoescape
from weasyprint import HTML

from models.order import Order
from models.question import OrderQuestion
from models.response import OrderResponse, ResponseStatus, VatKind
from services.reports.repository import ReportRepository

PUBLIC_BASE_URL = os.getenv("PUBLIC_BASE_URL", "https://plus-resurs.com").rstrip("/")


VAT_LABELS = {
    VatKind.NONE: "Без НДС",
    VatKind.VAT_5: "С НДС 5%",
    VatKind.VAT_7: "С НДС 7%",
    VatKind.VAT_22: "С НДС 22%",
}

BADGE_PALETTE = {
    "BLUE":   {"bg": "#e3f0ff", "color": "#1d4f9a"},
    "GREEN":  {"bg": "#e2f6df", "color": "#2e7a2a"},
    "GRAY":   {"bg": "#efefef", "color": "#4d4d4d"},
    "ORANGE": {"bg": "#fff1d6", "color": "#b35a00"},
    "BROWN":  {"bg": "#f3e7da", "color": "#6e4a26"},
    "PURPLE": {"bg": "#efe4ff", "color": "#5b349b"},
}

TEMPLATE_DIR = Path(__file__).resolve().parent.parent / "templates"


def format_sum(amount_kopecks: int | None) -> str:
    "Форматирует значение для отображения."
    if not amount_kopecks:
        return "Не определено"
    roubles = amount_kopecks // 100
    formatted = f"{roubles:,}".replace(",", " ")
    if amount_kopecks % 100:
        return f"{formatted},{amount_kopecks % 100:02d} ₽"
    return f"{formatted} ₽"


def format_date(value: date | None) -> str:
    "Форматирует значение для отображения."
    if value is None:
        return "—"
    return value.strftime("%d.%m.%Y")


def format_datetime(value: datetime | None) -> str:
    "Форматирует значение для отображения."
    if value is None:
        return "—"
    return value.strftime("%d.%m.%Y %H:%M")


def expert_full_name(response: OrderResponse) -> str:
    "Публичный метод сервисного слоя."
    expert = response.expert
    if expert is None:
        return "Неизвестный эксперт"
    parts = [expert.first_name or "", expert.last_name or ""]
    name = " ".join(part for part in parts if part).strip()
    return name or "Эксперт"


def question_expert_name(question: OrderQuestion) -> str:
    "Публичный метод сервисного слоя."
    expert = question.expert
    if expert is None:
        return "Эксперт"
    parts = [expert.first_name or "", expert.last_name or ""]
    name = " ".join(part for part in parts if part).strip()
    return name or "Эксперт"


def expert_company(response: OrderResponse) -> str:
    "Публичный метод сервисного слоя."
    data = response.expert_company_data or {}
    if not isinstance(data, dict):
        return ""
    name = (data.get("value") or data.get("name") or "").strip()
    inn = (response.expert_inn or "").strip()
    if name and inn:
        return f"{name} (ИНН {inn})"
    return name or (f"ИНН {inn}" if inn else "")


def customer_with_inn(order: Order) -> str:
    "Публичный метод сервисного слоя."
    name = (order.company or "").strip()
    customer = order.customer
    inn = (customer.inn or "").strip() if customer else ""
    if name and inn:
        return f"{name} (ИНН {inn})"
    return name or (f"ИНН {inn}" if inn else "—")


def expert_rating(response: OrderResponse) -> dict[str, Any] | None:
    "Публичный метод сервисного слоя."
    expert = response.expert
    if expert is None or expert.rating is None:
        return None
    return {
        "rating": float(expert.rating),
        "review_count": expert.review_count or 0,
    }


def build_badges(order: Order) -> list[dict[str, Any]]:
    "Строит объект из входных данных."
    result = []
    for badge in order.badges or []:
        variant = badge.variant.value if hasattr(badge.variant, "value") else str(badge.variant)
        palette = BADGE_PALETTE.get(variant.upper(), BADGE_PALETTE["GRAY"])
        result.append({"text": badge.text, "bg": palette["bg"], "color": palette["color"]})
    return result


def build_file_tiles(paths: list[str]) -> list[dict[str, Any]]:
    "Плитки файлов с публичным URL для клика-скачивания из PDF."
    result = []
    for path in paths or []:
        clean = path.split("?")[0]
        name = Path(clean).name
        extension = Path(clean).suffix.lower().lstrip(".") or "file"
        relative = clean.lstrip("/")
        result.append({
            "name": name,
            "extension": extension.upper(),
            "url": f"{PUBLIC_BASE_URL}/{relative}",
        })
    return result


CUSTOMER_DOCUMENT_GROUPS = [
    ("technical_files", "Техническое задание"),
    ("contract_files", "Проект договора"),
    ("company_files", "Карточка предприятия"),
    ("other_files", "Иное"),
]


def build_customer_documents(order: Order) -> list[dict[str, Any]]:
    "4 категории документов заказчика в порядке UI."
    groups = []
    for attr, label in CUSTOMER_DOCUMENT_GROUPS:
        paths = list(getattr(order, attr, None) or [])
        tiles = build_file_tiles(paths)
        if tiles:
            groups.append({"label": label, "files": tiles})
    return groups


def format_responses_deadline(value: datetime | None) -> str:
    "Форматирует значение для отображения."
    if value is None:
        return "—"
    return value.strftime("%d.%m.%Y, %H:%M")


def visible_questions(order: Order) -> list[dict[str, Any]]:
    "Публичный метод сервисного слоя."
    items = []
    for q in order.questions or []:
        if q.is_anonymous:
            continue
        items.append({
            "expert_name": question_expert_name(q),
            "question": q.question,
            "answer": q.answer or "",
            "asked_at": format_datetime(q.asked_at),
            "answered_at": format_datetime(q.answered_at),
        })
    return items


class BuildReportPdfUseCase:
    "Собирает HTML по шаблону и рендерит в PDF через WeasyPrint."

    def __init__(self, repo: ReportRepository) -> None:
        self.repo = repo
        self.env = Environment(
            loader=FileSystemLoader(str(TEMPLATE_DIR)),
            autoescape=select_autoescape(["html"]),
        )

    async def execute(self, order_id: int, customer_id: int) -> bytes:
        "Запускает основной сценарий use case."
        order = await self.repo.get_for_customer(order_id, customer_id)
        if order is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Отчёт не найден",
            )

        html = self.render_html(order)
        return HTML(string=html).write_pdf()

    def render_html(self, order: Order) -> str:
        "Рендерит шаблон/представление."
        responses = list(order.responses or [])
        winner_response = self.find_winner(order, responses)
        other_responses = [r for r in responses if r is not winner_response]
        badges = build_badges(order)
        questions = visible_questions(order)

        template = self.env.get_template("order_report.html")
        return template.render(
            order=order,
            customer_name=customer_with_inn(order),
            customer_comment=(order.comment or "").strip(),
            customer_documents=build_customer_documents(order),
            order_sum=format_sum(order.sum_amount),
            order_deadline=format_date(order.deadline),
            responses_deadline=format_responses_deadline(order.responses_deadline),
            badges=badges,
            participants_count=len(responses),
            winner=self.build_card(winner_response, order) if winner_response else None,
            others=[self.build_card(r, order) for r in other_responses],
            questions=questions,
            generated_at=datetime.now(UTC).strftime("%d.%m.%Y"),
        )

    @staticmethod
    def find_winner(order: Order, responses: list[OrderResponse]) -> OrderResponse | None:
        "Ищет сущность по заданным параметрам."
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
    def build_card(response: OrderResponse, order: Order) -> dict[str, Any]:
        "Строит объект из входных данных."
        return {
            "expert_name": expert_full_name(response),
            "expert_rating": expert_rating(response),
            "expert_company": expert_company(response),
            "proposed_sum": format_sum(response.proposed_sum_amount),
            "proposed_deadline": format_date(response.proposed_deadline),
            "response_date": response.created_at.strftime("%d.%m.%Y") if response.created_at else "—",
            "vat_label": VAT_LABELS.get(response.vat_kind, "Без НДС"),
            "comment": response.comment or "",
            "files": build_file_tiles(list(response.technical_files or [])),
            "order_sum": format_sum(order.sum_amount),
            "order_deadline": format_date(order.deadline),
        }
