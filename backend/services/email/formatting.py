from models.user import User


def greeting_for(user: User | None) -> str:
    if user is None:
        return "клиент Ресурс-Плюс"
    if user.first_name:
        return user.first_name
    if user.last_name:
        return user.last_name
    return "клиент Ресурс-Плюс"


def full_name(user: User | None) -> str:
    if user is None:
        return ""
    parts = [part for part in (user.last_name, user.first_name) if part]
    return " ".join(parts)


def contact_line(user: User | None) -> str:
    if user is None:
        return ""
    parts = [part for part in (user.email, user.phone) if part]
    return ", ".join(parts)
