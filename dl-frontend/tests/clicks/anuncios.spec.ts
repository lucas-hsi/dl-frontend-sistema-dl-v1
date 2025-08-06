import { test, expect } from '@playwright/test';
import { expectPostRequest, expectPutRequest, expectGetRequest } from '../utils/requests';
import { expectToast, expectDisabledWhilePending, openConfirmationAndConfirm, expectItemInList } from '../utils/ui';
import { generateDummyAnuncio, cleanupTestData } from '../fixtures/entities';

test.describe('Anúncios CTAs', () => {
  let testAnuncio: any;

  test.beforeEach(async ({ page }) => {
    await page.goto('/anuncios/criar-anuncio');
    testAnuncio = generateDummyAnuncio();
  });

  test.afterEach(async ({ page }) => {
    // Cleanup - remove anúncios de teste
    await cleanupTestData(page.context().request, 'anuncios');
  });

  test('deve gerar anúncio com IA', async ({ page }) => {
    // Arrange
    await page.fill('input[name="nome"]', testAnuncio.titulo);
    await page.selectOption('select[name="categoria"]', testAnuncio.categoria);
    
    // Act
    const iaPromise = expectPostRequest(page, '/anuncios/gerar-ia', {
      categoria: testAnuncio.categoria,
      nome_produto: testAnuncio.titulo
    });
    
    await page.click('button:has-text("Gerar Anúncio IA")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Gerar Anúncio IA")');
    await iaPromise;
    await expect(page.locator('[data-testid="resultado-ia"]')).toBeVisible();
    await expect(page.locator('[data-testid="resultado-ia"]')).toContainText(testAnuncio.titulo);
  });

  test('deve publicar anúncio gerado', async ({ page }) => {
    // Arrange - gerar anúncio primeiro
    await page.fill('input[name="nome"]', testAnuncio.titulo);
    await page.selectOption('select[name="categoria"]', testAnuncio.categoria);
    await page.click('button:has-text("Gerar Anúncio IA")');
    await page.waitForSelector('[data-testid="resultado-ia"]');
    
    // Act
    const publishPromise = expectPostRequest(page, '/anuncios/publicar', {
      titulo: testAnuncio.titulo,
      descricao: testAnuncio.descricao,
      preco: testAnuncio.preco,
      imagens: testAnuncio.imagens
    });
    
    await page.click('button:has-text("Publicar Anúncio")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Publicar Anúncio")');
    await publishPromise;
    await expectToast(page, 'Anúncio publicado com sucesso!');
    await expect(page).toHaveURL('/anuncios');
  });

  test('deve salvar anúncio como rascunho', async ({ page }) => {
    // Arrange
    await page.fill('input[name="nome"]', testAnuncio.titulo);
    await page.fill('textarea[name="descricao"]', testAnuncio.descricao);
    await page.fill('input[name="preco"]', testAnuncio.preco.toString());
    
    // Act
    const draftPromise = expectPostRequest(page, '/anuncios/rascunho', {
      titulo: testAnuncio.titulo,
      descricao: testAnuncio.descricao,
      preco: testAnuncio.preco
    });
    
    await page.click('button:has-text("Salvar Rascunho")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Salvar Rascunho")');
    await draftPromise;
    await expectToast(page, 'Rascunho salvo com sucesso!');
  });

  test('deve melhorar descrição com IA', async ({ page }) => {
    // Arrange
    await page.goto('/anuncios/ia/melhorar-descricoes');
    await page.fill('textarea[name="descricao"]', 'Descrição básica do produto');
    
    // Act
    const improvePromise = expectPostRequest(page, '/anuncios/ia/melhorar', {
      descricao: 'Descrição básica do produto'
    });
    
    await page.click('button:has-text("Analisar Descrições")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Analisar Descrições")');
    await improvePromise;
    await expect(page.locator('[data-testid="melhorias-lista"]')).toBeVisible();
  });

  test('deve analisar preços com IA', async ({ page }) => {
    // Arrange
    await page.goto('/anuncios/ia/sugestoes-preco');
    await page.fill('input[name="produto_id"]', '123');
    
    // Act
    const analyzePromise = expectPostRequest(page, '/anuncios/ia/precos', {
      produto_id: 123
    });
    
    await page.click('button:has-text("Analisar Preços")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Analisar Preços")');
    await analyzePromise;
    await expect(page.locator('[data-testid="sugestoes-preco"]')).toBeVisible();
  });

  test('deve aplicar preço sugerido', async ({ page }) => {
    // Arrange - analisar preços primeiro
    await page.goto('/anuncios/ia/sugestoes-preco');
    await page.fill('input[name="produto_id"]', '123');
    await page.click('button:has-text("Analisar Preços")');
    await page.waitForSelector('[data-testid="sugestoes-preco"]');
    
    // Act
    const applyPromise = expectPutRequest(page, '/anuncios/atualizar-preco', {
      anuncio_id: 123,
      preco: 150.00
    });
    
    await page.click('[data-testid="aplicar-preco-123"]');
    
    // Assert
    await expectDisabledWhilePending(page, '[data-testid="aplicar-preco-123"]');
    await applyPromise;
    await expectToast(page, 'Preço aplicado com sucesso!');
  });

  test('deve gerar anúncio completo com IA', async ({ page }) => {
    // Arrange
    await page.goto('/anuncios/ia/criar-anuncio');
    await page.fill('input[name="produto_id"]', '123');
    
    // Act
    const generatePromise = expectPostRequest(page, '/anuncios/ia/gerar-completo', {
      produto_id: 123
    });
    
    await page.click('button:has-text("Gerar Anúncio Completo")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Gerar Anúncio Completo")');
    await generatePromise;
    await expect(page.locator('[data-testid="anuncio-completo"]')).toBeVisible();
  });

  test('deve publicar no Shopify', async ({ page }) => {
    // Arrange - gerar anúncio primeiro
    await page.goto('/anuncios/ia/criar-anuncio');
    await page.fill('input[name="produto_id"]', '123');
    await page.click('button:has-text("Gerar Anúncio Completo")');
    await page.waitForSelector('[data-testid="anuncio-completo"]');
    
    // Act
    const shopifyPromise = expectPostRequest(page, '/anuncios/publicar-shopify', {
      anuncio_data: expect.any(Object)
    });
    
    await page.click('button:has-text("Publicar Shopify")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Publicar Shopify")');
    await shopifyPromise;
    await expectToast(page, 'Anúncio publicado no Shopify!');
  });

  test('deve analisar concorrência', async ({ page }) => {
    // Arrange
    await page.goto('/anuncios/ia/analise-concorrencia');
    await page.fill('input[name="produto_id"]', '123');
    
    // Act
    const analyzePromise = expectPostRequest(page, '/anuncios/ia/concorrencia', {
      produto_id: 123
    });
    
    await page.click('button:has-text("Analisar Concorrência")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Analisar Concorrência")');
    await analyzePromise;
    await expect(page.locator('[data-testid="analise-concorrencia"]')).toBeVisible();
  });

  test('deve publicar/despublicar anúncio com confirmação', async ({ page }) => {
    // Arrange - ir para lista de anúncios
    await page.goto('/anuncios');
    
    // Act - despublicar
    const unpublishPromise = expectPutRequest(page, '/anuncios/despublicar/123', {});
    
    await openConfirmationAndConfirm(
      page,
      '[data-testid="despublicar-anuncio-123"]',
      'button:has-text("Confirmar")'
    );
    
    // Assert
    await unpublishPromise;
    await expectToast(page, 'Anúncio despublicado com sucesso!');
    
    // Act - publicar novamente
    const publishPromise = expectPutRequest(page, '/anuncios/publicar/123', {});
    
    await page.click('[data-testid="publicar-anuncio-123"]');
    
    // Assert
    await expectDisabledWhilePending(page, '[data-testid="publicar-anuncio-123"]');
    await publishPromise;
    await expectToast(page, 'Anúncio publicado com sucesso!');
  });

  test('deve sincronizar com canal', async ({ page }) => {
    // Arrange
    await page.goto('/anuncios');
    
    // Act
    const syncPromise = expectPostRequest(page, '/anuncios/sincronizar/123', {});
    
    await page.click('[data-testid="sincronizar-anuncio-123"]');
    
    // Assert
    await expectDisabledWhilePending(page, '[data-testid="sincronizar-anuncio-123"]');
    await syncPromise;
    await expectToast(page, 'Anúncio sincronizado com sucesso!');
  });

  test('deve atualizar mídia do anúncio', async ({ page }) => {
    // Arrange
    await page.goto('/anuncios/editar/123');
    
    // Act
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('path/to/test-image.jpg');
    
    const updatePromise = expectPutRequest(page, '/anuncios/123/midia', {
      imagens: expect.any(Array)
    });
    
    await page.click('button:has-text("Atualizar Mídia")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Atualizar Mídia")');
    await updatePromise;
    await expectToast(page, 'Mídia atualizada com sucesso!');
  });
}); 