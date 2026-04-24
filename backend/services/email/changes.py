from datetime import date


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
            f"Бюджет: {format_rubles(before_sum_amount)} → {format_rubles(after_sum_amount)}"
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


def summarize_response_changes(
    before_sum_amount: int,
    after_sum_amount: int,
    before_deadline: date,
    after_deadline: date,
    before_comment: str,
    after_comment: str,
    before_files_count: int,
    after_files_count: int,
) -> str:
    return summarize_order_changes(
        before_sum_amount,
        after_sum_amount,
        before_deadline,
        after_deadline,
        before_comment,
        after_comment,
        before_files_count,
        after_files_count,
    )


def format_rubles(sum_amount: int) -> str:
    roubles = sum_amount // 100
    kopeks = sum_amount % 100
    formatted = f"{roubles:,}".replace(",", " ")
    if kopeks:
        return f"{formatted},{kopeks:02d} ₽"
    return f"{formatted} ₽"


def format_date(value: date | None) -> str:
    if value is None:
        return "—"
    return value.strftime("%d.%m.%Y")
