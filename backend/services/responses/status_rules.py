"Сервисный модуль: status rules."
from fastapi import HTTPException
from fastapi import status as http_status

from models.order import OrderStatus
from models.response import OrderResponse, ResponseStatus
from models.user import User, UserRole

EXPERT_ALLOWED_TARGETS = {ResponseStatus.IN_PROGRESS, ResponseStatus.COMPLETED}
CUSTOMER_ALLOWED_TARGETS = {
    ResponseStatus.REVIEW,
    ResponseStatus.REJECTED,
    ResponseStatus.ACCEPTED,
    ResponseStatus.IN_PROGRESS,
    ResponseStatus.COMPLETED,
}
EXPERT_IN_PROGRESS_FROM = {ResponseStatus.ACCEPTED, ResponseStatus.IN_PROGRESS}
EXPERT_COMPLETED_FROM = {ResponseStatus.IN_PROGRESS, ResponseStatus.COMPLETED}
CUSTOMER_IN_PROGRESS_FROM = {ResponseStatus.REVIEW, ResponseStatus.ACCEPTED, ResponseStatus.IN_PROGRESS}
CUSTOMER_ACCEPTED_FROM = {ResponseStatus.REVIEW, ResponseStatus.IN_PROGRESS}
CUSTOMER_REVIEW_FROM = {ResponseStatus.REJECTED}
CUSTOMER_COMPLETED_FROM = {
    ResponseStatus.ACCEPTED,
    ResponseStatus.IN_PROGRESS,
    ResponseStatus.COMPLETED,
}


class ResponseStatusRules:
    "Валидация переходов статуса отклика. Без IO, чистые проверки."

    def check(
        self,
        actor: User,
        response: OrderResponse,
        new_status: ResponseStatus,
    ) -> None:
        "Публичный метод сервисного слоя."
        if actor.role == UserRole.EXPERT:
            self.check_expert(actor, response, new_status)
            return
        if actor.role == UserRole.CUSTOMER:
            self.check_customer(actor, response, new_status)
            return
        raise HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для изменения статуса",
        )

    def check_expert(
        self,
        actor: User,
        response: OrderResponse,
        new_status: ResponseStatus,
    ) -> None:
        "Проверяет условие и возвращает результат."
        if response.expert_id != actor.id:
            raise self.forbidden("Нельзя изменять чужой отклик")
        if new_status not in EXPERT_ALLOWED_TARGETS:
            raise self.forbidden("Эксперт может только начать или завершить проект")
        if new_status == ResponseStatus.IN_PROGRESS:
            self.check_expert_in_progress(actor, response)
        if new_status == ResponseStatus.COMPLETED:
            self.check_expert_completed(actor, response)

    def check_expert_in_progress(self, actor: User, response: OrderResponse) -> None:
        "Проверяет условие и возвращает результат."
        if response.status not in EXPERT_IN_PROGRESS_FROM:
            raise self.conflict("В работу можно перевести только принятый отклик")
        if not response.order or response.order.assigned_expert_id != actor.id:
            raise self.conflict("Нельзя начать работу по незакрепленному заказу")

    def check_expert_completed(self, actor: User, response: OrderResponse) -> None:
        "Проверяет условие и возвращает результат."
        if response.status not in EXPERT_COMPLETED_FROM:
            raise self.conflict("Завершить можно только отклик со статусом в работе")
        if not response.order or response.order.assigned_expert_id != actor.id:
            raise self.conflict("Нельзя завершить незакрепленный заказ")

    def check_customer(
        self,
        actor: User,
        response: OrderResponse,
        new_status: ResponseStatus,
    ) -> None:
        "Проверяет условие и возвращает результат."
        if not response.order or response.order.customer_id != actor.id:
            raise self.forbidden("Нельзя изменять отклик к чужому заказу")
        if new_status not in CUSTOMER_ALLOWED_TARGETS:
            raise self.forbidden(
                "Заказчик может только отклонять, принимать, переводить отклик в переговоры или завершать проект"
            )
        if new_status == ResponseStatus.REVIEW:
            self.check_customer_review(response)
        if new_status == ResponseStatus.IN_PROGRESS:
            self.check_customer_in_progress(response)
        if new_status == ResponseStatus.ACCEPTED:
            self.check_customer_accepted(response)
        if new_status == ResponseStatus.COMPLETED:
            self.check_customer_completed(response)

    def check_customer_review(self, response: OrderResponse) -> None:
        "Проверяет условие и возвращает результат."
        if response.status not in CUSTOMER_REVIEW_FROM:
            raise self.conflict("Вернуть на рассмотрение можно только отклонённый отклик")
        order = response.order
        if order is None:
            return
        if order.assigned_expert_id is not None:
            raise self.conflict(
                "Нельзя вернуть отклик: по заказу уже выбран исполнитель"
            )
        if order.status != OrderStatus.ACTIVE:
            raise self.conflict(
                "Нельзя вернуть отклик: заказ завершён или больше не активен"
            )

    def check_customer_in_progress(self, response: OrderResponse) -> None:
        "Проверяет условие и возвращает результат."
        if response.status not in CUSTOMER_IN_PROGRESS_FROM:
            raise self.conflict(
                "В переговоры можно перевести только отклик после приглашения в чат"
            )

    def check_customer_accepted(self, response: OrderResponse) -> None:
        "Проверяет условие и возвращает результат."
        if response.status not in CUSTOMER_ACCEPTED_FROM:
            raise self.conflict(
                "Выбрать исполнителем можно только отклик на рассмотрении или в переговорах"
            )

    def check_customer_completed(self, response: OrderResponse) -> None:
        "Проверяет условие и возвращает результат."
        if response.status not in CUSTOMER_COMPLETED_FROM:
            raise self.conflict(
                "Завершить можно только отклик со статусом исполнитель выбран или в переговорах"
            )
        order = response.order
        if order is None or order.assigned_expert_id != response.expert_id:
            raise self.conflict(
                "Нельзя завершить проект для незакрепленного исполнителя"
            )

    @staticmethod
    def forbidden(detail: str) -> HTTPException:
        "Публичный метод сервисного слоя."
        return HTTPException(status_code=http_status.HTTP_403_FORBIDDEN, detail=detail)

    @staticmethod
    def conflict(detail: str) -> HTTPException:
        "Публичный метод сервисного слоя."
        return HTTPException(status_code=http_status.HTTP_409_CONFLICT, detail=detail)
