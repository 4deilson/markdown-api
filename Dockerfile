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
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
# Otimizações para containers
ENV PUPPETEER_DISABLE_DEV_SHM_USAGE=true
ENV CHROME_BIN=/usr/bin/google-chrome-stable
ENV DISPLAY=:99

# Configurações de locale UTF-8
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8
ENV LANGUAGE=C.UTF-8

# Instalar dependências do sistema e Chrome para Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    libxss1 \
    locales \
    # Configurar locale UTF-8
    && echo "C.UTF-8 UTF-8" > /etc/locale.gen \
    && locale-gen \
    # Adicionar repositório do Google Chrome
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    # Dependências essenciais para Puppeteer em containers
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
    libasound2 \
    # Fontes adicionais para PDFs
    fonts-noto-color-emoji \
    fonts-noto-cjk \
    # Otimizações para performance
    && mkdir -p /tmp/.X11-unix \
    && chmod 1777 /tmp/.X11-unix \
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
COPY exemplo.md ./

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
