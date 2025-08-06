import { test } from '@playwright/test';
import { expectRequest } from '../utils/requests';
import { expectToast, openConfirmationAndConfirm } from '../utils/ui';

test('anuncios:Despublicar should call POST /api/anuncios/despublicar and update UI', async ({ page }) => {
  // Arrange
  await page.goto('/anuncios');
  const btn = page.locator('[data-qa="anuncios-Despublicar"]');

  // Act
  await btn.click();

  // Confirmação quando destrutivo:
  await openConfirmationAndConfirm(page);

  // Assert
  await expectRequestSimple(page, 'POST', '/api/anuncios/despublicar', []);
  await expectToast(page, 'success'); // ajuste se o fluxo exibir erro em caso negativo
}); 