const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

// Configuração das páginas críticas
const CRITICAL_PAGES = [
  { path: '/login', name: 'login' },
  { path: '/gestor', name: 'gestor' },
  { path: '/produtos', name: 'produtos' }
];

// Thresholds do package.json
const THRESHOLDS = {
  performance: 85,
  accessibility: 95,
  'best-practices': 95,
  seo: 95,
  cls: 0.1,
  lcp: 3000
};

async function runLighthouse(url, outputPath) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--no-sandbox'] });
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  try {
    const runnerResult = await lighthouse(url, options);
    const reportJson = runnerResult.lhr;
    
    // Salvar relatório
    fs.writeFileSync(outputPath, JSON.stringify(reportJson, null, 2));
    
    return {
      performance: Math.round(reportJson.categories.performance.score * 100),
      accessibility: Math.round(reportJson.categories.accessibility.score * 100),
      'best-practices': Math.round(reportJson.categories['best-practices'].score * 100),
      seo: Math.round(reportJson.categories.seo.score * 100),
      cls: reportJson.audits['cumulative-layout-shift'].numericValue,
      lcp: reportJson.audits['largest-contentful-paint'].numericValue
    };
  } finally {
    await chrome.kill();
  }
}

async function checkThresholds(metrics, pageName) {
  const failures = [];
  
  for (const [metric, threshold] of Object.entries(THRESHOLDS)) {
    const value = metrics[metric];
    if (value > threshold) {
      failures.push(`${pageName}: ${metric} = ${value} (threshold: ${threshold})`);
    }
  }
  
  return failures;
}

async function main() {
  console.log('🚀 Iniciando verificação Lighthouse...');
  
  const baseUrl = 'http://localhost:3000';
  const results = [];
  const allFailures = [];
  
  for (const page of CRITICAL_PAGES) {
    console.log(`\n📊 Testando ${page.name}...`);
    
    try {
      const metrics = await runLighthouse(
        `${baseUrl}${page.path}`,
        `reports/lighthouse/${page.name}.json`
      );
      
      results.push({ page: page.name, metrics });
      
      const failures = await checkThresholds(metrics, page.name);
      allFailures.push(...failures);
      
      console.log(`✅ ${page.name}:`, metrics);
      
      if (failures.length > 0) {
        console.log(`❌ Falhas em ${page.name}:`, failures);
      }
      
    } catch (error) {
      console.error(`❌ Erro ao testar ${page.name}:`, error.message);
      allFailures.push(`${page.name}: Erro de execução`);
    }
  }
  
  // Gerar relatório consolidado
  const report = {
    timestamp: new Date().toISOString(),
    thresholds: THRESHOLDS,
    results,
    summary: {
      totalPages: CRITICAL_PAGES.length,
      passedPages: results.length - allFailures.length,
      failedPages: allFailures.length
    }
  };
  
  fs.writeFileSync('reports/lighthouse/summary.json', JSON.stringify(report, null, 2));
  
  console.log('\n📋 Resumo:');
  console.log(`- Páginas testadas: ${report.summary.totalPages}`);
  console.log(`- Páginas aprovadas: ${report.summary.passedPages}`);
  console.log(`- Falhas: ${report.summary.failedPages}`);
  
  if (allFailures.length > 0) {
    console.log('\n❌ Falhas encontradas:');
    allFailures.forEach(failure => console.log(`  - ${failure}`));
    process.exit(1);
  } else {
    console.log('\n✅ Todas as páginas passaram nos thresholds!');
  }
}

// Verificar se o servidor está rodando
const http = require('http');
function checkServer() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000', (res) => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(5000, () => resolve(false));
  });
}

async function start() {
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.error('❌ Servidor não está rodando em http://localhost:3000');
    console.log('Execute: npm run dev');
    process.exit(1);
  }
  
  await main();
}

start().catch(console.error); 