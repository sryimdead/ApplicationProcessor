from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.exceptions import ForbiddenException, UnauthorizedException
from app.core.security import decode_access_token
from app.database import get_db
from app.models.user import User
from app.repositories.user_repository import UserRepository

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    payload = decode_access_token(token)

    if payload is None:
        raise UnauthorizedException()

    username: str = payload.get("sub")
    if username is None:
        raise UnauthorizedException()

    user_repo = UserRepository(db)
    user = user_repo.get_by_username(username)

    if user is None:
        raise UnauthorizedException()

    return user


def get_current_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_admin:
        raise ForbiddenException()
    return current_user
