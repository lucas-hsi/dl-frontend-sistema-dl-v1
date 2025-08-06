import { test, expect } from '@playwright/test';

const ok = (s: number) => s >= 200 && s < 400;

test('login:Entrar should submit credentials and navigate', async ({ page }) => {
  // Abre a página de login
  await page.goto('/login');

  // Aguarda o form estar visível (evita timeout por render tardio)
  await page.waitForSelector('[data-qa="login-email"]', { state: 'visible' });
  await page.waitForSelector('[data-qa="login-password"]', { state: 'visible' });
  await page.waitForSelector('[data-qa="login-Entrar"]', { state: 'visible' });

  // Preenche com as credenciais corretas do sistema
  await page.fill('[data-qa="login-email"]', 'admin@dl.com');
  await page.fill('[data-qa="login-password"]', 'admin123');

  const btn = page.locator('[data-qa="login-Entrar"]').first();

  // Esperas registradas ANTES do clique (XHR ou formulário com redirect)
  const waitRequest = page.waitForRequest(req =>
    req.method() === 'POST' &&
    /\/(auth\/login|api\/auth\/callback\/credentials|api\/auth\/signin)/.test(req.url())
  ).catch(() => null);

  const waitResponse = page.waitForResponse(res => {
    const u = res.url();
    const isLoginEndpoint = /\/(auth\/login|api\/auth\/callback\/credentials|api\/auth\/signin)/.test(u);
    return isLoginEndpoint && ok(res.status());
  }).catch(() => null);

  const waitNav = page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => null);

  await Promise.all([
    waitRequest,
    waitResponse,
    waitNav,
    btn.click(),
  ]);

  // Ajuste a rota autenticada do seu app
  await expect(page).toHaveURL(/(\/gestor|\/dashboard|\/home)/);

  // Toast de sucesso, se existir
  const toast = page.locator('[data-qa="toast-success"]');
  if (await toast.count()) {
    await expect(toast).toBeVisible();
  }
}); 