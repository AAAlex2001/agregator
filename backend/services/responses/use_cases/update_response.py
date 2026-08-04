"Use case: update response."
from fastapi import HTTPException, UploadFile, status

from models.order import Order
from models.response import OrderResponse, ResponseStatus
from schemas.response import ResponseCreate
from services.email import SendResponseUpdatedEmailUseCase
from services.responses.in_app_notifier import ResponseInAppNotifier
from services.responses.repository import ResponseRepository
from services.responses.response_field_mutator import ResponseFieldMutator
from services.responses.response_update_notifier import ResponseUpdateNotifier
from services.responses.use_cases.get_response_by_id import GetResponseByIdUseCase
from services.responses.use_cases.upload_response_files import UploadResponseFilesUseCase
from services.responses.validators import ResponseValidator, check_budget, check_dates


class UpdateResponseUseCase:
    "Сценарий приложения: координирует репозитории и сервисы."
    def __init__(
        self,
        repo: ResponseRepository,
        validator: ResponseValidator,
        get_response: GetResponseByIdUseCase,
        upload_files: UploadResponseFilesUseCase,
        in_app: ResponseInAppNotifier,
        send_updated_email: SendResponseUpdatedEmailUseCase | None = None,
    ) -> None:
        self.repo = repo
        self.validator = validator
        self.get_response = get_response
        self.upload_files = upload_files
        self.mutator = ResponseFieldMutator()
        self.notifier = ResponseUpdateNotifier(in_app=in_app, send_updated_email=send_updated_email)

    async def execute(
        self,
        response_id: int,
        expert_id: int,
        data: ResponseCreate,
        keep_files: list[str] | None = None,
        new_files: list[UploadFile] | None = None,
    ) -> OrderResponse:
        "Запускает основной сценарий use case."
        await self.validator.ensure_expert(expert_id)
        response = await self.get_response.execute(response_id)

        self.ensure_owner(response, expert_id)
        self.ensure_editable(response)
        self.check_constraints(response.order, data)

        before = self.notifier.snapshot(response)

        self.mutator.apply_fields(response, data)
        self.mutator.track_files_change_before(response, keep_files, new_files)
        self.mutator.trim_files(response, keep_files)
        await self.repo.flush()

        if new_files:
            await self.upload_files.execute(response_id, expert_id, new_files)

        updated = await self.get_response.execute(response_id)
        await self.notifier.notify(updated, before)
        return updated

    @staticmethod
    def ensure_owner(response: OrderResponse, expert_id: int) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if response.expert_id == expert_id:
            return
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нельзя редактировать чужой отклик",
        )

    @staticmethod
    def ensure_editable(response: OrderResponse) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if response.status == ResponseStatus.REVIEW:
            return
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Редактировать можно только отклик на рассмотрении",
        )

    @staticmethod
    def check_constraints(order: Order | None, data: ResponseCreate) -> None:
        "Проверяет ограничения заказа для обновляемого отклика."
        if order is None:
            return
        check_budget(order, data.proposed_sum_amount)
        check_dates(order, data.proposed_start_date, data.proposed_deadline)
