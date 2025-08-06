const fs = require('fs');
const path = require('path');

// Thresholds do package.json
const BUNDLE_THRESHOLDS = {
  maxChunkSize: 250000 // 250KB
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundle() {
  const bundleDir = path.join(__dirname, '..', '.next', 'static', 'chunks');
  const results = [];
  let totalSize = 0;
  
  if (!fs.existsSync(bundleDir)) {
    console.error('❌ Diretório .next/static/chunks não encontrado');
    console.log('Execute: npm run build primeiro');
    process.exit(1);
  }
  
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (file.endsWith('.js')) {
        const size = stat.size;
        const relativePath = path.relative(bundleDir, filePath);
        
        results.push({
          file: relativePath,
          size,
          formattedSize: formatBytes(size)
        });
        
        totalSize += size;
      }
    }
  }
  
  scanDirectory(bundleDir);
  
  return { results, totalSize };
}

function checkThresholds(results) {
  const failures = [];
  
  for (const chunk of results) {
    if (chunk.size > BUNDLE_THRESHOLDS.maxChunkSize) {
      failures.push({
        file: chunk.file,
        size: chunk.size,
        formattedSize: chunk.formattedSize,
        threshold: formatBytes(BUNDLE_THRESHOLDS.maxChunkSize)
      });
    }
  }
  
  return failures;
}

function generateReport(results, totalSize, failures) {
  const report = {
    timestamp: new Date().toISOString(),
    thresholds: BUNDLE_THRESHOLDS,
    summary: {
      totalChunks: results.length,
      totalSize,
      formattedTotalSize: formatBytes(totalSize),
      oversizedChunks: failures.length
    },
    chunks: results.sort((a, b) => b.size - a.size),
    failures
  };
  
  return report;
}

function main() {
  console.log('📦 Analisando bundle...');
  
  const { results, totalSize } = analyzeBundle();
  const failures = checkThresholds(results);
  const report = generateReport(results, totalSize, failures);
  
  // Salvar relatório
  fs.writeFileSync('reports/bundle/analysis.json', JSON.stringify(report, null, 2));
  
  console.log('\n📋 Resumo do Bundle:');
  console.log(`- Total de chunks: ${report.summary.totalChunks}`);
  console.log(`- Tamanho total: ${report.summary.formattedTotalSize}`);
  console.log(`- Chunks acima do limite: ${report.summary.oversizedChunks}`);
  
  if (failures.length > 0) {
    console.log('\n❌ Chunks acima do limite:');
    failures.forEach(failure => {
      console.log(`  - ${failure.file}: ${failure.formattedSize} (limite: ${failure.threshold})`);
    });
    
    console.log('\n💡 Recomendações:');
    console.log('  - Use dynamic imports para módulos pesados');
    console.log('  - Implemente code splitting por rota');
    console.log('  - Otimize dependências de terceiros');
    console.log('  - Considere lazy loading para componentes pesados');
    
    process.exit(1);
  } else {
    console.log('\n✅ Todos os chunks estão dentro do limite!');
  }
  
  // Mostrar top 5 maiores chunks
  console.log('\n📊 Top 5 maiores chunks:');
  results.slice(0, 5).forEach((chunk, index) => {
    console.log(`  ${index + 1}. ${chunk.file}: ${chunk.formattedSize}`);
  });
}

main(); 