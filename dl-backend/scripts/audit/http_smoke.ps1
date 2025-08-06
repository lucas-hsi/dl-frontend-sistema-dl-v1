#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script de auditoria HTTP para validar endpoints-chave do Corredor Estável
    
.DESCRIPTION
    Testa a presença e códigos HTTP dos endpoints essenciais:
    - Health check
    - Login (sucesso e falha)
    - Endpoint /me (protegido)
    - Endpoint /produtos-estoque/ (protegido)
    - Confirma ausência de endpoints de draft
    
.PARAMETER BaseUrl
    URL base da API (padrão: http://localhost:8001)
    
.PARAMETER OutputFile
    Arquivo de saída (padrão: ../audit/http_smoke.md)
#>

param(
    [string]$BaseUrl = "http://localhost:8001",
    [string]$OutputFile = "../audit/http_smoke.md"
)

# Configurações
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Credenciais de teste
$TestCredentials = @{
    Valid = @{
        Username = "admin@dl.com"
        Password = "admin123"
    }
    Invalid = @{
        Username = "invalid@dl.com"
        Password = "wrongpassword"
    }
}

# Função para fazer requisição HTTP
function Invoke-TestRequest {
    param(
        [string]$Method = "GET",
        [string]$Url,
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )
    
    try {
        $params = @{
            Method = $Method
            Uri = $Url
            Headers = $Headers
            TimeoutSec = 10
        }
        
        if ($Body) {
            $params.Body = $Body
            $params.ContentType = "application/x-www-form-urlencoded"
        }
        
        $response = Invoke-WebRequest @params
        return @{
            StatusCode = $response.StatusCode
            Success = $true
            Content = $response.Content
            Headers = $response.Headers
        }
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        return @{
            StatusCode = $statusCode
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

# Função para testar login
function Test-Login {
    param(
        [hashtable]$Credentials,
        [string]$ExpectedStatus
    )
    
    $body = "username=$($Credentials.Username)&password=$($Credentials.Password)"
    $result = Invoke-TestRequest -Method "POST" -Url "$BaseUrl/api/v1/auth/login" -Body $body
    
    $status = if ($result.Success) { "✅" } else { "❌" }
    $expected = if ($ExpectedStatus -eq "200") { "✅" } else { "❌" }
    
    return @{
        Status = $status
        Expected = $expected
        StatusCode = $result.StatusCode
        ExpectedCode = $ExpectedStatus
        Success = ($result.StatusCode -eq $ExpectedStatus)
        Content = $result.Content
    }
}

# Função para testar endpoint protegido
function Test-ProtectedEndpoint {
    param(
        [string]$Url,
        [string]$Token,
        [string]$ExpectedStatus = "200"
    )
    
    $headers = @{
        "Authorization" = "Bearer $Token"
        "Content-Type" = "application/json"
    }
    
    $result = Invoke-TestRequest -Method "GET" -Url "$BaseUrl$Url" -Headers $headers
    
    $status = if ($result.Success) { "✅" } else { "❌" }
    $expected = if ($result.StatusCode -eq $ExpectedStatus) { "✅" } else { "❌" }
    
    return @{
        Status = $status
        Expected = $expected
        StatusCode = $result.StatusCode
        ExpectedCode = $ExpectedStatus
        Success = ($result.StatusCode -eq $ExpectedStatus)
        Content = $result.Content
    }
}

# Função para testar ausência de endpoint
function Test-EndpointAbsence {
    param(
        [string]$Url,
        [string]$ExpectedStatus = "404"
    )
    
    $result = Invoke-TestRequest -Method "GET" -Url "$BaseUrl$Url"
    
    $status = if ($result.StatusCode -eq $ExpectedStatus) { "✅" } else { "❌" }
    
    return @{
        Status = $status
        StatusCode = $result.StatusCode
        ExpectedCode = $ExpectedStatus
        Success = ($result.StatusCode -eq $ExpectedStatus)
        Content = $result.Content
    }
}

# Início do teste
Write-Host "🚀 Iniciando auditoria HTTP do Corredor Estável..." -ForegroundColor Green
Write-Host "📡 Base URL: $BaseUrl" -ForegroundColor Yellow

$results = @{}
$token = $null

# 1. Teste de Health Check
Write-Host "`n🔍 Testando Health Check..." -ForegroundColor Cyan
$healthResult = Invoke-TestRequest -Url "$BaseUrl/api/v1/utils/health-check"
$results.HealthCheck = @{
    Status = if ($healthResult.Success) { "✅" } else { "❌" }
    StatusCode = $healthResult.StatusCode
    Success = $healthResult.Success
    Content = $healthResult.Content
}

# 2. Teste de Login com credenciais inválidas
Write-Host "🔍 Testando Login (credenciais inválidas)..." -ForegroundColor Cyan
$results.LoginInvalid = Test-Login -Credentials $TestCredentials.Invalid -ExpectedStatus "200"

# 3. Teste de Login com credenciais válidas
Write-Host "🔍 Testando Login (credenciais válidas)..." -ForegroundColor Cyan
$loginResult = Test-Login -Credentials $TestCredentials.Valid -ExpectedStatus "200"
$results.LoginValid = $loginResult

# Extrair token se login foi bem-sucedido
if ($loginResult.Success -and $loginResult.Content) {
    try {
        $loginData = $loginResult.Content | ConvertFrom-Json
        if ($loginData.data -and $loginData.data.token) {
            $token = $loginData.data.token
            Write-Host "🔑 Token obtido com sucesso" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "⚠️ Não foi possível extrair token da resposta" -ForegroundColor Yellow
    }
}

# 4. Teste de endpoint /me (protegido)
Write-Host "🔍 Testando endpoint /me..." -ForegroundColor Cyan
if ($token) {
    $results.MeEndpoint = Test-ProtectedEndpoint -Url "/api/v1/users/me" -Token $token
} else {
    $results.MeEndpoint = @{
        Status = "⚠️"
        StatusCode = "N/A"
        Success = $false
        Note = "Token não disponível"
    }
}

# 5. Teste de endpoint /produtos-estoque/ (protegido)
Write-Host "🔍 Testando endpoint /produtos-estoque/..." -ForegroundColor Cyan
if ($token) {
    $results.ProdutosEndpoint = Test-ProtectedEndpoint -Url "/api/v1/produtos-estoque/" -Token $token
} else {
    $results.ProdutosEndpoint = @{
        Status = "⚠️"
        StatusCode = "N/A"
        Success = $false
        Note = "Token não disponível"
    }
}

# 6. Teste de ausência de endpoints de draft
Write-Host "🔍 Verificando ausência de endpoints de draft..." -ForegroundColor Cyan
$results.OrcamentosDraft = Test-EndpointAbsence -Url "/api/v1/orcamentos/draft"
$results.ClientesDraft = Test-EndpointAbsence -Url "/api/v1/clientes/draft"

# Gerar relatório
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Construir relatório linha por linha para evitar problemas de sintaxe
$reportLines = @()
$reportLines += "# 🔥 HTTP Smoke Test - Corredor Estável"
$reportLines += ""
$reportLines += "**Data/Hora:** $timestamp"
$reportLines += "**Base URL:** $BaseUrl"
$reportLines += "**Status Geral:** $(if ($results.Values.Success -contains $false) { "❌ FALHAS DETECTADAS" } else { "✅ TODOS OS TESTES PASSARAM" })"
$reportLines += ""
$reportLines += "---"
$reportLines += ""
$reportLines += "## 📊 Resultados dos Testes"
$reportLines += ""
$reportLines += "### 🔍 Health Check"
$reportLines += "- **Status:** $($results.HealthCheck.Status)"
$reportLines += "- **Código HTTP:** $($results.HealthCheck.StatusCode)"
$reportLines += "- **Sucesso:** $($results.HealthCheck.Success)"
$reportLines += ""
$reportLines += "### 🔐 Login (Credenciais Inválidas)"
$reportLines += "- **Status:** $($results.LoginInvalid.Status)"
$reportLines += "- **Código HTTP:** $($results.LoginInvalid.StatusCode) (esperado: 200)"
$reportLines += "- **Sucesso:** $($results.LoginInvalid.Success)"
$reportLines += ""
$reportLines += "### 🔐 Login (Credenciais Válidas)"
$reportLines += "- **Status:** $($results.LoginValid.Status)"
$reportLines += "- **Código HTTP:** $($results.LoginValid.StatusCode) (esperado: 200)"
$reportLines += "- **Sucesso:** $($results.LoginValid.Success)"
$reportLines += "- **Token Obtido:** $(if ($token) { "✅" } else { "❌" })"
$reportLines += ""
$reportLines += "### 👤 Endpoint /me (Protegido)"
$reportLines += "- **Status:** $($results.MeEndpoint.Status)"
$reportLines += "- **Código HTTP:** $($results.MeEndpoint.StatusCode) (esperado: 200)"
$reportLines += "- **Sucesso:** $($results.MeEndpoint.Success)"
if ($results.MeEndpoint.Note) {
    $reportLines += "- **Nota:** $($results.MeEndpoint.Note)"
}
$reportLines += ""
$reportLines += "### 📦 Endpoint /produtos-estoque/ (Protegido)"
$reportLines += "- **Status:** $($results.ProdutosEndpoint.Status)"
$reportLines += "- **Código HTTP:** $($results.ProdutosEndpoint.StatusCode) (esperado: 200)"
$reportLines += "- **Sucesso:** $($results.ProdutosEndpoint.Success)"
if ($results.ProdutosEndpoint.Note) {
    $reportLines += "- **Nota:** $($results.ProdutosEndpoint.Note)"
}
$reportLines += ""
$reportLines += "### 🚫 Endpoints de Draft (Devem estar ausentes)"
$reportLines += "- **/orcamentos/draft:** $($results.OrcamentosDraft.Status) (código: $($results.OrcamentosDraft.StatusCode))"
$reportLines += "- **/clientes/draft:** $($results.ClientesDraft.Status) (código: $($results.ClientesDraft.StatusCode))"
$reportLines += ""
$reportLines += "---"
$reportLines += ""
$reportLines += "## 🎯 Resumo do Corredor Estável"
$reportLines += ""
$reportLines += "### ✅ Endpoints Presentes e Funcionais:"
if ($results.HealthCheck.Success) {
    $reportLines += "- Health Check"
} else {
    $reportLines += "- ❌ Health Check"
}
if ($results.LoginValid.Success) {
    $reportLines += "- Login"
} else {
    $reportLines += "- ❌ Login"
}
if ($results.MeEndpoint.Success) {
    $reportLines += "- /me (protegido)"
} else {
    $reportLines += "- ❌ /me (protegido)"
}
if ($results.ProdutosEndpoint.Success) {
    $reportLines += "- /produtos-estoque/ (protegido)"
} else {
    $reportLines += "- ❌ /produtos-estoque/ (protegido)"
}
$reportLines += ""
$reportLines += "### 🚫 Endpoints Ausentes (Conforme Esperado):"
if ($results.OrcamentosDraft.Success) {
    $reportLines += "- /orcamentos/draft ✅"
} else {
    $reportLines += "- /orcamentos/draft ❌"
}
if ($results.ClientesDraft.Success) {
    $reportLines += "- /clientes/draft ✅"
} else {
    $reportLines += "- /clientes/draft ❌"
}
$reportLines += ""
$reportLines += "---"
$reportLines += ""
$reportLines += "## 📋 Próximos Passos"
$reportLines += ""
$reportLines += "1. **Se todos os testes passaram:** O Corredor Estável está operacional"
$reportLines += "2. **Se há falhas:** Verificar logs do servidor e corrigir endpoints problemáticos"
$reportLines += "3. **Se endpoints de draft estão presentes:** Remover ou desabilitar via Feature Flags"
$reportLines += ""
$reportLines += "---"
$reportLines += ""
$reportLines += "*Relatório gerado automaticamente pelo script http_smoke.ps1*"

$report = $reportLines -join "`n"

# Salvar relatório
$report | Out-File -FilePath $OutputFile -Encoding UTF8
Write-Host "`n📄 Relatório salvo em: $OutputFile" -ForegroundColor Green

# Exibir resumo
Write-Host "`n📊 RESUMO DA AUDITORIA:" -ForegroundColor Yellow
Write-Host "Health Check: $($results.HealthCheck.Status)" -ForegroundColor $(if ($results.HealthCheck.Success) { "Green" } else { "Red" })
Write-Host "Login (inválido): $($results.LoginInvalid.Status)" -ForegroundColor $(if ($results.LoginInvalid.Success) { "Green" } else { "Red" })
Write-Host "Login (válido): $($results.LoginValid.Status)" -ForegroundColor $(if ($results.LoginValid.Success) { "Green" } else { "Red" })
Write-Host "Endpoint /me: $($results.MeEndpoint.Status)" -ForegroundColor $(if ($results.MeEndpoint.Success) { "Green" } else { "Red" })
Write-Host "Endpoint /produtos-estoque/: $($results.ProdutosEndpoint.Status)" -ForegroundColor $(if ($results.ProdutosEndpoint.Success) { "Green" } else { "Red" })
Write-Host "Ausência /orcamentos/draft: $($results.OrcamentosDraft.Status)" -ForegroundColor $(if ($results.OrcamentosDraft.Success) { "Green" } else { "Red" })
Write-Host "Ausência /clientes/draft: $($results.ClientesDraft.Status)" -ForegroundColor $(if ($results.ClientesDraft.Success) { "Green" } else { "Red" })

$allSuccess = $results.Values.Success -notcontains $false
Write-Host "`n🎯 Status Final: $(if ($allSuccess) { "✅ TODOS OS TESTES PASSARAM" } else { "❌ FALHAS DETECTADAS" })" -ForegroundColor $(if ($allSuccess) { "Green" } else { "Red" }) 