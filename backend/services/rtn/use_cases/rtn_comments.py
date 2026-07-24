"Use case: обсуждение под разъяснением — список, добавление (с вложениями и ответами), удаление своего."

from fastapi import HTTPException, status

from models.rtn_comment import RtnComment
from schemas.rtn import AttachmentDto
from services.rtn.repository import RtnCommentRepository, RtnRepository


class RtnCommentsUseCase:
    def __init__(self, clarifications: RtnRepository, comments: RtnCommentRepository) -> None:
        self.clarifications = clarifications
        self.comments = comments

    async def list_comments(
        self,
        clarification_id: int,
        sort_by: str | None = None,
        sort_dir: str = "desc",
    ) -> list[RtnComment]:
        return await self.comments.list_for_clarification(clarification_id, sort_by, sort_dir)

    async def add(
        self,
        clarification_id: int,
        user_id: int | None,
        visitor_key: str,
        text: str,
        parent_id: int | None,
        attachments: list[AttachmentDto],
    ) -> RtnComment:
        clarification = await self.clarifications.get_published_by_id(clarification_id)
        if clarification is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Разъяснение не найдено")

        if parent_id is not None:
            parent = await self.comments.get_by_id(parent_id)
            if parent is None or parent.clarification_id != clarification_id:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Комментарий-родитель не найден")

        attachments_payload = [attachment.model_dump() for attachment in attachments]
        created = await self.comments.add(
            clarification_id, user_id, visitor_key, text.strip(), parent_id, attachments_payload
        )
        # перечитываем, чтобы подтянулся автор (lazy=selectin)
        fresh = await self.comments.get_by_id(created.id)
        return fresh if fresh is not None else created

    async def delete(self, comment_id: int, user_id: int | None, visitor_key: str | None) -> None:
        comment = await self.comments.get_by_id(comment_id)
        if comment is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Комментарий не найден")
        is_owner = comment.user_id == user_id if user_id is not None else comment.visitor_key == visitor_key
        if not is_owner:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нельзя удалить чужой комментарий")
        await self.comments.delete(comment)
