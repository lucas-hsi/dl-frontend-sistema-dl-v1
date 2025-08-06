import { test, expect } from '@playwright/test';

// Configuração das páginas críticas para teste de acessibilidade
const CRITICAL_PAGES = [
  { path: '/login', name: 'Login' },
  { path: '/gestor', name: 'Gestor' },
  { path: '/produtos', name: 'Produtos' }
];

test.describe('Acessibilidade (A11y)', () => {
  for (const page of CRITICAL_PAGES) {
    test(`${page.name} - Verificar acessibilidade`, async ({ page: testPage }) => {
      // Navegar para a página
      await testPage.goto(page.path);
      
      // Aguardar carregamento completo
      await testPage.waitForLoadState('networkidle');
      
      // Injetar axe-core
      await testPage.addInitScript(() => {
        // @ts-ignore
        window.axe = require('axe-core');
      });
      
      // Executar análise de acessibilidade
      const results = await testPage.evaluate(() => {
        // @ts-ignore
        const axeConfig = require('./axe-config.js');
        return window.axe.run(axeConfig);
      });
      
      // Filtrar apenas violações serious e critical
      const seriousViolations = results.violations.filter(
        (violation: any) => violation.impact === 'serious' || violation.impact === 'critical'
      );
      
      // Gerar relatório detalhado se houver violações
      if (seriousViolations.length > 0) {
        console.log(`\n❌ Violações de acessibilidade encontradas em ${page.name}:`);
        
        seriousViolations.forEach((violation: any) => {
          console.log(`  - ${violation.id}: ${violation.description}`);
          console.log(`    Impacto: ${violation.impact}`);
          console.log(`    Elementos afetados: ${violation.nodes.length}`);
          
          violation.nodes.forEach((node: any) => {
            console.log(`      - ${node.target.join(' > ')}`);
          });
        });
        
        // Salvar relatório detalhado
        const report = {
          page: page.name,
          url: page.path,
          timestamp: new Date().toISOString(),
          violations: seriousViolations,
          summary: {
            totalViolations: results.violations.length,
            seriousViolations: seriousViolations.length,
            passes: results.passes.length
          }
        };
        
        // Criar diretório se não existir
        const fs = require('fs');
        const path = require('path');
        const reportDir = path.join(__dirname, '..', '..', 'reports', 'a11y');
        if (!fs.existsSync(reportDir)) {
          fs.mkdirSync(reportDir, { recursive: true });
        }
        
        fs.writeFileSync(
          path.join(reportDir, `${page.name.toLowerCase()}-a11y.json`),
          JSON.stringify(report, null, 2)
        );
      }
      
      // Teste deve falhar se houver violações serious/critical
      expect(seriousViolations.length).toBe(0);
    });
  }
  
  test('Login - Verificar navegação por teclado', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Verificar se todos os elementos interativos são acessíveis por teclado
    const focusableElements = await page.$$('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    
    for (let i = 0; i < focusableElements.length; i++) {
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement);
      expect(focusedElement).not.toBeNull();
    }
  });
  
  test('Login - Verificar contraste de cores', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Verificar se há elementos com contraste insuficiente
    const lowContrastElements = await page.evaluate(() => {
      // @ts-ignore
      return window.axe.run({
        rules: {
          'color-contrast': { enabled: true }
        }
      });
    });
    
    const seriousContrastViolations = lowContrastElements.violations.filter(
      (violation: any) => violation.impact === 'serious' || violation.impact === 'critical'
    );
    
    expect(seriousContrastViolations.length).toBe(0);
  });
  
  test('Gestor - Verificar estrutura semântica', async ({ page }) => {
    await page.goto('/gestor');
    await page.waitForLoadState('networkidle');
    
    // Verificar se há landmarks apropriados
    const landmarks = await page.$$('main, nav, header, footer, aside, section, article');
    expect(landmarks.length).toBeGreaterThan(0);
    
    // Verificar se há heading hierarchy apropriada
    const headings = await page.$$('h1, h2, h3, h4, h5, h6');
    expect(headings.length).toBeGreaterThan(0);
    
    // Verificar se há skip links ou navegação alternativa
    const skipLinks = await page.$$('[href^="#"], [id]');
    expect(skipLinks.length).toBeGreaterThan(0);
  });
  
  test('Produtos - Verificar formulários acessíveis', async ({ page }) => {
    await page.goto('/produtos');
    await page.waitForLoadState('networkidle');
    
    // Verificar se todos os inputs têm labels associados
    const inputs = await page.$$('input, select, textarea');
    
    for (const input of inputs) {
      const hasLabel = await input.evaluate((el) => {
        const id = el.getAttribute('id');
        const name = el.getAttribute('name');
        const ariaLabel = el.getAttribute('aria-label');
        const ariaLabelledby = el.getAttribute('aria-labelledby');
        
        if (ariaLabel || ariaLabelledby) return true;
        
        if (id) {
          const label = document.querySelector(`label[for="${id}"]`);
          if (label) return true;
        }
        
        if (name) {
          const label = document.querySelector(`label[for="${name}"]`);
          if (label) return true;
        }
        
        // Verificar se está dentro de um label
        const parentLabel = el.closest('label');
        if (parentLabel) return true;
        
        return false;
      });
      
      expect(hasLabel).toBe(true);
    }
  });
}); 