# 🚀 DL Sistema - Sistema de Gestão Completo

Sistema de gestão empresarial completo com frontend React/Next.js e backend FastAPI, desenvolvido para DL Auto Peças.

## 📋 Índice

- [🏗️ Arquitetura](#-arquitetura)
- [🚀 Tecnologias](#-tecnologias)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [⚡ Instalação Rápida](#-instalação-rápida)
- [🔧 Configuração](#-configuração)
- [🎯 Funcionalidades](#-funcionalidades)
- [🔐 Sistema de Autenticação](#-sistema-de-autenticação)
- [📊 Status do Projeto](#-status-do-projeto)
- [🤝 Contribuição](#-contribuição)

## 🏗️ Arquitetura

```
DL_SISTEMA/
├── dl-frontend/          # Frontend React/Next.js
├── dl-backend/           # Backend FastAPI
├── nginx/               # Configuração Nginx (opcional)
└── docker-compose.yml   # Orquestração Docker
```

## 🚀 Tecnologias

### Frontend
- **Next.js 13** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **React Hot Toast** - Notificações

### Backend
- **FastAPI** - Framework Python
- **SQLAlchemy** - ORM
- **Pydantic** - Validação de dados
- **Uvicorn** - Servidor ASGI
- **SQLite** - Banco de dados (desenvolvimento)

## 📁 Estrutura do Projeto

### Frontend (`dl-frontend/`)
```
src/
├── components/          # Componentes reutilizáveis
├── pages/              # Páginas Next.js
├── contexts/           # Contextos React (Auth, etc.)
├── services/           # Serviços de API
├── hooks/              # Hooks customizados
├── lib/                # Utilitários
└── styles/             # Estilos globais
```

### Backend (`dl-backend/`)
```
app/
├── api/                # Rotas da API
├── core/               # Configurações centrais
├── schemas/            # Modelos Pydantic
├── models.py           # Modelos SQLAlchemy
└── main.py             # Aplicação principal
```

## ⚡ Instalação Rápida

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/dl-sistema.git
cd dl-sistema
```

### 2. Backend
```bash
cd dl-backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend
```bash
cd dl-frontend
npm install
npm run dev
```

### 4. Acesse
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8000
- **Docs API:** http://localhost:8000/docs

## 🔧 Configuração

### Variáveis de Ambiente

#### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Backend (`.env`)
```env
ENVIRONMENT=local
API_V1_STR=/api/v1
PROJECT_NAME=DL Sistema
```

## 🎯 Funcionalidades

### ✅ Implementadas
- [x] **Sistema de Autenticação** - Login com perfis (Gestor, Vendedor, Anúncios)
- [x] **Dashboard Gestor** - Métricas e gestão de equipe
- [x] **Dashboard Vendedor** - Orçamentos e vendas
- [x] **Dashboard Anúncios** - Gestão de anúncios e IA
- [x] **Proteção de Rotas** - Middleware de autenticação
- [x] **Responsividade** - Design mobile-first
- [x] **Animações** - Interface fluida com Framer Motion

### 🚧 Em Desenvolvimento
- [ ] **Sistema de Vendas** - Orçamentos e pedidos
- [ ] **Gestão de Estoque** - Controle de produtos
- [ ] **Relatórios** - Analytics e métricas
- [ ] **Notificações** - Sistema de alertas

## 🔐 Sistema de Autenticação

### Credenciais de Teste
```bash
# Gestor
Email: gestor@dl.com
Senha: 123
Perfil: Gestor

# Vendedor  
Email: vendedor@dl.com
Senha: 123
Perfil: Vendedor

# Anúncios
Email: anuncios@dl.com
Senha: 123
Perfil: Anúncios
```

### Características
- ✅ **Validação Backend** - Perfis validados no servidor
- ✅ **Compatibilidade Total** - Funciona com dados legados
- ✅ **Redirecionamento Confiável** - Sem problemas de navegação
- ✅ **Logs Detalhados** - Debug completo
- ✅ **Migração Automática** - Converte dados antigos

## 📊 Status do Projeto

### ✅ Funcionando
- **Login System** - 100% funcional
- **Dashboard Gestor** - Implementado
- **Dashboard Vendedor** - Implementado  
- **Dashboard Anúncios** - Implementado
- **API Backend** - Funcional
- **Autenticação** - Robusta e confiável

### 🎯 Próximos Passos
1. **Sistema de Vendas** - Orçamentos e pedidos
2. **Gestão de Estoque** - Controle de produtos
3. **Relatórios Avançados** - Analytics
4. **Deploy em Produção** - Configuração de servidor

## 🤝 Contribuição

### Estrutura de Commits
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: manutenção
```

### Padrões de Código
- **Frontend**: TypeScript + ESLint + Prettier
- **Backend**: Python + Black + Ruff
- **Commits**: Conventional Commits
- **Branches**: feature/, hotfix/, release/

## 📞 Suporte

- **Desenvolvedor**: Lucas Rocha
- **Email**: lucas@dl.com
- **Documentação**: [Wiki do Projeto](link-para-wiki)

---

**© 2024 DL Auto Peças - Sistema desenvolvido por Lucas Rocha** 