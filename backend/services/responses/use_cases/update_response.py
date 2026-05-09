from fastapi import HTTPException, UploadFile, status

from models.order import Order
from models.response import OrderResponse, ResponseStatus
from schemas.notification import ResponseUpdateKind
from schemas.response import ResponseCreate
from services.email import SendResponseUpdatedEmailUseCase
from services.email.changes import summarize_response_changes
from services.responses.in_app_notifier import ResponseInAppNotifier
from services.responses.repository import ResponseRepository
from services.responses.use_cases.get_response_by_id import GetResponseByIdUseCase
from services.responses.use_cases.upload_response_files import UploadResponseFilesUseCase
from services.responses.validators import ResponseValidator


class UpdateResponseUseCase:
    def __init__(
        self,
        repo: ResponseRepository,
        validator: ResponseValidator,
        get_response: GetResponseByIdUseCase,
        upload_files: UploadResponseFilesUseCase,
        in_app: ResponseInAppNotifier,
        send_updated_email: SendResponseUpdatedEmailUseCase | None = None,
    ):
        self.repo = repo
        self.validator = validator
        self.get_response = get_response
        self.upload_files = upload_files
        self.in_app = in_app
        self.send_updated_email = send_updated_email

    async def execute(
        self,
        response_id: int,
        expert_id: int,
        data: ResponseCreate,
        keep_files: list[str] | None = None,
        new_files: list[UploadFile] | None = None,
    ) -> OrderResponse:
        await self.validator.ensure_expert(expert_id)
        response = await self.get_response.execute(response_id)

        self.ensure_owner(response, expert_id)
        self.ensure_editable(response)
        self.check_constraints(response.order, data)

        snapshot = self.snapshot(response)

        self.apply_fields(response, data)
        self.trim_files(response, keep_files)
        await self.repo.flush()

        if new_files:
            await self.upload_files.execute(response_id, expert_id, new_files)

        updated = await self.get_response.execute(response_id)
        await self.in_app.response_updated(updated, kind=ResponseUpdateKind.UPDATED)
        await self.send_email_if_changed(updated, snapshot)
        return updated

    @staticmethod
    def snapshot(response: OrderResponse) -> dict:
        return {
            "sum_amount": response.proposed_sum_amount,
            "deadline": response.proposed_deadline,
            "comment": response.comment or "",
            "files_count": len(response.technical_files or []),
        }

    async def send_email_if_changed(
        self, updated: OrderResponse, before: dict
    ) -> None:
        if self.send_updated_email is None:
            return
        summary = summarize_response_changes(
            before["sum_amount"],
            updated.proposed_sum_amount,
            before["deadline"],
            updated.proposed_deadline,
            before["comment"],
            updated.comment or "",
            before["files_count"],
            len(updated.technical_files or []),
        )
        if not summary:
            return
        await self.send_updated_email.execute(updated.id, summary)

    @staticmethod
    def ensure_owner(response: OrderResponse, expert_id: int) -> None:
        if response.expert_id == expert_id:
            return
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нельзя редактировать чужой отклик",
        )

    @staticmethod
    def ensure_editable(response: OrderResponse) -> None:
        if response.status == ResponseStatus.REVIEW:
            return
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Редактировать можно только отклик на рассмотрении",
        )

    @staticmethod
    def check_constraints(order: Order | None, data: ResponseCreate) -> None:
        if order is None:
            return
        if order.sum_amount > 0 and data.proposed_sum_amount > order.sum_amount:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Стоимость не может превышать бюджет заказчика",
            )
        if data.proposed_deadline > order.deadline:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Срок не может быть позже дедлайна заказчика",
            )

    @staticmethod
    def apply_fields(response: OrderResponse, data: ResponseCreate) -> None:
        sum_changed = data.proposed_sum_amount != response.proposed_sum_amount
        deadline_changed = data.proposed_deadline != response.proposed_deadline

        if sum_changed:
            response.previous_proposed_sum_amount = response.proposed_sum_amount
        if deadline_changed:
            response.previous_proposed_deadline = response.proposed_deadline

        response.comment = data.comment
        response.proposed_sum_amount = data.proposed_sum_amount
        response.proposed_deadline = data.proposed_deadline
        response.vat_kind = data.vat_kind

    @staticmethod
    def trim_files(response: OrderResponse, keep_files: list[str] | None) -> None:
        if keep_files is None:
            return
        existing = list(response.technical_files or [])
        response.technical_files = [f for f in existing if f in keep_files]
