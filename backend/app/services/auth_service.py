from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.models.user import User
from app.core.security import verify_password, create_access_token
from app.core.exceptions import UnauthorizedException


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
    
    def authenticate_user(self, username: str, password: str) -> User:
        user = self.user_repo.get_by_username(username)
        if not user or not verify_password(password, user.hashed_password):
            raise UnauthorizedException()
        return user
    
    def create_access_token(self, user: User) -> str:
        return create_access_token(
            data={
                "sub": user.username,
                "is_admin": user.is_admin
            }
        )
        