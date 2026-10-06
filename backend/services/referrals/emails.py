"""Канонический email: алиасы одного почтового ящика участвуют в программе один раз."""

DOMAIN_ALIASES = {
    "googlemail.com": "gmail.com",
    "ya.ru": "yandex.ru",
    "yandex.com": "yandex.ru",
    "yandex.by": "yandex.ru",
    "yandex.kz": "yandex.ru",
    "yandex.ua": "yandex.ru",
}


def canonical_email(email: str | None) -> str:
    """Убирает регистр, метку после «+», точки в Gmail и различие «.» и «-» в Яндексе."""
    normalized = (email or "").strip().lower()
    local, separator, domain = normalized.rpartition("@")
    if not separator:
        return normalized

    domain = DOMAIN_ALIASES.get(domain, domain)
    local = local.split("+", 1)[0]
    if domain == "gmail.com":
        local = local.replace(".", "")
    elif domain == "yandex.ru":
        local = local.replace(".", "-")
    return f"{local}@{domain}"
