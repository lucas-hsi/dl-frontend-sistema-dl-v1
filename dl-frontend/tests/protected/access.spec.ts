import { test, expect } from '@playwright/test';

test.describe('🛡️ Acesso a Rotas Protegidas', () => {
  test('deve acessar dashboard do gestor com autenticação', async ({ page }) => {
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
    await page.goto('/gestor');
    
    // Assert - Verificar que a página carregou corretamente
    await expect(page).toHaveURL(/.*\/gestor/);
    
    // Verificar elementos-chave do dashboard
    const dashboardIndicators = page.locator('text=Dashboard, text=Gestor, text=Admin, nav, [data-testid="dashboard"]');
    await expect(dashboardIndicators.first()).toBeVisible();
    
    console.log('✅ Dashboard do gestor acessível com autenticação');
  });

  test('deve acessar página de produtos com autenticação', async ({ page }) => {
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
    
    // Assert - Verificar que a página carregou
    await expect(page).toHaveURL(/.*\/gestor\/produtos\/estoque/);
    
    // Verificar elementos-chave da página de produtos
    const productIndicators = page.locator('text=Estoque, text=Produtos, text=Inventory, table, [role="grid"], .product-list');
    await expect(productIndicators.first()).toBeVisible();
    
    console.log('✅ Página de produtos acessível com autenticação');
  });

  test('deve redirecionar para login quando não autenticado', async ({ page }) => {
    // Arrange - Usar contexto sem storage state
    const context = await page.context();
    await context.clearCookies();
    
    // Act
    await page.goto('/gestor');
    
    // Assert - Verificar redirecionamento para login
    await expect(page).toHaveURL(/.*\/login/);
    
    console.log('✅ Redirecionamento para login quando não autenticado');
  });
}); 