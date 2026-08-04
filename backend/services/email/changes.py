"Сервисный модуль: changes."
from datetime import date

from utils.money import format_kopecks


def summarize_order_changes(
    before_sum_amount: int,
    after_sum_amount: int,
    before_deadline: date,
    after_deadline: date,
    before_comment: str,
    after_comment: str,
    before_files_count: int,
    after_files_count: int,
) -> str:
    "Человеческая сводка для письма: перечисляем только реально изменившиеся поля."
    lines: list[str] = []

    if before_sum_amount != after_sum_amount:
        lines.append(
            f"Бюджет: {format_kopecks(before_sum_amount)} → {format_kopecks(after_sum_amount)}"
        )
    if before_deadline != after_deadline:
        lines.append(
            f"Срок: {format_date(before_deadline)} → {format_date(after_deadline)}"
        )
    if before_comment != after_comment:
        lines.append("Комментарий: обновлён")
    if before_files_count != after_files_count:
        lines.append(
            f"Файлы: {before_files_count} → {after_files_count}"
        )

    return "\n".join(lines)


def format_date(value: date | None) -> str:
    "Форматирует значение для отображения."
    if value is None:
        return "—"
    return value.strftime("%d.%m.%Y")
