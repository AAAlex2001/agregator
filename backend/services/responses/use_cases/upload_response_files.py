from fastapi import HTTPException, UploadFile, status

from models.response import OrderResponse
from services.responses.file_storage import ResponseFileStorage
from services.responses.repository import ResponseRepository
from services.responses.use_cases.get_response_by_id import GetResponseByIdUseCase

MAX_RESPONSE_FILES = 6


class UploadResponseFilesUseCase:
    def __init__(
        self,
        repo: ResponseRepository,
        get_response: GetResponseByIdUseCase,
        files: ResponseFileStorage,
    ):
        self.repo = repo
        self.get_response = get_response
        self.files = files

    async def execute(
        self,
        response_id: int,
        expert_id: int,
        uploads: list[UploadFile],
    ) -> OrderResponse:
        response = await self.get_response.execute(response_id)
        self.ensure_owner(response, expert_id)
        self.ensure_not_empty(uploads)

        existing = list(response.technical_files or [])
        self.ensure_total_limit(len(existing), len(uploads))

        new_paths = await self.files.save(response_id, uploads)
        response.technical_files = existing + new_paths
        await self.repo.flush()

        return await self.get_response.execute(response_id)

    @staticmethod
    def ensure_owner(response: OrderResponse, expert_id: int) -> None:
        if response.expert_id == expert_id:
            return
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нельзя загружать файлы к чужому отклику",
        )

    @staticmethod
    def ensure_not_empty(uploads: list[UploadFile]) -> None:
        if uploads:
            return
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Не переданы файлы для загрузки",
        )

    @staticmethod
    def ensure_total_limit(existing_count: int, new_count: int) -> None:
        if existing_count + new_count <= MAX_RESPONSE_FILES:
            return
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Можно прикрепить не более {MAX_RESPONSE_FILES} файлов",
        )
