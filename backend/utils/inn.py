def is_valid_inn(value: str | None) -> bool:
    if not value:
        return False
    return value.isdigit() and len(value) in {10, 12}
