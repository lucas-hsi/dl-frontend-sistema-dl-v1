import { test } from '@playwright/test';
import { expectRequest } from '../utils/requests';
import { expectToast, openConfirmationAndConfirm } from '../utils/ui';

test('vendas:AdicionarItem should call POST /api/vendas/items and update UI', async ({ page }) => {
  // Arrange
  await page.goto('/vendedor/venda-rapida');
  const btn = page.locator('[data-qa="vendas-AdicionarItem"]');

  // Act
  await btn.click();

  // Confirmação quando destrutivo:
  // if (__METHOD__ === 'DELETE' || __ENDPOINT__.includes('despublicar')) {
  //   await openConfirmationAndConfirm(page);
  // }

  // Assert
  await expectRequestSimple(page, 'POST', '/api/vendas/adicionar-item', ['id_produto_tiny', 'nome_produto', 'quantidade', 'preco_unitario', 'sku']);
  await expectToast(page, 'success'); // ajuste se o fluxo exibir erro em caso negativo
}); 