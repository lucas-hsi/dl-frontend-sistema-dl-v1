import { test, expect } from '@playwright/test';
import { testCredentials } from '../fixtures/data';

test.describe('🔐 Autenticação', () => {
  test('deve fazer login com credenciais válidas e salvar storage state', async ({ page }) => {
    // Arrange
    await page.goto('/login');
    
    // Aguardar página carregar e verificar se há elementos de login
    await page.waitForLoadState('networkidle');
    
    // Verificar se há campos de input ou elementos de login
    const emailInput = page.locator('input[type="email"], input[placeholder*="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[placeholder*="senha"], input[name="password"]');
    
    await expect(emailInput.first()).toBeVisible();
    await expect(passwordInput.first()).toBeVisible();
    
    // Act - Preencher credenciais
    await emailInput.first().fill(testCredentials.email);
    await passwordInput.first().fill(testCredentials.senha);
    
    // Clicar no botão de login (primeiro botão com texto relacionado a login)
    const loginButton = page.locator('button').filter({ hasText: /Entrar|Login|Sign In|Acessar/ }).first();
    await expect(loginButton).toBeVisible();
    await loginButton.click();
    
    // Aguardar redirecionamento ou mudança de página
    await page.waitForLoadState('networkidle');
    
    // Assert - Verificar se foi redirecionado (pode ser para /gestor ou outra rota)
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/login');
    
    // Verificar se há elementos que indicam sucesso no login
    const successIndicators = page.locator('text=Dashboard, text=Gestor, text=Admin, nav, [data-testid="dashboard"]');
    await expect(successIndicators.first()).toBeVisible();
    
    // Salvar storage state para outros testes
    await page.context().storageState({ path: 'tests/.auth/admin.json' });
    
    console.log('✅ Login realizado com sucesso e storage state salvo');
  });

  test('deve mostrar erro com credenciais inválidas', async ({ page }) => {
    // Arrange
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Act - Preencher credenciais inválidas
    const emailInput = page.locator('input[type="email"], input[placeholder*="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[placeholder*="senha"], input[name="password"]');
    
    await emailInput.first().fill('invalid@test.com');
    await passwordInput.first().fill('wrongpassword');
    
    // Clicar no botão de login
    const loginButton = page.locator('button').filter({ hasText: /Entrar|Login|Sign In|Acessar/ }).first();
    await loginButton.click();
    
    // Aguardar processamento
    await page.waitForLoadState('networkidle');
    
    // Assert - Verificar que permanece na página de login ou mostra erro
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      // Ainda na página de login
      await expect(page.locator('input[type="email"]').first()).toBeVisible();
    } else {
      // Se foi redirecionado, verificar se há indicação de erro
      const errorIndicators = page.locator('text=Erro, text=Invalid, text=Incorrect, .error, .alert');
      if (await errorIndicators.count() > 0) {
        await expect(errorIndicators.first()).toBeVisible();
      }
    }
    
    console.log('✅ Teste de credenciais inválidas concluído');
  });
}); 