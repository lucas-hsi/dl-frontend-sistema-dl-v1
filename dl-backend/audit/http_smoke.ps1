# Apague
Remove-Item .\scripts\audit\http_smoke.ps1 -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path .\scripts\audit | Out-Null

# Recrie (mínimo e sem emojis)
$code = @'
#requires -version 5.1
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Pastas de auditoria
$Root = (Resolve-Path "$PSScriptRoot\..\..").Path
$AuditDir = Join-Path $Root "audit"
New-Item -ItemType Directory -Force -Path $AuditDir | Out-Null
$OutFile = Join-Path $AuditDir "http_smoke.md"

function W($t){ $t | Out-File $OutFile -Append -Encoding utf8 }

# Cliente HTTP simples
function Hit {
    param(
        [Parameter(Mandatory=$true)][ValidateSet("GET","POST","PUT","PATCH","DELETE")] [string]$Method,
        [Parameter(Mandatory=$true)][string]$Url,
        [Parameter(Mandatory=$false)]$Body = $null,
        [hashtable]$Headers = $null
    )
    $code = -1
    $text = ""
    try {
        if ($Body -ne $null) {
            $json = $Body | ConvertTo-Json -Depth 8
            $resp = Invoke-WebRequest -Method $Method -Uri $Url -Body $json -ContentType "application/json" -Headers $Headers -SkipCertificateCheck -ErrorAction Stop
        } else {
            $resp = Invoke-WebRequest -Method $Method -Uri $Url -Headers $Headers -SkipCertificateCheck -ErrorAction Stop
        }
        $code = [int]$resp.StatusCode
        $text = $resp.Content
    } catch {
        if ($_.Exception.Response) {
            $code = [int]$_.Exception.Response.StatusCode.value__
            try {
                $sr = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $text = $sr.ReadToEnd()
            } catch {
                $text = $_.Exception.Message
            }
        } else {
            $text = $_.Exception.Message
        }
    }
    $bodyPreview = if ($text.Length -gt 300) { $text.Substring(0,300) + "..." } else { $text }
    W ("- {0} {1} -> {2}`n  body: {3}" -f $Method, $Url, $code, ($bodyPreview -replace "`r`n"," "))
    return @{ Code=$code; Body=$text }
}

# Base URL
$BASE = $env:BASE_URL
if ([string]::IsNullOrWhiteSpace($BASE)) { $BASE = "http://127.0.0.1:8000" }

"# HTTP Smoke - $(Get-Date -Format s)" | Out-File $OutFile -Encoding utf8
W "BASE_URL = $BASE"

# 1) Health
W ""
W "## Health"
Hit -Method GET -Url "$BASE/__health" | Out-Null
Hit -Method GET -Url "$BASE/api/v1/utils/health-check" | Out-Null

# 2) Login
W ""
W "## Login"
$loginBody = @{ email = "admin@example.com"; password = "changeme" }  # ajuste se tiver usuario valido
$login = Hit -Method POST -Url "$BASE/api/v1/auth/login" -Body $loginBody

$token = $null
if ($login.Code -eq 200 -and $login.Body) {
    try {
        $loginJson = $login.Body | ConvertFrom-Json -ErrorAction Stop
        if ($loginJson.access_token) { $token = $loginJson.access_token }
        elseif ($loginJson.data -and $loginJson.data.access_token) { $token = $loginJson.data.access_token }
        elseif ($loginJson.data -and $loginJson.data.token) { $token = $loginJson.data.token }
    } catch { }
}
if ($token) { W "- Token obtido." } else { W "- Sem token (codigo=$($login.Code)). Seguiremos com testes sem autenticar." }

# 3) /me
W ""
W "## /api/v1/me"
if ($token) {
    $headers = @{ Authorization = "Bearer $token" }
    $r = Hit -Method GET -Url "$BASE/api/v1/me" -Headers $headers
} else {
    W "- pulado (sem token)"
}

# 4) /produtos-estoque/ (paginado)
W ""
W "## /api/v1/produtos-estoque/"
if ($token) {
    $headers = @{ Authorization = "Bearer $token" }
    $r = Hit -Method GET -Url "$BASE/api/v1/produtos-estoque/?page=1&size=5" -Headers $headers
} else {
    $r = Hit -Method GET -Url "$BASE/api/v1/produtos-estoque/?page=1&size=5"
}

# 5) Presenca de rotas do Corredor Estavel
W ""
W "## Rotas esperadas do corredor (checagem de presenca)"
Hit -Method POST -Url "$BASE/orcamentos/draft" -Body @{ test = 1 } | Out-Null
Hit -Method POST -Url "$BASE/clientes/draft"   -Body @{ test = 1 } | Out-Null
W "Se retornarem 404 ou 405, confirmamos gap a implementar."

W ""
W "Concluido."
'@
Set-Content -Path .\scripts\audit\http_smoke.ps1 -Value $code -Encoding ascii
