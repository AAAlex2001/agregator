from typing import Literal

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

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
    id: int
    value: str
    type: Literal["string", "document", "number", "type", "department"]


# ---------- Модели внешнего API /search/intellectual/tips ----------

class TechExpertTip(BaseModel):
    id: int
    q: str


class TechExpertDocument(BaseModel):
    id: int
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

class TechExpertDocumentDetail(BaseModel):
    id: int
    names: list[str] = Field(default_factory=list)
    clean_name: str = ""
    status: TechExpertNamed | None = None
    registrations: list[TechExpertRegistration] = Field(default_factory=list)
    access: str = ""
    edition_date: str | None = None
    change_date: str | None = None
    action_start_date: str | None = None
    action_end_date: str | None = None
    publications: list[str] = Field(default_factory=list)


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
    edition_date: str | None
    change_date: str | None
    action_start_date: str | None
    action_end_date: str | None
    publications: list[str]


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

        return TechExpertDocumentCard(
            id=document.id,
            name=name,
            status=document.status.name if document.status else None,
            doctype=registration.doctype.name if registration.doctype else "",
            number=registration.number,
            date=registration.date,
            department=registration.department.name if registration.department else "",
            access=document.access,
            edition_date=document.edition_date,
            change_date=document.change_date,
            action_start_date=document.action_start_date,
            action_end_date=document.action_end_date,
            publications=document.publications,
        )

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