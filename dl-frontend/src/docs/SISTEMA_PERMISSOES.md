# Sistema de Permissões - DL Auto Peças

## Visão Geral

O sistema de permissões da DL Auto Peças foi implementado para controlar o acesso às diferentes funcionalidades da plataforma baseado no perfil do usuário.

## Perfis de Usuário

### 1. VENDEDOR
- **Acesso:** Painel de vendas, clientes, orçamentos
- **Permissões:** `['vendas', 'clientes', 'orcamentos']`
- **Funcionalidades:**
  - Buscar produtos no estoque
  - Criar orçamentos
  - Gerenciar clientes
  - Consultar histórico de vendas

### 2. ANUNCIANTE
- **Acesso:** Painel de anúncios, estoque, ferramentas
- **Permissões:** `['anuncios', 'estoque', 'ferramentas']`
- **Funcionalidades:**
  - Criar e gerenciar anúncios
  - Acessar ferramentas de IA
  - Gerenciar estoque
  - Visualizar anúncios da equipe

### 3. GESTOR
- **Acesso:** Todas as funcionalidades
- **Permissões:** `['vendedores', 'anuncios', 'performance', 'gestao', 'relatorios', 'configuracoes']`
- **Funcionalidades:**
  - Gerenciar vendedores
  - Visualizar performance da equipe
  - Acessar relatórios completos
  - Configurar sistema

## Implementação

### Hook usePermissions

```typescript
import { usePermissions } from '@/hooks/usePermissions';

const { 
  hasPermission, 
  hasRole, 
  canAccessEquipe,
  canAccessAnuncios,
  canAccessPerformance,
  user 
} = usePermissions();
```

### Componente PermissionGuard

```typescript
import PermissionGuard from '@/components/auth/PermissionGuard';

// Proteger por role
<PermissionGuard requiredRole="GESTOR">
  <ConteudoRestrito />
</PermissionGuard>

// Proteger por permissão específica
<PermissionGuard requiredPermission="vendedores">
  <GerenciarVendedores />
</PermissionGuard>
```

## Páginas da Equipe

### /gestor/equipe/vendedores
- **Acesso:** Apenas GESTOR
- **Funcionalidades:**
  - Listar vendedores
  - Cadastrar novo vendedor
  - Ativar/desativar contas
  - Resetar senhas
  - Atribuir permissões

### /gestor/equipe/anuncios
- **Acesso:** GESTOR ou ANUNCIANTE
- **Funcionalidades:**
  - Listar anúncios da equipe
  - Filtrar por criador, canal, status
  - Visualizar métricas
  - Acessar anúncios nos canais

### /gestor/equipe/performance
- **Acesso:** Apenas GESTOR
- **Funcionalidades:**
  - Métricas individuais
  - Gráficos de performance
  - Comparativos por período
  - Exportação de relatórios

## Autenticação Mockada

Para testes, o sistema usa autenticação mockada baseada no email:

- **Email contém "gestor" ou "admin":** Perfil GESTOR
- **Email contém "anuncios" ou "marketing":** Perfil ANUNCIANTE
- **Outros emails:** Perfil VENDEDOR

### Exemplo de Login

```typescript
// Login como gestor
email: "gestor@dlautopecas.com"
senha: "qualquer"

// Login como anunciante
email: "anuncios@dlautopecas.com"
senha: "qualquer"

// Login como vendedor
email: "vendedor@dlautopecas.com"
senha: "qualquer"
```

## Estrutura de Arquivos

```
frontend/src/
├── contexts/
│   └── AuthContext.tsx          # Contexto de autenticação
├── hooks/
│   └── usePermissions.ts        # Hook de permissões
├── components/
│   └── auth/
│       └── PermissionGuard.tsx  # Componente de proteção
└── pages/gestor/equipe/
    ├── vendedores.tsx           # Gestão de vendedores
    ├── anuncios.tsx             # Anúncios da equipe
    └── performance.tsx          # Performance da equipe
```

## Endpoints Mockados

### GET /equipe/vendedores
Retorna lista de vendedores com dados principais.

### POST /equipe/vendedores
Cria novo vendedor com permissões.

### DELETE /equipe/vendedores/{id}
Remove vendedor do sistema.

### GET /equipe/anuncios
Lista anúncios criados pela equipe.

### GET /equipe/performance?periodo=...
Retorna métricas de performance por período.

### POST /auth/login
Autenticação de usuário.

### GET /auth/me
Retorna dados do usuário logado.

## Boas Práticas

1. **Sempre usar PermissionGuard** para proteger rotas sensíveis
2. **Verificar permissões** antes de renderizar componentes
3. **Usar o hook usePermissions** para verificações dinâmicas
4. **Manter consistência** nos nomes de permissões
5. **Documentar** novas permissões adicionadas

## Extensibilidade

Para adicionar novas permissões:

1. Atualizar `getPermissoesByPerfil()` no AuthContext
2. Adicionar métodos no hook usePermissions
3. Usar PermissionGuard nas novas páginas
4. Atualizar esta documentação 