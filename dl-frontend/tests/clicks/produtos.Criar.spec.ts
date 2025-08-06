import { test } from '@playwright/test';
import { expectRequestSimple } from '../utils/requests';
import { expectToast, openConfirmationAndConfirm } from '../utils/ui';

test('produtos:Criar should call POST /api/produtos and update UI', async ({ page }) => {
  // Arrange
  await page.goto('/gestor/produtos/catalogo');
  const btn = page.locator('[data-qa="produtos-Criar"]');

  // Act
  await btn.click();

  // Confirmação quando destrutivo:
  // if (__METHOD__ === 'DELETE' || __ENDPOINT__.includes('despublicar')) {
  //   await openConfirmationAndConfirm(page);
  // }

  // Assert
  await expectRequestSimple(page, 'POST', '/api/produtos/estoque', ['nome', 'categoria', 'preco', 'estoque']);
  await expectToast(page, 'success'); // ajuste se o fluxo exibir erro em caso negativo
}); 