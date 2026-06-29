from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import get_password_hash


class UserRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def get_by_username(self, username: str) -> User | None:
        return self.db.query(User).filter(User.username == username).first()
    
    def create_user(self, username: str, password: str, is_admin: bool = False) -> User:
        hashed_password = get_password_hash(password)
        user = User(
            username=username,
            hashed_password=hashed_password,
            is_admin=is_admin
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def create_admin_if_not_exists(self, username: str, password: str) -> User:
        user = self.get_by_username(username)
        if not user:
            user = self.create_user(username, password, is_admin=True)
        return user
    
    def create_user_if_not_exists(self, username: str, password: str, is_admin: bool = False) -> User:
        user = self.get_by_username(username)
        if not user:
            user = self.create_user(username, password, is_admin=is_admin)
        return user