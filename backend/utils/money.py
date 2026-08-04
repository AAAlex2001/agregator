"Форматирование денежных сумм."


def format_kopecks(amount_kopecks: int) -> str:
    "Копейки в строку вида «12 345 ₽» или «12 345,67 ₽»."
    roubles = amount_kopecks // 100
    formatted = f"{roubles:,}".replace(",", " ")
    kopecks = amount_kopecks % 100
    if kopecks:
        return f"{formatted},{kopecks:02d} ₽"
    return f"{formatted} ₽"
