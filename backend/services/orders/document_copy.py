from fastapi import HTTPException, status

from schemas.order import OrderDocuments
from services.orders.documents import OrderDocumentsService
from services.orders.files import OrderFileStorage
from services.orders.repository import OrderRepository


class OrderDocumentCopyService:
    def __init__(self, repo: OrderRepository, files: OrderFileStorage) -> None:
        self.repo = repo
        self.files = files

    async def copy_to(
        self,
        source_order_id: int,
        target_order_id: int,
        selected: OrderDocuments,
        current_user_id: int,
    ) -> OrderDocuments:
        source = await self.repo.get_by_id(source_order_id)
        if source is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Исходная заявка не найдена")
        if source.customer_id != current_user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нет доступа к исходной заявке")

        available = OrderDocumentsService.from_order(source)
        self.ensure_subset(selected, available)
        return await self.files.copy_documents(source_order_id, target_order_id, selected)

    @staticmethod
    def ensure_subset(selected: OrderDocuments, available: OrderDocuments) -> None:
        for selected_paths, available_paths in (
            (selected.technical, available.technical),
            (selected.contract, available.contract),
            (selected.company, available.company),
            (selected.other, available.other),
        ):
            if not set(selected_paths).issubset(available_paths):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Выбраны документы, не принадлежащие исходной заявке",
                )
