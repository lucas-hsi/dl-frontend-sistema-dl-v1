#requires -version 5.1
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Paths
$Root = (Resolve-Path "$PSScriptRoot\..\..").Path
$AuditDir = Join-Path $Root "audit"
$EnvFile = Join-Path $Root ".env"
New-Item -ItemType Directory -Force -Path $AuditDir | Out-Null
$OutFile = Join-Path $AuditDir "env_check.md"

# Helpers
function WriteLine($text) { $text | Out-File $OutFile -Append -Encoding utf8 }

# Header
"# ENV Check - $(Get-Date -Format s)" | Out-File $OutFile -Encoding utf8

if (-not (Test-Path $EnvFile)) {
  WriteLine "- .env nao encontrado em $EnvFile"
  exit 1
}

# Parse .env em hashtable local $cfg (tolerante)
$cfg = @{}
$lines = Get-Content $EnvFile -Encoding UTF8
foreach ($ln in $lines) {
  if ([string]::IsNullOrWhiteSpace($ln)) { continue }
  $t = $ln.Trim()
  if ($t.StartsWith("#")) { continue }
  if ($t -notmatch "^\s*[^=\s]+\s*=") { continue }
  if ($t -match "^\s*([^=\s]+)\s*=\s*(.*)\s*$") {
    $k = $Matches[1]; $v = $Matches[2]
    if ($v.Length -ge 2 -and (($v.StartsWith('"') -and $v.EndsWith('"')) -or ($v.StartsWith("'") -and $v.EndsWith("'")))) {
      $v = $v.Substring(1, $v.Length-2)
    }
    $cfg[$k] = $v
  }
}

WriteLine "## Variaveis criticas"
$required = @("POSTGRES_USER","POSTGRES_PASSWORD","POSTGRES_SERVER","POSTGRES_PORT","POSTGRES_DB","JWT_SECRET")
$missing = $false
foreach ($key in $required) {
  if (-not $cfg.ContainsKey($key) -or [string]::IsNullOrWhiteSpace($cfg[$key])) {
    WriteLine "- FALTA $key"
    $missing = $true
  } else {
    WriteLine "- OK $key"
  }
}

WriteLine ""
WriteLine "## Selecao de Banco"
$hasUri = $cfg.ContainsKey("SQLALCHEMY_DATABASE_URI") -and -not [string]::IsNullOrWhiteSpace($cfg["SQLALCHEMY_DATABASE_URI"])
if ($hasUri) {
  WriteLine ("- Detectado SQLALCHEMY_DATABASE_URI=" + $cfg["SQLALCHEMY_DATABASE_URI"])
  if ($cfg["SQLALCHEMY_DATABASE_URI"].ToLower().StartsWith("sqlite")) {
    WriteLine "- AVISO: Apontando para SQLite (dev). Para PostgreSQL, remova/comente SQLALCHEMY_DATABASE_URI."
  } else {
    WriteLine "- OK usando SQLALCHEMY_DATABASE_URI custom"
  }
} else {
  WriteLine "- Sem SQLALCHEMY_DATABASE_URI: config.py deve montar PostgreSQL automaticamente"
}

# Monta URI (mascarado) e testa TCP via .NET (evita parsing com ':')
$pgUser = $cfg["POSTGRES_USER"]
$pgPass = $cfg["POSTGRES_PASSWORD"]
$pgHost = $cfg["POSTGRES_SERVER"]
$pgPort = [int]($cfg["POSTGRES_PORT"])
$pgDb   = $cfg["POSTGRES_DB"]

$pgUriMasked = "postgresql://${pgUser}:***@${pgHost}:${pgPort}/${pgDb}"

WriteLine ""
WriteLine "## Teste de conexao PostgreSQL (TCP)"
try {
  $client = New-Object System.Net.Sockets.TcpClient
  $iar = $client.BeginConnect($pgHost, $pgPort, $null, $null)
  if (-not $iar.AsyncWaitHandle.WaitOne(3000)) {
    $client.Close()
    throw "Timeout de conexao TCP apos 3s"
  }
  $client.EndConnect($iar)
  if ($client.Connected) {
    WriteLine ("- OK Porta acessivel -> " + $pgUriMasked)
    $client.Close()
  } else {
    WriteLine ("- FALHA Porta inacessivel -> " + $pgUriMasked)
  }
} catch {
  WriteLine ("- FALHA TCP -> " + $_.Exception.Message + " (" + $pgUriMasked + ")")
}

WriteLine ""
WriteLine "## Feature Flags (backend)"
foreach ($f in @("FEATURE_SHOPIFY","FEATURE_MERCADO_LIVRE","FEATURE_NFE")) {
  $val = if ($cfg.ContainsKey($f)) { $cfg[$f] } else { "false" }
  WriteLine ("- " + $f + "=" + $val)
}

WriteLine ""
WriteLine "Concluido."
Write-Host ("Gerado " + $OutFile)
