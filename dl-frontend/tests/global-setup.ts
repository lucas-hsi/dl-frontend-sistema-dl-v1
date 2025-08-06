import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Verificar se o frontend está acessível
  try {
    await page.goto('http://localhost:3000');
    console.log('✅ Frontend está acessível');
  } catch (error) {
    console.log('⚠️ Frontend não está acessível, iniciando...');
  }
  
  await browser.close();
}

export default globalSetup; 