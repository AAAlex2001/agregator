from __future__ import annotations

from datetime import date, datetime, timedelta, timezone
from uuid import uuid4

import httpx
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine

from load_models import (
    ChatDetailResponse,
    ChatOpenPayload,
    LoadSettings,
    LoginPayload,
    OrderApiResponse,
    OrderCreatePayload,
    OrderUpdatePayload,
    PreparedOrder,
    ProfileUpdatePayload,
    RegisteredUser,
    RegistrationPayload,
    ResponseApiResponse,
    ResponseCreatePayload,
    RoleName,
    UserApiResponse,
    UserIdentity,
    UserSession,
    UserSettingsResponse,
)


class ApiCallError(RuntimeError):
    pass


class DatabaseController:
    def __init__(self, db_url: str):
        self.engine: AsyncEngine = create_async_engine(db_url, future=True, pool_pre_ping=True)

    async def set_user_balance(self, user_id: int, balance_kopecks: int) -> None:
        async with self.engine.begin() as connection:
            result = await connection.execute(
                text("UPDATE users SET balance = :balance WHERE id = :user_id"),
                {"balance": balance_kopecks, "user_id": user_id},
            )
        if result.rowcount != 1:
            raise RuntimeError(f"Не удалось обновить баланс пользователя {user_id}")

    async def close(self) -> None:
        await self.engine.dispose()


class LoadApi:
    def __init__(self, settings: LoadSettings):
        self.settings = settings
        self.database = DatabaseController(settings.db_url) if settings.db_url else None

    async def __aenter__(self) -> "LoadApi":
        return self

    async def __aexit__(self, exc_type, exc, tb) -> None:
        if self.database is not None:
            await self.database.close()

    @property
    def has_database(self) -> bool:
        return self.database is not None

    def build_client(self) -> httpx.AsyncClient:
        return httpx.AsyncClient(
            base_url=self.settings.api_base_url,
            timeout=httpx.Timeout(self.settings.request_timeout_seconds),
            follow_redirects=True,
            verify=self.settings.verify_ssl,
            headers={"Accept": "application/json"},
        )

    def build_identity(self, scenario: str, iteration: int, role: RoleName) -> UserIdentity:
        token = uuid4().hex[:10]
        login = f"load-{scenario}-{role.lower()}-{iteration}-{token}"
        return UserIdentity(
            role=role,
            email=f"{login}@example.com",
            password="LoadPassA1!",
            first_name=f"{role.title()}-{iteration}",
            last_name=token,
        )

    async def register_user(self, client: httpx.AsyncClient, identity: UserIdentity) -> RegisteredUser:
        payload = RegistrationPayload(
            role=identity.role,
            email=identity.email,
            password=identity.password,
            first_name=identity.first_name,
            last_name=identity.last_name,
        )
        response = await client.post("/register/", json=payload.model_dump(mode="json"))
        data = self.parse_response(response, "Регистрация", UserApiResponse)
        return RegisteredUser(
            id=data.id,
            role=identity.role,
            email=identity.email,
            password=identity.password,
            first_name=identity.first_name,
            last_name=identity.last_name,
        )

    async def create_registered_user(self, scenario: str, iteration: int, role: RoleName) -> RegisteredUser:
        identity = self.build_identity(scenario, iteration, role)
        async with self.build_client() as client:
            return await self.register_user(client, identity)

    async def login_user(self, client: httpx.AsyncClient, user: RegisteredUser) -> UserApiResponse:
        payload = LoginPayload(email=user.email, password=user.password, role=user.role)
        response = await client.post("/login/", json=payload.model_dump(mode="json"))
        data = self.parse_response(response, "Авторизация", UserApiResponse)
        if "session_id" not in client.cookies:
            raise ApiCallError("Авторизация не вернула cookie session_id")
        return data

    async def create_authenticated_session(
        self,
        scenario: str,
        iteration: int,
        role: RoleName,
    ) -> UserSession:
        client = self.build_client()
        try:
            registered_user = await self.register_user(client, self.build_identity(scenario, iteration, role))
            await self.login_user(client, registered_user)
            return UserSession(user=registered_user, client=client)
        except Exception:
            await client.aclose()
            raise

    async def set_expert_balance(self, user_id: int) -> None:
        if self.database is None:
            raise RuntimeError("Для этого сценария нужен доступ к БД через LOAD_DB_URL или DATABASE_URL")
        await self.database.set_user_balance(user_id, self.settings.expert_balance_kopecks)

    async def create_order(self, session: UserSession, scenario: str, iteration: int) -> OrderApiResponse:
        title_seed = uuid4().hex[:6]
        payload = OrderCreatePayload(
            title=f"{scenario} order {iteration} {title_seed}",
            company=f"Company {title_seed}",
            typical_names="ОПО",
            comment=f"Load order {scenario} {iteration}",
            customer_id=session.user.id,
            sum_amount=self.settings.order_budget_kopecks,
            deadline=(date.today() + timedelta(days=14)).isoformat(),
            responses_deadline=(datetime.now(timezone.utc) + timedelta(days=5)).isoformat(),
        )
        response = await session.client.post("/orders/create-with-files", data=payload.model_dump(mode="json"))
        return self.parse_response(response, "Создание заявки", OrderApiResponse)

    async def update_order(
        self,
        session: UserSession,
        order: OrderApiResponse,
        scenario: str,
        iteration: int,
    ) -> OrderApiResponse:
        update_seed = uuid4().hex[:6]
        payload = OrderUpdatePayload(
            title=f"{scenario} updated {iteration} {update_seed}",
            company=f"Updated company {update_seed}",
            typical_names="ОПО обновлено",
            comment=f"Updated order {scenario} {iteration}",
            sum_amount=self.settings.order_budget_kopecks,
            deadline=(date.today() + timedelta(days=21)).isoformat(),
            responses_deadline=(datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        )
        response = await session.client.patch(
            f"/orders/{order.id}/update-with-files",
            data=payload.model_dump(mode="json"),
        )
        return self.parse_response(response, "Изменение заявки", OrderApiResponse)

    async def create_response(
        self,
        session: UserSession,
        order: OrderApiResponse,
        scenario: str,
        iteration: int,
    ) -> ResponseApiResponse:
        payload = ResponseCreatePayload(
            comment=f"Response for {scenario} {iteration}",
            proposed_sum_amount=min(self.settings.order_budget_kopecks, 9000),
            proposed_deadline=(date.today() + timedelta(days=10)).isoformat(),
        )
        response = await session.client.post(
            f"/orders/{order.id}/responses",
            data=payload.model_dump(mode="json"),
        )
        return self.parse_response(response, "Создание отклика", ResponseApiResponse)

    async def update_response_status(
        self,
        session: UserSession,
        response_id: int,
        new_status: str,
    ) -> ResponseApiResponse:
        response = await session.client.patch(
            f"/responses/{response_id}/status",
            params={"new_status": new_status},
        )
        return self.parse_response(response, f"Изменение статуса отклика {new_status}", ResponseApiResponse)

    async def update_profile(
        self,
        session: UserSession,
        scenario: str,
        iteration: int,
    ) -> UserSettingsResponse:
        update_seed = uuid4().hex[:6]
        payload = ProfileUpdatePayload(
            first_name=f"{scenario}-{iteration}",
            last_name=f"updated-{update_seed}",
        )
        response = await session.client.put(
            "/settings/profile",
            json=payload.model_dump(mode="json"),
        )
        return self.parse_response(response, "Изменение профиля", UserSettingsResponse)

    async def open_chat(self, session: UserSession, order_id: int) -> ChatDetailResponse:
        payload = ChatOpenPayload(order_id=order_id)
        response = await session.client.post("/chats/open", json=payload.model_dump(mode="json"))
        return self.parse_response(response, "Открытие чата", ChatDetailResponse)

    async def send_chat_message(
        self,
        session: UserSession,
        chat_uuid: str,
        text_value: str,
    ) -> None:
        response = await session.client.post(
            f"/chats/{chat_uuid}/messages",
            data={"text": text_value},
        )
        self.parse_response(response, "Отправка сообщения", None)

    async def prepare_order(self, scenario: str, iteration: int) -> PreparedOrder:
        customer = await self.create_authenticated_session(scenario, iteration, "CUSTOMER")
        try:
            order = await self.create_order(customer, scenario, iteration)
            return PreparedOrder(customer=customer, order=order)
        except Exception:
            await customer.close()
            raise

    def parse_response(self, response: httpx.Response, operation: str, model):
        if not response.is_success:
            raise ApiCallError(self.build_error_message(operation, response))
        if model is None:
            return None
        try:
            payload = response.json()
        except ValueError as error:
            raise ApiCallError(f"{operation}: ответ не JSON: {error}") from error
        return model.model_validate(payload)

    def build_error_message(self, operation: str, response: httpx.Response) -> str:
        body = response.text.strip()
        if len(body) > 500:
            body = f"{body[:500]}..."
        return f"{operation}: status={response.status_code}, body={body}"
