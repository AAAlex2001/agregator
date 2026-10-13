"""Публикации: лента, свои посты, реакции, комментарии, файлы и ИИ-помощник.

Ручки только связывают запрос со сценарием.
Ошибки сценариев (PostError) переводит в HTTP общий обработчик.
"""

from fastapi import APIRouter, Depends, Query, Request, UploadFile, status
from fastapi.responses import JSONResponse

from dependencies.posts import (
    PageQuery,
    get_author,
    get_comment,
    get_comment_repository,
    get_count_post_view_usecase,
    get_create_comment_usecase,
    get_create_post_usecase,
    get_create_repost_usecase,
    get_delete_post_media_usecase,
    get_delete_post_usecase,
    get_edit_comment_usecase,
    get_follow_author_usecase,
    get_follow_repository,
    get_like_comment_usecase,
    get_like_post_usecase,
    get_load_following_feed_usecase,
    get_load_marks_usecase,
    get_load_threads_usecase,
    get_own_comment,
    get_own_post,
    get_post_repository,
    get_post_save_repository,
    get_post_visitor,
    get_published_post,
    get_report_repository,
    get_update_post_usecase,
    get_upload_post_media_usecase,
    get_visible_post,
    get_write_with_ai_usecase,
)
from dependencies.posts_auth import get_current_user, require_user
from models.account import Account
from models.posts import Post, PostComment, PostStatus
from schemas.posts import (
    AssistantAnswerSchema,
    AssistantRequestSchema,
    CommentEditSchema,
    CommentSaveSchema,
    CommentSchema,
    CommentThreadPageSchema,
    LikesSchema,
    PostMediaSchema,
    PostPageSchema,
    PostSaveSchema,
    PostSchema,
    PostSitemapItemSchema,
    ReportSaveSchema,
    RepostSaveSchema,
    UnseenSchema,
)
from services.posts.comment_repo import PostCommentRepository
from services.posts.exceptions import PostError
from services.posts.follow_repository import FollowRepository
from services.posts.repo import PostRepository, PostSaveRepository
from services.posts.report_repo import PostReportRepository
from services.posts.use_cases.count_view import CountPostViewUseCase
from services.posts.use_cases.create_comment import CreateCommentUseCase
from services.posts.use_cases.create_post import CreatePostUseCase
from services.posts.use_cases.create_repost import CreateRepostUseCase
from services.posts.use_cases.delete_post import DeletePostUseCase
from services.posts.use_cases.follow_author import FollowAuthorUseCase
from services.posts.use_cases.like_post import LikePostUseCase
from services.posts.use_cases.load_following_feed import LoadFollowingFeedUseCase
from services.posts.use_cases.load_marks import LoadMarksUseCase
from services.posts.use_cases.load_threads import LoadThreadsUseCase
from services.posts.use_cases.manage_comment import EditCommentUseCase, LikeCommentUseCase
from services.posts.use_cases.manage_media import DeletePostMediaUseCase, UploadPostMediaUseCase
from services.posts.use_cases.update_post import UpdatePostUseCase
from services.posts.use_cases.write_with_ai import WritePostWithAiUseCase

router = APIRouter(prefix="/posts", tags=["posts"])


async def post_error_handler(request: Request, error: PostError) -> JSONResponse:
    """Ошибка сценария публикаций — в ответ с её кодом и текстом."""

    return JSONResponse(
        {"detail": str(error)},
        status_code=error.status_code,
        headers=error.headers,
    )


@router.post("/media", status_code=status.HTTP_201_CREATED)
async def upload_media(
    file: UploadFile,
    user: Account = Depends(require_user),
    usecase: UploadPostMediaUseCase = Depends(get_upload_post_media_usecase),
) -> PostMediaSchema:
    """Загрузить фото или видео для будущего поста. id передаётся при сохранении поста."""

    media = await usecase.execute(user, file)
    return PostMediaSchema.model_validate(media)


@router.delete("/media/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_media(
    media_id: int,
    user: Account = Depends(require_user),
    usecase: DeletePostMediaUseCase = Depends(get_delete_post_media_usecase),
) -> None:
    """Удалить загруженный файл, пока он не привязан к посту."""

    await usecase.execute(user, media_id)


@router.post("/assistant")
async def write_with_ai(
    payload: AssistantRequestSchema,
    user: Account = Depends(require_user),
    usecase: WritePostWithAiUseCase = Depends(get_write_with_ai_usecase),
) -> AssistantAnswerSchema:
    """ИИ-помощник: пишет пост по просьбе автора или переделывает текущий текст."""

    html = await usecase.execute(user, payload.instruction, payload.html)
    return AssistantAnswerSchema(html=html)


@router.get("/sitemap")
async def list_posts_sitemap(
    posts: PostRepository = Depends(get_post_repository),
) -> list[PostSitemapItemSchema]:
    """Опубликованные оригиналы для карты сайта."""

    rows = await posts.list_sitemap()
    return [
        PostSitemapItemSchema(id=post_id, updated_at=updated_at)
        for post_id, updated_at in rows
    ]


@router.get("/feed")
async def list_feed(
    page: PageQuery = Depends(),
    user: Account | None = Depends(get_current_user),
    posts: PostRepository = Depends(get_post_repository),
    marks: LoadMarksUseCase = Depends(get_load_marks_usecase),
) -> PostPageSchema:
    """Лента «Для вас»: опубликованные посты и репосты всех авторов. Открыта всем."""

    items, total = await posts.list_published(page.limit, page.offset)
    viewer_marks = await marks.execute(user, items)
    return PostPageSchema.for_viewer(items, total, viewer_marks)


@router.get("/feed/following/unseen")
async def count_unseen_following(
    user: Account = Depends(require_user),
    posts: PostRepository = Depends(get_post_repository),
) -> UnseenSchema:
    """Сколько постов вышло в подписках с прошлого захода во вкладку."""

    count = await posts.count_following_since(user.id, user.following_seen_at)
    return UnseenSchema(count=count)


@router.get("/feed/following")
async def list_following_feed(
    page: PageQuery = Depends(),
    user: Account = Depends(require_user),
    usecase: LoadFollowingFeedUseCase = Depends(get_load_following_feed_usecase),
    marks: LoadMarksUseCase = Depends(get_load_marks_usecase),
) -> PostPageSchema:
    """Лента «Подписки». Первая страница обнуляет счётчик новых постов."""

    items, total = await usecase.execute(user, page.limit, page.offset)
    viewer_marks = await marks.execute(user, items)
    return PostPageSchema.for_viewer(items, total, viewer_marks)


@router.get("/author/{author_id}")
async def list_author_posts(
    author_id: int,
    page: PageQuery = Depends(),
    user: Account | None = Depends(get_current_user),
    posts: PostRepository = Depends(get_post_repository),
    marks: LoadMarksUseCase = Depends(get_load_marks_usecase),
) -> PostPageSchema:
    """Опубликованные посты автора для его страницы. Открыты всем."""

    items, total = await posts.list_by_author(author_id, page.limit, page.offset)
    viewer_marks = await marks.execute(user, items)
    return PostPageSchema.for_viewer(items, total, viewer_marks)


@router.get("/reposts")
async def list_my_reposts(
    page: PageQuery = Depends(),
    user: Account = Depends(require_user),
    posts: PostRepository = Depends(get_post_repository),
    marks: LoadMarksUseCase = Depends(get_load_marks_usecase),
) -> PostPageSchema:
    """Свои репосты, новые первыми."""

    items, total = await posts.list_reposts(user.id, page.limit, page.offset)
    viewer_marks = await marks.execute(user, items)
    return PostPageSchema.for_viewer(items, total, viewer_marks)


@router.get("/saved")
async def list_saved_posts(
    page: PageQuery = Depends(),
    user: Account = Depends(require_user),
    posts: PostRepository = Depends(get_post_repository),
    marks: LoadMarksUseCase = Depends(get_load_marks_usecase),
) -> PostPageSchema:
    """Сохранённые посты, недавно сохранённые первыми."""

    items, total = await posts.list_saved(user.id, page.limit, page.offset)
    viewer_marks = await marks.execute(user, items)
    return PostPageSchema.for_viewer(items, total, viewer_marks)


@router.get("/my")
async def list_my_posts(
    post_status: PostStatus = Query(PostStatus.PUBLISHED, alias="status"),
    page: PageQuery = Depends(),
    user: Account = Depends(require_user),
    posts: PostRepository = Depends(get_post_repository),
    marks: LoadMarksUseCase = Depends(get_load_marks_usecase),
) -> PostPageSchema:
    """Свои посты: опубликованные, черновики или скрытые модератором."""

    items, total = await posts.list_for_author(user.id, post_status, page.limit, page.offset)
    viewer_marks = await marks.execute(user, items)
    return PostPageSchema.for_viewer(items, total, viewer_marks)


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_post(
    payload: PostSaveSchema,
    user: Account = Depends(require_user),
    usecase: CreatePostUseCase = Depends(get_create_post_usecase),
) -> PostSchema:
    """Опубликовать пост или сохранить черновиком."""

    post = await usecase.execute(user, payload)
    return PostSchema.model_validate(post)


@router.put("/comments/{comment_id}")
async def update_comment(
    payload: CommentEditSchema,
    comment: PostComment = Depends(get_own_comment),
    user: Account = Depends(require_user),
    usecase: EditCommentUseCase = Depends(get_edit_comment_usecase),
) -> CommentSchema:
    """Изменить текст своего комментария."""

    return await usecase.execute(user, comment, payload.text)


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment: PostComment = Depends(get_own_comment),
    comments: PostCommentRepository = Depends(get_comment_repository),
) -> None:
    """Удалить свой комментарий вместе с ответами."""

    await comments.delete(comment)


@router.post("/comments/{comment_id}/like")
async def like_comment(
    comment: PostComment = Depends(get_comment),
    user: Account = Depends(require_user),
    usecase: LikeCommentUseCase = Depends(get_like_comment_usecase),
) -> LikesSchema:
    """Поставить лайк комментарию."""

    return await usecase.execute(user, comment, liked=True)


@router.delete("/comments/{comment_id}/like")
async def unlike_comment(
    comment: PostComment = Depends(get_comment),
    user: Account = Depends(require_user),
    usecase: LikeCommentUseCase = Depends(get_like_comment_usecase),
) -> LikesSchema:
    """Убрать лайк с комментария."""

    return await usecase.execute(user, comment, liked=False)


@router.post("/comments/{comment_id}/report", status_code=status.HTTP_204_NO_CONTENT)
async def report_comment(
    payload: ReportSaveSchema,
    comment: PostComment = Depends(get_comment),
    user: Account = Depends(require_user),
    reports: PostReportRepository = Depends(get_report_repository),
) -> None:
    """Пожаловаться на комментарий. Повторная жалоба до решения модератора ничего не меняет."""

    await reports.add_for_comment(user.id, comment.id, payload.reason)


@router.post("/authors/{author_id}/follow", status_code=status.HTTP_204_NO_CONTENT)
async def follow_author(
    author: Account = Depends(get_author),
    user: Account = Depends(require_user),
    usecase: FollowAuthorUseCase = Depends(get_follow_author_usecase),
) -> None:
    """Подписаться на автора."""

    await usecase.execute(user, author)


@router.delete("/authors/{author_id}/follow", status_code=status.HTTP_204_NO_CONTENT)
async def unfollow_author(
    author_id: int,
    user: Account = Depends(require_user),
    follows: FollowRepository = Depends(get_follow_repository),
) -> None:
    """Отписаться от автора."""

    await follows.remove(user.id, author_id)


@router.get("/{post_id}")
async def get_post(
    post: Post = Depends(get_visible_post),
    user: Account | None = Depends(get_current_user),
    marks: LoadMarksUseCase = Depends(get_load_marks_usecase),
) -> PostSchema:
    """Пост по id: опубликованный — всем, свой черновик — автору."""

    viewer_marks = await marks.execute(user, [post])
    return PostSchema.for_viewer(post, viewer_marks)


@router.put("/{post_id}")
async def update_post(
    payload: PostSaveSchema,
    post: Post = Depends(get_own_post),
    usecase: UpdatePostUseCase = Depends(get_update_post_usecase),
) -> PostSchema:
    """Изменить свой пост. Репост изменить нельзя."""

    updated = await usecase.execute(post, payload)
    return PostSchema.model_validate(updated)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post: Post = Depends(get_own_post),
    usecase: DeletePostUseCase = Depends(get_delete_post_usecase),
) -> None:
    """Удалить свой пост или репост."""

    await usecase.execute(post)


@router.get("/{post_id}/comments")
async def list_comments(
    page: PageQuery = Depends(),
    post: Post = Depends(get_visible_post),
    user: Account | None = Depends(get_current_user),
    usecase: LoadThreadsUseCase = Depends(get_load_threads_usecase),
) -> CommentThreadPageSchema:
    """Ветки комментариев по порядку написания. Открыты всем."""

    return await usecase.execute(post, user, page.limit, page.offset)


@router.post("/{post_id}/comments", status_code=status.HTTP_201_CREATED)
async def create_comment(
    payload: CommentSaveSchema,
    post: Post = Depends(get_published_post),
    user: Account = Depends(require_user),
    usecase: CreateCommentUseCase = Depends(get_create_comment_usecase),
) -> CommentSchema:
    """Написать комментарий или ответить на комментарий."""

    comment = await usecase.execute(user, post, payload)
    return CommentSchema.model_validate(comment)


@router.post("/{post_id}/report", status_code=status.HTTP_204_NO_CONTENT)
async def report_post(
    payload: ReportSaveSchema,
    post: Post = Depends(get_published_post),
    user: Account = Depends(require_user),
    reports: PostReportRepository = Depends(get_report_repository),
) -> None:
    """Пожаловаться на пост. Повторная жалоба до решения модератора ничего не меняет."""

    await reports.add_for_post(user.id, post.id, payload.reason)


@router.post("/{post_id}/repost", status_code=status.HTTP_201_CREATED)
async def repost(
    payload: RepostSaveSchema,
    post: Post = Depends(get_published_post),
    user: Account = Depends(require_user),
    usecase: CreateRepostUseCase = Depends(get_create_repost_usecase),
) -> PostSchema:
    """Репостнуть публикацию: просто или с комментарием."""

    created = await usecase.execute(user, post, payload)
    return PostSchema.model_validate(created)


@router.post("/{post_id}/view", status_code=status.HTTP_204_NO_CONTENT)
async def count_post_view(
    post: Post = Depends(get_published_post),
    visitor: str = Depends(get_post_visitor),
    user: Account | None = Depends(get_current_user),
    usecase: CountPostViewUseCase = Depends(get_count_post_view_usecase),
) -> None:
    """Засчитать просмотр. Один посетитель — один просмотр в сутки, автор не считается."""

    await usecase.execute(post, user, visitor)


@router.post("/{post_id}/like")
async def like_post(
    post: Post = Depends(get_published_post),
    user: Account = Depends(require_user),
    usecase: LikePostUseCase = Depends(get_like_post_usecase),
) -> LikesSchema:
    """Поставить лайк. Автору приходит уведомление."""

    return await usecase.execute(user, post, liked=True)


@router.delete("/{post_id}/like")
async def unlike_post(
    post: Post = Depends(get_published_post),
    user: Account = Depends(require_user),
    usecase: LikePostUseCase = Depends(get_like_post_usecase),
) -> LikesSchema:
    """Убрать лайк."""

    return await usecase.execute(user, post, liked=False)


@router.post("/{post_id}/save", status_code=status.HTTP_204_NO_CONTENT)
async def save_post(
    post: Post = Depends(get_published_post),
    user: Account = Depends(require_user),
    saves: PostSaveRepository = Depends(get_post_save_repository),
) -> None:
    """Сохранить пост себе."""

    await saves.add(user.id, post.id)


@router.delete("/{post_id}/save", status_code=status.HTTP_204_NO_CONTENT)
async def unsave_post(
    post: Post = Depends(get_published_post),
    user: Account = Depends(require_user),
    saves: PostSaveRepository = Depends(get_post_save_repository),
) -> None:
    """Убрать пост из сохранённого."""

    await saves.remove(user.id, post.id)
