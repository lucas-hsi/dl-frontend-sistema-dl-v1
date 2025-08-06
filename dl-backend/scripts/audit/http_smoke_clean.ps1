#requires -version 5.1
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = (Resolve-Path "$PSScriptRoot\..\..").Path
$AuditDir = Join-Path $Root "audit"
New-Item -ItemType Directory -Force -Path $AuditDir | Out-Null
$OutFile = Join-Path $AuditDir "http_smoke.md"

function W($t){ $t | Out-File $OutFile -Append -Encoding utf8 }

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
            $resp = Invoke-WebRequest -Method $Method -Uri $Url -Body $json -ContentType "application/json" -Headers $Headers -ErrorAction Stop
        } else {
            $resp = Invoke-WebRequest -Method $Method -Uri $Url -Headers $Headers -ErrorAction Stop
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

$BASE = $env:BASE_URL
if ([string]::IsNullOrWhiteSpace($BASE)) { $BASE = "http://127.0.0.1:8000" }

"# HTTP Smoke - $(Get-Date -Format s)" | Out-File $OutFile -Encoding utf8
W "BASE_URL = $BASE"

W ""
W "## Health"
Hit -Method GET -Url "$BASE/__health" | Out-Null
Hit -Method GET -Url "$BASE/api/v1/utils/health-check" | Out-Null

W ""
W "## Login"
$loginBody = @{ email = "admin@example.com"; password = "changeme" }
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

W ""
W "## /api/v1/me"
if ($token) {
    $headers = @{ Authorization = "Bearer $token" }
    Hit -Method GET -Url "$BASE/api/v1/me" -Headers $headers | Out-Null
} else {
    W "- pulado (sem token)"
}

W ""
W "## /api/v1/produtos-estoque/"
if ($token) {
    $headers = @{ Authorization = "Bearer $token" }
    Hit -Method GET -Url "$BASE/api/v1/produtos-estoque/?page=1&size=5" -Headers $headers | Out-Null
} else {
    Hit -Method GET -Url "$BASE/api/v1/produtos-estoque/?page=1&size=5" | Out-Null
}

W ""
W "## Rotas esperadas do corredor (checagem de presenca)"
Hit -Method POST -Url "$BASE/orcamentos/draft" -Body @{ test = 1 } | Out-Null
Hit -Method POST -Url "$BASE/clientes/draft"   -Body @{ test = 1 } | Out-Null
W "Se retornarem 404 ou 405, confirmamos gap a implementar."

W ""
W "Concluido." 