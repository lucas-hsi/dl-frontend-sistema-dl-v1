# ===================================================================
# ARQUIVO 1: Salve este como 'dl-backend/Dockerfile'
# (Substitua o conteúdo do seu arquivo existente)
# ===================================================================

# Define a imagem base do Python
FROM python:3.10

# Variáveis de ambiente para otimização
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Instala a ferramenta 'uv' para gerenciamento de pacotes
COPY --from=ghcr.io/astral-sh/uv:0.5.11 /uv /uvx /bin/

# Copia os arquivos de dependência
COPY pyproject.toml uv.lock ./

# Instala as dependências Python diretamente no sistema do contêiner
RUN uv pip install --system -r pyproject.toml

# Copia o código-fonte da aplicação
COPY ./app /app/app
COPY ./scripts /app/scripts
COPY ./alembic.ini /app/

# Comando para iniciar o servidor FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# ===================================================================
# ARQUIVO 2: Salve este como 'dl-frontend/Dockerfile'
# (Substitua o conteúdo do seu arquivo existente)
# ===================================================================