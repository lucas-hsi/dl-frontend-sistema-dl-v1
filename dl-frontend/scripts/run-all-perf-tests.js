const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runCommand(command, description) {
  console.log(`\n🔄 ${description}...`);
  try {
    const result = execSync(command, { 
      stdio: 'pipe',
      encoding: 'utf8',
      cwd: process.cwd()
    });
    console.log(`✅ ${description} concluído`);
    return { success: true, output: result };
  } catch (error) {
    console.error(`❌ ${description} falhou:`, error.message);
    return { success: false, error: error.message };
  }
}

async function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: Object.keys(results).length,
      passedTests: Object.values(results).filter(r => r.success).length,
      failedTests: Object.values(results).filter(r => !r.success).length
    },
    results,
    recommendations: []
  };

  // Adicionar recomendações baseadas nos resultados
  if (!results.lighthouse.success) {
    report.recommendations.push('Otimizar performance das páginas críticas');
  }
  
  if (!results.bundle.success) {
    report.recommendations.push('Reduzir tamanho do bundle');
  }
  
  if (!results.a11y.success) {
    report.recommendations.push('Corrigir violações de acessibilidade');
  }
  
  if (!results.visual.success) {
    report.recommendations.push('Investigar regressões visuais');
  }

  return report;
}

async function main() {
  console.log('🚀 Iniciando testes de performance completos...');
  
  const results = {};
  
  // 1. Lighthouse
  results.lighthouse = await runCommand(
    'node scripts/lighthouse-check.js',
    'Teste Lighthouse'
  );
  
  // 2. Bundle Analysis
  results.bundle = await runCommand(
    'npm run build -- --profile && node scripts/bundle-check.js',
    'Análise de Bundle'
  );
  
  // 3. Acessibilidade
  results.a11y = await runCommand(
    'npx playwright test tests/a11y/',
    'Testes de Acessibilidade'
  );
  
  // 4. Regressão Visual
  results.visual = await runCommand(
    'npx playwright test tests/visual/',
    'Testes de Regressão Visual'
  );
  
  // Gerar relatório consolidado
  const report = await generateReport(results);
  
  // Salvar relatório
  const reportPath = path.join('reports', 'PERF_2F_REPORT.md');
  const reportDir = path.dirname(reportPath);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const markdownReport = `# Relatório de Performance - Fase 2.F

## Resumo Executivo

**Data:** ${new Date().toLocaleDateString('pt-BR')}
**Hora:** ${new Date().toLocaleTimeString('pt-BR')}

### Métricas Gerais
- **Total de Testes:** ${report.summary.totalTests}
- **Testes Aprovados:** ${report.summary.passedTests}
- **Testes com Falhas:** ${report.summary.failedTests}

## Resultados Detalhados

### 1. Lighthouse Performance
**Status:** ${results.lighthouse.success ? '✅ Aprovado' : '❌ Falhou'}

${results.lighthouse.success ? 
  'Todas as páginas críticas passaram nos thresholds de performance.' :
  `Erro: ${results.lighthouse.error}`
}

### 2. Análise de Bundle
**Status:** ${results.bundle.success ? '✅ Aprovado' : '❌ Falhou'}

${results.bundle.success ? 
  'Todos os chunks estão dentro do limite de 250KB.' :
  `Erro: ${results.bundle.error}`
}

### 3. Acessibilidade (A11y)
**Status:** ${results.a11y.success ? '✅ Aprovado' : '❌ Falhou'}

${results.a11y.success ? 
  'Nenhuma violação serious/critical encontrada.' :
  `Erro: ${results.a11y.error}`
}

### 4. Regressão Visual
**Status:** ${results.visual.success ? '✅ Aprovado' : '❌ Falhou'}

${results.visual.success ? 
  'Todos os snapshots visuais estão estáveis.' :
  `Erro: ${results.visual.error}`
}

## Recomendações

${report.recommendations.length > 0 ? 
  report.recommendations.map(rec => `- ${rec}`).join('\n') :
  '✅ Nenhuma recomendação necessária - todos os testes passaram!'
}

## Thresholds Configurados

### Lighthouse
- Performance: ≥ 85
- Acessibilidade: ≥ 95
- Best Practices: ≥ 95
- SEO: ≥ 95
- CLS: ≤ 0.1
- LCP: ≤ 3.0s

### Bundle
- Tamanho máximo por chunk: 250KB

### Visual
- Tolerância máxima: 1% (maxDiffPixelRatio: 0.01)

## Próximos Passos

1. **Se houver falhas:** Corrigir os problemas identificados
2. **Se todos passaram:** Manter monitoramento contínuo
3. **Otimizações futuras:** Considerar implementar:
   - Lazy loading para componentes pesados
   - Code splitting mais granular
   - Otimização de imagens
   - Cache strategies avançadas

---
*Relatório gerado automaticamente pela Fase 2.F - Performance & A11y Gate*
`;

  fs.writeFileSync(reportPath, markdownReport);
  
  console.log('\n📋 Resumo Final:');
  console.log(`- Total de testes: ${report.summary.totalTests}`);
  console.log(`- Aprovados: ${report.summary.passedTests}`);
  console.log(`- Falhas: ${report.summary.failedTests}`);
  
  if (report.summary.failedTests > 0) {
    console.log('\n❌ Alguns testes falharam. Verifique os relatórios detalhados.');
    process.exit(1);
  } else {
    console.log('\n✅ Todos os testes de performance passaram!');
  }
  
  console.log(`\n📄 Relatório completo salvo em: ${reportPath}`);
}

main().catch(console.error); 