from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from schemas.review import CreateReviewRequest, CreateReviewResponse, ReviewListResponse, ReviewItem
from services.review import ReviewService

router = APIRouter(tags=["reviews"])


@router.post("/reviews", response_model=CreateReviewResponse)
async def create_review(
    payload: CreateReviewRequest,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    service = ReviewService(db)
    await service.create_review(
        actor_id=user_id,
        response_id=payload.response_id,
        rating=payload.rating,
        comment=payload.comment,
    )
    return CreateReviewResponse(detail="Отзыв успешно оставлен")


@router.get("/reviews/my", response_model=ReviewListResponse)
async def get_my_reviews(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    service = ReviewService(db)
    items, total, avg_rating = await service.get_expert_reviews(user_id)
    return ReviewListResponse(
        reviews=[ReviewItem(**i) for i in items],
        total=total,
        avg_rating=avg_rating,
    )
