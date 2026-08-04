"Use case: реакция на комментарий обсуждения («Полезно» / «Есть уточнение» / «Согласен с практикой»)."

from fastapi import HTTPException, status

from models.rtn_comment import RtnComment
from models.rtn_comment_reaction import CommentReactionValue
from services.articles.use_cases.react_to_article import toggle_reaction
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
        current = await toggle_reaction(
            existing,
            value,
            add=lambda v: self.reactions.add(comment_id, user_id, visitor_key, v),
            remove=lambda: self.reactions.remove(comment_id, visitor_key),
            apply_delta=lambda v, delta: self.apply_delta(comment, v, delta),
        )
        return comment, current

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
