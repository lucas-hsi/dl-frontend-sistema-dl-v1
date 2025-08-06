import { test } from '@playwright/test';
import { expectRequest } from '../utils/requests';
import { expectToast, openConfirmationAndConfirm } from '../utils/ui';

test('vendas:AplicarPreco should call PUT /api/vendas/preco and update UI', async ({ page }) => {
  // Arrange
  await page.goto('/vendedor/venda-rapida');
  const btn = page.locator('[data-qa="vendas-AplicarPreco"]');

  // Act
  await btn.click();

  // Confirmação quando destrutivo:
  // if (__METHOD__ === 'DELETE' || __ENDPOINT__.includes('despublicar')) {
  //   await openConfirmationAndConfirm(page);
  // }

  // Assert
  await expectRequestSimple(page, 'POST', '/api/vendas/aplicar-preco', ['venda_id', 'preco']);
  await expectToast(page, 'success'); // ajuste se o fluxo exibir erro em caso negativo
}); 