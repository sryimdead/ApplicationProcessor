.PHONY: help install lint format test check

help:
	@echo "Доступные команды:"
	@echo "  make install    - Установка зависимостей"
	@echo "  make lint       - Запуск всех проверок линтеров"
	@echo "  make format     - Форматирование кода"
	@echo "  make test       - Запуск тестов"
	@echo "  make check      - Запуск всех проверок (lint + test)"

install:
	pip install -r requirements.txt

lint:
	@echo "🔍 Запуск Black (проверка форматирования)..."
	black --check app tests
	@echo ""
	@echo "🔍 Запуск Isort (проверка сортировки импортов)..."
	isort --check-only app tests
	@echo ""
	@echo "🔍 Запуск Flake8 (проверка PEP8)..."
	flake8 app tests
	@echo ""
	@echo "🔍 Запуск Pylint (статический анализ)..."
	pylint app
	@echo ""
	@echo "🔍 Запуск Mypy (проверка типов)..."
	mypy app
	@echo ""
	@echo "✅ Все проверки пройдены!"

format:
	@echo "🔧 Форматирование кода..."
	black app tests
	isort app tests
	@echo "✅ Код отформатирован!"

test:
	@echo "🧪 Запуск тестов..."
	pytest -v
	@echo ""
	@echo "✅ Тесты пройдены!"

check: lint test
	@echo "🎉 Все проверки пройдены успешно!"
	