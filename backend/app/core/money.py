"""Деньги: Decimal внутри и число в JSON, суммы цифрами и прописью, НДС «в том числе»."""

from decimal import ROUND_HALF_UP, Decimal
from typing import Annotated

from pydantic import PlainSerializer

KOPECK = Decimal("0.01")

RUBLES = ("рубль", "рубля", "рублей")
KOPECKS = ("копейка", "копейки", "копеек")
THOUSANDS = ("тысяча", "тысячи", "тысяч")
MILLIONS = ("миллион", "миллиона", "миллионов")

ONES = ("", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять")
ONES_FEMALE = ("", "одна", "две", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять")
TEENS = (
    "десять",
    "одиннадцать",
    "двенадцать",
    "тринадцать",
    "четырнадцать",
    "пятнадцать",
    "шестнадцать",
    "семнадцать",
    "восемнадцать",
    "девятнадцать",
)
TENS = (
    "",
    "",
    "двадцать",
    "тридцать",
    "сорок",
    "пятьдесят",
    "шестьдесят",
    "семьдесят",
    "восемьдесят",
    "девяносто",
)
HUNDREDS = (
    "",
    "сто",
    "двести",
    "триста",
    "четыреста",
    "пятьсот",
    "шестьсот",
    "семьсот",
    "восемьсот",
    "девятьсот",
)


def as_number(value: Decimal) -> float:
    """Сумма числом для фронтенда."""

    return float(value)


Money = Annotated[Decimal, PlainSerializer(as_number, return_type=float, when_used="json")]


def format_rub(amount: Decimal) -> str:
    """Сумма без копеек с пробелами между разрядами: «150 000 ₽»."""

    return f"{int(amount):,} ₽".replace(",", " ")


def format_amount(amount: Decimal) -> str:
    """Сумма с копейками для документов: «20 000,00»."""

    rubles = int(amount)
    kopecks = int((amount - rubles) * 100)

    return f"{rubles:,}".replace(",", " ") + f",{kopecks:02d}"


def plural(count: int, forms: tuple[str, str, str]) -> str:
    """Форма слова для числа: 1 рубль, 2 рубля, 5 рублей."""

    if 11 <= count % 100 <= 19:
        return forms[2]

    if count % 10 == 1:
        return forms[0]

    if 2 <= count % 10 <= 4:
        return forms[1]

    return forms[2]


def group_words(value: int, female: bool) -> list[str]:
    """Три разряда числа словами."""

    words = [HUNDREDS[value // 100]]
    rest = value % 100

    if 10 <= rest <= 19:
        return [*words, TEENS[rest - 10]]

    ones = ONES_FEMALE if female else ONES

    return [*words, TENS[rest // 10], ones[rest % 10]]


def number_to_words(value: int) -> str:
    """Целое число до миллиарда словами: «двадцать тысяч»."""

    if value == 0:
        return "ноль"

    millions, thousands, rest = value // 1_000_000, value // 1_000 % 1_000, value % 1_000
    words: list[str] = []

    if millions:
        words += [*group_words(millions, female=False), plural(millions, MILLIONS)]

    if thousands:
        words += [*group_words(thousands, female=True), plural(thousands, THOUSANDS)]

    if rest:
        words += group_words(rest, female=False)

    return " ".join(word for word in words if word)


def amount_in_words(amount: Decimal) -> str:
    """Сумма прописью: «Двадцать тысяч рублей 00 копеек»."""

    rubles = int(amount)
    kopecks = int((amount - rubles) * 100)
    text = f"{number_to_words(rubles)} {plural(rubles, RUBLES)} {kopecks:02d} {plural(kopecks, KOPECKS)}"

    return text[0].upper() + text[1:]


def vat_included(amount: Decimal, rate: int) -> Decimal:
    """НДС «в том числе»: цена уже с налогом, выделяем его из суммы."""

    if rate <= 0:
        return Decimal(0)

    return (amount * rate / (100 + rate)).quantize(KOPECK, rounding=ROUND_HALF_UP)
