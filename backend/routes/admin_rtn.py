"Тонкий CRUD разъяснений РТН для admin-next. За X-Internal-Token; логин держит сама админка."

from enum import Enum

from fastapi import APIRouter, Depends, File, HTTPException, Query, Response, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.internal_auth import require_internal_token
from models.rtn_change_report import RtnChangeReport, RtnChangeReportStatus
from models.rtn_clarification import PublicationStatus, RtnClarification
from models.rtn_question import RtnQuestion, RtnQuestionStatus
from schemas.admin_rtn import (
    RtnAttachmentUploadOut,
    RtnChangeReportListOut,
    RtnChangeReportOut,
    RtnClarificationListItem,
    RtnClarificationListOut,
    RtnClarificationOut,
    RtnClarificationWrite,
    RtnQuestionListOut,
    RtnQuestionOut,
)
from services.file_uploads import save_uploaded_file
from services.rtn import RtnChangeReportRepository, RtnQuestionRepository, RtnRepository
from services.rtn.use_cases.save_clarification import SaveRtnClarificationUseCase, SlugTakenError
from services.tags import TagRepository

router = APIRouter(
    prefix="/internal/rtn",
    tags=["admin-rtn"],
    dependencies=[Depends(require_internal_token)],
)

PDF_EXTENSIONS = {".pdf"}
PDF_CONTENT_TYPES = {"application/pdf"}
MAX_PDF_SIZE = 20 * 1024 * 1024


def parse_enum[E: Enum](enum_cls: type[E], raw: str) -> E:
    "Преобразует строку query-параметра в enum, при неверном значении отдаёт 422."
    try:
        return enum_cls(raw)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Недопустимое значение: {raw}",
        )


async def to_out(clarification: RtnClarification, repo: RtnRepository) -> RtnClarificationOut:
    selection = await repo.get_taxonomy_selection(clarification.id)
    return RtnClarificationOut(
        id=clarification.id,
        document_type=clarification.document_type.value,
        status=clarification.status.value,
        publication_status=clarification.publication_status.value,
        slug=clarification.slug,
        title=clarification.title,
        excerpt=clarification.excerpt,
        question_text=clarification.question_text,
        answer_html=clarification.answer_html,
        letter_number=clarification.letter_number,
        department=clarification.department,
        source_url=clarification.source_url,
        pdf_url=clarification.pdf_url,
        response_pdf_url=clarification.response_pdf_url,
        request_files=clarification.request_files,
        response_files=clarification.response_files,
        referenced_regulations=clarification.referenced_regulations,
        tags=[tag.name for tag in clarification.tags],
        oversight_areas=[value.value for value in selection.oversight_areas],
        industries=[value.value for value in selection.industries],
        activities=[value.value for value in selection.activities],
        object_types=[value.value for value in selection.object_types],
        meta_title=clarification.meta_title,
        meta_description=clarification.meta_description,
        meta_keywords=clarification.meta_keywords,
        published_at=clarification.published_at,
        views_count=clarification.views_count,
        created_at=clarification.created_at,
        updated_at=clarification.updated_at,
    )


@router.get("/clarifications", response_model=RtnClarificationListOut)
async def list_clarifications(
    publication_status: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
) -> RtnClarificationListOut:
    repo = RtnRepository(db)
    rows = await repo.list_all(
        parse_enum(PublicationStatus, publication_status) if publication_status else None
    )
    items = [
        RtnClarificationListItem(
            id=row.id,
            document_type=row.document_type.value,
            status=row.status.value,
            publication_status=row.publication_status.value,
            title=row.title,
            slug=row.slug,
            letter_number=row.letter_number,
            published_at=row.published_at,
            updated_at=row.updated_at,
        )
        for row in rows
    ]
    return RtnClarificationListOut(items=items, total=len(items))


@router.get("/clarifications/{clarification_id}", response_model=RtnClarificationOut)
async def get_clarification(clarification_id: int, db: AsyncSession = Depends(get_db)) -> RtnClarificationOut:
    repo = RtnRepository(db)
    clarification = await repo.get_by_id(clarification_id)
    if clarification is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Разъяснение не найдено")
    return await to_out(clarification, repo)


@router.post("/clarifications", response_model=RtnClarificationOut, status_code=status.HTTP_201_CREATED)
async def create_clarification(
    data: RtnClarificationWrite,
    db: AsyncSession = Depends(get_db),
) -> RtnClarificationOut:
    repo = RtnRepository(db)
    try:
        clarification = await SaveRtnClarificationUseCase(repo, TagRepository(db)).create(data)
    except SlugTakenError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Такой slug уже занят")
    return await to_out(clarification, repo)


@router.put("/clarifications/{clarification_id}", response_model=RtnClarificationOut)
async def update_clarification(
    clarification_id: int,
    data: RtnClarificationWrite,
    db: AsyncSession = Depends(get_db),
) -> RtnClarificationOut:
    repo = RtnRepository(db)
    clarification = await repo.get_by_id(clarification_id)
    if clarification is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Разъяснение не найдено")
    try:
        clarification = await SaveRtnClarificationUseCase(repo, TagRepository(db)).update(clarification, data)
    except SlugTakenError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Такой slug уже занят")
    return await to_out(clarification, repo)


@router.delete("/clarifications/{clarification_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_clarification(clarification_id: int, db: AsyncSession = Depends(get_db)) -> Response:
    repo = RtnRepository(db)
    clarification = await repo.get_by_id(clarification_id)
    if clarification is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Разъяснение не найдено")
    await repo.delete(clarification)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/upload-pdf", response_model=RtnAttachmentUploadOut)
async def upload_pdf(file: UploadFile = File(...)) -> RtnAttachmentUploadOut:
    "Скан-копия официального письма для карточки разъяснения."
    url = await save_uploaded_file(
        subdir="rtn",
        owner_key="letters",
        file=file,
        allowed_extensions=PDF_EXTENSIONS,
        allowed_content_types=PDF_CONTENT_TYPES,
        max_size=MAX_PDF_SIZE,
        bad_format_message="Принимаются только PDF-файлы",
        too_large_message="Файл слишком большой (макс 20 МБ)",
    )
    return RtnAttachmentUploadOut(url=url)


@router.get("/questions", response_model=RtnQuestionListOut)
async def list_questions(
    status_filter: str | None = Query(None, alias="status"),
    db: AsyncSession = Depends(get_db),
) -> RtnQuestionListOut:
    "Очередь вопросов из формы «Не нашли ответ?»."
    rows = await RtnQuestionRepository(db).list_all(
        parse_enum(RtnQuestionStatus, status_filter) if status_filter else None
    )
    items = [to_question_out(row) for row in rows]
    return RtnQuestionListOut(items=items)


@router.get("/questions/{question_id}", response_model=RtnQuestionOut)
async def get_question(question_id: int, db: AsyncSession = Depends(get_db)) -> RtnQuestionOut:
    question = await RtnQuestionRepository(db).get_by_id(question_id)
    if question is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Вопрос не найден")
    return to_question_out(question)


@router.patch("/questions/{question_id}", response_model=RtnQuestionOut)
async def update_question_status(
    question_id: int,
    status_value: str = Query(..., alias="status"),
    db: AsyncSession = Depends(get_db),
) -> RtnQuestionOut:
    repo = RtnQuestionRepository(db)
    question = await repo.get_by_id(question_id)
    if question is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Вопрос не найден")
    question.status = parse_enum(RtnQuestionStatus, status_value)
    return to_question_out(question)


@router.get("/change-reports", response_model=RtnChangeReportListOut)
async def list_change_reports(
    status_filter: str | None = Query(None, alias="status"),
    db: AsyncSession = Depends(get_db),
) -> RtnChangeReportListOut:
    "Очередь сообщений «Сообщить об изменении»."
    rows = await RtnChangeReportRepository(db).list_all(
        parse_enum(RtnChangeReportStatus, status_filter) if status_filter else None
    )
    items = [to_change_report_out(row) for row in rows]
    return RtnChangeReportListOut(items=items)


@router.patch("/change-reports/{report_id}", response_model=RtnChangeReportOut)
async def update_change_report_status(
    report_id: int,
    status_value: str = Query(..., alias="status"),
    db: AsyncSession = Depends(get_db),
) -> RtnChangeReportOut:
    repo = RtnChangeReportRepository(db)
    report = await repo.get_by_id(report_id)
    if report is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Сообщение не найдено")
    report.status = parse_enum(RtnChangeReportStatus, status_value)
    return to_change_report_out(report)


def to_question_out(question: RtnQuestion) -> RtnQuestionOut:
    return RtnQuestionOut(
        id=question.id,
        question_text=question.question_text,
        contact_email=question.contact_email,
        status=question.status.value,
        answered_clarification_id=question.answered_clarification_id,
        created_at=question.created_at,
    )


def to_change_report_out(report: RtnChangeReport) -> RtnChangeReportOut:
    return RtnChangeReportOut(
        id=report.id,
        clarification_id=report.clarification_id,
        description=report.description,
        status=report.status.value,
        created_at=report.created_at,
    )
