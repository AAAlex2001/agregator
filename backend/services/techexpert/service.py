import re
from typing import Literal

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field, field_validator

from dependencies.auth import get_current_user

router = APIRouter(
    prefix="/tech-expert",
    tags=["TechExpert"],
)


# ---------- входной query ----------

class TechExpertInput(BaseModel):
    q: str = Field(..., description="Поисковая строка")


# ---------- ответ для фронта ----------

class TechExpertOutput(BaseModel):
    id: int | None = None
    value: str
    type: Literal["string", "document", "number", "type", "department"]


# ---------- Модели внешнего API /search/intellectual/tips ----------

class TechExpertTip(BaseModel):
    id: int | None = None
    q: str


class TechExpertDocument(BaseModel):
    id: int | None = None
    names: list[str] = Field(default_factory=list)


class TechExpertGroups(BaseModel):
    tips: list[TechExpertTip] = Field(default_factory=list)
    documents: list[TechExpertDocument] = Field(default_factory=list)


class TechExpertTipsData(BaseModel):
    groups: TechExpertGroups


class TechExpertTipsResponse(BaseModel):
    data: TechExpertTipsData


# ---------- Модели внешнего API /search/intellectual/documents ----------

class TechExpertNamed(BaseModel):
    name: str = ""

    @field_validator("name", mode="before")
    @classmethod
    def empty_if_null(cls, value: object) -> object:
        return value if isinstance(value, str) else ""


class TechExpertRegistration(BaseModel):
    date: str | None = None
    number: str | None = None
    department: TechExpertNamed | None = None
    doctype: TechExpertNamed | None = None


class TechExpertSearchDocument(BaseModel):
    id: int
    names: list[str] = Field(default_factory=list)
    status: TechExpertNamed | None = None
    registrations: list[TechExpertRegistration] = Field(default_factory=list)
    access: str = ""


class TechExpertPagination(BaseModel):
    total: int = 0


class TechExpertDocumentsBlock(BaseModel):
    data: list[TechExpertSearchDocument] = Field(default_factory=list)
    pagination: TechExpertPagination = Field(default_factory=TechExpertPagination)


class TechExpertDocumentsResponse(BaseModel):
    documents: TechExpertDocumentsBlock


class TechExpertDocumentItem(BaseModel):
    id: int
    name: str
    status: str | None
    doctype: str
    number: str | None
    date: str | None
    department: str
    access: str


class TechExpertDocumentsOutput(BaseModel):
    items: list[TechExpertDocumentItem]
    total: int


# ---------- Модели внешнего API /document/{id} ----------

class TechExpertPdfSources(BaseModel):
    scan: bool = False
    djvu: bool = False
    html: bool = False


class TechExpertFiles(BaseModel):
    attachments: bool = False
    pdf: str | None = None
    pdf_sources: TechExpertPdfSources = Field(default_factory=TechExpertPdfSources)
    djvu: bool = False


class TechExpertContentText(BaseModel):
    blocks: int = 0
    titles: bool = False


class TechExpertContent(BaseModel):
    text: TechExpertContentText = Field(default_factory=TechExpertContentText)


class TechExpertDocumentDetail(BaseModel):
    id: int
    names: list[str] = Field(default_factory=list)
    clean_name: str = ""
    status: TechExpertNamed | None = None
    registrations: list[TechExpertRegistration] = Field(default_factory=list)
    access: str = ""
    access_reason: str | None = None
    is_important: bool = False
    is_favorite: bool = False
    is_purchased: bool = False
    price: int = 0
    edition_date: str | None = None
    change_date: str | None = None
    action_start_date: str | None = None
    action_end_date: str | None = None
    certificate_number: str | None = None
    certificate_date: str | None = None
    mu_number: str | None = None
    mu_date: str | None = None
    in_product_created: str | None = None
    in_product_updated: str | None = None
    publications: list[str] = Field(default_factory=list)
    content: TechExpertContent = Field(default_factory=TechExpertContent)
    files: TechExpertFiles = Field(default_factory=TechExpertFiles)


class TechExpertDocumentDetailResponse(BaseModel):
    data: TechExpertDocumentDetail


class TechExpertDocumentCard(BaseModel):
    id: int
    name: str
    status: str | None
    doctype: str
    number: str | None
    date: str | None
    department: str
    access: str
    access_reason: str | None
    is_important: bool
    is_favorite: bool
    is_purchased: bool
    price: int
    edition_date: str | None
    change_date: str | None
    action_start_date: str | None
    action_end_date: str | None
    certificate_number: str | None
    certificate_date: str | None
    mu_number: str | None
    mu_date: str | None
    in_product_created: str | None
    in_product_updated: str | None
    has_text: bool
    has_pdf: bool
    has_scan: bool
    has_html: bool
    has_attachments: bool
    blocks: int
    publications: list[str]


class TechExpertContentResponse(BaseModel):
    content: str


# ---------- Сервис ----------

class TechExpertService:
    def __init__(self, url: str):
        self.client = httpx.AsyncClient(
            base_url=url.rstrip("/"),
            timeout=httpx.Timeout(10.0, connect=10.0),
            headers={
                "Accept": "application/json",
            },
        )

    async def request(self, method: str, url: str, **kwargs) -> dict:
        try:
            response = await self.client.request(method, url, **kwargs)

            if response.status_code >= 400:
                error_detail = "TechExpert API request error"

                try:
                    error_body = response.json()

                    error_detail = (
                        error_body.get("message")
                        or error_body.get("errors", {})
                            .get("exception", {})
                            .get("message")
                        or error_detail
                    )

                except ValueError:
                    pass

                if response.status_code in (500, 502, 503, 504):
                    raise HTTPException(
                        status_code=502,
                        detail=error_detail,
                    )

                raise HTTPException(
                    status_code=response.status_code,
                    detail=error_detail,
                )

            return response.json()

        except httpx.TimeoutException:
            raise HTTPException(
                status_code=504,
                detail="TechExpert API timeout",
            )

        except httpx.RequestError:
            raise HTTPException(
                status_code=502,
                detail="TechExpert API connection error",
            )

    async def get_tech_autocomplete(
        self,
        payload: TechExpertInput,
    ) -> list[TechExpertOutput]:
        data = await self.request(
            "GET",
            "/search/intellectual/tips",
            params=payload.model_dump(exclude_none=True),
        )

        parsed = TechExpertTipsResponse.model_validate(data)

        result: list[TechExpertOutput] = []

        for tip in parsed.data.groups.tips:
            result.append(
                TechExpertOutput(
                    id=tip.id,
                    value=tip.q,
                    type="string",
                )
            )

        for document in parsed.data.groups.documents:
            result.append(
                TechExpertOutput(
                    id=document.id,
                    value=document.names[0] if document.names else "",
                    type="document",
                )
            )

        return result

    async def search_documents(
        self,
        payload: TechExpertInput,
    ) -> TechExpertDocumentsOutput:
        data = await self.request(
            "GET",
            "/search/intellectual/documents",
            params=payload.model_dump(exclude_none=True),
        )

        parsed = TechExpertDocumentsResponse.model_validate(data)

        items: list[TechExpertDocumentItem] = []

        for document in parsed.documents.data:
            registration = (
                document.registrations[0]
                if document.registrations
                else TechExpertRegistration()
            )

            items.append(
                TechExpertDocumentItem(
                    id=document.id,
                    name=document.names[0] if document.names else "",
                    status=document.status.name if document.status else None,
                    doctype=registration.doctype.name if registration.doctype else "",
                    number=registration.number,
                    date=registration.date,
                    department=registration.department.name if registration.department else "",
                    access=document.access,
                )
            )

        return TechExpertDocumentsOutput(
            items=items,
            total=parsed.documents.pagination.total,
        )

    async def get_document(self, document_id: int) -> TechExpertDocumentCard:
        data = await self.request("GET", f"/document/{document_id}")

        parsed = TechExpertDocumentDetailResponse.model_validate(data)
        document = parsed.data

        registration = (
            document.registrations[0]
            if document.registrations
            else TechExpertRegistration()
        )

        name = document.clean_name or (document.names[0] if document.names else "")
        sources = document.files.pdf_sources

        return TechExpertDocumentCard(
            id=document.id,
            name=name,
            status=document.status.name if document.status else None,
            doctype=registration.doctype.name if registration.doctype else "",
            number=registration.number,
            date=registration.date,
            department=registration.department.name if registration.department else "",
            access=document.access,
            access_reason=document.access_reason,
            is_important=document.is_important,
            is_favorite=document.is_favorite,
            is_purchased=document.is_purchased,
            price=document.price,
            edition_date=document.edition_date,
            change_date=document.change_date,
            action_start_date=document.action_start_date,
            action_end_date=document.action_end_date,
            certificate_number=document.certificate_number,
            certificate_date=document.certificate_date,
            mu_number=document.mu_number,
            mu_date=document.mu_date,
            in_product_created=document.in_product_created,
            in_product_updated=document.in_product_updated,
            has_text=document.content.text.blocks > 0,
            has_pdf=document.files.pdf is not None,
            has_scan=sources.scan,
            has_html=sources.html,
            has_attachments=document.files.attachments,
            blocks=document.content.text.blocks,
            publications=document.publications,
        )

    async def get_document_content(self, document_id: int, block: int, strict: bool) -> str:
        data = await self.request(
            "GET",
            f"/document/{document_id}/content/text/block/{block}",
            params={"strict": "true" if strict else "false"},
        )
        content = data.get("data", {}).get("content", "")
        return self.clean_content(content)

    @staticmethod
    def clean_content(html: str) -> str:
        html = re.sub(r"<style[^>]*>.*?</style>", "", html, flags=re.DOTALL | re.IGNORECASE)
        html = re.sub(r"<script[^>]*>.*?</script>", "", html, flags=re.DOTALL | re.IGNORECASE)
        html = re.sub(r"""\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)""", "", html, flags=re.IGNORECASE)
        return html

    async def close(self) -> None:
        await self.client.aclose()


# ---------- Роут ----------

@router.get(
    "/autocomplete",
    response_model=list[TechExpertOutput],
)
async def autocomplete(
    q: str = Query(..., description="Поисковая строка"),
    user_id: int = Depends(get_current_user),
):
    if user_id is None:
        raise HTTPException(status_code=401, detail="Пользователь не авторизован")

    service = TechExpertService(
        url="https://docs.cntd.ru/api",
    )

    try:
        payload = TechExpertInput(q=q)
        result = await service.get_tech_autocomplete(payload)

        return result

    finally:
        await service.close()


@router.get(
    "/documents",
    response_model=TechExpertDocumentsOutput,
)
async def documents(
    q: str = Query(..., description="Поисковая строка"),
    user_id: int = Depends(get_current_user),
):
    if user_id is None:
        raise HTTPException(status_code=401, detail="Пользователь не авторизован")

    service = TechExpertService(
        url="https://docs.cntd.ru/api",
    )

    try:
        payload = TechExpertInput(q=q)
        result = await service.search_documents(payload)

        return result

    finally:
        await service.close()


@router.get(
    "/document/{document_id}",
    response_model=TechExpertDocumentCard,
)
async def document(
    document_id: int,
    user_id: int = Depends(get_current_user),
):
    if user_id is None:
        raise HTTPException(status_code=401, detail="Пользователь не авторизован")

    service = TechExpertService(
        url="https://docs.cntd.ru/api",
    )

    try:
        result = await service.get_document(document_id)

        return result

    finally:
        await service.close()


@router.get(
    "/document/{document_id}/content",
    response_model=TechExpertContentResponse,
)
async def document_content(
    document_id: int,
    block: int = Query(1, ge=1),
    strict: bool = Query(False),
    user_id: int = Depends(get_current_user),
):
    if user_id is None:
        raise HTTPException(status_code=401, detail="Пользователь не авторизован")

    service = TechExpertService(
        url="https://docs.cntd.ru/api",
    )

    try:
        content = await service.get_document_content(document_id, block, strict)
        return TechExpertContentResponse(content=content)

    finally:
        await service.close()
