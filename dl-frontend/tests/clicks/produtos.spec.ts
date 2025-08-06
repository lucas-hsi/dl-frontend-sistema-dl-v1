import { test, expect } from '@playwright/test';
import { expectPostRequest, expectPutRequest, expectDeleteRequest, expectGetRequest } from '../utils/requests';
import { expectToast, expectDisabledWhilePending, openConfirmationAndConfirm, expectItemInList, expectItemNotInList } from '../utils/ui';
import { generateDummyProduto, cleanupTestData } from '../fixtures/entities';

test.describe('Produtos CTAs', () => {
  let testProduto: any;

  test.beforeEach(async ({ page }) => {
    await page.goto('/gestor/produtos/catalogo');
    testProduto = generateDummyProduto();
  });

  test.afterEach(async ({ page }) => {
    // Cleanup - remove produtos de teste
    await cleanupTestData(page.context().request, 'produtos');
  });

  test('deve criar produto com dados válidos', async ({ page }) => {
    // Arrange
    await page.click('button:has-text("Criar Produto")');
    await page.fill('input[name="nome"]', testProduto.nome);
    await page.selectOption('select[name="categoria"]', testProduto.categoria);
    await page.fill('input[name="preco"]', testProduto.preco.toString());
    await page.fill('input[name="estoque"]', testProduto.estoque.toString());
    
    // Act
    const createPromise = expectPostRequest(page, '/produtos/estoque', {
      nome: testProduto.nome,
      categoria: testProduto.categoria,
      preco: testProduto.preco,
      estoque: testProduto.estoque
    });
    
    await page.click('button:has-text("Salvar")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Salvar")');
    await createPromise;
    await expectToast(page, 'Produto criado com sucesso!');
    await expectItemInList(page, '[data-testid="produtos-lista"]', testProduto.nome);
  });

  test('deve editar produto existente', async ({ page }) => {
    // Arrange - criar produto primeiro
    await page.click('button:has-text("Criar Produto")');
    await page.fill('input[name="nome"]', testProduto.nome);
    await page.selectOption('select[name="categoria"]', testProduto.categoria);
    await page.fill('input[name="preco"]', testProduto.preco.toString());
    await page.fill('input[name="estoque"]', testProduto.estoque.toString());
    await page.click('button:has-text("Salvar")');
    await page.waitForSelector('text=Produto criado com sucesso!');
    
    // Act - editar produto
    const novoPreco = testProduto.preco + 50;
    await page.click(`[data-testid="editar-produto-${testProduto.id}"]`);
    await page.fill('input[name="preco"]', novoPreco.toString());
    
    const updatePromise = expectPutRequest(page, `/produtos/estoque/${testProduto.id}`, {
      preco: novoPreco
    });
    
    await page.click('button:has-text("Atualizar")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Atualizar")');
    await updatePromise;
    await expectToast(page, 'Produto atualizado com sucesso!');
  });

  test('deve deletar produto com confirmação', async ({ page }) => {
    // Arrange - criar produto primeiro
    await page.click('button:has-text("Criar Produto")');
    await page.fill('input[name="nome"]', testProduto.nome);
    await page.selectOption('select[name="categoria"]', testProduto.categoria);
    await page.fill('input[name="preco"]', testProduto.preco.toString());
    await page.fill('input[name="estoque"]', testProduto.estoque.toString());
    await page.click('button:has-text("Salvar")');
    await page.waitForSelector('text=Produto criado com sucesso!');
    
    // Act
    const deletePromise = expectDeleteRequest(page, `/produtos/estoque/${testProduto.id}`);
    
    await openConfirmationAndConfirm(
      page,
      `[data-testid="deletar-produto-${testProduto.id}"]`,
      'button:has-text("Confirmar")'
    );
    
    // Assert
    await deletePromise;
    await expectToast(page, 'Produto deletado com sucesso!');
    await expectItemNotInList(page, '[data-testid="produtos-lista"]', testProduto.nome);
  });

  test('deve buscar produto por nome', async ({ page }) => {
    // Arrange
    await page.fill('input[placeholder="Buscar produtos..."]', 'Freio');
    
    // Act
    const searchPromise = expectGetRequest(page, '/produtos/estoque?search=Freio');
    
    // Simula busca (pode ser automática ou com botão)
    await page.keyboard.press('Enter');
    
    // Assert
    await searchPromise;
    // Verifica se resultados contêm "Freio"
    await expect(page.locator('[data-testid="produtos-lista"]')).toContainText('Freio');
  });

  test('deve filtrar produtos por categoria', async ({ page }) => {
    // Arrange
    await page.selectOption('select[name="categoria"]', 'Freios');
    
    // Act
    const filterPromise = expectGetRequest(page, '/produtos/estoque?categoria=Freios');
    
    // Assert
    await filterPromise;
    // Verifica se todos os produtos são da categoria Freios
    const produtos = page.locator('[data-testid="produto-item"]');
    for (let i = 0; i < await produtos.count(); i++) {
      await expect(produtos.nth(i)).toContainText('Freios');
    }
  });

  test('deve importar produtos do Mercado Livre', async ({ page }) => {
    // Act
    const importPromise = expectPostRequest(page, '/produtos/importar-ml', {});
    
    await page.click('button:has-text("Importar ML")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Importar ML")');
    await importPromise;
    await expectToast(page, 'Produtos importados com sucesso!');
  });

  test('deve exportar catálogo', async ({ page }) => {
    // Act
    const exportPromise = expectGetRequest(page, '/produtos/exportar');
    
    await page.click('button:has-text("Exportar")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Exportar")');
    await exportPromise;
    // Verifica se download foi iniciado
    await expect(page.locator('text=Download iniciado')).toBeVisible();
  });

  test('deve atualizar estoque de produto', async ({ page }) => {
    // Arrange - criar produto primeiro
    await page.click('button:has-text("Criar Produto")');
    await page.fill('input[name="nome"]', testProduto.nome);
    await page.selectOption('select[name="categoria"]', testProduto.categoria);
    await page.fill('input[name="preco"]', testProduto.preco.toString());
    await page.fill('input[name="estoque"]', testProduto.estoque.toString());
    await page.click('button:has-text("Salvar")');
    await page.waitForSelector('text=Produto criado com sucesso!');
    
    // Act
    const novaQuantidade = testProduto.estoque + 10;
    await page.fill(`[data-testid="estoque-produto-${testProduto.id}"]`, novaQuantidade.toString());
    
    const updatePromise = expectPutRequest(page, `/produtos/estoque/${testProduto.id}`, {
      estoque: novaQuantidade
    });
    
    await page.click(`[data-testid="atualizar-estoque-${testProduto.id}"]`);
    
    // Assert
    await expectDisabledWhilePending(page, `[data-testid="atualizar-estoque-${testProduto.id}"]`);
    await updatePromise;
    await expectToast(page, 'Estoque atualizado com sucesso!');
  });

  test('deve visualizar detalhes do produto', async ({ page }) => {
    // Arrange - criar produto primeiro
    await page.click('button:has-text("Criar Produto")');
    await page.fill('input[name="nome"]', testProduto.nome);
    await page.selectOption('select[name="categoria"]', testProduto.categoria);
    await page.fill('input[name="preco"]', testProduto.preco.toString());
    await page.fill('input[name="estoque"]', testProduto.estoque.toString());
    await page.click('button:has-text("Salvar")');
    await page.waitForSelector('text=Produto criado com sucesso!');
    
    // Act
    const viewPromise = expectGetRequest(page, `/produtos/estoque/${testProduto.id}`);
    
    await page.click(`[data-testid="visualizar-produto-${testProduto.id}"]`);
    
    // Assert
    await viewPromise;
    await expect(page.locator('[data-testid="produto-detalhes"]')).toBeVisible();
    await expect(page.locator('[data-testid="produto-detalhes"]')).toContainText(testProduto.nome);
  });
}); 