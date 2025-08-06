import { test } from '@playwright/test';
import { expectRequestSimple } from '../utils/requests';
import { expectToast, openConfirmationAndConfirm } from '../utils/ui';

test('produtos:Deletar should call DELETE /api/produtos/{id} and update UI', async ({ page }) => {
  // Arrange
  await page.goto('/gestor/produtos/catalogo');
  const btn = page.locator('[data-qa="produtos-Deletar"]');

  // Act
  await btn.click();

  // Confirmação quando destrutivo:
  await openConfirmationAndConfirm(page);

  // Assert
  await expectRequestSimple(page, 'DELETE', '/api/produtos/', []);
  await expectToast(page, 'success'); // ajuste se o fluxo exibir erro em caso negativo
}); 