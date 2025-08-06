import { test, expect } from '@playwright/test';
import { expectPostRequest, expectRedirect } from '../utils/requests';
import { expectToast, expectDisabledWhilePending } from '../utils/ui';

test.describe('Login CTAs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('deve fazer login como Gestor com credenciais válidas', async ({ page }) => {
    // Arrange - aguarda carregamento da página
    await page.waitForSelector('input[placeholder="E-mail"]');
    await page.fill('input[placeholder="E-mail"]', 'admin@dl.com');
    await page.fill('input[placeholder="Senha"]', 'admin123');
    
    // Act
    const loginPromise = expectPostRequest(page, '/auth/login', {
      username: 'admin@dl.com',
      password: 'admin123'
    });
    
    await page.click('button:has-text("Entrar")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Entrar")');
    await loginPromise;
    await expectRedirect(page, '/gestor');
  });

  test('deve fazer login como Vendedor com credenciais válidas', async ({ page }) => {
    // Arrange
    await page.waitForSelector('input[placeholder="E-mail"]');
    await page.click('button[aria-label="Selecionar perfil Vendedor"]');
    await page.fill('input[placeholder="E-mail"]', 'admin@dl.com');
    await page.fill('input[placeholder="Senha"]', 'admin123');
    
    // Act
    const loginPromise = expectPostRequest(page, '/auth/login', {
      username: 'admin@dl.com',
      password: 'admin123'
    });
    
    await page.click('button:has-text("Entrar")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Entrar")');
    await loginPromise;
    await expectRedirect(page, '/vendedor');
  });

  test('deve fazer login como Anúncios com credenciais válidas', async ({ page }) => {
    // Arrange
    await page.waitForSelector('input[placeholder="E-mail"]');
    await page.click('button[aria-label="Selecionar perfil Anúncios"]');
    await page.fill('input[placeholder="E-mail"]', 'admin@dl.com');
    await page.fill('input[placeholder="Senha"]', 'admin123');
    
    // Act
    const loginPromise = expectPostRequest(page, '/auth/login', {
      username: 'admin@dl.com',
      password: 'admin123'
    });
    
    await page.click('button:has-text("Entrar")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Entrar")');
    await loginPromise;
    await expectRedirect(page, '/anuncios');
  });

  test('deve mostrar erro com credenciais inválidas', async ({ page }) => {
    // Arrange
    await page.waitForSelector('input[placeholder="E-mail"]');
    await page.fill('input[placeholder="E-mail"]', 'invalid@test.com');
    await page.fill('input[placeholder="Senha"]', 'wrongpassword');
    
    // Act
    await page.click('button:has-text("Entrar")');
    
    // Assert
    await expect(page.locator('text=E-mail ou senha inválidos')).toBeVisible();
  });

  test('deve manter botão habilitado durante login com credenciais inválidas', async ({ page }) => {
    // Arrange
    await page.waitForSelector('input[placeholder="E-mail"]');
    await page.fill('input[placeholder="E-mail"]', 'invalid@test.com');
    await page.fill('input[placeholder="Senha"]', 'wrongpassword');
    
    // Act
    await page.click('button:has-text("Entrar")');
    
    // Assert
    await expect(page.locator('button:has-text("Entrar")')).toBeEnabled();
  });

  test('deve limpar erro ao digitar novas credenciais', async ({ page }) => {
    // Arrange
    await page.waitForSelector('input[placeholder="E-mail"]');
    await page.fill('input[placeholder="E-mail"]', 'invalid@test.com');
    await page.fill('input[placeholder="Senha"]', 'wrongpassword');
    await page.click('button:has-text("Entrar")');
    await page.waitForSelector('text=E-mail ou senha inválidos');
    
    // Act
    await page.fill('input[placeholder="E-mail"]', 'admin@dl.com');
    
    // Assert
    await expect(page.locator('text=E-mail ou senha inválidos')).not.toBeVisible();
  });
}); 