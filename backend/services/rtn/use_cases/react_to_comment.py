"Use case: реакция на комментарий обсуждения («Полезно» / «Есть уточнение» / «Согласен с практикой»)."

from fastapi import HTTPException, status

from models.rtn_comment import RtnComment
from models.rtn_comment_reaction import CommentReactionValue
from services.rtn.repository import RtnCommentReactionRepository, RtnCommentRepository

COUNTER_FIELDS: dict[CommentReactionValue, str] = {
    CommentReactionValue.USEFUL: "useful_count",
    CommentReactionValue.CLARIFICATION: "clarification_count",
    CommentReactionValue.AGREE: "agree_count",
}


class ReactToRtnCommentUseCase:
    def __init__(self, comments: RtnCommentRepository, reactions: RtnCommentReactionRepository) -> None:
        self.comments = comments
        self.reactions = reactions

    async def react(
        self,
        comment_id: int,
        user_id: int | None,
        visitor_key: str,
        value: CommentReactionValue,
    ) -> tuple[RtnComment, CommentReactionValue | None]:
        "Нет реакции → ставим; та же → снимаем; другая → меняем. Возвращает комментарий и текущую реакцию."
        comment = await self.get_comment(comment_id)
        existing = await self.reactions.get(comment_id, visitor_key)

        if existing is None:
            await self.reactions.add(comment_id, user_id, visitor_key, value)
            self.apply_delta(comment, value, 1)
            return comment, value

        if existing.value == value:
            await self.reactions.remove(comment_id, visitor_key)
            self.apply_delta(comment, value, -1)
            return comment, None

        self.apply_delta(comment, existing.value, -1)
        existing.value = value
        self.apply_delta(comment, value, 1)
        return comment, value

    async def read(self, comment_id: int, visitor_key: str) -> tuple[RtnComment, CommentReactionValue | None]:
        comment = await self.get_comment(comment_id)
        existing = await self.reactions.get(comment_id, visitor_key)
        return comment, (existing.value if existing else None)

    async def get_comment(self, comment_id: int) -> RtnComment:
        comment = await self.comments.get_by_id(comment_id)
        if comment is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Комментарий не найден")
        return comment

    def apply_delta(self, comment: RtnComment, value: CommentReactionValue, delta: int) -> None:
        field_name = COUNTER_FIELDS[value]
        setattr(comment, field_name, getattr(comment, field_name) + delta)
