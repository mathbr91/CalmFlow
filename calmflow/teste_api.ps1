# 🧪 Script de Teste - API CalmFlow (Windows PowerShell)
# Testa os endpoints da API com Invoke-WebRequest

$API_URL = "http://localhost:8000/api/v1"
$ContentType = "application/json"

Write-Host "=========================================="  -ForegroundColor Cyan
Write-Host "🧪 CalmFlow API Testing Script"  -ForegroundColor Cyan
Write-Host "=========================================="  -ForegroundColor Cyan
Write-Host ""

# Verificar se servidor está rodando
Write-Host "[INFO] Verificando se servidor está rodando..."  -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/" -ErrorAction SilentlyContinue
    Write-Host "✓ Servidor está online!"  -ForegroundColor Green
} catch {
    Write-Host "✗ Servidor NÃO está respondendo. Inicie com: python manage.py runserver"  -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=========================================="  -ForegroundColor Cyan
Write-Host "1️⃣  TESTE: Endpoint SOS (sem autenticação)"  -ForegroundColor Cyan
Write-Host "=========================================="  -ForegroundColor Cyan
Write-Host "GET $API_URL/sos/"  -ForegroundColor Blue
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "$API_URL/sos/" `
        -Method Get `
        -ContentType $ContentType
    $response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
} catch {
    Write-Host "Erro: $($_.Exception.Message)"  -ForegroundColor Red
}

Write-Host ""
Write-Host "=========================================="  -ForegroundColor Cyan
Write-Host "2️⃣  TESTE: Criar Emergência - Sintoma RESPIRAÇÃO"  -ForegroundColor Cyan
Write-Host "=========================================="  -ForegroundColor Cyan
Write-Host "POST $API_URL/emergencias/"  -ForegroundColor Blue
Write-Host ""

$body = @{
    "sintoma_principal" = "respiracao"
    "ambiente_seguro" = $true
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$API_URL/emergencias/" `
        -Method Post `
        -ContentType $ContentType `
        -Body $body
    $response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
} catch {
    Write-Host "Erro: $($_.Exception.Message)"  -ForegroundColor Red
}

Write-Host ""
Write-Host "=========================================="  -ForegroundColor Cyan
Write-Host "3️⃣  TESTE: Criar Emergência - Sintoma PEITO"  -ForegroundColor Cyan
Write-Host "=========================================="  -ForegroundColor Cyan
Write-Host "POST $API_URL/emergencias/"  -ForegroundColor Blue
Write-Host ""

$body = @{
    "sintoma_principal" = "peito"
    "ambiente_seguro" = $false
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$API_URL/emergencias/" `
        -Method Post `
        -ContentType $ContentType `
        -Body $body
    $response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
} catch {
    Write-Host "Erro: $($_.Exception.Message)"  -ForegroundColor Red
}

Write-Host ""
Write-Host "=========================================="  -ForegroundColor Cyan
Write-Host "4️⃣  TESTE: Criar Emergência - Sintoma MEDO"  -ForegroundColor Cyan
Write-Host "=========================================="  -ForegroundColor Cyan
Write-Host "POST $API_URL/emergencias/"  -ForegroundColor Blue
Write-Host ""

$body = @{
    "sintoma_principal" = "medo"
    "ambiente_seguro" = $true
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$API_URL/emergencias/" `
        -Method Post `
        -ContentType $ContentType `
        -Body $body
    $response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
} catch {
    Write-Host "Erro: $($_.Exception.Message)"  -ForegroundColor Red
}

Write-Host ""
Write-Host "=========================================="  -ForegroundColor Cyan
Write-Host "5️⃣  TESTE: Criar Emergência - Sintoma CONFUSÃO"  -ForegroundColor Cyan
Write-Host "=========================================="  -ForegroundColor Cyan
Write-Host "POST $API_URL/emergencias/"  -ForegroundColor Blue
Write-Host ""

$body = @{
    "sintoma_principal" = "confusao"
    "ambiente_seguro" = $true
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$API_URL/emergencias/" `
        -Method Post `
        -ContentType $ContentType `
        -Body $body
    $response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
} catch {
    Write-Host "Erro: $($_.Exception.Message)"  -ForegroundColor Red
}

Write-Host ""
Write-Host "=========================================="  -ForegroundColor Cyan
Write-Host "📝 RESUMO DOS TESTES"  -ForegroundColor Cyan
Write-Host "=========================================="  -ForegroundColor Cyan
Write-Host "✓ /api/v1/sos/ - Retorna números de emergência + hospitais"  -ForegroundColor Green
Write-Host "✓ POST /api/v1/emergencias/ - Retorna técnica sugerida"  -ForegroundColor Green
Write-Host ""
Write-Host "Endpoints Autenticados:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Para testes interativos, use:"  -ForegroundColor Blue
Write-Host "  - Postman (recomendado)"  -ForegroundColor Blue
Write-Host "  - Insomnia"  -ForegroundColor Blue
Write-Host "  - Thunder Client (VS Code)"  -ForegroundColor Blue
