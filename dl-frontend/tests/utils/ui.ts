import { Page, expect } from '@playwright/test';

/**
 * Verifica se um toast de sucesso aparece
 */
export async function expectToast(
  page: Page,
  message: string,
  type: 'success' | 'error' | 'info' = 'success',
  timeout = 5000
): Promise<void> {
  const toastSelector = type === 'success' 
    ? '[data-testid="toast-success"], .toast-success, [role="alert"]'
    : type === 'error'
    ? '[data-testid="toast-error"], .toast-error, [role="alert"]'
    : '[data-testid="toast-info"], .toast-info, [role="alert"]';

  await expect(page.locator(toastSelector)).toBeVisible({ timeout });
  
  if (message) {
    await expect(page.locator(toastSelector)).toContainText(message);
  }
}

/**
 * Verifica se um elemento está desabilitado durante request
 */
export async function expectDisabledWhilePending(
  page: Page,
  selector: string,
  timeout = 5000
): Promise<void> {
  const element = page.locator(selector);
  
  // Verifica se está desabilitado
  await expect(element).toBeDisabled({ timeout });
  
  // Verifica se tem aria-busy ou loading state
  const ariaBusy = await element.getAttribute('aria-busy');
  const classAttribute = await element.getAttribute('class') || '';
const hasLoadingClass = classAttribute.includes('loading');
const hasDisabledClass = classAttribute.includes('disabled');
  
  expect(ariaBusy === 'true' || hasLoadingClass || hasDisabledClass).toBeTruthy();
}

/**
 * Abre confirmação e confirma ação destrutiva
 */
export async function openConfirmationAndConfirm(
  page: Page,
  triggerSelector: string,
  confirmSelector = '[data-testid="confirm-yes"], .confirm-yes, button:has-text("Confirmar"), button:has-text("Sim")',
  timeout = 5000
): Promise<void> {
  // Clica no botão que abre a confirmação
  await page.click(triggerSelector);
  
  // Aguarda modal de confirmação aparecer
  await expect(page.locator(confirmSelector)).toBeVisible({ timeout });
  
  // Clica em confirmar
  await page.click(confirmSelector);
  
  // Aguarda modal fechar
  await expect(page.locator(confirmSelector)).not.toBeVisible({ timeout });
}

/**
 * Verifica se um elemento aparece na lista após ação
 */
export async function expectItemInList(
  page: Page,
  listSelector: string,
  itemText: string,
  timeout = 5000
): Promise<void> {
  const list = page.locator(listSelector);
  await expect(list).toContainText(itemText, { timeout });
}

/**
 * Verifica se um elemento foi removido da lista após ação
 */
export async function expectItemNotInList(
  page: Page,
  listSelector: string,
  itemText: string,
  timeout = 5000
): Promise<void> {
  const list = page.locator(listSelector);
  await expect(list).not.toContainText(itemText, { timeout });
}

/**
 * Verifica se um contador foi atualizado
 */
export async function expectCounterUpdated(
  page: Page,
  counterSelector: string,
  expectedValue: string | number,
  timeout = 5000
): Promise<void> {
  const counter = page.locator(counterSelector);
  await expect(counter).toHaveText(expectedValue.toString(), { timeout });
}

/**
 * Verifica se um formulário foi limpo após submit
 */
export async function expectFormCleared(
  page: Page,
  formSelector: string,
  timeout = 5000
): Promise<void> {
  const form = page.locator(formSelector);
  const inputs = form.locator('input, textarea, select');
  
  for (let i = 0; i < await inputs.count(); i++) {
    const input = inputs.nth(i);
    const value = await input.inputValue();
    expect(value).toBe('');
  }
}

/**
 * Verifica se um modal foi fechado
 */
export async function expectModalClosed(
  page: Page,
  modalSelector: string,
  timeout = 5000
): Promise<void> {
  await expect(page.locator(modalSelector)).not.toBeVisible({ timeout });
}

/**
 * Verifica se um loading spinner aparece e depois desaparece
 */
export async function expectLoadingSpinner(
  page: Page,
  spinnerSelector = '[data-testid="loading"], .loading, [aria-busy="true"]',
  timeout = 10000
): Promise<void> {
  // Verifica se spinner aparece
  await expect(page.locator(spinnerSelector)).toBeVisible({ timeout: 2000 });
  
  // Aguarda spinner desaparecer
  await expect(page.locator(spinnerSelector)).not.toBeVisible({ timeout });
}

/**
 * Verifica se uma página foi redirecionada
 */
export async function expectRedirect(
  page: Page,
  expectedUrl: string,
  timeout = 5000
): Promise<void> {
  await expect(page).toHaveURL(expectedUrl, { timeout });
}

/**
 * Verifica se um botão está habilitado
 */
export async function expectButtonEnabled(
  page: Page,
  buttonSelector: string,
  timeout = 5000
): Promise<void> {
  const button = page.locator(buttonSelector);
  await expect(button).toBeEnabled({ timeout });
}

/**
 * Verifica se um botão está desabilitado
 */
export async function expectButtonDisabled(
  page: Page,
  buttonSelector: string,
  timeout = 5000
): Promise<void> {
  const button = page.locator(buttonSelector);
  await expect(button).toBeDisabled({ timeout });
}

/**
 * Verifica se um elemento tem texto específico
 */
export async function expectElementText(
  page: Page,
  selector: string,
  expectedText: string,
  timeout = 5000
): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toHaveText(expectedText, { timeout });
}

/**
 * Verifica se um elemento contém texto específico
 */
export async function expectElementContainsText(
  page: Page,
  selector: string,
  expectedText: string,
  timeout = 5000
): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toContainText(expectedText, { timeout });
}

/**
 * Verifica se um elemento está visível
 */
export async function expectElementVisible(
  page: Page,
  selector: string,
  timeout = 5000
): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toBeVisible({ timeout });
}

/**
 * Verifica se um elemento não está visível
 */
export async function expectElementNotVisible(
  page: Page,
  selector: string,
  timeout = 5000
): Promise<void> {
  const element = page.locator(selector);
  await expect(element).not.toBeVisible({ timeout });
} 