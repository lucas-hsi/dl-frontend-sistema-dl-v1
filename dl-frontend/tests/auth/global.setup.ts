import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';

export default async function globalSetup(config: FullConfig) {
  const frontendURL = process.env.PW_BASE_URL || 'http://localhost:3000';
  
  const email = process.env.E2E_USER || 'admin@dl.com';
  const password = process.env.E2E_PASS || 'admin123';

  console.log(`🔐 Configurando autenticação para: ${email}`);

  try {
    // Criar contexto para simular login no frontend
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Ir para a página de login
    await page.goto(`${frontendURL}/login`);
    
    // Simular dados de usuário baseado nas credenciais
    const userData = {
      id: Date.now(),
      nome: 'Admin Teste',
      email: email,
      username: email,
      perfil: 'GESTOR',
      permissoes: ['vendedores', 'anuncios', 'performance', 'gestao', 'relatorios', 'configuracoes']
    };

    // Simular login no frontend salvando no localStorage
    await page.evaluate(({ email, userData }: { email: string; userData: any }) => {
      // Salvar no localStorage como o frontend faz
      localStorage.setItem('auth_token', 'auth_token_' + Date.now());
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('perfil_autenticado', 'GESTOR');
      
      console.log('✅ Dados de autenticação salvos no localStorage');
    }, { email, userData });

    // Aguardar um pouco para garantir que os dados foram salvos
    await page.waitForTimeout(1000);

    // Salvar estado (cookies/localStorage) para a suíte
    await fs.promises.mkdir('tests/.auth', { recursive: true });
    await context.storageState({ path: 'tests/.auth/storageState.json' });
    
    console.log('✅ Storage state salvo em tests/.auth/storageState.json');
    
    await context.close();
    await browser.close();

  } catch (error) {
    console.error('❌ Erro durante setup de autenticação:', error);
    
    // Fallback: criar storage state vazio se falhar
    const fallbackBrowser = await chromium.launch();
    const fallbackContext = await fallbackBrowser.newContext();
    await fs.promises.mkdir('tests/.auth', { recursive: true });
    await fallbackContext.storageState({ path: 'tests/.auth/storageState.json' });
    
    console.log('⚠️ Criado storage state vazio como fallback');
    await fallbackContext.close();
    await fallbackBrowser.close();
  }
} 