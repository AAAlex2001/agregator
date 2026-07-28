"Публичные ручки соц-функций разъяснения РТН: обсуждение, реакции на комментарии, вопрос, отчёт об изменении."

from fastapi import APIRouter, Depends, File, Query, Response, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user, get_current_user_optional
from dependencies.visitor import get_visitor_key, interaction_key
from models.rtn_comment import RtnComment
from models.rtn_comment_reaction import CommentReactionValue
from models.user import UserRole
from schemas.rtn import (
    AttachmentDto,
    RtnChangeReportCreate,
    RtnClarificationReactionRequest,
    RtnClarificationReactionResponse,
    RtnClarificationViewResponse,
    RtnCommentCreate,
    RtnCommentDto,
    RtnCommentListResponse,
    RtnCommentReactionRequest,
    RtnCommentReactionResponse,
    RtnQuestionCreate,
    RtnQuestionDto,
)
from services.file_uploads import save_uploaded_file
from services.rtn import (
    RtnChangeReportRepository,
    RtnClarificationReactionRepository,
    RtnClarificationViewRepository,
    RtnCommentReactionRepository,
    RtnCommentRepository,
    RtnQuestionRepository,
    RtnRepository,
)
from services.rtn.use_cases.clarification_interactions import RtnClarificationInteractionsUseCase
from services.rtn.use_cases.list_user_questions import ListUserRtnQuestionsUseCase
from services.rtn.use_cases.react_to_comment import ReactToRtnCommentUseCase
from services.rtn.use_cases.report_change import ReportRtnChangeUseCase
from services.rtn.use_cases.rtn_comments import RtnCommentsUseCase
from services.rtn.use_cases.submit_question import SubmitRtnQuestionUseCase

router = APIRouter(tags=["rtn-interactions"])

ATTACHMENT_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".pdf"}
ATTACHMENT_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "application/pdf"}
MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024


def clarification_interactions(db: AsyncSession) -> RtnClarificationInteractionsUseCase:
    return RtnClarificationInteractionsUseCase(
        RtnRepository(db),
        RtnClarificationReactionRepository(db),
        RtnClarificationViewRepository(db),
    )


def author_name(comment: RtnComment) -> str:
    if comment.user is None:
        return "Аноним"
    parts = [part for part in (comment.user.first_name, comment.user.last_name) if part]
    return " ".join(parts) if parts else "Пользователь"


def is_expert_author(comment: RtnComment) -> bool:
    return comment.user is not None and comment.user.role == UserRole.EXPERT


def to_comment_dto(comment: RtnComment, current_user_id: int | None, visitor_key: str | None) -> RtnCommentDto:
    is_mine = comment.user_id == current_user_id if current_user_id is not None else comment.visitor_key == visitor_key
    return RtnCommentDto(
        id=comment.id,
        parent_id=comment.parent_id,
        text=comment.text,
        author={"name": author_name(comment), "is_expert": is_expert_author(comment)},
        attachments=comment.attachments,
        created_at=comment.created_at,
        is_mine=is_mine,
        useful_count=comment.useful_count,
        clarification_count=comment.clarification_count,
        agree_count=comment.agree_count,
        my_reaction=None,
    )


@router.get(
    "/public/rtn/clarifications/{clarification_id}/reactions",
    response_model=RtnClarificationReactionResponse,
)
async def get_clarification_reactions(
    clarification_id: int,
    user_id: int | None = Depends(get_current_user_optional),
    visitor_key: str = Depends(get_visitor_key),
    db: AsyncSession = Depends(get_db),
) -> RtnClarificationReactionResponse:
    current_key = interaction_key(user_id, visitor_key)
    clarification, my_reaction = await clarification_interactions(db).read(
        clarification_id,
        current_key,
    )
    return RtnClarificationReactionResponse(
        likes_count=clarification.likes_count,
        dislikes_count=clarification.dislikes_count,
        views_count=clarification.views_count,
        my_reaction=my_reaction,
    )


@router.post(
    "/public/rtn/clarifications/{clarification_id}/reaction",
    response_model=RtnClarificationReactionResponse,
)
async def react_to_clarification(
    clarification_id: int,
    data: RtnClarificationReactionRequest,
    user_id: int | None = Depends(get_current_user_optional),
    visitor_key: str = Depends(get_visitor_key),
    db: AsyncSession = Depends(get_db),
) -> RtnClarificationReactionResponse:
    current_key = interaction_key(user_id, visitor_key)
    clarification, my_reaction = await clarification_interactions(db).react(
        clarification_id,
        user_id,
        current_key,
        data.value,
    )
    return RtnClarificationReactionResponse(
        likes_count=clarification.likes_count,
        dislikes_count=clarification.dislikes_count,
        views_count=clarification.views_count,
        my_reaction=my_reaction,
    )


@router.post(
    "/public/rtn/clarifications/{clarification_id}/view",
    response_model=RtnClarificationViewResponse,
)
async def record_clarification_view(
    clarification_id: int,
    user_id: int | None = Depends(get_current_user_optional),
    visitor_key: str = Depends(get_visitor_key),
    db: AsyncSession = Depends(get_db),
) -> RtnClarificationViewResponse:
    current_key = interaction_key(user_id, visitor_key)
    clarification = await clarification_interactions(db).record_view(
        clarification_id,
        user_id,
        current_key,
    )
    return RtnClarificationViewResponse(views_count=clarification.views_count)


@router.get(
    "/public/rtn/clarifications/{clarification_id}/comments",
    response_model=RtnCommentListResponse,
)
async def list_comments(
    clarification_id: int,
    sort_by: str | None = Query(None, pattern="^(useful_count|created_at|is_expert)$"),
    sort_dir: str = Query("desc", pattern="^(asc|desc)$"),
    user_id: int | None = Depends(get_current_user_optional),
    visitor_key: str = Depends(get_visitor_key),
    db: AsyncSession = Depends(get_db),
) -> RtnCommentListResponse:
    "Плоский список комментариев обсуждения; дерево строится на фронте по parent_id."
    current_key = interaction_key(user_id, visitor_key)
    use_case = RtnCommentsUseCase(RtnRepository(db), RtnCommentRepository(db))
    comments = await use_case.list_comments(clarification_id, sort_by, sort_dir)

    reaction_repo = RtnCommentReactionRepository(db)
    my_reactions = await reaction_repo.get_my_reactions([comment.id for comment in comments], current_key)
    items = []
    for comment in comments:
        dto = to_comment_dto(comment, user_id, current_key)
        my_reaction = my_reactions.get(comment.id)
        dto.my_reaction = my_reaction.value if my_reaction else None
        items.append(dto)
    return RtnCommentListResponse(items=items)


@router.post("/public/rtn/comments/upload-attachment", response_model=AttachmentDto)
async def upload_comment_attachment(
    visitor_key: str = Depends(get_visitor_key),
    file: UploadFile = File(...),
) -> AttachmentDto:
    "Вложение (фото/скан) к комментарию обсуждения — картинка или PDF, до 10 МБ."
    folder_safe_key = visitor_key.replace(":", "_")
    url = await save_uploaded_file(
        subdir="rtn-comments",
        owner_key=folder_safe_key,
        file=file,
        allowed_extensions=ATTACHMENT_EXTENSIONS,
        allowed_content_types=ATTACHMENT_CONTENT_TYPES,
        max_size=MAX_ATTACHMENT_SIZE,
        bad_format_message="Допустимы только изображения (jpg, png, webp) и PDF",
        too_large_message="Файл слишком большой (макс 10 МБ)",
    )
    return AttachmentDto(name=file.filename or "attachment", url=url)


@router.post(
    "/public/rtn/clarifications/{clarification_id}/comments",
    response_model=RtnCommentDto,
    status_code=status.HTTP_201_CREATED,
)
async def add_comment(
    clarification_id: int,
    data: RtnCommentCreate,
    user_id: int | None = Depends(get_current_user_optional),
    visitor_key: str = Depends(get_visitor_key),
    db: AsyncSession = Depends(get_db),
) -> RtnCommentDto:
    current_key = interaction_key(user_id, visitor_key)
    use_case = RtnCommentsUseCase(RtnRepository(db), RtnCommentRepository(db))
    comment = await use_case.add(
        clarification_id, user_id, current_key, data.text, data.parent_id, data.attachments
    )
    return to_comment_dto(comment, user_id, current_key)


@router.delete("/public/rtn/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: int,
    user_id: int | None = Depends(get_current_user_optional),
    visitor_key: str = Depends(get_visitor_key),
    db: AsyncSession = Depends(get_db),
) -> Response:
    current_key = interaction_key(user_id, visitor_key)
    use_case = RtnCommentsUseCase(RtnRepository(db), RtnCommentRepository(db))
    await use_case.delete(comment_id, user_id, current_key)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/public/rtn/comments/{comment_id}/reaction", response_model=RtnCommentReactionResponse)
async def react_to_comment(
    comment_id: int,
    data: RtnCommentReactionRequest,
    user_id: int | None = Depends(get_current_user_optional),
    visitor_key: str = Depends(get_visitor_key),
    db: AsyncSession = Depends(get_db),
) -> RtnCommentReactionResponse:
    "«Полезно» / «Есть уточнение» / «Согласен с практикой» — тоггл/смена, как лайк."
    current_key = interaction_key(user_id, visitor_key)
    use_case = ReactToRtnCommentUseCase(RtnCommentRepository(db), RtnCommentReactionRepository(db))
    comment, my_reaction = await use_case.react(comment_id, user_id, current_key, CommentReactionValue(data.value))
    return RtnCommentReactionResponse(
        useful_count=comment.useful_count,
        clarification_count=comment.clarification_count,
        agree_count=comment.agree_count,
        my_reaction=my_reaction.value if my_reaction else None,
    )


@router.post(
    "/public/rtn/clarifications/{clarification_id}/change-report",
    status_code=status.HTTP_201_CREATED,
)
async def report_change(
    clarification_id: int,
    data: RtnChangeReportCreate,
    user_id: int | None = Depends(get_current_user_optional),
    visitor_key: str = Depends(get_visitor_key),
    db: AsyncSession = Depends(get_db),
) -> Response:
    "Кнопка «Сообщить об изменении» под устаревшим разъяснением."
    current_key = interaction_key(user_id, visitor_key)
    use_case = ReportRtnChangeUseCase(RtnRepository(db), RtnChangeReportRepository(db))
    await use_case.execute(clarification_id, user_id, current_key, data.description)
    return Response(status_code=status.HTTP_201_CREATED)


@router.post("/public/rtn/questions", status_code=status.HTTP_201_CREATED)
async def submit_question(
    data: RtnQuestionCreate,
    user_id: int | None = Depends(get_current_user_optional),
    visitor_key: str = Depends(get_visitor_key),
    db: AsyncSession = Depends(get_db),
) -> Response:
    "Форма «Не нашли ответ?» — вопрос уходит в очередь модерации админки."
    current_key = interaction_key(user_id, visitor_key)
    use_case = SubmitRtnQuestionUseCase(RtnQuestionRepository(db))
    await use_case.execute(user_id, current_key, data.question_text, data.contact_email)
    return Response(status_code=status.HTTP_201_CREATED)


@router.get("/rtn/questions/mine", response_model=list[RtnQuestionDto])
async def list_my_questions(
    user_id: int = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[RtnQuestionDto]:
    "Вопросы текущего пользователя для личной страницы обращений."
    use_case = ListUserRtnQuestionsUseCase(RtnQuestionRepository(db))
    questions = await use_case.execute(user_id)
    return [RtnQuestionDto.model_validate(question) for question in questions]
