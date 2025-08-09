# Script para rebuild completo do Docker com correções do Puppeteer
Write-Host "🐳 Rebuilding Docker com correções do Puppeteer..." -ForegroundColor Cyan

# Parar e remover containers existentes
Write-Host "📦 Parando containers existentes..." -ForegroundColor Yellow
docker-compose down

# Remover imagem existente para forçar rebuild
Write-Host "🗑️ Removendo imagem antiga..." -ForegroundColor Yellow
docker image rm markdown-api_markdown-api 2>$null
docker image rm markdown-api-markdown-api 2>$null

# Limpar cache do Docker
Write-Host "🧹 Limpando cache do Docker..." -ForegroundColor Yellow
docker system prune -f

# Build da nova imagem
Write-Host "🔨 Building nova imagem..." -ForegroundColor Green
docker-compose build --no-cache

# Iniciar o serviço
Write-Host "🚀 Iniciando serviço..." -ForegroundColor Green
docker-compose up -d

# Aguardar inicialização
Write-Host "⏳ Aguardando inicialização (20s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

# Testar health check
Write-Host "🔍 Testando health check..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:7000/health" -Method Get
    Write-Host "✅ Health check OK: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro no health check: $($_.Exception.Message)" -ForegroundColor Red
}

# Testar conversão PDF
Write-Host "📄 Testando conversão PDF..." -ForegroundColor Cyan
try {
    $body = @{
        markdown = "# Teste Docker`n`nEste é um **teste** da API com Docker corrigido!`n`n- Item 1`n- Item 2`n`n> Citação de teste"
        title = "Teste-Docker-PDF"
    } | ConvertTo-Json

    $headers = @{
        "Content-Type" = "application/json"
    }

    Invoke-RestMethod -Uri "http://localhost:7000/convert/pdf" -Method Post -Body $body -Headers $headers -OutFile "teste-docker-pdf.pdf"
    Write-Host "✅ PDF gerado com sucesso: teste-docker-pdf.pdf" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro na conversão PDF: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Detalhes: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

# Mostrar logs se houver erro
Write-Host "`n📋 Logs do container:" -ForegroundColor Cyan
docker-compose logs --tail=20

Write-Host "`n🎉 Rebuild completo! Acesse: http://localhost:7000" -ForegroundColor Green
