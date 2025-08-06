# Autenticação via API para Testes E2E

Este diretório contém a implementação de autenticação via API para toda a suíte de testes E2E do Playwright.

## 🎯 Objetivo

Autenticar via HTTP (sem UI), salvar cookies/token em `storageState.json` e rodar todos os testes já logados.

## 📁 Arquivos

- `global.setup.ts` - Setup global que faz login via API
- `api-login.spec.ts` - Testes de exemplo da autenticação
- `README.md` - Esta documentação

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` baseado no `env.test.example`:

```bash
# Credenciais para testes E2E
E2E_USER=admin@dl.com
E2E_PASS=admin123

# URL base para testes Playwright
PW_BASE_URL=http://localhost:3000

# URL da API do backend
NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1
```

### 2. Configuração do Playwright

O `playwright.config.ts` já está configurado para:
- Usar `globalSetup: './tests/auth/global.setup.ts'`
- Carregar `storageState: 'tests/.auth/storageState.json'`

## 🚀 Como Usar

### Executar todos os testes (com autenticação automática)

```bash
npm run test:e2e
```

### Executar apenas testes de autenticação

```bash
npm run test:e2e:auth
```

### Executar com credenciais específicas

```bash
# Windows
$env:E2E_USER="user@example.com"; $env:E2E_PASS="secret123"; npm run test:e2e

# Linux/Mac
E2E_USER=user@example.com E2E_PASS=secret123 npm run test:e2e
```

## 🔧 Como Funciona

1. **Setup Global**: Antes de todos os testes, o `global.setup.ts`:
   - Faz login via API no endpoint `/api/login/access-token`
   - Simula o processo de login no frontend
   - Salva o estado (localStorage/cookies) em `tests/.auth/storageState.json`

2. **Execução dos Testes**: Todos os testes rodam com o estado de autenticação pré-carregado

3. **Resultado**: Testes mais rápidos e confiáveis, sem depender do formulário de login

## 📊 Benefícios

- ✅ **Performance**: Não precisa fazer login via UI em cada teste
- ✅ **Confiabilidade**: Menos pontos de falha (sem dependência do formulário)
- ✅ **Velocidade**: Setup único para toda a suíte
- ✅ **Manutenibilidade**: Credenciais centralizadas via env

## 🐛 Troubleshooting

### Erro: "Login API falhou"

1. Verifique se o backend está rodando em `http://localhost:8001`
2. Confirme as credenciais em `.env.local`
3. Verifique se o endpoint `/api/login/access-token` está funcionando

### Erro: "Storage state não encontrado"

1. Execute `npm run test:e2e:install` para instalar dependências
2. Verifique se o diretório `tests/.auth/` foi criado
3. Execute um teste simples primeiro: `npm run test:e2e:auth`

### Testes falhando por autenticação

1. Verifique se o `storageState.json` foi gerado corretamente
2. Confirme se as URLs estão corretas no `playwright.config.ts`
3. Teste manualmente o login via API

## 🔄 Atualizações

Para atualizar o estado de autenticação:

```bash
# Remover storage state antigo
rm tests/.auth/storageState.json

# Executar testes para regenerar
npm run test:e2e
``` 