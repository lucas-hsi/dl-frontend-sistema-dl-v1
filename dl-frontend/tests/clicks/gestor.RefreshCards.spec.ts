import { test } from '@playwright/test';
import { expectRequest } from '../utils/requests';
import { expectToast, openConfirmationAndConfirm } from '../utils/ui';

test('gestor:RefreshCards should call GET /dashboard/metricas and update UI', async ({ page }) => {
  // Arrange
  await page.goto('/gestor');
  const btn = page.locator('[data-qa="gestor-RefreshCards"]');

  // Act
  await btn.click();

  // Confirmação quando destrutivo:
  // if (__METHOD__ === 'DELETE' || __ENDPOINT__.includes('despublicar')) {
  //   await openConfirmationAndConfirm(page);
  // }

  // Assert
  await expectRequestSimple(page, 'GET', '/dashboard/metricas', []);
  await expectToast(page, 'success'); // ajuste se o fluxo exibir erro em caso negativo
}); 