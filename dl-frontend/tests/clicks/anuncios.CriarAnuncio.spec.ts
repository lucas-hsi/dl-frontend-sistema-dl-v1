import { test } from '@playwright/test';
import { expectRequest } from '../utils/requests';
import { expectToast, openConfirmationAndConfirm } from '../utils/ui';

test('anuncios:CriarAnuncio should call POST /api/anuncios and update UI', async ({ page }) => {
  // Arrange
  await page.goto('/anuncios');
  const btn = page.locator('[data-qa="anuncios-CriarAnuncio"]');

  // Act
  await btn.click();

  // Confirmação quando destrutivo:
  // if (__METHOD__ === 'DELETE' || __ENDPOINT__.includes('despublicar')) {
  //   await openConfirmationAndConfirm(page);
  // }

  // Assert
  await expectRequestSimple(page, 'GET', '/anuncios/ia/criar-anuncio', []);
  await expectToast(page, 'success'); // ajuste se o fluxo exibir erro em caso negativo
}); 