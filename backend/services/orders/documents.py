"Сервисный модуль: documents."
from models.order import Order
from schemas.order import OrderDocuments


class OrderDocumentsService:
    "Маппинг и операции с категоризованными документами заказа."

    @staticmethod
    def from_order(order: Order) -> OrderDocuments:
        "Публичный метод сервисного слоя."
        return OrderDocuments(
            technical=list(order.technical_files or []),
            contract=list(order.contract_files or []),
            company=list(order.company_files or []),
            other=list(order.other_files or []),
        )

    @staticmethod
    def from_order_previous(order: Order) -> OrderDocuments | None:
        "Публичный метод сервисного слоя."
        snapshots = (
            order.previous_technical_files,
            order.previous_contract_files,
            order.previous_company_files,
            order.previous_other_files,
        )
        if all(snapshot is None for snapshot in snapshots):
            return None
        return OrderDocuments(
            technical=list(order.previous_technical_files or []),
            contract=list(order.previous_contract_files or []),
            company=list(order.previous_company_files or []),
            other=list(order.previous_other_files or []),
        )

    @staticmethod
    def write(order: Order, documents: OrderDocuments) -> None:
        "Публичный метод сервисного слоя."
        order.technical_files = list(documents.technical)
        order.contract_files = list(documents.contract)
        order.company_files = list(documents.company)
        order.other_files = list(documents.other)

    @staticmethod
    def write_previous(order: Order, documents: OrderDocuments) -> None:
        "Публичный метод сервисного слоя."
        order.previous_technical_files = list(documents.technical)
        order.previous_contract_files = list(documents.contract)
        order.previous_company_files = list(documents.company)
        order.previous_other_files = list(documents.other)

    @staticmethod
    def merge(left: OrderDocuments, right: OrderDocuments) -> OrderDocuments:
        "Публичный метод сервисного слоя."
        return OrderDocuments(
            technical=[*left.technical, *right.technical],
            contract=[*left.contract, *right.contract],
            company=[*left.company, *right.company],
            other=[*left.other, *right.other],
        )

    @staticmethod
    def count(documents: OrderDocuments) -> int:
        "Возвращает количество подходящих записей."
        return (
            len(documents.technical) + len(documents.contract)
            + len(documents.company) + len(documents.other)
        )
