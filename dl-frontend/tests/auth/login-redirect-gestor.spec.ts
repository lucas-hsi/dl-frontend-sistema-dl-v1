import { test, expect } from '@playwright/test';

test.describe('🔐 Login Redirect - Gestor', () => {
  test('deve redirecionar gestor para /gestor após login', async ({ page }) => {
    // Arrange
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Aguardar página carregar completamente
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    
    // Act - Preencher credenciais (o primeiro card é o gestor por padrão)
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
    await page.waitForURL('**/gestor**', { timeout: 10000 });
    
    // Assert - Verificar se foi redirecionado para /gestor
    const currentUrl = page.url();
    expect(currentUrl).toContain('/gestor');
    
    console.log('✅ Gestor redirecionado corretamente para /gestor');
  });
}); 