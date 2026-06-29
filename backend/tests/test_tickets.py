def test_create_ticket(client, auth_headers):
    """Создание заявки"""
    ticket_data = {"title": "Тестовая заявка", "description": "Описание тестовой заявки", "priority": "normal"}

    response = client.post("/api/tickets", json=ticket_data, headers=auth_headers)

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == ticket_data["title"]
    assert data["description"] == ticket_data["description"]
    assert data["priority"] == ticket_data["priority"]
    assert data["status"] == "new"
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_create_ticket_minimal(client, auth_headers):
    """Создание заявки с минимальными данными"""
    ticket_data = {"title": "Минимальная заявка"}

    response = client.post("/api/tickets", json=ticket_data, headers=auth_headers)

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == ticket_data["title"]
    assert data["description"] is None
    assert data["priority"] == "normal"


def test_create_ticket_invalid_title_too_short(client, auth_headers):
    """Создание заявки с слишком коротким заголовком"""
    ticket_data = {"title": "ab"}

    response = client.post("/api/tickets", json=ticket_data, headers=auth_headers)

    assert response.status_code == 422


def test_create_ticket_invalid_title_too_long(client, auth_headers):
    """Создание заявки с слишком длинным заголовком"""
    ticket_data = {"title": "a" * 121}

    response = client.post("/api/tickets", json=ticket_data, headers=auth_headers)

    assert response.status_code == 422


def test_get_ticket(client, auth_headers, sample_tickets):
    """Получение заявки по ID"""
    ticket = sample_tickets[0]

    response = client.get(f"/api/tickets/{ticket.id}", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == ticket.id
    assert data["title"] == ticket.title


def test_get_ticket_not_found(client, auth_headers):
    """Получение несуществующей заявки"""
    response = client.get("/api/tickets/99999", headers=auth_headers)

    assert response.status_code == 404
    assert "Заявка не найдена" in response.json()["detail"]


def test_update_ticket_status(client, auth_headers, sample_tickets):
    """Обновление статуса заявки"""
    ticket = sample_tickets[0]

    response = client.patch(f"/api/tickets/{ticket.id}", json={"status": "in_progress"}, headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "in_progress"


def test_update_ticket_title(client, auth_headers, sample_tickets):
    """Обновление заголовка заявки"""
    ticket = sample_tickets[0]

    response = client.patch(f"/api/tickets/{ticket.id}", json={"title": "Новый заголовок"}, headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Новый заголовок"


def test_update_ticket_priority(client, auth_headers, sample_tickets):
    """Обновление приоритета заявки"""
    ticket = sample_tickets[0]

    response = client.patch(f"/api/tickets/{ticket.id}", json={"priority": "high"}, headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["priority"] == "high"


def test_delete_ticket_as_admin(client, auth_headers, sample_tickets):
    """Удаление заявки админом"""
    ticket = sample_tickets[0]

    response = client.delete(f"/api/tickets/{ticket.id}", headers=auth_headers)

    assert response.status_code == 200
    assert "успешно удалена" in response.json()["message"]

    # Проверяем, что заявка действительно удалена
    response = client.get(f"/api/tickets/{ticket.id}", headers=auth_headers)
    assert response.status_code == 404


def test_delete_ticket_not_found(client, auth_headers):
    """Удаление несуществующей заявки"""
    response = client.delete("/api/tickets/99999", headers=auth_headers)

    assert response.status_code == 404
