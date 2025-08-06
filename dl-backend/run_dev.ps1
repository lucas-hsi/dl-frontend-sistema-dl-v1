Param([switch]$NoReload)
Set-Location -Path $PSScriptRoot
if (Test-Path ".\.venv\Scripts\Activate.ps1") { . .\.venv\Scripts\Activate.ps1 }
$reload = $NoReload.IsPresent ? "" : "--reload --reload-dir app --reload-excludes scripts"
python -m uvicorn app.main:app $reload --host 0.0.0.0 --port 8001
