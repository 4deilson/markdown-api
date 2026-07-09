const express = require('express');
const cors = require('cors');

// Configurar encoding UTF-8 para Node.js
process.env.NODE_OPTIONS = '--input-type=module';
if (process.platform === 'win32') {
  process.env.CHCP = '65001'; // UTF-8 no Windows
}

// Importar módulos

const config = require('./config');
const authMiddleware = require('./auth');
const { getDocumentationHtml } = require('./documentation');
const routes = require('./routes');
const { setupAutoCleanup } = require('./tempFiles');
const multer = require('multer');
const { generatePdf } = require('./pdf');

const app = express();
const upload = multer({ dest: config.TEMP_DIR || 'tmp/' });
// Rota para upload de arquivo HTML e conversão para PDF
app.post('/upload-html-to-pdf', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Envie um arquivo HTML no campo "file".' });
    }
    const fs = require('fs');
    const path = require('path');
    const html = fs.readFileSync(req.file.path, 'utf8');
    // Remove arquivo temporário após leitura
    fs.unlink(req.file.path, () => {});
    const pdfBuffer = await generatePdf(html);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${(req.file.originalname || 'documento').replace(/\.html?$/i, '')}.pdf"`
    });
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao converter HTML para PDF', details: err.message });
  }
});



// Configurar limpeza automática de arquivos temporários
setupAutoCleanup();

// Configurar middleware
app.use(cors());

// Configurar parsing de JSON e texto com UTF-8 explícito
app.use(express.json({ 
  limit: config.MAX_REQUEST_SIZE,
  type: 'application/json',
  charset: 'utf-8'
}));

app.use(express.text({ 
  limit: config.MAX_REQUEST_SIZE,
  type: 'text/plain',
  charset: 'utf-8'
}));

// Configurar charset padrão para respostas
app.use((req, res, next) => {
  res.charset = 'utf-8';
  next();
});

// Aplicar middleware de autenticação
app.use(authMiddleware);

// Rota principal - documentação HTML
app.get('/', (req, res) => {
  const documentationHtml = getDocumentationHtml(req);
  res.send(documentationHtml);
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    tempDir: config.TEMP_DIR,
    host: config.getHost(),
    baseUrl: config.getBaseUrl(req)
  });
});

// Usar as rotas de conversão
app.use('/', routes);

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    available_routes: [
      'GET /', 
      'POST /convert (🔐)', 
      'POST /convert/full (🔐)', 
      'POST /convert/pdf (🔐)',
      'POST /html-to-pdf (🔐)',
      'POST /html-to-pdf-full (🔐⏳)',
      'POST /upload-html-to-pdf (🔐)',
      'POST /debug-html (🔐🔍)',
      'GET /health'
    ],
    note: '🔐 = Requer API Key | ⏳ = Carregamento completo | 🔍 = Debug (retorna HTML processado)'
  });
});

// Iniciar servidor
app.listen(config.PORT, () => {
  const host = config.getHost();
  const baseUrl = config.getBaseUrl();
  
  console.log(`🚀 API rodando na porta ${config.PORT}`);
  console.log(`🌐 Host detectado: ${host}`);
  console.log(`📖 Documentação: ${baseUrl}`);
  console.log(`🔐 API Key: ${config.API_KEY}`);
  console.log(`📁 Diretório temporário: ${config.TEMP_DIR}`);
  console.log(`\n📋 Endpoints disponíveis:`);
  console.log(`   🔄 Converter: POST ${baseUrl}/convert`);
  console.log(`   📄 HTML completo: POST ${baseUrl}/convert/full`);
  console.log(`   📑 PDF direto: POST ${baseUrl}/convert/pdf`);
  console.log(`   🔗 HTML para PDF: POST ${baseUrl}/html-to-pdf`);
  console.log(`   ⏳ HTML→PDF (full load): POST ${baseUrl}/html-to-pdf-full`);
  console.log(`   📆 Upload HTML→PDF: POST ${baseUrl}/upload-html-to-pdf`);
  console.log(`   🔍 Debug HTML: POST ${baseUrl}/debug-html`);
  console.log(`   ❤️ Health check: ${baseUrl}/health`);
  console.log(`\n💡 Para usar endpoints protegidos, inclua:`);
  console.log(`   Authorization: Bearer ${config.API_KEY}`);
});
