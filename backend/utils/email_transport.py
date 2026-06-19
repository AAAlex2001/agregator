import base64
import mimetypes

import httpx
from pydantic import BaseModel, ConfigDict, Field

from config import email_config
from utils.email import EmailAttachment, EmailMessage


class UnisenderGoBody(BaseModel):
    plaintext: str
    html: str | None = None


class UnisenderGoRecipient(BaseModel):
    email: str


class UnisenderGoAttachment(BaseModel):
    type: str
    name: str
    content: str  # base64


class UnisenderGoMessage(BaseModel):
    recipients: list[UnisenderGoRecipient]
    body: UnisenderGoBody
    subject: str
    from_email: str
    from_name: str
    reply_to: str
    attachments: list[UnisenderGoAttachment] = Field(default_factory=list)
    headers: dict[str, str] | None = None


class UnisenderGoPayload(BaseModel):
    message: UnisenderGoMessage


class UnisenderGoResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    status: str | None = None
    job_id: str | None = None
    code: int | str | None = None
    message: str | None = None


class UnisenderGoTransport:
    "Транспорт поверх Unisender Go HTTP API — https://godocs.unisender.ru/web-api-ref"

    SEND_PATH = "/ru/transactional/api/v1/email/send.json"

    def __init__(self, api_key: str, base_url: str):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.client = httpx.AsyncClient(
            timeout=httpx.Timeout(30.0, connect=10.0),
            limits=httpx.Limits(max_keepalive_connections=20, max_connections=100),
        )

    async def send(self, message: EmailMessage) -> None:
        payload = self.build_payload(message)
        url = f"{self.base_url}{self.SEND_PATH}"

        try:
            response = await self.client.post(
                url,
                headers={
                    "X-API-KEY": self.api_key,
                    "Content-Type": "application/json",
                },
                content=payload.model_dump_json(exclude_none=True).encode("utf-8"),
            )
        except httpx.HTTPError as exc:
            raise RuntimeError(f"Unisender Go сеть: {exc}") from exc

        try:
            parsed = UnisenderGoResponse.model_validate_json(response.content)
        except ValueError:
            raise RuntimeError(
                f"Unisender Go непонятный ответ ({response.status_code}): {response.text[:300]}"
            )

        if response.status_code >= 400 or parsed.status != "success":
            raise RuntimeError(
                f"Unisender Go отклонил ({response.status_code}): {parsed.model_dump_json(exclude_none=True)}"
            )

    def build_payload(self, message: EmailMessage) -> UnisenderGoPayload:
        return UnisenderGoPayload(
            message=UnisenderGoMessage(
                recipients=[UnisenderGoRecipient(email=message.to)],
                body=UnisenderGoBody(plaintext=message.text, html=message.html),
                subject=message.subject,
                from_email=message.from_email,
                from_name=message.from_name,
                reply_to=message.reply_to,
                attachments=self.build_attachments(message.attachments),
                headers=message.headers or None,
            )
        )

    def build_attachments(
        self, attachments: tuple[EmailAttachment, ...]
    ) -> list[UnisenderGoAttachment]:
        result: list[UnisenderGoAttachment] = []
        total_bytes = 0
        for att in attachments:
            if not att.path.exists() or not att.path.is_file():
                continue
            size = att.path.stat().st_size
            if total_bytes + size > email_config.attachments_max_total_bytes:
                continue
            total_bytes += size

            ctype, encoding = mimetypes.guess_type(att.filename)
            if ctype is None or encoding is not None:
                ctype = "application/octet-stream"

            content = att.path.read_bytes()
            result.append(
                UnisenderGoAttachment(
                    type=ctype,
                    name=att.filename,
                    content=base64.b64encode(content).decode("ascii"),
                )
            )
        return result


email_transport = UnisenderGoTransport(
    api_key=email_config.unisender_go_api_key,
    base_url=email_config.unisender_go_endpoint,
)
