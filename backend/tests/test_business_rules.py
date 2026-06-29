import pytest


def test_cannot_edit_done_ticket(client, auth_headers, sample_tickets):
    """Нельзя редактировать заявку в статусе done"""
    done_ticket = sample_tickets[2]  # Заявка со статусом done

    response = client.patch(f"/api/tickets/{done_ticket.id}", json={"title": "Новый заголовок"}, headers=auth_headers)

    assert response.status_code == 400
    assert "не может быть изменена" in response.json()["detail"]


def test_cannot_change_status_from_done(client, auth_headers, sample_tickets):
    """Нельзя изменить статус с done на другой"""
    done_ticket = sample_tickets[2]

    response = client.patch(f"/api/tickets/{done_ticket.id}", json={"status": "new"}, headers=auth_headers)

    assert response.status_code == 400
    assert "нельзя изменить статус" in response.json()["detail"].lower()


def test_cannot_delete_done_ticket(client, auth_headers, sample_tickets):
    """Нельзя удалить заявку в статусе done"""
    done_ticket = sample_tickets[2]

    response = client.delete(f"/api/tickets/{done_ticket.id}", headers=auth_headers)

    assert response.status_code == 400
    assert "не может быть изменена" in response.json()["detail"]


def test_only_admin_can_delete(client, db_session, auth_headers, sample_tickets):
    """Только админ может удалять заявки"""
    # Создаем обычного пользователя
    from app.repositories.user_repository import UserRepository

    user_repo = UserRepository(db_session)
    user_repo.create_user("user", "password", is_admin=False)

    # Логинимся как обычный пользователь
    response = client.post("/api/auth/login", json={"username": "user", "password": "password"})
    user_token = response.json()["access_token"]
    user_headers = {"Authorization": f"Bearer {user_token}"}

    ticket = sample_tickets[0]

    # Пытаемся удалить заявку
    response = client.delete(f"/api/tickets/{ticket.id}", headers=user_headers)

    assert response.status_code == 403
    assert "Недостаточно прав" in response.json()["detail"]


def test_any_user_can_create_ticket(client, db_session, auth_headers):
    """Любой авторизованный пользователь может создавать заявки"""
    # Создаем обычного пользователя
    from app.repositories.user_repository import UserRepository

    user_repo = UserRepository(db_session)
    user_repo.create_user("user2", "password", is_admin=False)

    response = client.post("/api/auth/login", json={"username": "user2", "password": "password"})
    user_token = response.json()["access_token"]
    user_headers = {"Authorization": f"Bearer {user_token}"}

    ticket_data = {"title": "Заявка от обычного пользователя", "description": "Тест"}

    response = client.post("/api/tickets", json=ticket_data, headers=user_headers)

    assert response.status_code == 201


def test_any_user_can_update_ticket(client, db_session, auth_headers, sample_tickets):
    """Любой авторизованный пользователь может обновлять заявки"""
    # Создаем обычного пользователя
    from app.repositories.user_repository import UserRepository

    user_repo = UserRepository(db_session)
    user_repo.create_user("user3", "password", is_admin=False)

    response = client.post("/api/auth/login", json={"username": "user3", "password": "password"})
    user_token = response.json()["access_token"]
    user_headers = {"Authorization": f"Bearer {user_token}"}

    ticket = sample_tickets[0]

    response = client.patch(f"/api/tickets/{ticket.id}", json={"status": "in_progress"}, headers=user_headers)

    assert response.status_code == 200
