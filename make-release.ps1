# ==============================================================
# make-release.ps1
#
# Gera um arquivo .tar.gz com os arquivos necessarios para deploy
# da aplicacao markdown-api.
#
# Como usar:
#   .\make-release.ps1
#   .\make-release.ps1 -Version "1.2.0"
#   .\make-release.ps1 -OutputDir "C:\releases"
#
# O arquivo gerado contera apenas os arquivos necessarios para
# subir o container Docker (sem node_modules, logs, .git, etc).
# Depois de transferir para o servidor, execute:
#   docker compose up -d --build
# ==============================================================

param(
    # Versao do release. Se nao informado, usa a data/hora atual.
    [string]$Version = "",

    # Diretorio de saida do arquivo .tar.gz. Padrao: dentro da propria pasta do projeto.
    [string]$OutputDir = "."
)

# ---------------------------------------------------------------
# Configuracoes
# ---------------------------------------------------------------

# Nome base do projeto (usado no nome do arquivo gerado)
$ProjectName = "markdown-api"

# Resolve o diretorio raiz do projeto (onde este script esta)
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition

# Monta o sufixo de versao ou timestamp
if ($Version -eq "") {
    # Formato: YYYYMMDD_HHmm
    $Timestamp = Get-Date -Format "yyyyMMdd_HHmm"
    $ReleaseName = "${ProjectName}_${Timestamp}"
} else {
    $ReleaseName = "${ProjectName}_v${Version}"
}

# Arquivo de saida final
$OutputDir = Resolve-Path $OutputDir
$OutputFile = Join-Path $OutputDir "${ReleaseName}.tar.gz"

# ---------------------------------------------------------------
# Arquivos a INCLUIR no pacote
# Apenas os arquivos essenciais para build + execucao Docker.
# ---------------------------------------------------------------
$IncludeItems = @(
    "server.js",
    "config.js",
    "auth.js",
    "routes.js",
    "markdown.js",
    "pdf.js",
    "documentation.js",
    "tempFiles.js",
    "package.json",
    "package-lock.json",
    "Dockerfile",
    "docker-compose.yml",
    ".dockerignore",
    ".env",
    "README.md",
    # Arquivos de deploy para o Portainer
    "portainer-stack.yml",
    "portainer-stack.env"
)

# ---------------------------------------------------------------
# Validacoes iniciais
# ---------------------------------------------------------------

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Gerando release: $ReleaseName" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se tar esta disponivel (Windows 10 1803+ ja vem com tar nativo)
if (-not (Get-Command tar -ErrorAction SilentlyContinue)) {
    Write-Host "[ERRO] O comando 'tar' nao foi encontrado." -ForegroundColor Red
    Write-Host "       Instale o Git for Windows ou WSL para ter o tar disponivel." -ForegroundColor Red
    exit 1
}

# Verificar se o diretorio de saida existe
if (-not (Test-Path $OutputDir)) {
    Write-Host "[ERRO] Diretorio de saida nao encontrado: $OutputDir" -ForegroundColor Red
    exit 1
}

# ---------------------------------------------------------------
# Verificar quais arquivos existem antes de empacotar
# ---------------------------------------------------------------

Write-Host "Arquivos que serao incluidos no pacote:" -ForegroundColor Yellow
$FilesToPack = @()
$MissingFiles = @()

foreach ($Item in $IncludeItems) {
    $FullPath = Join-Path $ProjectRoot $Item
    if (Test-Path $FullPath) {
        Write-Host "  [OK] $Item" -ForegroundColor Green
        $FilesToPack += $Item
    } else {
        Write-Host "  [AVISO] Nao encontrado (sera ignorado): $Item" -ForegroundColor DarkYellow
        $MissingFiles += $Item
    }
}

Write-Host ""

# Avisar sobre .env se nao existir
if ($MissingFiles -contains ".env") {
    Write-Host "[AVISO] O arquivo .env nao foi encontrado e NAO sera incluido." -ForegroundColor Yellow
    Write-Host "         Lembre-se de configurar as variaveis de ambiente no servidor!" -ForegroundColor Yellow
    Write-Host ""
}

if ($FilesToPack.Count -eq 0) {
    Write-Host "[ERRO] Nenhum arquivo valido encontrado para empacotar." -ForegroundColor Red
    exit 1
}

# ---------------------------------------------------------------
# Gerar o arquivo .tar.gz
# ---------------------------------------------------------------

Write-Host "Gerando arquivo: $OutputFile" -ForegroundColor Cyan

# Muda para o diretorio raiz do projeto para que os caminhos
# dentro do tar sejam relativos (sem caminho absoluto completo)
Push-Location $ProjectRoot

try {
    # Cria o arquivo tar.gz com os arquivos listados
    $TarArgs = @("-czf", $OutputFile) + $FilesToPack
    & tar $TarArgs

    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "[ERRO] Falha ao criar o arquivo tar.gz (codigo: $LASTEXITCODE)" -ForegroundColor Red
        exit 1
    }
} finally {
    Pop-Location
}

# ---------------------------------------------------------------
# Resultado final
# ---------------------------------------------------------------

$FileSize = (Get-Item $OutputFile).Length
$FileSizeKB = [math]::Round($FileSize / 1KB, 1)

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Release gerado com sucesso!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Arquivo : $OutputFile" -ForegroundColor White
Write-Host "  Tamanho : ${FileSizeKB} KB" -ForegroundColor White
Write-Host "  Itens   : $($FilesToPack.Count) arquivos" -ForegroundColor White
Write-Host ""
Write-Host "Proximos passos no servidor:" -ForegroundColor Cyan
Write-Host "  1. Copie o arquivo para o servidor" -ForegroundColor White
Write-Host "  2. tar -xzf ${ReleaseName}.tar.gz -C /opt/$ProjectName" -ForegroundColor White
Write-Host "  3. cd /opt/$ProjectName" -ForegroundColor White
Write-Host "  4. docker compose up -d --build" -ForegroundColor White
Write-Host ""
