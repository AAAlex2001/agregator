from typing import Literal

import httpx
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field


router = APIRouter(
    prefix="/tech-expert",
    tags=["TechExpert"],
)


class TechExpertInput(BaseModel):
    q: str = Field(..., description="Запрос")


class TechExpertOutput(BaseModel):
    id: int
    value: str
    type: Literal["string", "document", "number", "type", "department"]


class TechExpertCompleteResponse(BaseModel):
    data: list[TechExpertOutput]


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
                    error_detail = error_body.get("message") or error_detail
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
            "/search/complete",
            params=payload.model_dump(exclude_none=True),
        )

        parsed = TechExpertCompleteResponse.model_validate(data)

        return parsed.data

    async def close(self) -> None:
        await self.client.aclose()


@router.get(
    "/autocomplete",
    response_model=list[TechExpertOutput],
)
async def autocomplete(
    q: str = Query(..., description="Поисковая строка"),
):
    service = TechExpertService(
        url="https://docs.cntd.ru/api",
    )

    try:
        payload = TechExpertInput(q=q)
        result = await service.get_tech_autocomplete(payload)

        return result

    finally:
        await service.close()