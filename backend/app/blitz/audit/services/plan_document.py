"""Программа аудита СУПБ в Word по шаблону: метки {{...}} заполняются так же, как в договоре."""

from datetime import date, datetime, timedelta, timezone
from io import BytesIO

from docx import Document

from app.blitz.audit.options import AUDIT_KINDS, ELEMENTS
from app.blitz.audit.schemas import AuditDetailsSchema, PlanSchema
from app.blitz.contracts.services.document import TEMPLATES, fill, initials
from app.blitz.orders.models import BlitzOrder
from app.blitz.orders.schemas import TeamMemberSchema

MOSCOW = timezone(timedelta(hours=3))

SCOPE_TEXT = {
    "basic": "Объём аудита определяется как всесторонняя проверка всех элементов СУПБ.",
    "interim": "Оценка выполнения корректирующих мероприятий по результатам базового аудита СУПБ.",
    "consultation": "Объём аудита согласован с заказчиком по итогам консультации.",
}


def moscow_time(moment: datetime) -> str:
    """Дата и время по Москве: 15.11.2026 10:00 (МСК)."""

    aware = moment if moment.tzinfo else moment.replace(tzinfo=MOSCOW)

    return f"{aware.astimezone(MOSCOW):%d.%m.%Y %H:%M} (МСК)"


def period(start: date | None, end: date | None) -> str:
    """Период: 01.11.2026 — 10.11.2026."""

    if start is None or end is None:
        return "—"

    return f"{start:%d.%m.%Y} — {end:%d.%m.%Y}"


def audit_scope(details: AuditDetailsSchema) -> str:
    """Объём аудита: у выборочного — перечень элементов СУПБ."""

    if details.params.kind != "selective":
        return SCOPE_TEXT[details.params.kind]

    elements = "\n".join(ELEMENTS[item] for item in details.params.elements)

    return f"Выборочная проверка элементов СУПБ:\n{elements}"


def objects_text(details: AuditDetailsSchema) -> str:
    """Проверяемые ОПО по строке или сведения обо всех ОПО."""

    if details.fleet is not None:
        return f"Все ОПО организации, количество: {details.fleet.count}"

    return "\n".join(f"{item.name}, {item.hazard_class} класс опасности" for item in details.objects)


def reg_numbers_text(details: AuditDetailsSchema) -> str:
    """Регистрационные номера ОПО."""

    if details.fleet is not None:
        return "Согласно свидетельству о регистрации ОПО"

    return "\n".join(item.reg_number for item in details.objects)


def address_text(order: BlitzOrder, details: AuditDetailsSchema) -> str:
    """Где проходит аудит: адреса ОПО или юридический адрес организации."""

    if details.fleet is None:
        return "\n".join(item.address for item in details.objects)

    return order.company.address if order.company else "—"


def member_line(member: TeamMemberSchema) -> str:
    """Аудитор и его области аттестации."""

    return f"{member.name}, области аттестации: {', '.join(member.areas) or '—'}"


def team_values(team: list[TeamMemberSchema]) -> dict[str, str]:
    """Руководитель и состав группы."""

    lead = next((member for member in team if member.lead), None)

    return {
        "lead": member_line(lead) if lead else "—",
        "lead_name": lead.name if lead else "",
        "lead_initials": initials(lead.name) if lead else "",
        "team": "\n".join(member_line(member) for member in team if not member.lead) or "—",
    }


def schedule_values(plan: PlanSchema, generated_at: datetime) -> dict[str, str]:
    """Даты мероприятий в графике аудита."""

    documents = period(plan.documents_start, plan.documents_end)
    onsite = period(plan.onsite_start, plan.onsite_end) if plan.onsite_start else "Не предусмотрен"
    no_meetings = "Не проводится"
    end = max(filter(None, [plan.documents_end, plan.onsite_end]))

    return {
        "date_opening": moscow_time(plan.opening_at) if plan.opening_at else no_meetings,
        "date_preparation": f"{generated_at:%d.%m.%Y}",
        "date_documents": documents,
        "date_onsite": onsite,
        "date_interview": onsite if plan.onsite_start else documents,
        "date_closing": moscow_time(plan.closing_at) if plan.closing_at else no_meetings,
        "date_report": "По завершении проверки",
        "date_delivery": "После оплаты остатка",
        "workshops": plan.workshops or "",
        "interviewees": plan.interviewees,
        "period": period(plan.documents_start, end),
    }


def customer_values(order: BlitzOrder, details: AuditDetailsSchema) -> dict[str, str]:
    """Заказчик в шапке, критериях аудита и сведениях об объекте."""

    company = order.company
    sto = f", в том числе {details.params.sto_name}" if details.params.use_sto else ""

    return {
        "customer_name": company.name if company else details.applicant.organization,
        "customer_signer": initials(company.signer_name) if company else "",
        "organization": company.full_name if company else details.applicant.organization,
        "sto": sto,
    }


def build_plan_document(
    order: BlitzOrder,
    details: AuditDetailsSchema,
    plan: PlanSchema,
    team: list[TeamMemberSchema],
    generated_at: datetime,
) -> bytes:
    """Собрать Программу аудита."""

    values = {
        **customer_values(order, details),
        **team_values(team),
        **schedule_values(plan, generated_at),
        "address": address_text(order, details),
        "objects": objects_text(details),
        "reg_numbers": reg_numbers_text(details),
        "audit_kind": AUDIT_KINDS[details.params.kind],
        "audit_scope": audit_scope(details),
    }

    document = Document(str(TEMPLATES / "audit_program.docx"))
    fill(document, values)

    buffer = BytesIO()
    document.save(buffer)

    return buffer.getvalue()


def plan_filename(order: BlitzOrder, version: int) -> str:
    """Имя файла Программы."""

    return f"Программа аудита — заявка {order.id}, версия {version}.docx"
