def test_get_all_tickets(client, auth_headers, sample_tickets):
    """Получение всех заявок"""
    response = client.get("/api/tickets", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 5
    assert len(data["items"]) == 5


def test_filter_by_status(client, auth_headers, sample_tickets):
    """Фильтрация по статусу"""
    response = client.get("/api/tickets?status=new", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 3
    assert all(ticket["status"] == "new" for ticket in data["items"])


def test_filter_by_priority(client, auth_headers, sample_tickets):
    """Фильтрация по приоритету"""
    response = client.get("/api/tickets?priority=high", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert all(ticket["priority"] == "high" for ticket in data["items"])


def test_filter_by_status_and_priority(client, auth_headers, sample_tickets):
    """Фильтрация по статусу и приоритету"""
    response = client.get("/api/tickets?status=new&priority=high", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert all(ticket["status"] == "new" and ticket["priority"] == "high" for ticket in data["items"])


def test_search_by_title(client, auth_headers, sample_tickets):
    """Поиск по заголовку"""
    response = client.get("/api/tickets?search=ошибка", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert any("ошибка" in ticket["title"].lower() for ticket in data["items"])


def test_search_by_description(client, auth_headers, sample_tickets):
    """Поиск по описанию"""
    response = client.get("/api/tickets?search=PDF", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert any("PDF" in ticket["description"] for ticket in data["items"])


def test_sort_by_created_at_desc(client, auth_headers, sample_tickets):
    """Сортировка по дате создания (убывание)"""
    response = client.get("/api/tickets?sort_by=created_at&sort_order=desc", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    dates = [ticket["created_at"] for ticket in data["items"]]
    assert dates == sorted(dates, reverse=True)


def test_sort_by_created_at_asc(client, auth_headers, sample_tickets):
    """Сортировка по дате создания (возрастание)"""
    response = client.get("/api/tickets?sort_by=created_at&sort_order=asc", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    dates = [ticket["created_at"] for ticket in data["items"]]
    assert dates == sorted(dates)


def test_sort_by_priority(client, auth_headers, sample_tickets):
    """Сортировка по приоритету"""
    response = client.get("/api/tickets?sort_by=priority&sort_order=asc", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()

    priority_order = {"high": 3, "normal": 2, "low": 1}
    priorities = [priority_order[ticket["priority"]] for ticket in data["items"]]
    assert priorities == sorted(priorities)


def test_pagination_first_page(client, auth_headers, sample_tickets):
    """Пагинация - первая страница"""
    response = client.get("/api/tickets?page=1&limit=2", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 2
    assert data["page"] == 1
    assert data["limit"] == 2
    assert data["total"] == 5


def test_pagination_second_page(client, auth_headers, sample_tickets):
    """Пагинация - вторая страница"""
    response = client.get("/api/tickets?page=2&limit=2", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 2
    assert data["page"] == 2


def test_pagination_last_page(client, auth_headers, sample_tickets):
    """Пагинация - последняя страница"""
    response = client.get("/api/tickets?page=3&limit=2", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["page"] == 3


def test_pagination_empty_page(client, auth_headers, sample_tickets):
    """Пагинация - пустая страница"""
    response = client.get("/api/tickets?page=10&limit=2", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 0


def test_combined_filters_search_sort_pagination(client, auth_headers, sample_tickets):
    """Комбинированная фильтрация, поиск, сортировка и пагинация"""
    response = client.get(
        "/api/tickets?status=new&priority=high&search=ошибка&sort_by=created_at&sort_order=desc&page=1&limit=10",
        headers=auth_headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert "limit" in data


def test_empty_result(client, auth_headers):
    """Пустой результат фильтрации"""
    response = client.get("/api/tickets?status=in_progress&priority=low", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert len(data["items"]) == 0
