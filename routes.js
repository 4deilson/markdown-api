const express = require('express');
const multer = require('multer');
const puppeteer = require('puppeteer');
const config = require('./config');
const { convertToHtml, convertToFullHtml, convertToPdfHtml } = require('./markdown');
const { generatePdf } = require('./pdf');

const router = express.Router();

// Configurar multer para uploads em memória
const upload = multer({ storage: multer.memoryStorage() });

// Função utilitária para processar markdown (converter quebras de linha escapadas)
const processMarkdown = (text) => {
  if (!text) return '';
  // Converter \\n para \n reais para quebras de linha, preservando UTF-8
  return text.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r');
};

// Rota para converter markdown simples
router.post('/convert', (req, res) => {
  try {
    let markdown = '';
    
    // Aceita tanto JSON quanto texto plano
    if (typeof req.body === 'string') {
      markdown = processMarkdown(req.body);
    } else if (req.body.markdown) {
      markdown = processMarkdown(req.body.markdown);
    } else {
      return res.status(400).json({ 
        error: 'Envie o markdown como texto ou JSON com campo "markdown"' 
      });
    }

    const html = convertToHtml(markdown);
    
    res.json({
      success: true,
      html: html,
      input_length: markdown.length,
      output_length: html.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao converter markdown',
      details: error.message
    });
  }
});

// Rota para converter com HTML completo + CSS
router.post('/convert/full', (req, res) => {
  try {
    let markdown = '';
    let title = 'Documento';
    
    if (typeof req.body === 'string') {
      markdown = processMarkdown(req.body);
    } else if (req.body.markdown) {
      markdown = processMarkdown(req.body.markdown);
      title = req.body.title || title;
    } else {
      return res.status(400).json({ 
        error: 'Envie o markdown como texto ou JSON com campo "markdown"' 
      });
    }

    const fullHtml = convertToFullHtml(markdown, title);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(fullHtml);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao converter markdown',
      details: error.message
    });
  }
});

// Rota para converter markdown diretamente para PDF (via HTML)
router.post('/convert/pdf', async (req, res) => {
  try {
    let markdown = '';
    let title = 'Documento';
    
    if (typeof req.body === 'string') {
      markdown = processMarkdown(req.body);
    } else if (req.body.markdown) {
      markdown = processMarkdown(req.body.markdown);
      title = req.body.title || title;
    } else {
      return res.status(400).json({ 
        error: 'Envie o markdown como texto ou JSON com campo "markdown"' 
      });
    }

    console.log('🔄 Convertendo markdown para PDF...');
    console.log('📝 Etapa 1: Convertendo Markdown → HTML...');

    // ETAPA 1: Converter markdown para HTML otimizado para PDF
    const fullHtml = convertToPdfHtml(markdown, title);
    
    console.log('📄 Etapa 2: Convertendo HTML → PDF...');

    // ETAPA 2: Gerar PDF a partir do HTML
    const pdfBuffer = await generatePdf(fullHtml);

    console.log('✅ PDF gerado com sucesso via fluxo Markdown → HTML → PDF');

    // Enviar PDF como resposta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${title}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar PDF',
      details: error.message
    });
  }
});

// Rota para converter HTML diretamente para PDF
router.post('/html-to-pdf', async (req, res) => {
  try {
    let html = '';
    let title = 'Documento';
    
    if (typeof req.body === 'string') {
      // Se for string, pode ser JSON escapado ou HTML puro
      try {
        const parsed = JSON.parse(req.body);
        if (parsed.html) {
          html = parsed.html;
          title = parsed.title || title;
        } else {
          html = req.body;
        }
      } catch {
        // Se não for JSON válido, tratar como HTML puro
        html = req.body;
      }
    } else if (req.body.html) {
      html = req.body.html;
      title = req.body.title || title;
    } else {
      return res.status(400).json({ 
        error: 'Envie o HTML como texto ou JSON com campo "html"' 
      });
    }

    // APENAS remover escape de aspas do JSON, preservando tudo o resto
    if (html.includes('\\"')) {
      html = html.replace(/\\"/g, '"');
    }

    console.log('🔄 Convertendo HTML para PDF...');
    console.log(`📏 Tamanho do HTML: ${html.length} caracteres`);

    // Gerar PDF preservando exatamente o HTML original
    const pdfBuffer = await generatePdf(html);

    console.log('✅ PDF gerado com sucesso - HTML preservado integralmente!');

    // Enviar PDF como resposta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${title}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar PDF',
      details: error.message
    });
  }
});

// Rota para converter HTML para PDF com carregamento completo (sem timeout)
router.post('/html-to-pdf-full', async (req, res) => {
  try {
    let html = '';
    let title = 'Documento';
    let waitTime = 0; // Tempo de espera adicional em ms (padrão: 0)
    
    if (typeof req.body === 'string') {
      // Se for string, pode ser JSON escapado ou HTML puro
      try {
        const parsed = JSON.parse(req.body);
        if (parsed.html) {
          html = parsed.html;
          title = parsed.title || title;
          waitTime = parsed.waitTime || 0;
        } else {
          html = req.body;
        }
      } catch {
        // Se não for JSON válido, tratar como HTML puro
        html = req.body;
      }
    } else if (req.body.html) {
      html = req.body.html;
      title = req.body.title || title;
      waitTime = req.body.waitTime || 0;
    } else {
      return res.status(400).json({ 
        error: 'Envie o HTML como texto ou JSON com campo "html"' 
      });
    }

    // APENAS remover escape de aspas do JSON, preservando tudo o resto
    if (html.includes('\\"')) {
      html = html.replace(/\\"/g, '"');
    }

    console.log('🔄 Convertendo HTML para PDF (carregamento completo)...');
    console.log(`📏 Tamanho do HTML: ${html.length} caracteres`);
    if (waitTime > 0) {
      console.log(`⏳ Tempo de espera adicional: ${waitTime}ms`);
    }
    console.log('⏳ ATENÇÃO: Aguardando carregamento COMPLETO da página (sem timeout)');

    // Importar função específica para carregamento completo
    const { generatePdfFullLoad } = require('./pdf');
    const pdfBuffer = await generatePdfFullLoad(html, waitTime);

    console.log('✅ PDF gerado com sucesso - Página carregada completamente!');

    // Enviar PDF como resposta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${title}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('❌ Erro ao gerar PDF com carregamento completo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar PDF',
      details: error.message
    });
  }
});

// Rota para debug: retorna o HTML processado com CSS de impressão (sem gerar PDF)
router.post('/debug-html', async (req, res) => {
  try {
    let html = '';
    let title = 'Documento';
    
    if (typeof req.body === 'string') {
      try {
        const parsed = JSON.parse(req.body);
        if (parsed.html) {
          html = parsed.html;
          title = parsed.title || title;
        } else {
          html = req.body;
        }
      } catch {
        html = req.body;
      }
    } else if (req.body.html) {
      html = req.body.html;
      title = req.body.title || title;
    } else {
      return res.status(400).json({ 
        error: 'Envie o HTML como texto ou JSON com campo "html"' 
      });
    }

    // APENAS remover escape de aspas do JSON
    if (html.includes('\\"')) {
      html = html.replace(/\\"/g, '"');
    }

    console.log('🔍 Gerando HTML processado para debug...');

    // Importar função de injeção de CSS
    const { injectPrintCSS } = require('./pdf');
    const htmlProcessado = injectPrintCSS(html);

    console.log('✅ HTML processado gerado!');

    // Retornar HTML como resposta
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `inline; filename="${title}.html"`);
    res.send(htmlProcessado);

  } catch (error) {
    console.error('❌ Erro ao processar HTML:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar HTML',
      details: error.message
    });
  }
});

// Rota de diagnóstico: verifica fontes disponíveis no container
router.get('/debug-fonts', async (req, res) => {
  try {
    const puppeteer = require('puppeteer');
    const config = require('./config');
    
    console.log('🔍 Iniciando diagnóstico de fontes...');
    
    const browser = await puppeteer.launch(config.PUPPETEER_CONFIG);
    const page = await browser.newPage();
    
    // Criar HTML de teste com diferentes pesos de fonte
    const testHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; }
        .weight-400 { font-weight: 400; }
        .weight-700 { font-weight: 700; }
        .weight-800 { font-weight: 800; }
        .weight-900 { font-weight: 900; }
      </style>
    </head>
    <body>
      <div class="weight-400">Font weight 400 (normal)</div>
      <div class="weight-700">Font weight 700 (bold)</div>
      <div class="weight-800">Font weight 800 (extra-bold)</div>
      <div class="weight-900">Font weight 900 (black)</div>
    </body>
    </html>`;
    
    await page.setContent(testHtml);
    
    // Verificar fontes computadas
    const fontInfo = await page.evaluate(() => {
      const elements = {
        'weight-400': document.querySelector('.weight-400'),
        'weight-700': document.querySelector('.weight-700'),
        'weight-800': document.querySelector('.weight-800'),
        'weight-900': document.querySelector('.weight-900')
      };
      
      const results = {};
      for (const [name, el] of Object.entries(elements)) {
        const computed = window.getComputedStyle(el);
        results[name] = {
          fontFamily: computed.fontFamily,
          fontWeight: computed.fontWeight,
          fontSize: computed.fontSize
        };
      }
      
      return results;
    });
    
    await browser.close();
    
    console.log('✅ Diagnóstico concluído');
    
    res.json({
      success: true,
      message: 'Fontes disponíveis no container',
      fonts: fontInfo,
      note: 'Se fontWeight de 800/900 aparecer como 700, o Chrome não tem essas variações'
    });
    
  } catch (error) {
    console.error('❌ Erro no diagnóstico:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao diagnosticar fontes',
      details: error.message
    });
  }
});

// Rota de diagnóstico avançada - testar renderização real com suas classes
router.post('/debug-render', upload.single('htmlFile'), async (req, res) => {
  try {
    console.log('🎨 Testando renderização real...');
    
    // Obter HTML do arquivo ou do body
    let html;
    if (req.file) {
      html = req.file.buffer.toString('utf8');
    } else if (req.body.html) {
      html = req.body.html;
    } else {
      return res.status(400).json({
        success: false,
        error: 'Nenhum HTML fornecido. Use "htmlFile" (multipart) ou "html" (JSON)'
      });
    }
    
    const browser = await puppeteer.launch(config.PUPPETEER_CONFIG);
    const page = await browser.newPage();
    await page.emulateMediaType('screen');
    await page.setContent(html);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Capturar computed styles de elementos específicos
    const renderInfo = await page.evaluate(() => {
      const selectors = ['.bold-domain', '.boat-name', '.contact-title', 'strong', 'b'];
      const results = {};
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          results[selector] = [];
          elements.forEach((el, idx) => {
            const computed = window.getComputedStyle(el);
            results[selector].push({
              index: idx,
              fontFamily: computed.fontFamily,
              fontWeight: computed.fontWeight,
              fontSize: computed.fontSize,
              textContent: el.textContent.substring(0, 50) // Primeiros 50 chars
            });
          });
        } else {
          results[selector] = 'Não encontrado';
        }
      });
      
      return results;
    });
    
    await browser.close();
    
    res.json({
      success: true,
      message: 'Diagnóstico de renderização',
      elements: renderInfo,
      tip: 'Se fontWeight mostrar valor diferente do esperado, há problema com a fonte ou CSS'
    });
    
  } catch (error) {
    console.error('❌ Erro no diagnóstico de renderização:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
