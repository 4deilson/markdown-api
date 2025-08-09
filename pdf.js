const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require('./config');
const { generateTempFilePath, cleanupFile } = require('./tempFiles');

// Função para gerar PDF a partir de HTML
const generatePdf = async (html) => {
  let browser;
  let page;
  let tempHtmlFile = null;
  
  try {
    console.log('🔄 Iniciando geração de PDF...');

    // Criar arquivo HTML temporário
    tempHtmlFile = generateTempFilePath('.html');
    fs.writeFileSync(tempHtmlFile, html, 'utf8');
    console.log(`📝 Arquivo HTML temporário criado: ${tempHtmlFile}`);

    // Configuração de launch com retry
    console.log('🚀 Lançando browser...');
    browser = await puppeteer.launch(config.PUPPETEER_CONFIG);
    
    console.log('📄 Criando nova página...');
    page = await browser.newPage();
    
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

module.exports = {
  generatePdf
};
