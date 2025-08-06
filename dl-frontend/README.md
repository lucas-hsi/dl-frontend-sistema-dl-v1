# Frontend DL Sistema

## 🚀 Como rodar E2E local (dev)

### Pré-requisitos
- Node.js 16+
- Backend rodando em `http://localhost:8001`
- Frontend rodando em `http://localhost:3000`

### Instalação das dependências
```bash
npm install
```

### Executar testes E2E
```bash
# Instalar Playwright (primeira vez)
npx playwright install

# Executar todos os testes
npm run test:e2e

# Executar com UI interativa
npm run test:e2e:ui

# Ver relatório HTML
npm run test:e2e:report
```

### Estrutura dos testes
```
tests/
├── auth/
│   └── login.spec.ts          # Login e storage state
├── protected/
│   └── access.spec.ts         # Acesso a rotas protegidas
├── produtos/
│   └── crud.spec.ts           # CRUD completo de produtos
├── health/
│   └── health.spec.ts         # Health checks
├── fixtures/
│   └── data.ts               # Geradores de dados
├── utils/
│   └── api.ts                # Utilitários de limpeza
└── .auth/
    └── admin.json            # Storage state (gerado automaticamente)
```

### Troubleshooting

#### Problemas comuns:
1. **Backend não está rodando**
   - Verifique se o backend está em `http://localhost:8001`
   - Execute: `python -m uvicorn backend.main:app --reload`

2. **Frontend não está rodando**
   - Execute: `npm run dev`
   - Verifique se está acessível em `http://localhost:3000`

3. **Storage state expirado**
   - Delete `tests/.auth/admin.json`
   - Execute novamente: `npm run test:e2e`

4. **Testes falhando por timeout**
   - Aumente timeout no `playwright.config.ts`
   - Verifique se os serviços estão respondendo

5. **Dados de teste não limpos**
   - Execute: `npm run test:e2e` novamente
   - Os testes incluem limpeza automática

### Critérios de aceite
- ✅ `npm run test:e2e` executa todas as suítes e retorna verde
- ✅ Relatório HTML gerado em `playwright-report/`
- ✅ Testes idempotentes (sem dados órfãos)
- ✅ Tempo total < 90s em máquina dev padrão

### Suítes implementadas
1. **🔐 Autenticação** - Login e storage state
2. **🛡️ Acesso Protegido** - Rotas com autenticação
3. **📦 CRUD Produtos** - Listar, criar, atualizar, deletar
4. **🏥 Health Check** - Validação de endpoints

# DL Auto Peças - Frontend (Next.js)

## Descrição
Interface web para o sistema de gestão e vendas da DL Auto Peças. Painéis para vendedores e gestores, integração com backend FastAPI.

## Instalação
```bash
npm install
```

## Como rodar localmente
```bash
npm run dev
```

## Configuração da API

### Variáveis de Ambiente
1. Copie o arquivo `env.local.example` para `.env.local`:
```bash
cp env.local.example .env.local
```

2. Configure as variáveis no `.env.local`:
```env
# URL base da API do backend (obrigatório)
NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1

# Ambiente da aplicação
NEXT_PUBLIC_ENV=development

# Nome da aplicação
NEXT_PUBLIC_APP_NAME=DL Auto Peças

# Versão da aplicação
NEXT_PUBLIC_APP_VERSION=1.0.0

# Configurações de debug (apenas desenvolvimento)
NEXT_PUBLIC_DEBUG=true
```

### Centralização da API
O frontend utiliza um cliente HTTP centralizado em `src/config/api.ts` que:
- Centraliza todas as chamadas para o backend
- Usa a variável `NEXT_PUBLIC_API_URL` para a URL base
- Fornece métodos `get`, `post`, `put`, `delete` padronizados
- Inclui headers padrão e tratamento de erros

### Validação da Configuração
- ✅ O frontend deve se conectar ao backend em `http://localhost:8001/api/v1`
- ✅ Verifique o console do navegador para logs de conexão: "[API] Conectando em: [URL]"
- ✅ Teste o health check em `/__health` do backend
- ✅ Sem erros de CORS no console do navegador

### Troubleshooting de CORS
Se houver erros de CORS:
1. **Verifique a URL**: A URL em `NEXT_PUBLIC_API_URL` deve apontar para o host correto (inclui protocolo e porta)
2. **Backend CORS**: O backend deve expor `Access-Control-Allow-Origin` e aceitar o origin do FE
3. **Proxy/NGINX**: Verifique se não está bloqueando requisições `OPTIONS` (preflight)
4. **Variáveis de Ambiente**: Em produção, setar `NEXT_PUBLIC_API_URL` nos envs do provider CI/CD
5. **Rebuild**: `NEXT_PUBLIC_*` são embutidas no bundle; trocar exige rebuild

## Principais rotas
- `/login` — Login do vendedor
- `/ponto-de-venda` — Painel do vendedor
- `/login-gestor` — Login do gestor
- `/painel-gestor` — Painel do gestor (dashboard, aprovações)
- `/orcamentos` — Gestão de orçamentos
- `/clientes` — Gestão de clientes

## Estrutura de pastas
- `/src/config` — Configurações centralizadas (api.ts, env.ts)
- `/src/services` — Serviços de API usando cliente centralizado
- `/src/components` — Componentes reutilizáveis
- `/src/pages` — Páginas da aplicação

## Erros & Sessão (401/403)

### Tratamento Automático de Erros
O sistema possui interceptors automáticos que tratam:

- **401 (Unauthorized)**: Limpa sessão e redireciona para `/login` com `next=<rota_atual>`
- **403 (Forbidden)**: Redireciona para `/acesso-negado` com toast de permissão
- **5xx (Server Error)**: Toast "Falha temporária" + retry automático para GET (x3 com backoff)

### Retry Automático
- Aplicado apenas a requisições GET (idempotentes)
- Máximo 3 tentativas com delay exponencial
- Desabilitável via `NEXT_PUBLIC_RETRY_GET=false`
- Logs de retry apenas em desenvolvimento

### Segurança de Sessão
- Validação de token no cliente (formato básico)
- Limpeza automática de sessão em 401/403
- Redirecionamento seguro com preservação da rota atual
- Página `/acesso-negado` para permissões insuficientes

## Padrões de UI

### Estados de Carregamento
```tsx
import { Loading, Skeleton, CardSkeleton } from '@/components/ui/loading';

// Loading simples
<Loading text="Carregando produtos..." />

// Skeleton para listas
<Skeleton rows={5} />

// Skeleton para cards
<CardSkeleton cards={6} />
```

### Estados Vazios
```tsx
import { ProductEmptyState, OrderEmptyState } from '@/components/ui/empty-state';

// Estado vazio com CTA
<ProductEmptyState onAdd={() => router.push('/produtos/novo')} />

// Estado vazio de busca
<SearchEmptyState searchTerm="motor" />
```

### Estados de Erro
```tsx
import { ErrorState, NetworkErrorState } from '@/components/ui/error-state';

// Erro com retry
<ErrorState 
  title="Erro ao carregar dados"
  message="Tente novamente em alguns instantes"
  onRetry={refetch}
/>

// Erro de rede
<NetworkErrorState onRetry={refetch} />
```

### Submit Lock
```tsx
import { useSubmitLock } from '@/hooks/useSubmitLock';

const { isSubmitting, submitLock } = useSubmitLock();

const handleSubmit = submitLock(async (data) => {
  await api.post('/produtos', data);
});

return (
  <button disabled={isSubmitting}>
    {isSubmitting ? 'Salvando...' : 'Salvar'}
  </button>
);
```

### Confirmação de DELETE
```tsx
import { useConfirmationModal } from '@/components/ui/confirmation-modal';

const { showConfirmation, ConfirmationModal } = useConfirmationModal();

const handleDelete = () => {
  showConfirmation(
    'Excluir produto?',
    'Esta ação não pode ser desfeita.',
    () => deleteProduct(id),
    'danger'
  );
};

return (
  <>
    <button onClick={handleDelete}>Excluir</button>
    <ConfirmationModal />
  </>
);
```

## Guards de Rota
```tsx
import { RouteGuard, PermissionGate } from '@/components/auth/RouteGuard';

// Proteção por autenticação
<RouteGuard>
  <ProtectedPage />
</RouteGuard>

// Proteção por permissão
<RouteGuard requiredPermissions={['gestao']}>
  <AdminPage />
</RouteGuard>

// Esconder elementos por permissão
<PermissionGate permissions={['gestao']}>
  <AdminButton />
</PermissionGate>
```

## Observações
- ✅ Todas as chamadas de API usam o cliente centralizado
- ✅ URLs hardcoded foram eliminadas
- ✅ Configuração via variáveis de ambiente
- ✅ Logs de debug em desenvolvimento
- ✅ Interceptors automáticos para 401/403/5xx
- ✅ Retry automático para GET com backoff
- ✅ Estados de UI padronizados (loading/empty/error)
- ✅ Submit lock para prevenir double-submit
- ✅ Confirmação obrigatória para DELETE
- ✅ Guards de rota por token/role
- Não deixe tokens ou URLs sensíveis no código
- Comente pontos críticos e integrações 