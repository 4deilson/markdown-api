const express = require('express');
const { convertToHtml, convertToFullHtml, convertToPdfHtml } = require('./markdown');
const { generatePdf } = require('./pdf');

const router = express.Router();

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
      html = req.body;
    } else if (req.body.html) {
      html = req.body.html;
      title = req.body.title || title;
    } else {
      return res.status(400).json({ 
        error: 'Envie o HTML como texto ou JSON com campo "html"' 
      });
    }

    console.log('🔄 Convertendo HTML para PDF...');

    // Gerar PDF
    const pdfBuffer = await generatePdf(html);

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

module.exports = router;
