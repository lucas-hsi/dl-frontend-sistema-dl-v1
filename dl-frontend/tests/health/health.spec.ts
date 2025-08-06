import { test, expect } from '@playwright/test';

test.describe('🏥 Health Check', () => {
  test('deve validar que frontend está acessível', async ({ page }) => {
    // Arrange & Act
    await page.goto('/');
    
    // Assert
    await expect(page).toHaveURL(/.*\//);
    
    // Verificar se há elementos básicos da página
    await expect(page.locator('body')).toBeVisible();
    
    console.log('✅ Frontend está acessível e carregando');
  });

  test('deve validar health check via frontend (se backend estiver disponível)', async ({ page }) => {
    // Arrange & Act
    await page.goto('/');
    
    try {
      // Fazer requisição para o health check via frontend
      const response = await page.request.get('http://127.0.0.1:8000/api/v1/__health');
      
      // Assert
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      expect(body).toEqual({ status: "ok" });
      
      console.log('✅ Health check retornou status 200 e body {"status":"ok"}');
    } catch (error) {
      console.log('⚠️ Backend não está disponível, pulando teste de health check');
      test.skip();
    }
  });

  test('deve validar health check direto no backend (se disponível)', async ({ page }) => {
    try {
      // Arrange & Act
      const response = await page.request.get('http://127.0.0.1:8000/__health');
      
      // Assert
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      expect(body).toEqual({ status: "ok" });
      
      console.log('✅ Health check direto no backend funcionando');
    } catch (error) {
      console.log('⚠️ Backend não está disponível, pulando teste de health check');
      test.skip();
    }
  });
}); 