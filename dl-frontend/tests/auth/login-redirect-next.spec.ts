import { test, expect } from '@playwright/test';

test.describe('🔐 Login Redirect - Next Parameter', () => {
  test('deve priorizar next parameter sobre mapa de roles', async ({ page }) => {
    // Arrange - Acessar login com next parameter
    await page.goto('/login?next=/produtos');
    await page.waitForLoadState('networkidle');
    
    // Aguardar página carregar completamente
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    
    // Act - Preencher credenciais (primeiro card é gestor por padrão)
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    await emailInput.fill('admin@dl.com');
    await passwordInput.fill('admin123');
    
    // Clicar no botão de login
    const loginButton = page.locator('button').filter({ hasText: /Entrar/ }).first();
    await expect(loginButton).toBeVisible();
    await loginButton.click();
    
    // Aguardar redirecionamento
    await page.waitForLoadState('networkidle');
    await page.waitForURL('**/produtos**', { timeout: 10000 });
    
    // Assert - Verificar se foi redirecionado para /produtos (next parameter) 
    // em vez de /gestor (mapa de roles)
    const currentUrl = page.url();
    expect(currentUrl).toContain('/produtos');
    
    console.log('✅ Next parameter priorizado corretamente sobre mapa de roles');
  });

  test('deve funcionar com next parameter em diferentes roles', async ({ page }) => {
    // Teste com vendedor e next parameter
    await page.goto('/login?next=/clientes');
    await page.waitForLoadState('networkidle');
    
    // Aguardar página carregar completamente
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    
    // Clicar no card do vendedor (segundo card)
    const cards = page.locator('div[style*="position: absolute"]');
    await expect(cards).toHaveCount(3);
    await cards.nth(1).click();
    
    // Preencher credenciais
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    await emailInput.fill('admin@dl.com');
    await passwordInput.fill('admin123');
    
    // Clicar no botão de login
    const loginButton = page.locator('button').filter({ hasText: /Entrar/ }).first();
    await expect(loginButton).toBeVisible();
    await loginButton.click();
    
    // Aguardar redirecionamento
    await page.waitForLoadState('networkidle');
    await page.waitForURL('**/clientes**', { timeout: 10000 });
    
    // Assert - Verificar se foi redirecionado para /clientes (next parameter)
    // em vez de /vendas (mapa de roles)
    const currentUrl = page.url();
    expect(currentUrl).toContain('/clientes');
    
    console.log('✅ Next parameter funcionando corretamente com vendedor');
  });
}); 