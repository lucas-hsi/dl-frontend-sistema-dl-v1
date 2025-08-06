# ========================================
# SCRIPT DE LIMPEZA PARA GITHUB
# ========================================
# Este script remove arquivos desnecessários antes de subir para o GitHub

Write-Host "🧹 Iniciando limpeza para GitHub..." -ForegroundColor Green

# ===== REMOVER ARQUIVOS TEMPORÁRIOS =====
Write-Host "📁 Removendo arquivos temporários..." -ForegroundColor Yellow

$tempFiles = @(
    "*.tmp",
    "*.temp", 
    "*.cache",
    "$null",
    "temp_*.txt",
    "package-lock.json"
)

foreach ($pattern in $tempFiles) {
    Get-ChildItem -Path . -Recurse -Name $pattern -ErrorAction SilentlyContinue | ForEach-Object {
        Remove-Item $_ -Force -ErrorAction SilentlyContinue
        Write-Host "🗑️ Removido: $_" -ForegroundColor Red
    }
}

# ===== REMOVER BACKUPS E LEGACY =====
Write-Host "🗂️ Removendo backups e legacy..." -ForegroundColor Yellow

$legacyDirs = @(
    "postgres_backup_*",
    "_legacy"
)

foreach ($pattern in $legacyDirs) {
    Get-ChildItem -Path . -Recurse -Directory -Name $pattern -ErrorAction SilentlyContinue | ForEach-Object {
        Remove-Item $_ -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "🗑️ Removido diretório: $_" -ForegroundColor Red
    }
}

# ===== REMOVER SCRIPTS TEMPORÁRIOS =====
Write-Host "📜 Removendo scripts temporários..." -ForegroundColor Yellow

$tempScripts = @(
    "setup_*.ps1",
    "reset_*.ps1", 
    "CLEAN_*.ps1",
    "test_*.py",
    "check_*.py",
    "list_*.py"
)

foreach ($pattern in $tempScripts) {
    Get-ChildItem -Path . -Recurse -Name $pattern -ErrorAction SilentlyContinue | ForEach-Object {
        if ($_ -ne "clean-for-github.ps1") {  # Não remover este script
            Remove-Item $_ -Force -ErrorAction SilentlyContinue
            Write-Host "🗑️ Removido script: $_" -ForegroundColor Red
        }
    }
}

# ===== REMOVER RESULTADOS DE TESTE =====
Write-Host "📊 Removendo resultados de teste..." -ForegroundColor Yellow

$testDirs = @(
    "test-results",
    "test-results-*",
    "playwright-report",
    "visual-report", 
    "reports"
)

foreach ($pattern in $testDirs) {
    Get-ChildItem -Path . -Recurse -Directory -Name $pattern -ErrorAction SilentlyContinue | ForEach-Object {
        Remove-Item $_ -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "🗑️ Removido diretório de teste: $_" -ForegroundColor Red
    }
}

# ===== REMOVER BANCOS DE DADOS =====
Write-Host "🗄️ Removendo bancos de dados..." -ForegroundColor Yellow

$dbFiles = @(
    "*.db",
    "*.sqlite",
    "*.sqlite3"
)

foreach ($pattern in $dbFiles) {
    Get-ChildItem -Path . -Recurse -Name $pattern -ErrorAction SilentlyContinue | ForEach-Object {
        Remove-Item $_ -Force -ErrorAction SilentlyContinue
        Write-Host "🗑️ Removido banco: $_" -ForegroundColor Red
    }
}

# ===== REMOVER LOGS =====
Write-Host "📝 Removendo logs..." -ForegroundColor Yellow

$logFiles = @(
    "*.log",
    "logs",
    "log"
)

foreach ($pattern in $logFiles) {
    Get-ChildItem -Path . -Recurse -Name $pattern -ErrorAction SilentlyContinue | ForEach-Object {
        Remove-Item $_ -Force -ErrorAction SilentlyContinue
        Write-Host "🗑️ Removido log: $_" -ForegroundColor Red
    }
}

# ===== REMOVER ARQUIVOS DE LEGACY =====
Write-Host "📄 Removendo arquivos legacy..." -ForegroundColor Yellow

$legacyFiles = @(
    "legacy_*.md",
    "legacy_selection_report.md"
)

foreach ($pattern in $legacyFiles) {
    Get-ChildItem -Path . -Recurse -Name $pattern -ErrorAction SilentlyContinue | ForEach-Object {
        Remove-Item $_ -Force -ErrorAction SilentlyContinue
        Write-Host "🗑️ Removido arquivo legacy: $_" -ForegroundColor Red
    }
}

# ===== VERIFICAR ESTRUTURA FINAL =====
Write-Host "✅ Verificando estrutura final..." -ForegroundColor Green

Write-Host "📁 Estrutura do projeto:" -ForegroundColor Cyan
Get-ChildItem -Path . -Directory | ForEach-Object {
    Write-Host "  📂 $_" -ForegroundColor White
}

Write-Host "📄 Arquivos principais:" -ForegroundColor Cyan
Get-ChildItem -Path . -File | Where-Object { $_.Name -match "\.(md|yml|yaml|json|gitignore)$" } | ForEach-Object {
    Write-Host "  📄 $_" -ForegroundColor White
}

# ===== MENSAGEM FINAL =====
Write-Host ""
Write-Host "🎉 Limpeza concluída!" -ForegroundColor Green
Write-Host "📋 Próximos passos:" -ForegroundColor Yellow
Write-Host "  1. git add ." -ForegroundColor White
Write-Host "  2. git commit -m 'feat: sistema de login definitivo funcionando'" -ForegroundColor White
Write-Host "  3. git push origin main" -ForegroundColor White
Write-Host ""
Write-Host "💡 Dica: Use 'git status' para verificar o que será commitado" -ForegroundColor Cyan 