# TicketFlow - Система управления заявками

Полнофункциональное веб-приложение для учёта внутренних заявок с современным интерфейсом и надёжным backend.

## Описание проекта

TicketFlow — это fullstack приложение для управления заявками, разработанное в соответствии с техническим заданием. Приложение позволяет создавать, просматривать, фильтровать и управлять заявками с разделением ролей между администратором и обычным пользователем.

### Возможности

- Создание заявок с указанием названия, описания и приоритета
- Поиск по названию и описанию
- Фильтрация по статусу и приоритету
- Сортировка по дате создания и приоритету
- Изменение статуса заявок (new -> in_progress -> done)
- Удаление заявок (только для администратора)
- Аутентификация с JWT токенами
- Разделение ролей: администратор и обычный пользователь
- Адаптивный дизайн для всех устройств
- Доступ из локальной сети

### Бизнес-правила

- Заявку в статусе done нельзя редактировать или удалять
- Нельзя перевести заявку из done обратно в другой статус
- Удалять заявки может только администратор
- При нарушении правил API возвращает осмысленные HTTP-ответы с понятными сообщениями

## Архитектура

ApplicationProcessor/
── backend/           # FastAPI приложение
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Безопасность, исключения
│   │   ├── dependencies/ # FastAPI зависимости
│   │   ├── models/       # SQLAlchemy модели
│   │   ├── repositories/ # Работа с БД
│   │   ├── schemas/      # Pydantic схемы
│   │   └── services/     # Бизнес-логика
│   └── tests/            # Тесты pytest
│
└── frontend/          # React + TypeScript приложение
    └── src/
        ├── api/          # API клиент
        ├── components/   # UI компоненты
        ├── store/        # Zustand stores
        ├── types/        # TypeScript типы
        └── utils/        # Утилиты

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
- Zustand
- React Hook Form + Zod
- Tailwind CSS 3.4+
- Axios

## Быстрый старт

### Требования

- Python 3.12+
- Node.js 20.x+
- npm или yarn

### 1. Клонирование репозитория

git clone [https://github.com/sryimdead/ApplicationProcessor.git](https://github.com/sryimdead/ApplicationProcessor.git)
cd ApplicationProcessor

## Установка и запуск Backend

### 1. Переход в директорию backend

cd backend

### 2. Создание виртуального окружения

python -m venv venv
source venv/bin/activate  # Linux/Mac

# или

venv\Scripts\activate     # Windows

### 3. Установка зависимостей

pip install -r requirements.txt

### 4. Настройка переменных окружения

Создайте файл .env в директории backend/:

DATABASE_URL=sqlite:///./tickets.db
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin

### 5. Запуск сервера

python run.py

Backend будет доступен по адресу: [http://localhost:8000](http://localhost:8000)
Swagger документация: [http://localhost:8000/docs](http://localhost:8000/docs)

### 6. Тестирование backend

# Запуск всех тестов

pytest

# Запуск с подробным выводом

pytest -v

# Запуск конкретного файла

pytest tests/test_auth.py

# Запуск с отчётом о покрытии

pytest --cov=app --cov-report=term-missing

# Запуск проверок качества кода

make lint

# Автоматическое форматирование кода

make format

# Запуск всех проверок (lint + test)

make check

## Установка и запуск Frontend

### 1. Переход в директорию frontend

cd frontend

### 2. Установка зависимостей

npm install

### 3. Настройка переменных окружения

Создайте файл .env в директории frontend/:

VITE_API_URL=[http://localhost:8000/api](http://localhost:8000/api)

### 4. Запуск dev-сервера

npm run dev

Frontend будет доступен по адресу: [http://localhost:5173](http://localhost:5173)

### 5. Сборка для продакшена

npm run build
npm run preview  # Предпросмотр собранной версии

### 6. Проверка качества кода

npm run lint

## Тестовые учётные записи

При первом запуске автоматически создаются два пользователя:


| Роль          | Логин | Пароль | Возможности                           |
| ------------- | ----- | ------ | ------------------------------------- |
| Администратор | admin | admin  | Все операции + удаление заявок        |
| Пользователь  | user  | user   | Создание, просмотр, изменение статуса |


## Доступ из локальной сети

### 1. Узнайте IP-адрес сервера

# Linux/Mac

ip addr show

# Windows

ipconfig

### 2. Запустите сервисы на всех интерфейсах

Backend уже настроен на 0.0.0.0:8000

Frontend — в vite.config.ts:

server: {
  host: '0.0.0.0',
  port: 5173,
}

### 3. Доступ с других устройств

Откройте в браузере на другом устройстве:

- Frontend: [http://your-ip:5173](http://your-ip:5173)
- Backend API: [http://your-ip:8000](http://your-ip:8000)
- Swagger: [http://your-ip:8000/docs](http://your-ip:8000/docs)

### 4. Настройка файрвола (если нужно)

# Linux (UFW)

sudo ufw allow 8000/tcp
sudo ufw allow 5173/tcp

# Windows — через "Брандмауэр Windows" -> "Правила для входящих подключений"

## API Endpoints

### Аутентификация


| Метод | Endpoint        | Описание                          |
| ----- | --------------- | --------------------------------- |
| POST  | /api/auth/login | Получение JWT токена              |
| GET   | /api/auth/me    | Информация о текущем пользователе |


### Заявки


| Метод  | Endpoint          | Описание                    | Доступ       |
| ------ | ----------------- | --------------------------- | ------------ |
| GET    | /api/tickets      | Список заявок (с фильтрами) | Все          |
| POST   | /api/tickets      | Создание заявки             | Все          |
| GET    | /api/tickets/{id} | Получение заявки            | Все          |
| PATCH  | /api/tickets/{id} | Обновление заявки           | Все          |
| DELETE | /api/tickets/{id} | Удаление заявки             | Только admin |


### Query параметры для GET /api/tickets

- status — фильтр по статусу (new, in_progress, done)
- priority — фильтр по приоритету (low, normal, high)
- search — поиск по title и description
- sort_by — сортировка (created_at, priority)
- sort_order — направление (asc, desc)
- page — номер страницы (по умолчанию 1)
- limit — количество на странице (по умолчанию 10)

## Тестирование

### Backend тесты

Проект покрыт comprehensive тестами, проверяющими:

- Аутентификацию и авторизацию
- CRUD операции с заявками
- Бизнес-правила (нельзя редактировать/удалять done)
- Фильтрацию, поиск, сортировку и пагинацию
- Разграничение прав (admin vs user)
- Обработку ошибок и валидацию

cd backend
pytest --cov=app --cov-report=html

# Откройте htmlcov/index.html для детального отчёта

## Структура базы данных

### Таблица users


| Поле            | Тип     | Описание                      |
| --------------- | ------- | ----------------------------- |
| id              | Integer | Уникальный идентификатор      |
| username        | String  | Имя пользователя (уникальное) |
| hashed_password | String  | Хеш пароля (bcrypt)           |
| is_admin        | Boolean | Роль администратора           |


### Таблица tickets


| Поле        | Тип          | Описание                         |
| ----------- | ------------ | -------------------------------- |
| id          | Integer      | Уникальный идентификатор         |
| title       | String(120)  | Название заявки (3-120 символов) |
| description | String(1000) | Описание (до 1000 символов)      |
| status      | Enum         | new / in_progress / done         |
| priority    | Enum         | low / normal / high              |
| created_at  | DateTime     | Дата создания (UTC)              |
| updated_at  | DateTime     | Дата последнего изменения (UTC)  |


## Безопасность

- JWT токены с настраиваемым временем жизни
- Хеширование паролей через bcrypt
- Валидация всех входных данных
- CORS настроен для конкретных origins
- Защита от несанкционированного доступа

## Скрипты Makefile (backend)

make help      # Список всех команд
make install   # Установка зависимостей
make lint      # Запуск всех проверок линтеров
make format    # Автоматическое форматирование кода
make test      # Запуск тестов
make check     # Запуск всех проверок (lint + test)

## Скрипты npm (frontend)

npm run dev      # Запуск dev-сервера
npm run build    # Сборка для продакшена
npm run preview  # Предпросмотр сборки
npm run lint     # Проверка кода

## Решение типичных проблем

### Backend не запускается

# Удалите старую БД

rm tickets.db
python run.py

### Frontend не видит backend

- Проверьте, что backend запущен на [http://localhost:8000](http://localhost:8000)
- Проверьте файл .env в frontend
- Проверьте CORS настройки в app/main.py

### Ошибки с bcrypt

pip uninstall passlib bcrypt
pip install bcrypt==4.1.2

### Node.js version error

Используйте Node.js 20.x (не ниже 20.18):

node --version

## Лицензия

MIT

## Разработка

Проект разработан в соответствии с техническим заданием на Fullstack-разработчика (FastAPI + React).