# Use Node.js 20 LTS como base
FROM node:20-slim

# ========================================
# DEPENDÊNCIAS DO PROJETO
# ========================================
# Principais (dependencies):
# - express (^5.1.0): Framework web para APIs
# - cors (^2.8.5): Middleware para CORS
# - markdown-it (^14.1.0): Parser de Markdown para HTML
# - puppeteer (^24.15.0): Automatização do Chrome para PDFs
# - dotenv (^17.2.1): Carregamento de variáveis de ambiente
# - uuid (^9.0.1): Geração de IDs únicos para arquivos temporários
# - highlight.js (^11.11.1): Syntax highlighting para código
# - chalk (^5.5.0): Coloração de logs no terminal
# - fs-extra (^11.3.0): Operações avançadas de sistema de arquivos
# - yargs (^18.0.0): Parser de argumentos de linha de comando
# 
# TypeScript Types (@types/*):
# - @types/fs-extra (^11.0.4)
# - @types/markdown-it (^14.1.2) 
# - @types/node (^24.2.0)
# - @types/yargs (^17.0.33)
# - typescript (^5.9.2)
#
# Desenvolvimento (devDependencies):
# - @types/highlight.js (^9.12.4)
# - nodemon (^3.1.10): Hot reload para desenvolvimento
# - tsx (^4.20.3): TypeScript executor
# ========================================

# Definir variáveis de ambiente otimizadas para container
ENV NODE_ENV=production
ENV PORT=7000
ENV API_KEY=md-api-ae4a14b70333ce2424fcc5db55a6c00a0255939688adf76f02f6b0e32a9261eb
# Usar Chromium instalado via apt (compatível com amd64 E arm64)
# NOTA: NÃO usar google-chrome-stable — o repositório do Google só tem pacotes amd64,
#       causando falha "E: Unable to locate package" em servidores ARM64.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
# Otimizações para containers
ENV PUPPETEER_DISABLE_DEV_SHM_USAGE=true
ENV CHROME_BIN=/usr/bin/chromium
ENV DISPLAY=:99

# Configurações de locale UTF-8
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8
ENV LANGUAGE=C.UTF-8

# Instalar Chromium e dependências do sistema via apt do Debian.
# O pacote "chromium" está disponível para amd64 e arm64 nos repositórios
# oficiais do Debian, diferente do google-chrome-stable que só tem amd64.
RUN apt-get update && apt-get install -y \
    chromium \
    # Dependências essenciais para Chromium em containers
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libxkbcommon0 \
    libgtk-3-0 \
    libnss3 \
    libxss1 \
    procps \
    locales \
    # Fontes adicionais para PDFs com suporte a bold/heavy weights
    fonts-noto-color-emoji \
    fonts-noto-cjk \
    fonts-roboto \
    fonts-open-sans \
    fonts-liberation2 \
    fonts-dejavu-core \
    # Configurar locale UTF-8
    && echo "C.UTF-8 UTF-8" > /etc/locale.gen \
    && locale-gen \
    # Otimizações para performance
    && mkdir -p /tmp/.X11-unix \
    && chmod 1777 /tmp/.X11-unix \
    # Criar link simbólico para compatibilidade com ambos os nomes de binário
    && ln -sf /usr/bin/chromium /usr/bin/chromium-browser 2>/dev/null || true \
    # Cleanup
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Criar diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências primeiro (para cache do Docker)
COPY package*.json ./

# Instalar dependências do Node.js
# Incluindo todas as dependências: express, cors, markdown-it, puppeteer, 
# dotenv, uuid, highlight.js, chalk, fs-extra, yargs e seus types
RUN npm ci --only=production && npm cache clean --force

# Copiar código da aplicação (arquivos modulares)
COPY server.js ./
COPY config.js ./
COPY auth.js ./
COPY routes.js ./
COPY markdown.js ./
COPY pdf.js ./
COPY documentation.js ./
COPY tempFiles.js ./
# Copiar documentação, mas não o .env (usar variáveis do container)
COPY README.md ./

# Criar usuário não-root para segurança
RUN groupadd -r appuser && useradd -r -g appuser appuser \
    && mkdir -p /home/appuser/.local/share/applications \
    && mkdir -p /home/appuser/.config/google-chrome \
    && chown -R appuser:appuser /home/appuser \
    && chown -R appuser:appuser /app

# Mudar para usuário não-root
USER appuser

# Expor a porta da aplicação
EXPOSE 7000

# Health check melhorado para container com Puppeteer
HEALTHCHECK --interval=60s --timeout=30s --start-period=15s --retries=3 \
    CMD node -e "const http = require('http'); \
        const options = { hostname: 'localhost', port: 7000, path: '/health', timeout: 10000 }; \
        const req = http.request(options, (res) => { \
            if (res.statusCode === 200) { console.log('API OK'); process.exit(0); } \
            else { console.log('API FAIL'); process.exit(1); } \
        }); \
        req.on('error', () => { console.log('API ERROR'); process.exit(1); }); \
        req.end();"

# Comando para iniciar a aplicação
CMD ["node", "server.js"]
