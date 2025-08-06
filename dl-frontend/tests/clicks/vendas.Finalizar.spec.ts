import { test } from '@playwright/test';
import { expectRequest } from '../utils/requests';
import { expectToast, openConfirmationAndConfirm } from '../utils/ui';

test('vendas:Finalizar should call POST /api/vendas/finalizar and update UI', async ({ page }) => {
  // Arrange
  await page.goto('/vendedor/venda-rapida');
  const btn = page.locator('[data-qa="vendas-Finalizar"]');

  // Act
  await btn.click();

  // Confirmação quando destrutivo:
  // if (__METHOD__ === 'DELETE' || __ENDPOINT__.includes('despublicar')) {
  //   await openConfirmationAndConfirm(page);
  // }

  // Assert
  await expectRequestSimple(page, 'POST', '/api/vendas/finalizar', ['cliente_id', 'vendedor_id', 'produtos', 'forma_pagamento']);
  await expectToast(page, 'success'); // ajuste se o fluxo exibir erro em caso negativo
}); 