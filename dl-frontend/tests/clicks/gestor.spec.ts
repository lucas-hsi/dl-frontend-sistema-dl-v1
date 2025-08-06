import { test, expect } from '@playwright/test';
import { expectPostRequest, expectGetRequest } from '../utils/requests';
import { expectToast, expectDisabledWhilePending } from '../utils/ui';

test.describe('Gestor Dashboard CTAs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gestor');
  });

  test('deve ativar modo turbo', async ({ page }) => {
    // Act
    const turboPromise = expectPostRequest(page, '/dashboard/turbo', {});
    
    await page.click('button:has-text("Ativar Modo Turbo")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Ativar Modo Turbo")');
    await turboPromise;
    await expectToast(page, 'Modo turbo ativado com sucesso!');
  });

  test('deve definir meta de vendas', async ({ page }) => {
    // Arrange
    await page.fill('input[name="meta"]', 'vendas_mensais');
    await page.fill('input[name="valor"]', '50000');
    
    // Act
    const metaPromise = expectPostRequest(page, '/dashboard/metas', {
      meta: 'vendas_mensais',
      valor: 50000
    });
    
    await page.click('button:has-text("Definir Meta")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Definir Meta")');
    await metaPromise;
    await expectToast(page, 'Meta definida com sucesso!');
  });

  test('deve enviar mensagem para IA assistente', async ({ page }) => {
    // Arrange
    await page.fill('textarea[name="message"]', 'Analise as vendas de hoje');
    
    // Act
    const chatPromise = expectPostRequest(page, '/dashboard/chat', {
      message: 'Analise as vendas de hoje'
    });
    
    await page.click('button:has-text("Enviar")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Enviar")');
    await chatPromise;
    await expect(page.locator('[data-testid="chat-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="chat-message"]')).toContainText('Analise as vendas de hoje');
  });

  test('deve analisar preços de concorrência', async ({ page }) => {
    // Arrange
    await page.fill('input[name="produto_id"]', '123');
    
    // Act
    const analyzePromise = expectPostRequest(page, '/dashboard/analise-precos', {
      produto_id: 123
    });
    
    await page.click('button:has-text("Analisar Preços")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Analisar Preços")');
    await analyzePromise;
    await expectToast(page, 'Análise de preços concluída!');
  });

  test('deve verificar dificuldades do vendedor', async ({ page }) => {
    // Arrange
    await page.fill('input[name="vendedor_id"]', '456');
    
    // Act
    const checkPromise = expectPostRequest(page, '/dashboard/dificuldades', {
      vendedor_id: 456
    });
    
    await page.click('button:has-text("Verificar Dificuldades")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Verificar Dificuldades")');
    await checkPromise;
    await expectToast(page, 'Análise de dificuldades concluída!');
  });

  test('deve revisar estratégia de vendas', async ({ page }) => {
    // Act
    const strategyPromise = expectPostRequest(page, '/dashboard/estrategia', {});
    
    await page.click('button:has-text("Revisar Estratégia")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Revisar Estratégia")');
    await strategyPromise;
    await expectToast(page, 'Estratégia revisada com sucesso!');
  });

  test('deve revisar preços automaticamente', async ({ page }) => {
    // Act
    const reviewPromise = expectPostRequest(page, '/dashboard/revisar-precos', {});
    
    await page.click('button:has-text("Revisar Preços")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Revisar Preços")');
    await reviewPromise;
    await expectToast(page, 'Revisão de preços concluída!');
  });

  test('deve atender lead', async ({ page }) => {
    // Arrange
    await page.fill('input[name="lead_id"]', '789');
    
    // Act
    const attendPromise = expectPostRequest(page, '/dashboard/atender-lead', {
      lead_id: 789
    });
    
    await page.click('button:has-text("Atender Lead")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Atender Lead")');
    await attendPromise;
    await expectToast(page, 'Lead atendido com sucesso!');
  });

  test('deve carregar dados do dashboard', async ({ page }) => {
    // Act
    const metricsPromise = expectGetRequest(page, '/dashboard/metricas');
    const statsPromise = expectGetRequest(page, '/dashboard/estatisticas');
    const productsPromise = expectGetRequest(page, '/produtos/estoque/estatisticas');
    
    // Assert
    await metricsPromise;
    await statsPromise;
    await productsPromise;
    
    // Verifica se os cards principais estão carregados
    await expect(page.locator('[data-testid="faturamento-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="produtos-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="clientes-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="vendas-hoje-card"]')).toBeVisible();
  });

  test('deve atualizar métricas em tempo real', async ({ page }) => {
    // Arrange - aguarda carregamento inicial
    await page.waitForSelector('[data-testid="faturamento-card"]');
    
    // Act
    const refreshPromise = expectGetRequest(page, '/dashboard/metricas');
    
    await page.click('button:has-text("Atualizar")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Atualizar")');
    await refreshPromise;
    await expectToast(page, 'Dados atualizados!');
  });

  test('deve abrir calendário inteligente', async ({ page }) => {
    // Act
    await page.click('button:has-text("Calendário")');
    
    // Assert
    await expect(page).toHaveURL('/gestor/calendario-inteligente');
  });

  test('deve abrir notificações', async ({ page }) => {
    // Act
    await page.click('button:has-text("Notificações")');
    
    // Assert
    await expect(page.locator('[data-testid="notificacoes-panel"]')).toBeVisible();
  });

  test('deve exportar relatório', async ({ page }) => {
    // Arrange
    await page.selectOption('select[name="periodo"]', '30d');
    await page.selectOption('select[name="tipo"]', 'vendas');
    
    // Act
    const exportPromise = expectGetRequest(page, '/dashboard/exportar?periodo=30d&tipo=vendas');
    
    await page.click('button:has-text("Exportar")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Exportar")');
    await exportPromise;
    await expect(page.locator('text=Download iniciado')).toBeVisible();
  });

  test('deve configurar alertas', async ({ page }) => {
    // Arrange
    await page.click('button:has-text("Configurar Alertas")');
    await page.fill('input[name="limite_vendas"]', '1000');
    await page.fill('input[name="limite_estoque"]', '10');
    
    // Act
    const configPromise = expectPostRequest(page, '/dashboard/alertas', {
      limite_vendas: 1000,
      limite_estoque: 10
    });
    
    await page.click('button:has-text("Salvar Configurações")');
    
    // Assert
    await expectDisabledWhilePending(page, 'button:has-text("Salvar Configurações")');
    await configPromise;
    await expectToast(page, 'Alertas configurados com sucesso!');
  });

  test('deve visualizar gráficos de performance', async ({ page }) => {
    // Act
    await page.click('button:has-text("Ver Gráficos")');
    
    // Assert
    await expect(page.locator('[data-testid="grafico-vendas"]')).toBeVisible();
    await expect(page.locator('[data-testid="grafico-produtos"]')).toBeVisible();
    await expect(page.locator('[data-testid="grafico-clientes"]')).toBeVisible();
  });

  test('deve filtrar dados por período', async ({ page }) => {
    // Arrange
    await page.selectOption('select[name="periodo"]', '7d');
    
    // Act
    const filterPromise = expectGetRequest(page, '/dashboard/metricas?periodo=7d');
    
    // Assert
    await filterPromise;
    await expect(page.locator('[data-testid="faturamento-card"]')).toContainText('7 dias');
  });

  test('deve visualizar detalhes de métrica', async ({ page }) => {
    // Arrange
    await page.click('[data-testid="faturamento-card"]');
    
    // Act
    const detailsPromise = expectGetRequest(page, '/dashboard/metricas/detalhes');
    
    // Assert
    await detailsPromise;
    await expect(page.locator('[data-testid="detalhes-metrica"]')).toBeVisible();
  });
}); 