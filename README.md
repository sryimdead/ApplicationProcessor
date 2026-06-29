# TicketFlow - Система управления заявками

Веб-приложение для учёта внутренних заявок, разработанное в соответствии с техническим заданием на Fullstack-разработчика (FastAPI + React).

## Описание

TicketFlow — это fullstack приложение для управления заявками с разделением ролей между администратором и обычным пользователем. Приложение позволяет создавать, просматривать, фильтровать и управлять заявками с соблюдением бизнес-правил.

## Технологический стек

### Backend
- Python 3.12+
- FastAPI 0.109+
- SQLAlchemy 2.0+
- Pydantic 2.5+
- PyJWT
- bcrypt
- SQLite
- pytest

### Frontend
- React 18+
- TypeScript 5+
- Vite 5+
- Tailwind CSS 3.4+
- Zustand
- React Hook Form + Zod
- Axios

## Архитектура проекта
```
ApplicationProcessor/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── dependencies/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   └── services/
│   ├── tests/
│   ├── requirements.txt
│   └── run.py
│
└── frontend/
    └── src/
        ├── api/
        ├── components/
        ├── store/
        ├── types/
        └── utils/
```

## Установка и запуск Backend

### 1. Переход в директорию backend
```
cd backend
```

### 2. Создание виртуального окружения
```
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows
```

### 3. Установка зависимостей
```
pip install -r requirements.txt
```

### 4. Настройка переменных окружения

Создайте файл .env в директории backend/:
```
DATABASE_URL=sqlite:///./tickets.db
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

### 5. Запуск сервера
```
python run.py
```

Backend будет доступен по адресу: http://localhost:8000

Swagger документация: http://localhost:8000/docs

## Установка и запуск Frontend

### 1. Переход в директорию frontend

cd frontend

### 2. Установка зависимостей

npm install

### 3. Настройка переменных окружения

Создайте файл .env в директории frontend/:
```
VITE_API_URL=http://localhost:8000/api
```

### 4. Запуск dev-сервера
```
npm run dev
```

Frontend будет доступен по адресу: http://localhost:5173

### 5. Сборка для продакшена
```
npm run build
npm run preview
```

## Тестовые учётные записи

При первом запуске автоматически создаются два пользователя:

Роль          | Логин | Пароль | Возможности
--------------|-------|--------|------------------------------------------
Администратор | admin | admin  | Все операции + удаление заявок
Пользователь  | user  | user   | Создание, просмотр, изменение статуса

## API Endpoints

### Аутентификация

Метод | Endpoint           | Описание
------|--------------------|----------------------------------
POST  | /api/auth/login    | Получение JWT токена
GET   | /api/auth/me       | Информация о текущем пользователе

### Заявки

Метод  | Endpoint             | Описание                      | Доступ
-------|----------------------|-------------------------------|-------------
GET    | /api/tickets         | Список заявок (с фильтрами)   | Все
POST   | /api/tickets         | Создание заявки               | Все
GET    | /api/tickets/{id}    | Получение заявки              | Все
PATCH  | /api/tickets/{id}    | Обновление заявки             | Все
DELETE | /api/tickets/{id}    | Удаление заявки               | Только admin

### Параметры запроса для GET /api/tickets

- status — фильтр по статусу (new, in_progress, done)
- priority — фильтр по приоритету (low, normal, high)
- search — поиск по названию и описанию
- sort_by — сортировка (created_at, priority)
- sort_order — направление (asc, desc)
- page — номер страницы (по умолчанию 1)
- limit — количество на странице (по умолчанию 10)

## Бизнес-правила

- Заявку в статусе done нельзя редактировать или удалять
- Нельзя перевести заявку из done обратно в другой статус
- Удалять заявки может только администратор
- При нарушении правил API возвращает осмысленные HTTP-ответы с понятными сообщениями
- Поиск, фильтрация, сортировка и пагинация выполняются на backend

## Тестирование

### Backend тесты
```
cd backend
pytest                  # Все тесты
pytest -v               # Подробный вывод
pytest --cov=app        # С отчётом о покрытии
```

Проект покрыт тестами, проверяющими:
- Аутентификацию и авторизацию
- CRUD операции с заявками
- Бизнес-правила
- Фильтрацию, поиск, сортировку и пагинацию
- Разграничение прав (admin vs user)
- Обработку ошибок и валидацию

### Проверка качества кода
```
make lint               # Все проверки (black, isort, flake8, pylint, mypy)
make format             # Автоматическое форматирование кода
make check              # Запуск всех проверок и тестов
```

## Структура базы данных

### Таблица users

Поле            | Тип     | Описание
----------------|---------|----------------------------------
id              | Integer | Уникальный идентификатор
username        | String  | Имя пользователя (уникальное)
hashed_password | String  | Хеш пароля (bcrypt)
is_admin        | Boolean | Роль администратора

### Таблица tickets

Поле        | Тип      | Описание
------------|----------|---------------------------------------
id          | Integer  | Уникальный идентификатор
title       | String   | Название заявки (3-120 символов)
description | String   | Описание (до 1000 символов)
status      | Enum     | new / in_progress / done
priority    | Enum     | low / normal / high
created_at  | DateTime | Дата создания (UTC)
updated_at  | DateTime | Дата последнего изменения (UTC)

## Доступ из локальной сети

### 1. Узнайте IP-адрес сервера
```
Linux/Mac:
ip addr show

Windows:
ipconfig
```

### 2. Запустите сервисы на всех интерфейсах

Backend уже настроен на 0.0.0.0:8000.

Frontend — добавьте в vite.config.ts:
```
server: {
  host: '0.0.0.0',
  port: 5173,
}
```

### 3. Доступ с других устройств

Откройте в браузере на другом устройстве:
- Frontend: http://your-ip:5173
- Backend API: http://your-ip:8000
- Swagger: http://your-ip:8000/docs

### 4. Настройка файрвола (если нужно)
```
Linux (UFW):
sudo ufw allow 8000/tcp
sudo ufw allow 5173/tcp
```

Windows:
Панель управления -> Брандмауэр Windows -> Правила для входящих подключений -> Создать правило для портов 8000 и 5173.

## Скрипты Makefile (backend)
```
make help      # Список всех команд
make install   # Установка зависимостей
make lint      # Запуск всех проверок линтеров
make format    # Автоматическое форматирование кода
make test      # Запуск тестов
make check     # Запуск всех проверок (lint + test)
```

## Скрипты npm (frontend)
```
npm run dev      # Запуск dev-сервера
npm run build    # Сборка для продакшена
npm run preview  # Предпросмотр сборки
npm run lint     # Проверка кода
```