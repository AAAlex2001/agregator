import uuid

from fastapi import APIRouter, Cookie, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from models.session import Session
from schemas.login import UserLogin, UserResponse
from services.login import LoginService

router = APIRouter(prefix="/login", tags=["auth"])

@router.post("/", response_model=UserResponse)
async def login_user(
    data: UserLogin,
    db: AsyncSession = Depends(get_db),
):
    service = LoginService(db)
    user = None
    if data.email:
        user = await service.get_user_by_email(data.email)
    elif data.phone:
        user = await service.get_user_by_phone(data.phone)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден",
        )
    
    if not service.verify_password(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный пароль",
        )

    new_session = Session(session_id=str(uuid.uuid4()), user_id=user.id)
    db.add(new_session)
    await db.commit()

    response = JSONResponse(content=UserResponse.model_validate(user).model_dump(mode="json"))
    response.set_cookie(
        key="session_id",
        value=new_session.session_id,
        httponly=True,
        samesite="lax",
        max_age=60 * 60 * 24 * 30,
        path="/",
    )
    return response


@router.post("/logout")
async def logout_user(
    session_id: str = Cookie(None),
    db: AsyncSession = Depends(get_db),
):
    if session_id:
        await db.execute(delete(Session).where(Session.session_id == session_id))
        await db.commit()

    response = JSONResponse(content={"detail": "ok"})
    response.delete_cookie(key="session_id", path="/")
    return response