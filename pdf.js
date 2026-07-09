const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require('./config');
const { generateTempFilePath, cleanupFile } = require('./tempFiles');

// CSS para impressão perfeita (sem margens, com fundos)
const PRINT_CSS = `
<style id="perfect-print-css">
  /* Importar fontes com todos os pesos necessários */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap');
  
  @page {
    margin: 0 !important;
    size: A4;
  }
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    border: none !important;
    outline: none !important;
  }
  
  /* Fallback para fontes que não têm weights 800/900 */
  /* Se Avenir Next não tiver o peso, usar Inter que tem */
  @supports (font-variation-settings: normal) {
    [style*="font-weight: 800"],
    [style*="font-weight: 900"],
    .boat-name,
    .contact-title,
    .bold-domain {
      font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif !important;
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      text-rendering: optimizeLegibility !important;
    }
  }
  
  /* Forçar renderização de font-weights altos para todos os navegadores */
  [style*="font-weight: 800"],
  [style*="font-weight: 900"],
  .boat-name,
  .contact-title,
  .bold-domain {
    font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
    text-rendering: optimizeLegibility !important;
  }
  
  @media print {
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
    }
  }
</style>
`;

// Função para injetar CSS de impressão no HTML
const injectPrintCSS = (html) => {
  // Se já tiver <head>, injetar antes do </head>
  if (html.includes('</head>')) {
    return html.replace('</head>', `${PRINT_CSS}</head>`);
  }
  // Se tiver <html> mas não <head>, criar head
  if (html.includes('<html')) {
    return html.replace('<html', `<html><head>${PRINT_CSS}</head>`);
  }
  // Se não tiver estrutura HTML, envolver
  return `<!DOCTYPE html><html><head>${PRINT_CSS}</head><body>${html}</body></html>`;
};

// Função para gerar PDF a partir de HTML
const generatePdf = async (html) => {
  let browser;
  let page;
  let tempHtmlFile = null;
  
  try {
    console.log('🔄 Iniciando geração de PDF...');

    // Injetar CSS de impressão perfeita
    const htmlWithPrintCSS = injectPrintCSS(html);

    // Criar arquivo HTML temporário
    tempHtmlFile = generateTempFilePath('.html');
    fs.writeFileSync(tempHtmlFile, htmlWithPrintCSS, 'utf8');    

    console.log('🚀 Lançando browser...');
    browser = await puppeteer.launch(config.PUPPETEER_CONFIG);    
    
    console.log('📄 Criando nova página...');
    page = await browser.newPage();
    
    // Emular mídia de impressão como screen para preservar estilos de fonte
    await page.emulateMediaType('screen');
    
    // Configurar timeout da página
    page.setDefaultNavigationTimeout(30000);
    page.setDefaultTimeout(30000);
    
    // Desabilitar JavaScript se não necessário (para performance)
    await page.setJavaScriptEnabled(false);
    
    // Carregar o arquivo HTML temporário
    console.log(`🔄 Carregando HTML: file://${tempHtmlFile}`);
    await page.goto(`file://${tempHtmlFile}`, { 
      waitUntil: config.PDF_OPTIONS.waitUntil || 'networkidle0',
      timeout: 30000
    });
    
    console.log('📑 Gerando PDF...');
    const pdfBuffer = await page.pdf({
      ...config.PDF_OPTIONS,
      timeout: 30000 // Timeout específico para PDF
    });
    
    console.log('🔒 Fechando browser...');
    await page.close();
    await browser.close();
    browser = null;
    page = null;
    
    // Limpar arquivo HTML temporário
    cleanupFile(tempHtmlFile);
    
    console.log('✅ PDF gerado com sucesso!');
    return pdfBuffer;
    
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error.message);
    
    // Cleanup mais robusto
    try {
      if (page) {
        await page.close().catch(() => {});
      }
      if (browser) {
        await browser.close().catch(() => {});
      }
    } catch (cleanupError) {
      console.error('⚠️ Erro durante cleanup:', cleanupError.message);
    }
    
    if (tempHtmlFile) {
      cleanupFile(tempHtmlFile);
    }
    
    // Erro mais específico para container
    if (error.message.includes('Target closed') || error.message.includes('Protocol error')) {
      throw new Error('Erro de conexão com browser - verifique configurações do container');
    }
    
    throw error;
  }
};

// Função para gerar PDF com carregamento COMPLETO (sem timeout)
// waitTime: tempo opcional em milissegundos para aguardar após o carregamento (padrão: 0)
const generatePdfFullLoad = async (html, waitTime = 0) => {
  let browser;
  let page;
  let tempHtmlFile = null;
  
  try {
    console.log('🔄 Iniciando geração de PDF com carregamento completo...');

    // Injetar CSS de impressão perfeita
    const htmlWithPrintCSS = injectPrintCSS(html);

    // Criar arquivo HTML temporário
    tempHtmlFile = generateTempFilePath('.html');
    fs.writeFileSync(tempHtmlFile, htmlWithPrintCSS, 'utf8');
    console.log(`📝 Arquivo HTML temporário criado: ${tempHtmlFile}`);

    // Configuração de launch SEM timeouts
    console.log('🚀 Lançando browser (modo sem timeout)...');
    browser = await puppeteer.launch({
      ...config.PUPPETEER_CONFIG,
      timeout: 0 // SEM TIMEOUT para launch
    });
    
    console.log('📄 Criando nova página...');
    page = await browser.newPage();
    
    // Emular mídia de impressão para garantir renderização correta
    await page.emulateMediaType('screen'); // Usar 'screen' ao invés de 'print' para preservar estilos
    
    // REMOVER todos os timeouts da página
    page.setDefaultNavigationTimeout(0); // Sem timeout de navegação
    page.setDefaultTimeout(0); // Sem timeout de operações
    
    // Manter JavaScript habilitado para páginas complexas
    await page.setJavaScriptEnabled(true);
    
    // Carregar o arquivo HTML temporário
    console.log(`🔄 Carregando HTML: file://${tempHtmlFile}`);
    console.log('⏳ Aguardando carregamento COMPLETO de todos os recursos...');
    
    await page.goto(`file://${tempHtmlFile}`, { 
      waitUntil: [
        'load',           // Evento load disparado
        'domcontentloaded', // DOM carregado
        'networkidle0'    // Nenhuma conexão de rede por 500ms
      ],
      timeout: 0 // SEM TIMEOUT
    });
    
    console.log('✅ Página carregada completamente!');
    
    // Aguardar tempo adicional se especificado
    if (waitTime > 0) {
      console.log(`⏳ Aguardando ${waitTime}ms adicionais para renderização completa...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    // Verificar se há conteúdo visível na página
    const bodyContent = await page.evaluate(() => document.body.innerHTML);
    console.log(`📏 Tamanho do conteúdo renderizado: ${bodyContent.length} caracteres`);
    
    console.log('📑 Gerando PDF...');
    const pdfBuffer = await page.pdf({
      ...config.PDF_OPTIONS,
      timeout: 0 // SEM TIMEOUT para geração do PDF
    });
    
    console.log('🔒 Fechando browser...');
    await page.close();
    await browser.close();
    browser = null;
    page = null;
    
    // Limpar arquivo HTML temporário
    cleanupFile(tempHtmlFile);
    
    console.log('✅ PDF com carregamento completo gerado com sucesso!');
    return pdfBuffer;
    
  } catch (error) {
    console.error('❌ Erro ao gerar PDF com carregamento completo:', error.message);
    
    // Cleanup mais robusto
    try {
      if (page) {
        await page.close().catch(() => {});
      }
      if (browser) {
        await browser.close().catch(() => {});
      }
    } catch (cleanupError) {
      console.error('⚠️ Erro durante cleanup:', cleanupError.message);
    }
    
    if (tempHtmlFile) {
      cleanupFile(tempHtmlFile);
    }
    
    throw error;
  }
};

module.exports = {
  generatePdf,
  generatePdfFullLoad,
  injectPrintCSS
};
