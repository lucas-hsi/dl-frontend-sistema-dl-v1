import { Page, expect } from '@playwright/test';

export interface RequestAssertion {
  method: string;
  url: string;
  body?: Record<string, any>;
  status?: number;
}

export interface RequestCapture {
  method: string;
  url: string;
  body?: any;
  status: number;
  response?: any;
}

/**
 * Captura requests para uma rota específica
 */
export async function captureRequest(
  page: Page,
  urlPattern: string,
  timeout = 5000
): Promise<RequestCapture | null> {
  const requests: RequestCapture[] = [];
  
  // Listener para capturar requests
  page.on('request', request => {
    if (request.url().includes(urlPattern)) {
      requests.push({
        method: request.method(),
        url: request.url(),
        body: request.postDataJSON(),
        status: 0 // Será atualizado no response
      });
    }
  });

  // Listener para capturar responses
  page.on('response', response => {
    const request = requests.find(r => r.url === response.url());
    if (request) {
      request.status = response.status();
      try {
        response.json().then(data => {
          request.response = data;
        });
      } catch {
        // Response não é JSON
      }
    }
  });

  // Aguarda um request ser capturado
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (requests.length > 0) {
      return requests[requests.length - 1];
    }
    await page.waitForTimeout(100);
  }

  return null;
}

/**
 * Verifica se um request específico foi feito
 */
export async function expectRequest(
  page: Page,
  assertion: RequestAssertion
): Promise<void> {
  const captured = await captureRequest(page, assertion.url);
  
  expect(captured).not.toBeNull();
  expect(captured!.method).toBe(assertion.method);
  expect(captured!.url).toContain(assertion.url);
  
  if (assertion.body) {
    expect(captured!.body).toMatchObject(assertion.body);
  }
  
  if (assertion.status) {
    expect(captured!.status).toBe(assertion.status);
  }
}

/**
 * Verifica se um request foi feito com método, rota e chaves mínimas do body
 */
export async function expectRequestWithBodyKeys(
  page: Page,
  method: string,
  routePart: string,
  bodyKeys: string[] = []
): Promise<void> {
  const captured = await captureRequest(page, routePart);
  
  expect(captured).not.toBeNull();
  expect(captured!.method).toBe(method);
  expect(captured!.url).toContain(routePart);
  
  if (bodyKeys.length > 0 && captured!.body) {
    for (const key of bodyKeys) {
      expect(captured!.body).toHaveProperty(key);
    }
  }
}

/**
 * Verifica se um request POST foi feito com payload específico
 */
export async function expectPostRequest(
  page: Page,
  url: string,
  body?: Record<string, any>
): Promise<void> {
  await expectRequest(page, {
    method: 'POST',
    url,
    body
  });
}

/**
 * Verifica se um request PUT foi feito com payload específico
 */
export async function expectPutRequest(
  page: Page,
  url: string,
  body?: Record<string, any>
): Promise<void> {
  await expectRequest(page, {
    method: 'PUT',
    url,
    body
  });
}

/**
 * Verifica se um request DELETE foi feito
 */
export async function expectDeleteRequest(
  page: Page,
  url: string
): Promise<void> {
  await expectRequest(page, {
    method: 'DELETE',
    url
  });
}

/**
 * Verifica se um request GET foi feito
 */
export async function expectGetRequest(
  page: Page,
  url: string
): Promise<void> {
  await expectRequest(page, {
    method: 'GET',
    url
  });
}

/**
 * Aguarda e captura múltiplos requests
 */
export async function captureMultipleRequests(
  page: Page,
  urlPattern: string,
  count: number,
  timeout = 10000
): Promise<RequestCapture[]> {
  const requests: RequestCapture[] = [];
  
  page.on('request', request => {
    if (request.url().includes(urlPattern)) {
      requests.push({
        method: request.method(),
        url: request.url(),
        body: request.postDataJSON(),
        status: 0
      });
    }
  });

  page.on('response', response => {
    const request = requests.find(r => r.url === response.url());
    if (request) {
      request.status = response.status();
    }
  });

  const startTime = Date.now();
  while (Date.now() - startTime < timeout && requests.length < count) {
    await page.waitForTimeout(100);
  }

  return requests.slice(0, count);
}

/**
 * Verifica se nenhum request foi feito para uma rota específica
 */
export async function expectNoRequest(
  page: Page,
  urlPattern: string,
  timeout = 2000
): Promise<void> {
  const captured = await captureRequest(page, urlPattern, timeout);
  expect(captured).toBeNull();
}

/**
 * Verifica se um request foi feito com método e endpoint específicos
 * Versão simplificada para uso nos templates de teste
 */
export async function expectRequestSimple(
  page: Page,
  method: string,
  endpoint: string,
  bodyKeys: string[] = []
): Promise<void> {
  await expectRequestWithBodyKeys(page, method, endpoint, bodyKeys);
} 