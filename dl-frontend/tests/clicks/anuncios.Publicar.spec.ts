import { test } from '@playwright/test';
import { expectRequest } from '../utils/requests';
import { expectToast, openConfirmationAndConfirm } from '../utils/ui';

test('anuncios:Publicar should call POST /anuncios/publicar and update UI', async ({ page }) => {
  // Arrange
  await page.goto('/anuncios');
  const btn = page.locator('[data-qa="anuncios-Publicar"]');

  // Act
  await btn.click();

  // Confirmação quando destrutivo:
  // if (__METHOD__ === 'DELETE' || __ENDPOINT__.includes('despublicar')) {
  //   await openConfirmationAndConfirm(page);
  // }

  // Assert
  await expectRequestSimple(page, 'POST', '/anuncios/publicar', ['titulo', 'descricao', 'preco', 'imagens']);
  await expectToast(page, 'success'); // ajuste se o fluxo exibir erro em caso negativo
}); 