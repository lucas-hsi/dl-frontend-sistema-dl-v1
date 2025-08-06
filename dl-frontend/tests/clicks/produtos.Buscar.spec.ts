import { test } from '@playwright/test';
import { expectRequestSimple } from '../utils/requests';
import { expectToast, openConfirmationAndConfirm } from '../utils/ui';

test('produtos:Buscar should call GET /produtos/estoque and update UI', async ({ page }) => {
  // Arrange
  await page.goto('/gestor/produtos/catalogo');
  const btn = page.locator('[data-qa="produtos-Buscar"]');

  // Act
  await btn.click();

  // Confirmação quando destrutivo:
  // if (__METHOD__ === 'DELETE' || __ENDPOINT__.includes('despublicar')) {
  //   await openConfirmationAndConfirm(page);
  // }

  // Assert
  await expectRequestSimple(page, 'GET', '/produtos/estoque', []);
  await expectToast(page, 'success'); // ajuste se o fluxo exibir erro em caso negativo
}); 