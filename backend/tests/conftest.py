import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app import app
from app.database import Base, get_db
from app.models.ticket import Ticket, TicketPriority, TicketStatus
from app.repositories.user_repository import UserRepository

# Тестовая БД в памяти
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """Создание тестовой БД для каждого теста"""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Тестовый клиент с переопределенной БД"""

    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    # Создаем админа
    user_repo = UserRepository(db_session)
    user_repo.create_admin_if_not_exists("admin", "admin")

    with TestClient(app) as c:
        yield c

    app.dependency_overrides.clear()


@pytest.fixture
def admin_token(client):
    """Получение токена админа"""
    response = client.post("/api/auth/login", json={"username": "admin", "password": "admin"})
    return response.json()["access_token"]


@pytest.fixture
def auth_headers(admin_token):
    """Заголовки с токеном авторизации"""
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture
def sample_tickets(db_session):
    """Создание тестовых заявок"""
    tickets_data = [
        {
            "title": "Ошибка в системе",
            "description": "Критическая ошибка в модуле авторизации",
            "status": TicketStatus.NEW,
            "priority": TicketPriority.HIGH,
        },
        {
            "title": "Добавить новую функцию",
            "description": "Необходимо добавить экспорт в PDF",
            "status": TicketStatus.IN_PROGRESS,
            "priority": TicketPriority.NORMAL,
        },
        {
            "title": "Обновить документацию",
            "description": "Обновить README файл",
            "status": TicketStatus.DONE,
            "priority": TicketPriority.LOW,
        },
        {
            "title": "Оптимизация запросов",
            "description": "Ускорить работу базы данных",
            "status": TicketStatus.NEW,
            "priority": TicketPriority.NORMAL,
        },
        {
            "title": "Исправить баг в UI",
            "description": "Кнопка не работает на мобильной версии",
            "status": TicketStatus.NEW,
            "priority": TicketPriority.HIGH,
        },
    ]

    tickets = []
    for data in tickets_data:
        ticket = Ticket(**data)
        db_session.add(ticket)
        tickets.append(ticket)

    db_session.commit()

    for ticket in tickets:
        db_session.refresh(ticket)

    return tickets
