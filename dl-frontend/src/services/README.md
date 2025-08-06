# Serviço de Orçamento

Este serviço permite enviar orçamentos para a API FastAPI usando axios e gerenciar todo o ciclo de vida dos orçamentos.

## Estrutura de Tipos

Os tipos estão centralizados em `src/types/orcamento.ts`:

```typescript
interface OrcamentoPayload {
  cliente_id: number;
  vendedor_id: number;
  valor_total: number;
  itens: ItemOrcamento[];
}

interface OrcamentoComStatus extends OrcamentoResponse {
  status: StatusOrcamento;
  observacoes?: string;
  data_aprovacao?: string;
  data_conclusao?: string;
  cliente?: Cliente;
  vendedor?: { id: number; nome: string; };
}
```

## Funcionalidades Principais

### 1. Criação de Orçamentos
```typescript
import { salvarOrcamento } from '@/services/orcamentoService';
import { OrcamentoPayload } from '@/types/orcamento';

const payload: OrcamentoPayload = {
  cliente_id: 1,
  vendedor_id: 1,
  valor_total: 500.00,
  itens: [
    {
      id_produto_tiny: "12345",
      nome_produto: "Parachoque Onix 2019",
      quantidade: 1,
      preco_unitario: 250.00
    }
  ]
};

const resultado = await salvarOrcamento(payload);
```

### 2. Gestão de Orçamentos
```typescript
import { buscarOrcamentos, mudarStatusOrcamento, reabrirOrcamento } from '@/services/orcamentoService';

// Buscar orçamentos
const orcamentos = await buscarOrcamentos({ status: StatusOrcamento.PENDENTE });

// Mudar status
await mudarStatusOrcamento({
  orcamento_id: 1,
  novo_status: StatusOrcamento.APROVADO,
  observacoes: "Aprovado pelo cliente"
});

// Reabrir orçamento
await reabrirOrcamento({
  orcamento_id: 1,
  vendedor_id: 1
});
```

### 3. Funcionalidades Extras
```typescript
import { gerarPDFOrcamento, enviarOrcamentoWhatsApp } from '@/services/orcamentoService';

// Gerar PDF
const pdfUrl = await gerarPDFOrcamento(1);

// Enviar por WhatsApp
await enviarOrcamentoWhatsApp(1, "(11) 99999-9999");
```

## Componentes de Interface

### OrcamentoCard
Exibe os dados de um orçamento individual com ações:
- Mudança de status
- Reabrir orçamento
- Gerar PDF
- Enviar por WhatsApp

### ListaOrcamentos
Componente principal da gestão de orçamentos:
- Filtros por status
- Busca por cliente/ID/vendedor
- Estatísticas rápidas
- Grid responsivo de cards

## Status de Orçamento

```typescript
enum StatusOrcamento {
  PENDENTE = 'pendente',
  NEGOCIANDO = 'negociando',
  APROVADO = 'aprovado',
  CONCLUIDO = 'concluido',
  CANCELADO = 'cancelado'
}
```

## Endpoints

- **POST** `/orcamentos` - Criar orçamento
- **GET** `/orcamentos` - Listar orçamentos (com filtros)
- **GET** `/orcamentos/{id}` - Buscar orçamento específico
- **PUT** `/orcamentos/{id}/status` - Mudar status
- **POST** `/orcamentos/{id}/reabrir` - Reabrir orçamento
- **GET** `/orcamentos/{id}/pdf` - Gerar PDF

## Tratamento de Erros

O serviço captura e trata erros de rede e da API, fornecendo mensagens de erro descritivas.

## Tipos Disponíveis

### Em `src/types/orcamento.ts`:

- `ItemOrcamento`: Interface para itens do orçamento
- `OrcamentoPayload`: Interface para o payload de envio
- `OrcamentoResponse`: Interface para a resposta da API
- `OrcamentoComStatus`: Interface para orçamento com status
- `Cliente`: Interface para cliente
- `Produto`: Interface para produto
- `StatusOrcamento`: Enum para status de orçamento
- `FiltroOrcamento`: Interface para filtros
- `ListaOrcamentosResponse`: Interface para resposta de lista
- `MudancaStatusPayload`: Interface para mudança de status
- `ReabrirOrcamentoPayload`: Interface para reabrir orçamento

## Estrutura do Projeto

```
src/
├── types/
│   └── orcamento.ts          # Tipos centralizados
├── data/
│   └── orcamentosMock.ts     # Dados mock para desenvolvimento
├── services/
│   ├── orcamentoService.ts   # Serviço principal
│   ├── exemploUso.ts         # Exemplo de uso
│   └── README.md             # Documentação
├── components/
│   ├── orcamento/
│   │   ├── OrcamentoCard.tsx # Card individual
│   │   └── ListaOrcamentos.tsx # Lista principal
│   └── venda/
│       └── Pagamento.tsx     # Componente de venda
└── pages/
    ├── orcamentos.tsx        # Página de gestão
    └── ponto-de-venda.tsx    # Página de vendas
```

## Funcionalidades da Gestão de Orçamentos

### ✅ Filtros e Busca
- Filtro por status (Pendente, Negociando, Aprovado, Concluído, Cancelado)
- Busca por cliente, ID do orçamento ou vendedor
- Estatísticas rápidas por status

### ✅ Ações nos Orçamentos
- **Mudar Status**: Alterar o status do orçamento
- **Reabrir**: Voltar orçamento para status "Pendente"
- **Gerar PDF**: Simulação de geração de PDF
- **Enviar WhatsApp**: Simulação de envio por WhatsApp

### ✅ Interface Responsiva
- Cards organizados em grid responsivo
- Loading states para melhor UX
- Estados vazios com mensagens informativas

### ✅ Integração com Sistema
- Usa o contexto de venda existente
- Tipagem centralizada e consistente
- Navegação integrada no sidebar

## Mock Data

O sistema inclui dados mock para desenvolvimento:
- 5 orçamentos de exemplo com diferentes status
- Dados completos de clientes e vendedores
- Simulação de delays de API para UX realista 