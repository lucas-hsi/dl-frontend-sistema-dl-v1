.PHONY: help openapi-snapshot dev test lint format

help: ## Mostra esta ajuda
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

openapi-snapshot: ## Exporta o schema OpenAPI para artifacts/auditoria/openapi_snapshot.json
	@python scripts/export_openapi.py

dev: ## Inicia o servidor de desenvolvimento
	@python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001

test: ## Executa os testes
	@pytest

lint: ## Executa o linter
	@python -m flake8 app/ scripts/

format: ## Formata o código
	@python -m black app/ scripts/ 