"Проверка подписи Telegram WebApp initData и извлечение telegram_id."
import hashlib
import hmac
import json
from urllib.parse import parse_qsl

from fastapi import HTTPException, status

from config import telegram_config


def _verify(init_data: str) -> dict[str, str]:
    token = telegram_config.telegram_bot_token
    if not token:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Telegram-бот не настроен",
        )
    if not init_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Нет данных Telegram",
        )
    pairs = dict(parse_qsl(init_data, strict_parsing=False))
    received = pairs.pop("hash", "")
    check_string = "\n".join(f"{key}={pairs[key]}" for key in sorted(pairs))
    secret = hmac.new(b"WebAppData", token.encode(), hashlib.sha256).digest()
    computed = hmac.new(secret, check_string.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(computed, received):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Подпись Telegram неверна",
        )
    return pairs


def telegram_user_id(init_data: str) -> int:
    "Возвращает Telegram ID отправителя после проверки подписи."
    pairs = _verify(init_data)
    raw_user = pairs.get("user")
    if not raw_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Нет пользователя Telegram",
        )
    try:
        return int(json.loads(raw_user)["id"])
    except (ValueError, KeyError, TypeError) as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Некорректные данные Telegram",
        ) from exc
