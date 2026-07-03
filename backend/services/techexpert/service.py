from typing import Literal
import httpx
from fastapi import APIRouter, HTTPException
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
                "Content-Type": "application/json",
            },
        )

    async def request(self, method: str, url: str, **kwargs) -> dict:
        try:
            response = await self.client.request(method, url, **kwargs)

            if response.status_code == 401:
                raise HTTPException(status_code=401, detail="Unauthorized")

            if response.status_code == 400:
                raise HTTPException(status_code=400, detail="Bad Request")

            if response.status_code == 404:
                raise HTTPException(status_code=404, detail="Not Found")

            if response.status_code == 429:
                raise HTTPException(status_code=429, detail="Too Many Requests")

            if response.status_code >= 500:
                raise HTTPException(
                    status_code=502,
                    detail="TechExpert external API error",
                )

            response.raise_for_status()
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
async def autocomplete(q: str):
    service = TechExpertService(
        url="https://api.docs.cntd.ru/v1",
    )
    try:
        payload = TechExpertInput(q=q)
        result = await service.get_tech_autocomplete(payload)
        return result
    finally:
        await service.close()