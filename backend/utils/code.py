import secrets


def generate_numeric_code(length: int = 6) -> str:
    """Криптостойкий N-значный числовой код для OTP и верификации email."""
    upper = 10 ** length
    number = secrets.randbelow(upper - 10 ** (length - 1)) + 10 ** (length - 1)
    return str(number)
