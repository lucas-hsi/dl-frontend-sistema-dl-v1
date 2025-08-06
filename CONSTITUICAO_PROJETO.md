# 📜 CONSTITUIÇÃO DO PROJETO - DL_SISTEMA

**Data da Última Ratificação:** 2025-08-03
**Status:** ESTADO DE EMERGÊNCIA - OPERAÇÃO "CORREDOR ESTÁVEL"

Este documento é a lei suprema deste projeto até que a entrega de emergência seja concluída. Toda e qualquer modificação ou implementação de código, por humano ou IA, DEVE aderir estritamente aos artigos abaixo.

---

### **Artigo 1: O Objetivo Imutável**

O **ÚNICO** objetivo é estabelecer o **"Corredor Estável"**. Qualquer funcionalidade fora deste corredor DEVE ser desativada via Feature Flag.

O "Corredor Estável" é definido pela seguinte jornada do usuário:
1.  **Login Real:** Usuário se autentica com email e senha.
2.  **Acesso ao Dashboard:** Usuário visualiza o dashboard principal (mesmo que com dados estáticos).
3.  **Busca no Estoque:** Usuário busca por um produto e recebe resultados reais do banco.
4.  **Criação de Orçamento (Rascunho):** Usuário adiciona um item a um orçamento e salva como rascunho.
5.  **Criação de Cliente (Rascunho):** Usuário cria um novo cliente e salva como rascunho.

---

### **Artigo 2: O Contrato da API (O Envelope de Resposta)**

TODA resposta de endpoint da API DEVE seguir estritamente o schema `ApiResponse`. Não há exceções.

```python
# Schema Pydantic Obrigatório
from pydantic import BaseModel, Field
from typing import TypeVar, Generic, Optional, Any

T = TypeVar('T')

class ApiResponse(BaseModel, Generic[T]):
    ok: bool = Field(..., description="True para sucesso, False para erro.")
    data: Optional[T] = Field(None, description="Payload em caso de sucesso.")
    error: Optional[str] = Field(None, description="Mensagem de erro em caso de falha.")
    meta: Optional[dict[str, Any]] = Field(None, description="Metadados como paginação.")
Artigo 3: Os Pilares da Arquitetura
Backend é a Fonte da Verdade: O Frontend NÃO PODE conter lógica de negócio ou estado mockado para funcionalidades do "Corredor Estável".

Injeção de Dependência: Serviços serão instanciados via dependências do FastAPI para garantir testabilidade.

Padrão de Repositório: A lógica de acesso ao banco de dados será isolada em Repositórios (mesmo que implementados de forma simples nesta fase). Serviços não falam com o DB diretamente.

Artigo 4: A Sequência Cirúrgica (Plano de Ação)
A implementação DEVE seguir esta ordem. Não pule etapas.

Implementar Serviços Mínimos: Substituir os stubs NotImplementedError dos serviços do "Corredor Estável" por lógica real.

Padronizar Respostas: Aplicar o ApiResponse (Artigo 2) nos endpoints do "Corredor Estável".

Conectar Banco de Dados: Garantir conexão real com o PostgreSQL.

Blindar o Frontend: Criar um wrapper HTTP que valide a estrutura do ApiResponse.

Ativar Feature Flags: Desligar todas as funcionalidades não essenciais na UI.

Realizar Teste de Fumaça: Executar o "Corredor Estável" de ponta a ponta.

Criar Ponto de Salvação: Gerar git tag e dump do banco.

Artigo 5: As Feature Flags (Portões de Segurança)
As seguintes flags DEVEM ser usadas para controlar o escopo:

Backend: FEATURE_SHOPIFY, FEATURE_MERCADO_LIVRE, FEATURE_NFE. Todas devem ser False por padrão.

Frontend: NEXT_PUBLIC_FEATURE_SHOPIFY, NEXT_PUBLIC_FEATURE_ML, NEXT_PUBLIC_FEATURE_NFE. Devem ocultar ou desabilitar os elementos na UI correspondentes.


---

### **Passo 2: O "Prompt Mestre" (Nosso Modelo de Comando)**

A partir de agora, **toda e qualquer** tarefa que você me passar, ou passar para o Cursor, DEVE usar o template abaixo. Isso nos força a pensar de forma estruturada e a respeitar a Constituição.

```markdown
@CONSTITUICAO_PROJETO.md

### TAREFA:
[Descrição clara e única da tarefa a ser executada.]

### ARTIGOS APLICÁVEIS:
[Listar os artigos da Constituição que regem esta tarefa. Ex: "Artigo 1, 2 e 4"]

### CONTEXTO DE CÓDIGO:
- **Arquivos a modificar:** [Ex: `app/services/auth_service.py`, `app/api/routes/auth.py`]
- **Funções a criar/alterar:** [Ex: `create_access_token`, `router.post('/login')`]

### CRITÉRIOS DE ACEITE:
- [Liste os pontos que definem que a tarefa foi concluída com sucesso. Ex:
- "O endpoint `/login` deve retornar um `ApiResponse`."
- "Em caso de sucesso, o campo `data` deve conter um token JWT válido."
- "Em caso de falha de autenticação, deve retornar `ok: false` e uma mensagem no campo `error`."]

### INSTRUÇÃO FINAL:
Execute a tarefa aderindo estritamente aos artigos da Constituição citados. Não implemente nada além do escopo definido.
Exemplo Prático: Nossa Primeira Tarefa Real
Para implementar o login, este é o prompt que você vai usar:

Markdown

@CONSTITUICAO_PROJETO.md

### TAREFA:
Implementar a lógica real do endpoint de login (`/auth/login`), substituindo o stub `NotImplementedError` e a autenticação mockada.

### ARTIGOS APLICÁVEIS:
- **Artigo 1:** Esta é a primeira etapa do "Corredor Estável".
- **Artigo 2:** A resposta do endpoint DEVE usar o `ApiResponse`.
- **Artigo 4:** Esta é a primeira parte do "Passo 1" do plano.

### CONTEXTO DE CÓDIGO:
- **Arquivos a modificar:** `app/services/auth_service.py`, `app/api/routes/auth.py`, `app/core/security.py` (para funções de JWT e hash).
- **Funções a criar/alterar:** `AuthService.authenticate_user`, `security.create_access_token`, o endpoint `login` no router.

### CRITÉRIOS DE ACEITE:
- O endpoint deve receber um email e senha.
- Deve comparar a senha enviada com a hash salva no banco de dados usando `passlib`.
- Em caso de sucesso, deve retornar um `ApiResponse` com `ok: true` e o campo `data` contendo um token de acesso.
- Em caso de falha (usuário não encontrado ou senha incorreta), deve retornar um `ApiResponse` com `ok: false` e a mensagem de erro "Credenciais inválidas".
- O status HTTP deve ser 200 para sucesso e 401 para falha.

### INSTRUÇÃO FINAL:
Execute a tarefa aderindo estritamente aos artigos da Constituição citados. Não implemente a lógica de refresh token agora. Foco exclusivo no login básico.