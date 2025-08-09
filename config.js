// Configurações da aplicação
require('dotenv').config();
const path = require('path');
const os = require('os');

// Função para obter o host baseado no ambiente
const getHost = () => {
  // Se estiver rodando em container/cloud, usar variável de ambiente
  if (process.env.HOST) {
    return process.env.HOST;
  }
  
  // Se tiver domínio configurado
  if (process.env.DOMAIN) {
    return process.env.DOMAIN;
  }
  
  // Detectar IP local se não for localhost
  if (process.env.NODE_ENV === 'production' || process.env.USE_LOCAL_IP === 'true') {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
      for (const iface of networkInterfaces[interfaceName]) {
        // Pegar o primeiro IP IPv4 não-loopback
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  }
  
  // Fallback para localhost
  return 'localhost';
};

// Função para construir URL base completa
const getBaseUrl = (req = null) => {
  const port = process.env.PORT || 7000;
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
  
  // Se tiver request, usar o host do request (melhor opção)
  if (req) {
    const host = req.get('host');
    return `${protocol}://${host}`;
  }
  
  // Senão, usar configuração manual
  const host = getHost();
  const portSuffix = (port === 80 && protocol === 'http') || (port === 443 && protocol === 'https') ? '' : `:${port}`;
  
  return `${protocol}://${host}${portSuffix}`;
};

module.exports = {
  PORT: process.env.PORT || 7000,
  API_KEY: process.env.API_KEY ,
  MAX_REQUEST_SIZE: process.env.MAX_REQUEST_SIZE || '10mb',
  REQUEST_TIMEOUT: process.env.REQUEST_TIMEOUT || 15000,
  
  // Diretório temporário para arquivos gerados
  TEMP_DIR: path.join(os.tmpdir(), 'markdown-api-temp'),
  
  // Funções para URLs dinâmicas
  getHost,
  getBaseUrl,
  
  PUPPETEER_CONFIG: {
    headless: 'new', // Usar novo modo headless
    timeout: 60000, // Timeout aumentado para 60s
    args: [
      // Configurações essenciais para containers
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-extensions',
      '--disable-features=VizDisplayCompositor',
      
      // Performance e estabilidade
      '--no-first-run',
      '--no-zygote',
      // Removido --single-process que pode causar problemas
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-features=TranslateUI',
      '--disable-ipc-flooding-protection',
      '--disable-web-security',
      '--disable-crash-reporter',
      '--disable-component-extensions-with-background-pages',
      
      // Configurações de memória para containers
      '--memory-pressure-off',
      '--max_old_space_size=512', // Reduzir memória para containers
      '--js-flags=--max-old-space-size=512',
      
      // Desabilitar recursos desnecessários em containers
      '--disable-accelerated-2d-canvas',
      '--disable-software-rasterizer',
      '--disable-background-networking',
      '--disable-default-apps',
      '--disable-sync',
      '--metrics-recording-only',
      '--no-default-browser-check',
      
      // Configurações adicionais para estabilidade
      '--disable-features=VizDisplayCompositor,AudioServiceOutOfProcess',
      '--disable-background-media-suspend',
      '--disable-client-side-phishing-detection',
      '--disable-sync',
      '--disable-translate',
      '--hide-scrollbars',
      '--mute-audio',
      '--no-default-browser-check',
      '--no-pings',
      '--disable-plugins-discovery',
      '--disable-preconnect'
    ],
    // Usar Chrome instalado no container
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable',
    
    // Configurações otimizadas para container
    defaultViewport: {
      width: 1024,
      height: 768,
      deviceScaleFactor: 1
    },
    
    // Configurações específicas para container - MAIS CONSERVADORAS
    pipe: false, // Usar WebSocket em vez de pipes para mais estabilidade
    dumpio: false, // Desabilitar logs verbosos
    handleSIGINT: false, // Deixar o container gerenciar sinais
    handleSIGTERM: false,
    handleSIGHUP: false,
    // Tentar várias vezes antes de falhar
    waitForInitialPage: true,
    ignoreHTTPSErrors: true
  },
  
  PDF_OPTIONS: {
    format: 'A4',
    margin: {
      top: '2cm',
      right: '2cm',
      bottom: '2cm',
      left: '2cm'
    },
    printBackground: true,
    preferCSSPageSize: true,
    // Configurações otimizadas para containers
    timeout: 30000, // 30 segundos timeout
    omitBackground: false,
    scale: 1,
    displayHeaderFooter: false,
    // Aguardar carregamento completo
    waitUntil: 'networkidle0'
  }
};
