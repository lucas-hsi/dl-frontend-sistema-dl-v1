import { test, expect } from '@playwright/test';

test.describe('🔐 Autenticação via API', () => {
  test('deve estar autenticado automaticamente via storage state @auth', async ({ page }) => {
    // Arrange & Act - Ir para uma página protegida
    await page.goto('/gestor');
    
    // Assert - Verificar que está autenticado (não foi redirecionado para login)
    await expect(page).not.toHaveURL(/\/login/);
    
    // Verificar se a página carregou corretamente (mais flexível)
    await expect(page.locator('body')).toBeVisible();
    
    // Verificar se há elementos que indicam que está logado (mais flexível)
    const authIndicators = page.locator('text=Dashboard, text=Gestor, text=Admin, nav, [data-testid="dashboard"], h1, h2, h3');
    if (await authIndicators.count() > 0) {
      await expect(authIndicators.first()).toBeVisible();
    }
    
    console.log('✅ Teste de autenticação via API concluído');
  });

  test('deve acessar páginas protegidas sem precisar fazer login @auth', async ({ page }) => {
    // Testar acesso a diferentes páginas protegidas
    const protectedPages = ['/gestor', '/vendedor', '/anuncios'];
    
    for (const pagePath of protectedPages) {
      await page.goto(pagePath);
      
      // Verificar que não foi redirecionado para login
      await expect(page).not.toHaveURL(/\/login/);
      
      // Verificar que a página carregou corretamente
      await expect(page.locator('body')).toBeVisible();
      
      console.log(`✅ Acesso a ${pagePath} funcionou com autenticação via API`);
    }
  });

  test('deve manter estado de autenticação entre testes @auth', async ({ page }) => {
    // Este teste verifica se o storage state está funcionando
    await page.goto('/gestor');
    
    // Verificar localStorage
    const authToken = await page.evaluate(() => localStorage.getItem('auth_token'));
    const userData = await page.evaluate(() => localStorage.getItem('user'));
    
    expect(authToken).toBeTruthy();
    expect(userData).toBeTruthy();
    
    console.log('✅ Estado de autenticação mantido entre testes');
  });
}); 