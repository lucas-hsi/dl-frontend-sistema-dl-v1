import { test, expect } from '@playwright/test';
import path from 'path';

// Configuração das páginas críticas para teste visual
const VISUAL_PAGES = [
  { path: '/login', name: 'login' },
  { path: '/gestor', name: 'gestor' },
  { path: '/produtos', name: 'produtos-list' },
  { path: '/produtos/novo', name: 'produtos-form' }
];

// Configurações de viewport e tolerância
const VIEWPORT_CONFIG = {
  width: 1280,
  height: 720
};

const VISUAL_CONFIG = {
  maxDiffPixelRatio: 0.01, // 1% de tolerância
  threshold: 0.1
};

test.describe('Regressão Visual', () => {
  test.beforeEach(async ({ page }) => {
    // Configurar viewport consistente
    await page.setViewportSize(VIEWPORT_CONFIG);
    
    // Desabilitar animações para snapshots consistentes
    await page.addInitScript(() => {
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `;
      document.head.appendChild(style);
    });
  });

  for (const pageConfig of VISUAL_PAGES) {
    test(`${pageConfig.name} - Snapshot visual`, async ({ page }) => {
      // Navegar para a página
      await page.goto(pageConfig.path);
      
      // Aguardar carregamento completo
      await page.waitForLoadState('networkidle');
      
      // Aguardar por elementos específicos para garantir estabilidade
      await page.waitForTimeout(2000);
      
      // Aguardar por animações/transições terminarem
      await page.evaluate(() => {
        return new Promise((resolve) => {
          const checkAnimations = () => {
            const animations = document.querySelectorAll('*');
            let hasAnimations = false;
            
            animations.forEach((el) => {
              const computedStyle = window.getComputedStyle(el);
              if (computedStyle.animationDuration !== '0s' || 
                  computedStyle.transitionDuration !== '0s') {
                hasAnimations = true;
              }
            });
            
            if (!hasAnimations) {
              resolve(true);
            } else {
              setTimeout(checkAnimations, 100);
            }
          };
          
          checkAnimations();
        });
      });
      
      // Capturar screenshot
      const screenshotPath = path.join('visual-report', `${pageConfig.name}.png`);
      
      // Comparar com snapshot existente ou criar novo
      await expect(page).toHaveScreenshot(screenshotPath, {
        maxDiffPixelRatio: VISUAL_CONFIG.maxDiffPixelRatio,
        threshold: VISUAL_CONFIG.threshold
      });
    });
  }

  test('Login - Elementos específicos', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Verificar elementos específicos do login
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();
    
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    await expect(emailInput).toBeVisible();
    
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('Gestor - Layout responsivo', async ({ page }) => {
    await page.goto('/gestor');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Verificar se o layout principal está presente
    const mainContent = page.locator('main, .main, #main');
    await expect(mainContent).toBeVisible();
    
    // Verificar se há sidebar ou navegação
    const sidebar = page.locator('nav, .sidebar, .navigation');
    if (await sidebar.count() > 0) {
      await expect(sidebar).toBeVisible();
    }
  });

  test('Produtos - Lista e formulário', async ({ page }) => {
    // Testar página de lista
    await page.goto('/produtos');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Verificar se há tabela ou lista de produtos
    const productList = page.locator('table, .product-list, .products-grid');
    if (await productList.count() > 0) {
      await expect(productList).toBeVisible();
    }
    
    // Testar página de formulário
    await page.goto('/produtos/novo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Verificar se há formulário de produto
    const productForm = page.locator('form');
    await expect(productForm).toBeVisible();
  });

  test('Estados de loading', async ({ page }) => {
    // Testar estado de loading no login
    await page.goto('/login');
    
    // Simular loading (se houver)
    const loadingElements = page.locator('.loading, .spinner, [data-loading]');
    if (await loadingElements.count() > 0) {
      await expect(loadingElements.first()).toBeVisible();
    }
    
    // Aguardar carregamento completo
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Verificar se loading foi removido
    if (await loadingElements.count() > 0) {
      await expect(loadingElements.first()).not.toBeVisible();
    }
  });

  test('Estados de erro', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Simular erro de login
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
      await emailInput.fill('invalid@email.com');
      await passwordInput.fill('wrongpassword');
      await submitButton.click();
      
      // Aguardar possível mensagem de erro
      await page.waitForTimeout(1000);
      
      const errorMessage = page.locator('.error, .alert, [role="alert"]');
      if (await errorMessage.count() > 0) {
        await expect(errorMessage.first()).toBeVisible();
      }
    }
  });
}); 