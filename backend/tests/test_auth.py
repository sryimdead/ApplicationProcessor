def test_login_success(client):
    """Успешная аутентификация"""
    response = client.post("/api/auth/login", json={"username": "admin", "password": "admin"})

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client):
    """Неверный пароль"""
    response = client.post("/api/auth/login", json={"username": "admin", "password": "wrong"})

    assert response.status_code == 401
    assert "Неверные учетные данные" in response.json()["detail"]


def test_login_wrong_username(client):
    """Неверное имя пользователя"""
    response = client.post("/api/auth/login", json={"username": "nonexistent", "password": "admin"})

    assert response.status_code == 401
    assert "Неверные учетные данные" in response.json()["detail"]


def test_access_without_token(client):
    """Доступ без токена"""
    response = client.get("/api/tickets")

    assert response.status_code == 403


def test_access_with_invalid_token(client):
    """Доступ с невалидным токеном"""
    headers = {"Authorization": "Bearer invalid_token"}
    response = client.get("/api/tickets", headers=headers)

    assert response.status_code == 401
