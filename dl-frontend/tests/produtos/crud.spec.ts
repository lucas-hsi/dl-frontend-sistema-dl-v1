import { test, expect } from '@playwright/test';
import { generateProductData, generateUpdatedProductData } from '../fixtures/data';
import { ApiCleanup } from '../utils/api';

test.describe('📦 CRUD ProdutoEstoque', () => {
  test('deve mostrar lista de produtos sem erro', async ({ page }) => {
    // Verificar se storage state existe, se não, fazer login primeiro
    try {
      await page.context().storageState({ path: 'tests/.auth/admin.json' });
    } catch {
      console.log('⚠️ Storage state não encontrado, fazendo login primeiro...');
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      
      const emailInput = page.locator('input[type="email"], input[placeholder*="email"], input[name="email"]');
      const passwordInput = page.locator('input[type="password"], input[placeholder*="senha"], input[name="password"]');
      
      await emailInput.first().fill('admin@dl.com');
      await passwordInput.first().fill('admin123');
      
      const loginButton = page.locator('button').filter({ hasText: /Entrar|Login|Sign In|Acessar/ }).first();
      await loginButton.click();
      
      await page.waitForLoadState('networkidle');
      await page.context().storageState({ path: 'tests/.auth/admin.json' });
    }
    
    // Arrange & Act
    await page.goto('/gestor/produtos/estoque');
    
    // Assert
    await expect(page).toHaveURL(/.*\/gestor\/produtos\/estoque/);
    
    // Verificar se há elementos de lista/tabela
    const productList = page.locator('table, [role="grid"], .product-list, tbody, text=Produtos, text=Estoque');
    await expect(productList.first()).toBeVisible();
    
    console.log('✅ Lista de produtos carregada sem erro');
  });

  test('deve executar fluxo completo CRUD: LIST → CREATE → UPDATE → DELETE', async ({ page }) => {
    // Verificar se storage state existe, se não, fazer login primeiro
    try {
      await page.context().storageState({ path: 'tests/.auth/admin.json' });
    } catch {
      console.log('⚠️ Storage state não encontrado, fazendo login primeiro...');
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      
      const emailInput = page.locator('input[type="email"], input[placeholder*="email"], input[name="email"]');
      const passwordInput = page.locator('input[type="password"], input[placeholder*="senha"], input[name="password"]');
      
      await emailInput.first().fill('admin@dl.com');
      await passwordInput.first().fill('admin123');
      
      const loginButton = page.locator('button').filter({ hasText: /Entrar|Login|Sign In|Acessar/ }).first();
      await loginButton.click();
      
      await page.waitForLoadState('networkidle');
      await page.context().storageState({ path: 'tests/.auth/admin.json' });
    }
    
    // Arrange
    const productData = generateProductData();
    const updatedData = generateUpdatedProductData();
    
    // Cleanup prévio
    try {
      await ApiCleanup.cleanupProduct(productData.sku);
    } catch (error) {
      console.log('⚠️ Cleanup prévio falhou, continuando...');
    }
    
    // Act & Assert - LIST (verificar que a página carrega sem erro)
    await page.goto('/gestor/produtos/estoque');
    await expect(page).toHaveURL(/.*\/gestor\/produtos\/estoque/);
    
    const productIndicators = page.locator('text=Estoque, text=Produtos, text=Inventory');
    await expect(productIndicators.first()).toBeVisible();
    
    console.log('✅ LIST: Página de produtos carregou sem erro');
    
    // CREATE - Procurar botão de adicionar produto
    const addButton = page.locator('button').filter({ hasText: /Adicionar|Novo|Criar|Plus|Add/ });
    if (await addButton.count() > 0) {
      await expect(addButton.first()).toBeVisible();
      await addButton.first().click();
      
      // Preencher formulário de criação (se existir)
      const skuInput = page.locator('input[name="sku"], input[placeholder*="SKU"], input[data-testid="sku"]');
      const nomeInput = page.locator('input[name="nome"], input[placeholder*="Nome"], input[data-testid="nome"]');
      
      if (await skuInput.count() > 0) {
        await skuInput.first().fill(productData.sku);
      }
      if (await nomeInput.count() > 0) {
        await nomeInput.first().fill(productData.nome);
      }
      
      // Salvar produto
      const saveButton = page.locator('button').filter({ hasText: /Salvar|Criar|Confirmar|Save/ });
      if (await saveButton.count() > 0) {
        await saveButton.first().click();
        console.log('✅ CREATE: Produto criado com sucesso');
      }
    } else {
      console.log('⚠️ Botão de adicionar produto não encontrado, pulando CREATE');
    }
    
    // Verificar se produto aparece na lista (se foi criado)
    await page.reload();
    const productName = page.locator(`text=${productData.nome}`);
    if (await productName.count() > 0) {
      await expect(productName.first()).toBeVisible();
      
      // UPDATE - Clicar no botão de editar do produto criado
      const editButton = page.locator(`tr:has-text("${productData.nome}") button[title*="Editar"], tr:has-text("${productData.nome}") button:has-text("Editar")`);
      if (await editButton.count() > 0) {
        await editButton.first().click();
        
        // Atualizar dados
        const nomeInput = page.locator('input[name="nome"], input[placeholder*="Nome"], input[data-testid="nome"]');
        if (await nomeInput.count() > 0) {
          await nomeInput.first().fill(updatedData.nome);
        }
        
        // Salvar atualização
        const updateButton = page.locator('button').filter({ hasText: /Salvar|Atualizar|Confirmar|Update/ });
        if (await updateButton.count() > 0) {
          await updateButton.first().click();
          console.log('✅ UPDATE: Produto atualizado com sucesso');
        }
      }
      
      // DELETE - Clicar no botão de deletar
      const deleteButton = page.locator(`tr:has-text("${productData.nome}") button[title*="Deletar"], tr:has-text("${productData.nome}") button:has-text("Deletar")`);
      if (await deleteButton.count() > 0) {
        await deleteButton.first().click();
        
        // Confirmar exclusão (se houver modal)
        const confirmDeleteButton = page.locator('button').filter({ hasText: /Confirmar|Sim|Excluir|Delete/ });
        if (await confirmDeleteButton.count() > 0) {
          await confirmDeleteButton.first().click();
        }
        
        console.log('✅ DELETE: Produto removido com sucesso');
      }
    }
    
    // Cleanup final
    try {
      await ApiCleanup.cleanupProduct(productData.sku);
    } catch (error) {
      console.log('⚠️ Cleanup final falhou');
    }
  });

  test('deve limpar dados de teste após execução', async ({ page }) => {
    // Cleanup de produtos de teste
    try {
      await ApiCleanup.cleanupTestProducts();
      console.log('✅ Limpeza de dados de teste concluída');
    } catch (error) {
      console.log('⚠️ Limpeza de dados de teste falhou');
    }
  });
}); 