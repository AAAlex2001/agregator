from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from schemas.review import (
    CreateReviewRequest,
    CreateReviewResponse,
    PublicExpertReviewsResponse,
    ReviewItem,
    ReviewListResponse,
)
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


@router.get("/experts/{public_id}/reviews", response_model=PublicExpertReviewsResponse)
async def get_expert_public_reviews(
    public_id: str,
    db: AsyncSession = Depends(get_db),
    _user_id: int = Depends(get_current_user),
):
    service = ReviewService(db)
    data = await service.get_expert_reviews_by_public_id(public_id)
    return PublicExpertReviewsResponse(
        expert_public_id=data["expert_public_id"],
        expert_name=data["expert_name"],
        expert_avatar_url=data["expert_avatar_url"],
        reviews=[ReviewItem(**i) for i in data["reviews"]],
        total=data["total"],
        avg_rating=data["avg_rating"],
    )
