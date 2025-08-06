import { test, expect } from '@playwright/test';
import { expectPostRequest, expectPutRequest, expectDeleteRequest, expectGetRequest } from '../utils/requests';
import { expectToast, expectDisabledWhilePending, openConfirmationAndConfirm, expectItemInList, expectItemNotInList } from '../utils/ui';
import { generateDummyCliente, generateDummyVenda, generateDummyOrcamento, cleanupTestData } from '../fixtures/entities';

test.describe('Vendas CTAs', () => {
  let testCliente: any;
  let testVenda: any;
  let testOrcamento: any;

  test.beforeEach(async ({ page }) => {
    await page.goto('/vendedor/venda-rapida');
    testCliente = generateDummyCliente();
    testVenda = generateDummyVenda();
    testOrcamento = generateDummyOrcamento();
  });

  test.afterEach(async ({ page }) => {
    // Cleanup - remove dados de teste
    await cleanupTestData(page.context().request, 'clientes');
    await cleanupTestData(page.context().request, 'vendas');
    await cleanupTestData(page.context().request, 'orcamentos');
  });

  test('deve adicionar item ao carrinho', async ({ page }) => {
    // Arrange
    await page.fill('input[placeholder="Buscar produtos..."]', 'Freio');
    await page.click('[data-testid="produto-item"]');
    
    // Act
    const addPromise = expectPostRequest(page, '/vendas/adicionar-item', {
      produto_id: 123,
      quantidade: 1
    });
    
    await page.click('button:has-text("Adicionar")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Adicionar")');
    await addPromise;
    await expectToast(page, 'Item adicionado ao carrinho!');
    await expectItemInList(page, '[data-testid="carrinho-items"]', 'Freio');
  });

  test('deve buscar cliente existente', async ({ page }) => {
    // Arrange
    await page.fill('input[placeholder="Buscar cliente..."]', 'João');
    
    // Act
    const searchPromise = expectGetRequest(page, '/clientes/buscar?termo=João');
    
    await page.click('button:has-text("Buscar")');
    
    // Assert
    await searchPromise;
    await expect(page.locator('[data-testid="clientes-resultado"]')).toBeVisible();
  });

  test('deve criar novo cliente', async ({ page }) => {
    // Arrange
    await page.click('button:has-text("Novo Cliente")');
    await page.fill('input[name="nome"]', testCliente.nome);
    await page.fill('input[name="email"]', testCliente.email);
    await page.fill('input[name="telefone"]', testCliente.telefone);
    
    // Act
    const createPromise = expectPostRequest(page, '/clientes/criar', {
      nome: testCliente.nome,
      email: testCliente.email,
      telefone: testCliente.telefone
    });
    
    await page.click('button:has-text("Criar Cliente")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Criar Cliente")');
    await createPromise;
    await expectToast(page, 'Cliente criado com sucesso!');
    await expectItemInList(page, '[data-testid="clientes-lista"]', testCliente.nome);
  });

  test('deve aplicar desconto na venda', async ({ page }) => {
    // Arrange - ter itens no carrinho
    await page.fill('input[placeholder="Buscar produtos..."]', 'Freio');
    await page.click('[data-testid="produto-item"]');
    await page.click('button:has-text("Adicionar")');
    await page.waitForSelector('text=Item adicionado ao carrinho!');
    
    // Act
    await page.fill('input[name="desconto"]', '10');
    
    const discountPromise = expectPostRequest(page, '/vendas/aplicar-desconto', {
      venda_id: 123,
      desconto: 10
    });
    
    await page.click('button:has-text("Aplicar Desconto")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Aplicar Desconto")');
    await discountPromise;
    await expectToast(page, 'Desconto aplicado com sucesso!');
  });

  test('deve finalizar venda', async ({ page }) => {
    // Arrange - ter itens no carrinho e cliente selecionado
    await page.fill('input[placeholder="Buscar produtos..."]', 'Freio');
    await page.click('[data-testid="produto-item"]');
    await page.click('button:has-text("Adicionar")');
    await page.waitForSelector('text=Item adicionado ao carrinho!');
    
    await page.fill('input[placeholder="Buscar cliente..."]', 'João');
    await page.click('button:has-text("Buscar")');
    await page.click('[data-testid="selecionar-cliente"]');
    
    // Act
    const finishPromise = expectPostRequest(page, '/vendas/finalizar', {
      venda_data: expect.any(Object)
    });
    
    await page.click('button:has-text("Finalizar Venda")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Finalizar Venda")');
    await finishPromise;
    await expectToast(page, 'Venda finalizada com sucesso!');
    await expect(page).toHaveURL('/vendedor/historico');
  });

  test('deve remover item do carrinho', async ({ page }) => {
    // Arrange - ter item no carrinho
    await page.fill('input[placeholder="Buscar produtos..."]', 'Freio');
    await page.click('[data-testid="produto-item"]');
    await page.click('button:has-text("Adicionar")');
    await page.waitForSelector('text=Item adicionado ao carrinho!');
    
    // Act
    const removePromise = expectDeleteRequest(page, '/vendas/remover-item/123');
    
    await page.click('[data-testid="remover-item-123"]');
    
    // Assert
    await removePromise;
    await expectToast(page, 'Item removido do carrinho!');
    await expectItemNotInList(page, '[data-testid="carrinho-items"]', 'Freio');
  });

  test('deve atualizar quantidade do item', async ({ page }) => {
    // Arrange - ter item no carrinho
    await page.fill('input[placeholder="Buscar produtos..."]', 'Freio');
    await page.click('[data-testid="produto-item"]');
    await page.click('button:has-text("Adicionar")');
    await page.waitForSelector('text=Item adicionado ao carrinho!');
    
    // Act
    await page.fill('[data-testid="quantidade-item-123"]', '3');
    
    const updatePromise = expectPutRequest(page, '/vendas/atualizar-item/123', {
      quantidade: 3
    });
    
    await page.click('[data-testid="atualizar-quantidade-123"]');
    
    // Assert
    await expectDisabledWhilePending(page, '[data-testid="atualizar-quantidade-123"]');
    await updatePromise;
    await expectToast(page, 'Quantidade atualizada!');
  });

  test('deve criar orçamento', async ({ page }) => {
    // Arrange
    await page.goto('/vendedor/orcamentos');
    await page.click('button:has-text("Novo Orçamento")');
    await page.fill('input[name="cliente_id"]', '123');
    
    // Adicionar itens
    await page.fill('input[placeholder="Buscar produtos..."]', 'Freio');
    await page.click('[data-testid="produto-item"]');
    await page.click('button:has-text("Adicionar")');
    
    // Act
    const createPromise = expectPostRequest(page, '/orcamentos/criar', {
      cliente_id: 123,
      itens: expect.any(Array)
    });
    
    await page.click('button:has-text("Criar Orçamento")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Criar Orçamento")');
    await createPromise;
    await expectToast(page, 'Orçamento criado com sucesso!');
  });

  test('deve enviar orçamento por email', async ({ page }) => {
    // Arrange - ter orçamento criado
    await page.goto('/vendedor/orcamentos');
    await page.click('[data-testid="orcamento-item-123"]');
    
    // Act
    const sendPromise = expectPostRequest(page, '/orcamentos/123/enviar', {});
    
    await page.click('button:has-text("Enviar Orçamento")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Enviar Orçamento")');
    await sendPromise;
    await expectToast(page, 'Orçamento enviado com sucesso!');
  });

  test('deve gerar PDF do orçamento', async ({ page }) => {
    // Arrange
    await page.goto('/vendedor/orcamentos');
    await page.click('[data-testid="orcamento-item-123"]');
    
    // Act
    const pdfPromise = expectGetRequest(page, '/orcamentos/123/pdf');
    
    await page.click('button:has-text("Gerar PDF")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Gerar PDF")');
    await pdfPromise;
    await expect(page.locator('text=Download iniciado')).toBeVisible();
  });

  test('deve concluir orçamento (converter em venda)', async ({ page }) => {
    // Arrange
    await page.goto('/vendedor/orcamentos');
    await page.click('[data-testid="orcamento-item-123"]');
    
    // Act
    const concludePromise = expectPostRequest(page, '/orcamentos/123/concluir', {});
    
    await page.click('button:has-text("Concluir Orçamento")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Concluir Orçamento")');
    await concludePromise;
    await expectToast(page, 'Orçamento convertido em venda!');
    await expect(page).toHaveURL('/vendedor/venda-rapida');
  });

  test('deve calcular frete', async ({ page }) => {
    // Arrange
    await page.goto('/vendedor/orcamentos');
    await page.click('[data-testid="orcamento-item-123"]');
    await page.fill('input[name="cep"]', '01234-567');
    
    // Act
    const fretePromise = expectPostRequest(page, '/orcamentos/123/frete', {
      cep: '01234-567'
    });
    
    await page.click('button:has-text("Calcular Frete")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Calcular Frete")');
    await fretePromise;
    await expect(page.locator('[data-testid="opcoes-frete"]')).toBeVisible();
  });

  test('deve aplicar frete selecionado', async ({ page }) => {
    // Arrange - ter opções de frete calculadas
    await page.goto('/vendedor/orcamentos');
    await page.click('[data-testid="orcamento-item-123"]');
    await page.fill('input[name="cep"]', '01234-567');
    await page.click('button:has-text("Calcular Frete")');
    await page.waitForSelector('[data-testid="opcoes-frete"]');
    
    // Act
    const applyPromise = expectPostRequest(page, '/orcamentos/123/aplicar-frete', {
      opcao_frete: 'sedex'
    });
    
    await page.click('[data-testid="aplicar-frete-sedex"]');
    
    // Assert
    await expectDisabledWhilePending(page, '[data-testid="aplicar-frete-sedex"]');
    await applyPromise;
    await expectToast(page, 'Frete aplicado com sucesso!');
  });

  test('deve editar orçamento', async ({ page }) => {
    // Arrange
    await page.goto('/vendedor/orcamentos');
    await page.click('[data-testid="orcamento-item-123"]');
    
    // Act
    await page.fill('input[name="desconto"]', '15');
    
    const editPromise = expectPutRequest(page, '/orcamentos/123', {
      desconto: 15
    });
    
    await page.click('button:has-text("Salvar Alterações")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Salvar Alterações")');
    await editPromise;
    await expectToast(page, 'Orçamento atualizado com sucesso!');
  });
}); 