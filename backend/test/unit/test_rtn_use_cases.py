"Юнит-тесты use cases сервиса «Ростехнадзор отвечает»: реакции, вопросы, отчёты об изменениях, таксономия."

from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from models.rtn_comment_reaction import CommentReactionValue
from schemas.admin_rtn import RtnClarificationWrite
from services.rtn.taxonomy import DOCUMENT_TYPE_LABELS, build_taxonomy, serialize_options
from services.rtn.use_cases.react_to_comment import ReactToRtnCommentUseCase
from services.rtn.use_cases.report_change import ReportRtnChangeUseCase
from services.rtn.use_cases.save_clarification import SaveRtnClarificationUseCase
from services.rtn.use_cases.submit_question import SubmitRtnQuestionUseCase


class FakeCommentRepo:
    def __init__(self):
        self.comment = SimpleNamespace(
            id=1,
            useful_count=0,
            clarification_count=0,
            agree_count=0,
        )

    async def get_by_id(self, comment_id: int):
        return self.comment if comment_id == self.comment.id else None


class FakeCommentReactionRepo:
    def __init__(self):
        self.items: dict[tuple[int, str], SimpleNamespace] = {}

    async def get(self, comment_id: int, visitor_key: str):
        return self.items.get((comment_id, visitor_key))

    async def add(self, comment_id: int, user_id: int | None, visitor_key: str, value: CommentReactionValue):
        reaction = SimpleNamespace(comment_id=comment_id, user_id=user_id, visitor_key=visitor_key, value=value)
        self.items[(comment_id, visitor_key)] = reaction
        return reaction

    async def remove(self, comment_id: int, visitor_key: str) -> None:
        self.items.pop((comment_id, visitor_key), None)


class FakeQuestionRepo:
    def __init__(self):
        self.saved = None

    async def add(self, user_id, visitor_key, contact_email, question_text):
        self.saved = SimpleNamespace(
            user_id=user_id,
            visitor_key=visitor_key,
            contact_email=contact_email,
            question_text=question_text,
        )
        return self.saved


class FakeChangeReportRepo:
    def __init__(self):
        self.saved = None

    async def add(self, clarification_id, user_id, visitor_key, description):
        self.saved = SimpleNamespace(
            clarification_id=clarification_id,
            user_id=user_id,
            visitor_key=visitor_key,
            description=description,
        )
        return self.saved


class FakeClarificationRepo:
    def __init__(self, published: bool = True):
        self.published = published

    async def get_published_by_id(self, clarification_id: int):
        return SimpleNamespace(id=clarification_id) if self.published else None


@pytest.mark.asyncio
async def test_first_reaction_sets_value_and_increments_counter():
    comments = FakeCommentRepo()
    reactions = FakeCommentReactionRepo()
    use_case = ReactToRtnCommentUseCase(comments, reactions)

    comment, current = await use_case.react(1, user_id=None, visitor_key="anon-1", value=CommentReactionValue.USEFUL)

    assert current == CommentReactionValue.USEFUL
    assert comment.useful_count == 1


@pytest.mark.asyncio
async def test_repeating_same_reaction_removes_it():
    comments = FakeCommentRepo()
    reactions = FakeCommentReactionRepo()
    use_case = ReactToRtnCommentUseCase(comments, reactions)

    await use_case.react(1, user_id=None, visitor_key="anon-1", value=CommentReactionValue.AGREE)
    comment, current = await use_case.react(1, user_id=None, visitor_key="anon-1", value=CommentReactionValue.AGREE)

    assert current is None
    assert comment.agree_count == 0


@pytest.mark.asyncio
async def test_switching_reaction_moves_counter_between_fields():
    comments = FakeCommentRepo()
    reactions = FakeCommentReactionRepo()
    use_case = ReactToRtnCommentUseCase(comments, reactions)

    await use_case.react(1, user_id=None, visitor_key="anon-1", value=CommentReactionValue.USEFUL)
    comment, current = await use_case.react(1, user_id=None, visitor_key="anon-1", value=CommentReactionValue.CLARIFICATION)

    assert current == CommentReactionValue.CLARIFICATION
    assert comment.useful_count == 0
    assert comment.clarification_count == 1


@pytest.mark.asyncio
async def test_reaction_on_missing_comment_raises_404():
    use_case = ReactToRtnCommentUseCase(FakeCommentRepo(), FakeCommentReactionRepo())

    with pytest.raises(HTTPException) as exc_info:
        await use_case.react(999, user_id=None, visitor_key="anon-1", value=CommentReactionValue.USEFUL)

    assert exc_info.value.status_code == 404


@pytest.mark.asyncio
async def test_submit_question_trims_text_and_email():
    questions = FakeQuestionRepo()
    use_case = SubmitRtnQuestionUseCase(questions)

    await use_case.execute(user_id=None, visitor_key="anon-1", question_text="  Как получить лицензию?  ", contact_email="  me@mail.ru  ")

    assert questions.saved.question_text == "Как получить лицензию?"
    assert questions.saved.contact_email == "me@mail.ru"
    assert questions.saved.visitor_key == "anon-1"


@pytest.mark.asyncio
async def test_report_change_saves_description_for_published_clarification():
    reports = FakeChangeReportRepo()
    use_case = ReportRtnChangeUseCase(FakeClarificationRepo(published=True), reports)

    await use_case.execute(clarification_id=5, user_id=7, visitor_key="anon-1", description="  Письмо отозвано  ")

    assert reports.saved.clarification_id == 5
    assert reports.saved.description == "Письмо отозвано"


@pytest.mark.asyncio
async def test_report_change_for_unpublished_clarification_raises_404():
    use_case = ReportRtnChangeUseCase(FakeClarificationRepo(published=False), FakeChangeReportRepo())

    with pytest.raises(HTTPException) as exc_info:
        await use_case.execute(clarification_id=5, user_id=None, visitor_key="anon-1", description="test")

    assert exc_info.value.status_code == 404


def test_serialize_options_preserves_enum_order():
    options = serialize_options(DOCUMENT_TYPE_LABELS)

    assert options[0] == {"value": "OFFICIAL_CLARIFICATION", "label": "Официальные разъяснения"}
    assert [option["value"] for option in options] == [member.value for member in DOCUMENT_TYPE_LABELS]


def test_build_taxonomy_returns_all_dimensions():
    taxonomy = build_taxonomy()

    assert set(taxonomy.keys()) == {
        "oversight_areas",
        "industries",
        "activities",
        "object_types",
        "document_types",
        "statuses",
    }
    assert len(taxonomy["oversight_areas"]) == 8
    assert len(taxonomy["industries"]) == 21
    assert len(taxonomy["activities"]) == 7
    assert len(taxonomy["object_types"]) == 7
    assert len(taxonomy["document_types"]) == 3
    assert len(taxonomy["statuses"]) == 2


def test_save_clarification_preserves_all_request_and_response_files():
    data = RtnClarificationWrite(
        document_type="INFO_LETTER",
        status="ACTIVE",
        publication_status="DRAFT",
        slug="audit-supb",
        request_files=[
            {"name": "Запрос, часть 1.pdf", "url": "/files/request-1.pdf"},
            {"name": "Запрос, часть 2.pdf", "url": "/files/request-2.pdf"},
        ],
        response_files=[
            {"name": "Ответ Ростехнадзора.pdf", "url": "/files/answer-rtn.pdf"},
            {"name": "Ответ прокуратуры.pdf", "url": "/files/answer-prosecutor.pdf"},
        ],
    )

    normalized = SaveRtnClarificationUseCase(None, None).normalize(data)  # type: ignore[arg-type]

    assert len(normalized["request_files"]) == 2
    assert len(normalized["response_files"]) == 2
    assert normalized["pdf_url"] == "/files/request-1.pdf"
    assert normalized["response_pdf_url"] == "/files/answer-rtn.pdf"
