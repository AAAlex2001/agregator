from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Literal
from urllib.parse import urlsplit, urlunsplit

import httpx
from pydantic import BaseModel, EmailStr, Field


RoleName = Literal["CUSTOMER", "EXPERT"]


class LoadSettings(BaseModel):
    base_url: str = Field(default="https://plus-resurs.com")
    db_url: str | None = None
    rate_per_second: int = Field(default=10, ge=1)
    duration_seconds: int = Field(default=5, ge=1)
    request_timeout_seconds: float = Field(default=10.0, gt=0)
    order_budget_rub: int = Field(default=100, ge=1)
    max_failures: int = Field(default=0, ge=0)
    max_concurrency: int | None = Field(default=None, ge=1)
    verify_ssl: bool = True

    @property
    def api_base_url(self) -> str:
        parsed = urlsplit(self.base_url)
        if parsed.scheme and parsed.netloc:
            path = parsed.path.rstrip("/")
            api_path = path if path.endswith("/api") else "/api"
            return urlunsplit((parsed.scheme, parsed.netloc, api_path, "", ""))
        normalized = self.base_url.rstrip("/")
        return normalized if normalized.endswith("/api") else f"{normalized}/api"

    @property
    def total_iterations(self) -> int:
        return self.rate_per_second * self.duration_seconds

    @property
    def effective_max_concurrency(self) -> int:
        return min(self.max_concurrency or self.rate_per_second, self.total_iterations)

    @property
    def order_budget_kopecks(self) -> int:
        return self.order_budget_rub * 100


class RegistrationPayload(BaseModel):
    role: RoleName
    email: EmailStr
    password: str
    first_name: str
    last_name: str


class LoginPayload(BaseModel):
    email: EmailStr
    password: str
    role: RoleName


class OrderCreatePayload(BaseModel):
    title: str
    company: str
    typical_names: str
    comment: str
    customer_id: int
    sum_amount: int
    deadline: str
    responses_deadline: str
    badges_json: str = "[]"


class OrderUpdatePayload(BaseModel):
    title: str
    company: str
    typical_names: str
    comment: str
    sum_amount: int
    deadline: str
    responses_deadline: str
    badges_json: str = "[]"
    keep_files: str = "[]"


class ResponseCreatePayload(BaseModel):
    comment: str
    proposed_sum_amount: int
    proposed_deadline: str


class ProfileUpdatePayload(BaseModel):
    first_name: str
    last_name: str


class ChatOpenPayload(BaseModel):
    order_id: int


class UserApiResponse(BaseModel):
    id: int
    role: str
    email: EmailStr | None = None
    phone: str | None = None
    created_at: datetime


class OrderApiResponse(BaseModel):
    id: int
    public_id: str
    title: str
    company: str
    comment: str
    customer_id: int
    assigned_expert_id: int | None = None
    sum_amount_raw: int
    date: str
    responses_deadline: str | None = None
    status: str


class ResponseApiResponse(BaseModel):
    id: int
    order_id: int
    status: str
    proposed_sum_amount_raw: int
    proposed_deadline_raw: str
    created_at: datetime


class UserSettingsResponse(BaseModel):
    id: int
    email: EmailStr | None = None
    phone: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    role: str


class ChatMessageResponse(BaseModel):
    id: int
    chat_id: int
    sender_id: int
    sender_role: str
    text: str
    file_url: str | None = None
    file_name: str | None = None
    attachments: list[dict[str, str]] = Field(default_factory=list)
    is_read: bool = False
    created_at: datetime


class ChatDetailResponse(BaseModel):
    id: int
    uuid: str
    order_id: int
    customer_id: int
    expert_id: int
    order_title: str
    order_company: str
    counterpart_id: int
    counterpart_name: str
    messages: list[ChatMessageResponse]


@dataclass(slots=True)
class UserIdentity:
    role: RoleName
    email: str
    password: str
    first_name: str
    last_name: str


@dataclass(slots=True)
class RegisteredUser:
    id: int
    role: RoleName
    email: str
    password: str
    first_name: str
    last_name: str


@dataclass(slots=True)
class UserSession:
    user: RegisteredUser
    client: httpx.AsyncClient

    async def close(self) -> None:
        await self.client.aclose()


@dataclass(slots=True)
class PreparedOrder:
    customer: UserSession
    order: OrderApiResponse


@dataclass(slots=True)
class PreparedResponseWorld:
    customer: UserSession
    expert: UserSession
    order: OrderApiResponse
    response: ResponseApiResponse | None = None
    chat: ChatDetailResponse | None = None
