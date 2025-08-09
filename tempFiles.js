const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('./config');

// Garantir que o diretório temporário existe
const ensureTempDir = () => {
  if (!fs.existsSync(config.TEMP_DIR)) {
    fs.mkdirSync(config.TEMP_DIR, { recursive: true });
    console.log(`📁 Diretório temporário criado: ${config.TEMP_DIR}`);
  }
};

// Gerar caminho único para arquivo temporário
const generateTempFilePath = (extension = '.tmp') => {
  ensureTempDir();
  const fileName = `${uuidv4()}${extension}`;
  return path.join(config.TEMP_DIR, fileName);
};

// Limpar arquivo específico
const cleanupFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Arquivo temporário removido: ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`❌ Erro ao remover arquivo ${filePath}:`, error.message);
  }
};

// Limpar todos os arquivos temporários
const cleanupAllTempFiles = () => {
  try {
    if (fs.existsSync(config.TEMP_DIR)) {
      const files = fs.readdirSync(config.TEMP_DIR);
      let cleanedCount = 0;
      
      files.forEach(file => {
        const filePath = path.join(config.TEMP_DIR, file);
        try {
          fs.unlinkSync(filePath);
          cleanedCount++;
        } catch (error) {
          console.error(`❌ Erro ao remover ${file}:`, error.message);
        }
      });
      
      if (cleanedCount > 0) {
        console.log(`🧹 ${cleanedCount} arquivo(s) temporário(s) removido(s)`);
      }
    }
  } catch (error) {
    console.error('❌ Erro ao limpar diretório temporário:', error.message);
  }
};

// Limpeza automática na inicialização e finalização
const setupAutoCleanup = () => {
  // Limpeza na inicialização
  cleanupAllTempFiles();
  
  // Limpeza automática a cada 30 minutos
  setInterval(() => {
    console.log('🔄 Executando limpeza automática de arquivos temporários...');
    cleanupAllTempFiles();
  }, 30 * 60 * 1000); // 30 minutos
  
  // Limpeza quando o processo for finalizado
  process.on('SIGINT', () => {
    console.log('\n🛑 Finalizando aplicação...');
    cleanupAllTempFiles();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Finalizando aplicação...');
    cleanupAllTempFiles();
    process.exit(0);
  });
};

module.exports = {
  generateTempFilePath,
  cleanupFile,
  cleanupAllTempFiles,
  setupAutoCleanup,
  ensureTempDir
};
