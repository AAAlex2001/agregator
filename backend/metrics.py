import time
from typing import Optional

from fastapi import FastAPI, Request
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Histogram, generate_latest
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response


HTTP_REQUESTS_TOTAL = Counter(
    "app_http_requests_total",
    "Общее количество HTTP-запросов",
    ["method", "endpoint", "endpoint_ru", "status_code", "result", "fail_reason"],
)

HTTP_REQUEST_DURATION_SECONDS = Histogram(
    "app_http_request_duration_seconds",
    "Длительность HTTP-запросов",
    ["method", "endpoint", "endpoint_ru", "status_code"],
    buckets=(0.01, 0.03, 0.05, 0.1, 0.3, 0.5, 1, 2, 5, 10),
)

HTTP_STATUS_REASON_RU = {
    400: "Неверный запрос",
    401: "Не авторизован",
    403: "Нет доступа",
    404: "Не найдено",
    405: "Метод не поддерживается",
    409: "Конфликт данных",
    422: "Ошибка валидации",
    429: "Слишком много запросов",
    500: "Внутренняя ошибка сервера",
    502: "Ошибка шлюза",
    503: "Сервис недоступен",
    504: "Таймаут шлюза",
}

ENDPOINT_NAMES_RU = {
    "/": "Главная проверка API",
    "/health": "Проверка здоровья API",
    "/metrics": "Метрики Prometheus",
    "/api/login/": "Авторизация",
    "/api/login/refresh": "Обновление токена",
    "/api/login/logout": "Выход из аккаунта",
    "/api/register/": "Регистрация пользователя",
    "/api/forgot-password/send-code": "Запрос кода восстановления",
    "/api/forgot-password/reset-password": "Сброс пароля",
    "/api/orders/": "Список заказов",
    "/api/orders/public/{public_id}": "Публичный просмотр заказа",
    "/api/orders/{order_id}": "Детали заказа",
    "/api/orders/create-with-files": "Создание заказа с файлами",
    "/api/orders/{order_id}/update-with-files": "Обновление заказа с файлами",
    "/api/orders/{order_id}/files": "Добавление файлов к заказу",
    "/api/orders/{order_id}/responses": "Добавление отклика к заказу",
    "/api/responses": "Список откликов",
    "/api/responses/{response_id}/status": "Изменение статуса отклика",
    "/api/responses/{response_id}": "Редактирование отклика",
    "/api/settings/profile": "Профиль пользователя",
    "/api/settings/password": "Смена пароля",
    "/api/chats/open": "Открытие чата",
    "/api/chats/": "Список чатов",
    "/api/chats/{chat_uuid}": "Детали чата",
    "/api/chats/{chat_uuid}/presence": "Онлайн-статус чата",
    "/api/chats/{chat_uuid}/read": "Отметка сообщений как прочитанных",
    "/api/chats/{chat_uuid}/messages": "Отправка сообщения в чат",
    "/api/payments/create": "Создание платежа",
    "/api/payments/webhook": "Webhook оплаты",
    "/api/payments/balance": "Баланс пользователя",
    "/api/payments/history": "История платежей",
    "/api/payments/refund": "Возврат платежа",
    "/api/payments/withdraw": "Вывод средств",
    "/api/reviews": "Создание отзыва",
    "/api/reviews/my": "Мои отзывы",
}


def result_and_reason(status_code: int, exception_name: Optional[str] = None) -> tuple[str, str]:
    if 200 <= status_code < 400:
        return "success", "none"
    if exception_name:
        return "failed", f"Исключение:{exception_name}"
    return "failed", HTTP_STATUS_REASON_RU.get(status_code, f"HTTP {status_code}")


class PrometheusMetricsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.scope.get("type") != "http":
            return await call_next(request)

        start = time.perf_counter()
        route = request.scope.get("route")
        endpoint = getattr(route, "path", request.url.path)
        endpoint_ru = ENDPOINT_NAMES_RU.get(endpoint, f"Неизвестный эндпоинт: {endpoint}")

        status_code = 500
        exception_name: Optional[str] = None

        try:
            response = await call_next(request)
            status_code = response.status_code
            return response
        except Exception as exc:  # noqa: BLE001
            exception_name = exc.__class__.__name__
            raise
        finally:
            duration = time.perf_counter() - start
            result, fail_reason = result_and_reason(status_code, exception_name=exception_name)
            status_code_str = str(status_code)

            HTTP_REQUESTS_TOTAL.labels(
                method=request.method,
                endpoint=endpoint,
                endpoint_ru=endpoint_ru,
                status_code=status_code_str,
                result=result,
                fail_reason=fail_reason,
            ).inc()
            HTTP_REQUEST_DURATION_SECONDS.labels(
                method=request.method,
                endpoint=endpoint,
                endpoint_ru=endpoint_ru,
                status_code=status_code_str,
            ).observe(duration)


def setup_metrics(app: FastAPI) -> None:
    app.add_middleware(PrometheusMetricsMiddleware)

    @app.get("/metrics", include_in_schema=False, tags=["metrics"])
    async def metrics():
        return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)
