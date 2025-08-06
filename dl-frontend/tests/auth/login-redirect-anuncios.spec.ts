import { test, expect } from '@playwright/test';

test.describe('🔐 Login Redirect - Anúncios', () => {
  test('deve redirecionar anuncios para /anuncios após login', async ({ page }) => {
    // Arrange
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Aguardar página carregar completamente
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    
    // Act - Clicar no card do anuncios (terceiro card) antes de preencher credenciais
    // Procurar por elementos que representam os cards
    const cards = page.locator('div[style*="position: absolute"]');
    await expect(cards).toHaveCount(3); // Deve ter 3 cards
    
    // Clicar no terceiro card (anuncios)
    await cards.nth(2).click();
    
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
    await page.waitForURL('**/anuncios**', { timeout: 10000 });
    
    // Assert - Verificar se foi redirecionado para /anuncios
    const currentUrl = page.url();
    expect(currentUrl).toContain('/anuncios');
    
    console.log('✅ Anúncios redirecionado corretamente para /anuncios');
  });
}); 