# Matriz de Auditoria de Cliques - DL Sistema

## Visão Geral
Este documento mapeia todos os CTAs (Call-to-Action) críticos do sistema, validando que cada botão dispare a ação correta com submit-lock, confirmação em ações destrutivas, toasts/estados padronizados e requests esperados.

## Estrutura da Matriz
- **Página**: Página onde o CTA está localizado
- **CTA**: Descrição do botão/ação
- **Endpoint**: Rota da API que deve ser chamada
- **Método**: HTTP method (GET, POST, PUT, DELETE)
- **Payload mínimo**: Dados mínimos esperados no request
- **Efeito de UI**: Toast/redirect/atualização esperada
- **Submit-lock**: Se o botão deve ficar desabilitado durante request
- **Confirmação**: Se ação destrutiva requer confirmação
- **Status**: Pass/Fail/Skip (preenchido após testes)
- **Observações**: Notas adicionais

---

## CTAs Críticos - Matriz Principal (15 CTAs)

| Página | CTA | Endpoint | Método | Payload mínimo | Efeito de UI (toast/redirect/atualização) | Submit-lock? | Confirmação? | Observações | Status |
|--------|-----|----------|--------|----------------|--------------------------------------------|--------------|--------------|-------------|--------|
| login | Entrar | /auth/login | POST | {username, password} | Redirect para /gestor ou /vendedor | ✅ | ❌ | Valida credenciais e salva token | **SKIP** |
| gestor | RefreshCards | /dashboard/metricas, /dashboard/estatisticas, /produtos/estoque/estatisticas | GET |  | Atualiza cards do dashboard | ✅ | ❌ | Busca dados atualizados | **PENDING** |
| produtos | Criar | /produtos/estoque | POST | {nome, categoria, preco, estoque, sku?, descricao?, marca?} | Toast sucesso + refresh lista | ✅ | ❌ | Cria novo produto | **PENDING** |
| produtos | Salvar | /produtos/estoque/{id} | PUT | {nome?, categoria?, preco?, estoque?, sku?, descricao?, marca?} | Toast sucesso + refresh | ✅ | ❌ | Atualiza produto existente | **PENDING** |
| produtos | Deletar | /produtos/estoque/{id} | DELETE |  | Toast sucesso + remove da lista | ✅ | ✅ | Ação destrutiva - confirmação obrigatória | **PENDING** |
| produtos | Buscar | /produtos/estoque | GET | {search?, categoria?} | Atualiza lista de resultados | ❌ | ❌ | Busca em tempo real | **PENDING** |
| anuncios | CriarAnuncio | /anuncios/ia/criar-anuncio | GET |  | Redirect para página de criação | ✅ | ❌ | Redireciona para criação com IA | **PENDING** |
| anuncios | GerarIA | /anuncios/ia/otimizar | POST |  | Toast sucesso + otimização | ✅ | ❌ | Otimiza anúncios com IA | **PENDING** |
| anuncios | Publicar | /anuncios/publicar | POST | {titulo, descricao, preco, imagens} | Toast sucesso + redirect | ✅ | ❌ | Publica anúncio | **PENDING** |
| anuncios | Despublicar | /anuncios/{id}/despublicar | POST |  | Toast sucesso + status inativo | ✅ | ✅ | Ação destrutiva - confirmação obrigatória | **PENDING** |
| anuncios | AtualizarMidia | /anuncios/{id}/midia | PUT | {imagens} | Toast sucesso + refresh | ✅ | ❌ | Atualiza imagens do anúncio | **PENDING** |
| anuncios | Sincronizar | /anuncios/{id}/sync | POST |  | Toast sucesso + status sincronizado | ✅ | ❌ | Sincroniza com marketplace | **PENDING** |
| vendas | AdicionarItem | /vendas/adicionar-item | POST | {id_produto_tiny, nome_produto, quantidade, preco_unitario, sku, imagem, permalink} | Adiciona ao carrinho | ✅ | ❌ | Adiciona produto à venda | **PENDING** |
| vendas | AplicarPreco | /vendas/aplicar-preco | POST | {venda_id, preco} | Toast sucesso + atualiza total | ✅ | ❌ | Aplica preço personalizado | **PENDING** |
| vendas | Finalizar | /vendas/finalizar | POST | {cliente_id, vendedor_id, produtos, forma_pagamento, dados_pagamento, desconto_geral_percentual, frete_valor, frete_tipo} | Toast sucesso + redirect | ✅ | ❌ | Finaliza a venda | **PENDING** |

---

## Login

| Página | CTA | Endpoint | Método | Payload mínimo | Efeito de UI | Submit-lock? | Confirmação? | Status | Observações |
|--------|-----|----------|--------|----------------|--------------|--------------|--------------|--------|-------------|
| /login | Entrar (Gestor) | /auth/login | POST | {username, password} | Redirect para /gestor | ✅ | ❌ | **SKIP** | **Coberto por storageState; teste contratual de /auth/login PASS** |
| /login | Entrar (Vendedor) | /auth/login | POST | {username, password} | Redirect para /vendedor | ✅ | ❌ | **SKIP** | **Coberto por storageState; teste contratual de /auth/login PASS** |
| /login | Entrar (Anúncios) | /auth/login | POST | {username, password} | Redirect para /anuncios | ✅ | ❌ | **SKIP** | **Coberto por storageState; teste contratual de /auth/login PASS** |

---

## Gestor

### Dashboard (/gestor)

| Página | CTA | Endpoint | Método | Payload mínimo | Efeito de UI | Submit-lock? | Confirmação? | Status | Observações |
|--------|-----|----------|--------|----------------|--------------|--------------|--------------|--------|-------------|
| /gestor | Ativar Modo Turbo | /configuracoes/turbo | POST | {} | Toast sucesso | ✅ | ❌ | ⏳ | Otimização de performance |
| /gestor | Definir Meta | /configuracoes/metas | POST | {meta, valor} | Toast sucesso | ✅ | ❌ | ⏳ | Define meta de vendas |
| /gestor | Enviar Mensagem IA | /ia/chat | POST | {message, context: 'dashboard_gestor'} | Adiciona ao chat | ✅ | ❌ | ⏳ | Chat com IA assistente |
| /gestor | Analisar Preços | /dashboard/analise-precos | POST | {produto_id?} | Toast sucesso | ✅ | ❌ | ⏳ | Análise de concorrência |
| /gestor | Verificar Dificuldades | /dashboard/dificuldades | POST | {vendedor_id} | Toast sucesso | ✅ | ❌ | ⏳ | Análise de performance |
| /gestor | Revisar Estratégia | /dashboard/estrategia | POST | {} | Toast sucesso | ✅ | ❌ | ⏳ | Revisão automática |
| /gestor | Revisar Preços | /dashboard/revisar-precos | POST | {} | Toast sucesso | ✅ | ❌ | ⏳ | Revisão de preços |
| /gestor | Atender Lead | /dashboard/atender-lead | POST | {lead_id} | Toast sucesso | ✅ | ❌ | ⏳ | Atendimento de leads |

---

## Produtos

### Catálogo (/gestor/produtos/catalogo)

| Página | CTA | Endpoint | Método | Payload mínimo | Efeito de UI | Submit-lock? | Confirmação? | Status | Observações |
|--------|-----|----------|--------|----------------|--------------|--------------|--------------|--------|-------------|
| /gestor/produtos/catalogo | Criar Produto | /produtos/estoque | POST | {nome, categoria, preco, estoque, sku?, descricao?, marca?} | Toast sucesso + refresh | ✅ | ❌ | ⏳ | Cria novo produto |
| /gestor/produtos/catalogo | Editar Produto | /produtos/estoque/{id} | PUT | {nome?, categoria?, preco?, estoque?, sku?, descricao?, marca?} | Toast sucesso + refresh | ✅ | ❌ | ⏳ | Atualiza produto existente |
| /gestor/produtos/catalogo | Deletar Produto | /produtos/estoque/{id} | DELETE | {} | Toast sucesso + remove da lista | ✅ | ✅ | ⏳ | Ação destrutiva - confirmação obrigatória |
| /gestor/produtos/catalogo | Buscar/Filtrar | /produtos/estoque | GET | {search?, categoria?} | Atualiza lista | ❌ | ❌ | ⏳ | Filtro em tempo real |
| /gestor/produtos/catalogo | Importar ML | /produtos/estoque/importar-ml | POST | {} | Toast sucesso + refresh | ✅ | ❌ | ⏳ | Importa produtos do Mercado Livre |
| /gestor/produtos/catalogo | Exportar Catálogo | /produtos/estoque/exportar | GET | {} | Download arquivo | ✅ | ❌ | ⏳ | Exporta catálogo completo |
| /gestor/produtos/catalogo | Atualizar Estoque | /produtos/estoque/{id} | PUT | {estoque} | Toast sucesso + refresh | ✅ | ❌ | ⏳ | Atualiza quantidade em estoque |
| /gestor/produtos/catalogo | Visualizar Produto | /produtos/estoque/{id} | GET | {} | Abre modal/detalhes | ❌ | ❌ | ⏳ | Visualização sem alteração |

### Estoque (/gestor/produtos/estoque)

| Página | CTA | Endpoint | Método | Payload mínimo | Efeito de UI | Submit-lock? | Confirmação? | Status | Observações |
|--------|-----|----------|--------|----------------|--------------|--------------|--------------|--------|-------------|
| /gestor/produtos/estoque | Atualizar Estoque | /produtos/estoque/{id} | PUT | {estoque} | Toast sucesso + refresh | ✅ | ❌ | ⏳ | Atualiza quantidade |
| /gestor/produtos/estoque | Deletar Produto | /produtos/estoque/{id} | DELETE | {} | Toast sucesso + remove | ✅ | ✅ | ⏳ | Ação destrutiva |
| /gestor/produtos/estoque | Buscar Produto | /produtos/estoque | GET | {search?} | Atualiza lista | ❌ | ❌ | ⏳ | Busca em tempo real |

---

## Anúncios

### Criar Anúncio (/anuncios/criar-anuncio)

| Página | CTA | Endpoint | Método | Payload mínimo | Efeito de UI | Submit-lock? | Confirmação? | Status | Observações |
|--------|-----|----------|--------|----------------|--------------|--------------|--------------|--------|-------------|
| /anuncios/criar-anuncio | Gerar Anúncio IA | /anuncios/gerar-ia | POST | {categoria, nome_produto} | Mostra resultado IA | ✅ | ❌ | ⏳ | Gera conteúdo com IA |
| /anuncios/criar-anuncio | Publicar Anúncio | /anuncios/publicar | POST | {titulo, descricao, preco, imagens} | Toast sucesso + redirect | ✅ | ❌ | ⏳ | Publica anúncio |
| /anuncios/criar-anuncio | Salvar Rascunho | /anuncios/rascunho | POST | {titulo?, descricao?, preco?} | Toast sucesso | ✅ | ❌ | ⏳ | Salva como rascunho |

### IA (/anuncios/ia/*)

| Página | CTA | Endpoint | Método | Payload mínimo | Efeito de UI | Submit-lock? | Confirmação? | Status | Observações |
|--------|-----|----------|--------|----------------|--------------|--------------|--------------|--------|-------------|
| /anuncios/ia/melhorar-descricoes | Analisar Descrições | /anuncios/ia/melhorar | POST | {descricao} | Mostra melhorias | ✅ | ❌ | ⏳ | Melhora descrições com IA |
| /anuncios/ia/sugestoes-preco | Analisar Preços | /anuncios/ia/precos | POST | {produto_id} | Mostra sugestões | ✅ | ❌ | ⏳ | Sugere preços otimizados |
| /anuncios/ia/sugestoes-preco | Aplicar Preço | /anuncios/atualizar-preco | PUT | {anuncio_id, preco} | Toast sucesso | ✅ | ❌ | ⏳ | Aplica preço sugerido |
| /anuncios/ia/criar-anuncio | Gerar Anúncio Completo | /anuncios/ia/gerar-completo | POST | {produto_id} | Mostra anúncio completo | ✅ | ❌ | ⏳ | Gera anúncio completo |
| /anuncios/ia/criar-anuncio | Publicar Shopify | /anuncios/publicar-shopify | POST | {anuncio_data} | Toast sucesso | ✅ | ❌ | ⏳ | Publica no Shopify |
| /anuncios/ia/analise-concorrencia | Analisar Concorrência | /anuncios/ia/concorrencia | POST | {produto_id} | Mostra análise | ✅ | ❌ | ⏳ | Análise de concorrência |

---

## Vendas/Balcão

### Venda Rápida (/vendedor/venda-rapida)

| Página | CTA | Endpoint | Método | Payload mínimo | Efeito de UI | Submit-lock? | Confirmação? | Status | Observações |
|--------|-----|----------|--------|----------------|--------------|--------------|--------------|--------|-------------|
| /vendedor/venda-rapida | Adicionar Item | /vendas/adicionar-item | POST | {id_produto_tiny, nome_produto, quantidade, preco_unitario, sku, imagem, permalink} | Adiciona ao carrinho | ✅ | ❌ | ⏳ | Adiciona produto ao carrinho |
| /vendedor/venda-rapida | Buscar Cliente | /clientes/buscar | GET | {termo} | Mostra resultados | ❌ | ❌ | ⏳ | Busca cliente existente |
| /vendedor/venda-rapida | Criar Cliente | /clientes/criar | POST | {nome, email, telefone} | Toast sucesso + adiciona | ✅ | ❌ | ⏳ | Cria novo cliente |
| /vendedor/venda-rapida | Aplicar Desconto | /vendas/aplicar-desconto | POST | {venda_id, desconto} | Toast sucesso | ✅ | ❌ | ⏳ | Aplica desconto na venda |
| /vendedor/venda-rapida | Finalizar Venda | /vendas/finalizar | POST | {cliente_id, vendedor_id, produtos, forma_pagamento, dados_pagamento, desconto_geral_percentual, frete_valor, frete_tipo} | Toast sucesso + redirect | ✅ | ❌ | ⏳ | Finaliza a venda |
| /vendedor/venda-rapida | Remover Item | /vendas/remover-item | DELETE | {item_id} | Remove do carrinho | ✅ | ❌ | ⏳ | Remove item do carrinho |
| /vendedor/venda-rapida | Atualizar Quantidade | /vendas/atualizar-item | PUT | {item_id, quantidade} | Atualiza carrinho | ✅ | ❌ | ⏳ | Atualiza quantidade |

### Clientes (/vendedor/clientes)

| Página | CTA | Endpoint | Método | Payload mínimo | Efeito de UI | Submit-lock? | Confirmação? | Status | Observações |
|--------|-----|----------|--------|----------------|--------------|--------------|--------------|--------|-------------|
| /vendedor/clientes | Criar Cliente | /clientes/criar | POST | {nome, email, telefone} | Toast sucesso + refresh | ✅ | ❌ | ⏳ | Cria novo cliente |
| /vendedor/clientes | Editar Cliente | /clientes/{id} | PUT | {nome?, email?, telefone?} | Toast sucesso + refresh | ✅ | ❌ | ⏳ | Atualiza cliente |
| /vendedor/clientes | Excluir Cliente | /clientes/{id} | DELETE | {} | Toast sucesso + remove | ✅ | ✅ | ⏳ | Ação destrutiva |
| /vendedor/clientes | Vale Peça | /clientes/vale-peca | POST | {cliente_id} | Toast sucesso | ✅ | ❌ | ⏳ | Aplica vale peça |
| /vendedor/clientes | Exportar | /clientes/exportar | GET | {} | Download arquivo | ✅ | ❌ | ⏳ | Exporta lista de clientes |

### Histórico (/vendedor/historico)

| Página | CTA | Endpoint | Método | Payload mínimo | Efeito de UI | Submit-lock? | Confirmação? | Status | Observações |
|--------|-----|----------|--------|----------------|--------------|--------------|--------------|--------|-------------|
| /vendedor/historico | Visualizar Venda | /vendas/{id} | GET | {} | Abre modal/detalhes | ❌ | ❌ | ⏳ | Visualiza detalhes da venda |
| /vendedor/historico | Gerar PDF | /vendas/{id}/pdf | GET | {} | Download PDF | ✅ | ❌ | ⏳ | Gera PDF da venda |
| /vendedor/historico | Replicar Venda | /vendas/replicar | POST | {venda_id} | Toast sucesso + redirect | ✅ | ❌ | ⏳ | Replica venda anterior |
| /vendedor/historico | Exportar | /vendas/exportar | GET | {} | Download arquivo | ✅ | ❌ | ⏳ | Exporta histórico |

---

## Orçamentos (/vendedor/orcamentos)

| Página | CTA | Endpoint | Método | Payload mínimo | Efeito de UI | Submit-lock? | Confirmação? | Status | Observações |
|--------|-----|----------|--------|----------------|--------------|--------------|--------------|--------|-------------|
| /vendedor/orcamentos | Criar Orçamento | /orcamentos/criar | POST | {cliente_id, itens} | Toast sucesso + redirect | ✅ | ❌ | ⏳ | Cria novo orçamento |
| /vendedor/orcamentos | Editar Orçamento | /orcamentos/{id} | PUT | {itens?, desconto?} | Toast sucesso | ✅ | ❌ | ⏳ | Atualiza orçamento |
| /vendedor/orcamentos | Enviar Orçamento | /orcamentos/{id}/enviar | POST | {} | Toast sucesso | ✅ | ❌ | ⏳ | Envia por email |
| /vendedor/orcamentos | Gerar PDF | /orcamentos/{id}/pdf | GET | {} | Download PDF | ✅ | ❌ | ⏳ | Gera PDF do orçamento |
| /vendedor/orcamentos | Concluir Orçamento | /orcamentos/{id}/concluir | POST | {} | Toast sucesso + redirect | ✅ | ❌ | ⏳ | Converte em venda |
| /vendedor/orcamentos | Calcular Frete | /orcamentos/{id}/frete | POST | {cep} | Mostra opções | ✅ | ❌ | ⏳ | Calcula frete |

---

## Legenda
- ✅ = Sim
- ❌ = Não  
- ⏳ = Pendente (será preenchido após testes)
- **SKIP** = Coberto por storageState; teste contratual PASS
- **PASS** = Teste passou com sucesso
- **FAIL** = Teste falhou
- **PENDING** = Aguardando execução

## Notas Importantes
1. **Login UI marcado como SKIP**: Coberto por storageState; teste contratual de /auth/login PASS
2. Todos os CTAs devem ter submit-lock durante requests
3. Ações destrutivas (DELETE) devem ter confirmação obrigatória
4. Todos os requests devem retornar toast de sucesso/erro
5. Dados de teste devem ser limpos após cada teste
6. Seletores devem ser robustos (data-qa preferencialmente) 