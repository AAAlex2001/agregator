"Изменение полей отклика и отслеживание файлов."
from fastapi import UploadFile

from models.response import OrderResponse
from schemas.response import ResponseCreate


class ResponseFieldMutator:
    "Применяет изменения к полям отклика и трекает прошлые значения."

    @staticmethod
    def apply_fields(response: OrderResponse, data: ResponseCreate) -> None:
        "Публичный метод сервисного слоя."
        if data.proposed_sum_amount != response.proposed_sum_amount:
            response.previous_proposed_sum_amount = response.proposed_sum_amount
        if data.proposed_start_date != response.proposed_start_date:
            response.previous_proposed_start_date = response.proposed_start_date
        if data.proposed_deadline != response.proposed_deadline:
            response.previous_proposed_deadline = response.proposed_deadline
        if (data.comment or "") != (response.comment or ""):
            response.previous_comment = response.comment or ""
        if data.vat_kind != response.vat_kind:
            response.previous_vat_kind = response.vat_kind

        response.comment = data.comment
        response.proposed_sum_amount = data.proposed_sum_amount
        response.proposed_start_date = data.proposed_start_date
        response.proposed_deadline = data.proposed_deadline
        response.vat_kind = data.vat_kind

    @staticmethod
    def track_files_change_before(
        response: OrderResponse,
        keep_files: list[str] | None,
        new_files: list[UploadFile] | None,
    ) -> None:
        "Публичный метод сервисного слоя."
        existing = list(response.technical_files or [])
        kept = existing if keep_files is None else [f for f in existing if f in keep_files]
        will_change = (kept != existing) or bool(new_files)
        if will_change:
            response.previous_technical_files = existing

    @staticmethod
    def trim_files(response: OrderResponse, keep_files: list[str] | None) -> None:
        "Публичный метод сервисного слоя."
        if keep_files is None:
            return
        existing = list(response.technical_files or [])
        response.technical_files = [f for f in existing if f in keep_files]
