const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.API_URL || 'https://test.adsoftcode.com';
const API_KEY = process.env.API_KEY || 'md-api-ae4a14b70333ce2424fcc5db55a6c00a0255939688adf76f02f6b0e32a9261eb';
const OUTPUT_DIR = path.join(__dirname, 'test-results-advanced');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const advancedTests = [
  {
    id: '13_layout_com_borda_e_padding',
    name: 'Layout com Borda Dupla, Sombra e Padding de Página (Cartão Elegante)',
    endpoint: '/html-to-pdf',
    payload: {
      title: 'Documento com Borda e Padding',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @page { margin: 20mm; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
            .page-border-container {
              border: 3px double #2c3e50;
              border-radius: 8px;
              padding: 40px;
              background-color: #ffffff;
              box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            }
            .header-title { color: #1a2a3a; font-size: 28px; border-bottom: 2px solid #3498db; padding-bottom: 10px; margin-top: 0; }
            .highlight-box { background-color: #ebf5fb; border-left: 6px solid #3498db; padding: 20px; border-radius: 4px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="page-border-container">
            <h1 class="header-title">Relatório de Design com Bordas & Padding</h1>
            <p>Este documento demonstra um layout moderno encapsulado por uma <strong>borda dupla estilizada</strong> e espaçamentos internos (<strong>padding de 40px</strong>) garantindo excelente estética para relatórios executivos e apresentações.</p>
            <div class="highlight-box">
              <strong>💡 Informação de Layout:</strong> O uso de padding combinado com margens controladas previne cortes de conteúdo nas bordas físicas da folha de impressão.
            </div>
            <p>Segurança, elegância e responsividade integradas diretamente na geração via Puppeteer / Chromium.</p>
          </div>
        </body>
        </html>
      `
    }
  },
  {
    id: '14_relatorio_multipaginas_extenso',
    name: 'Relatório Extenso Multipáginas (5 Páginas com Quebras Controladas)',
    endpoint: '/convert/pdf',
    payload: {
      title: 'Relatorio Extenso 5 Paginas',
      markdown: '# Relatório Técnico de Infraestrutura e Performance - 2026\n\n---\n\n## Página 1: Visão Geral de Arquitetura\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.\n\n### Métricas Gerais do Cluster\n* **Nós Ativos:** 16 instâncias ARM64\n* **Uso Médio de CPU:** 42%\n* **Uso Médio de Memória:** 3.8 GB por nó\n* **Uptime Geral:** 99.99%\n\n<div style="page-break-after: always;"></div>\n\n## Página 2: Análise de Carga e Microserviços\n\n### Desempenho dos Microserviços em Produção\n\n| Serviço | Requisições / min | Latência Média | Taxa de Erro |\n|---|:---:|:---:|:---:|\n| API de Autenticação | 14.500 | 12ms | 0.001% |\n| API de Conversão PDF | 3.200 | 2.4s | 0.000% |\n| Serviço de Notificação | 8.900 | 45ms | 0.005% |\n| Worker Backblaze B2 | 1.100 | 310ms | 0.000% |\n\nDuis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.\n\n<div style="page-break-after: always;"></div>\n\n## Página 3: Logs de Segurança e Auditoria\n\n* [2026-07-29T17:30:00Z] INFO [AuthGuard] Token Bearer validado para tenant_id=4821\n* [2026-07-29T17:30:01Z] INFO [PDFEngine] Iniciando renderizacao de PDF com Chromium (arm64)\n* [2026-07-29T17:30:03Z] INFO [PDFEngine] Buffer PDF gerado: 125.2 KB em 2500ms\n\n> **Nota de Auditoria:** Todos os acessos aos endpoints protegidos foram autenticados com sucesso via token Bearer sem violações registradas.\n\n<div style="page-break-after: always;"></div>\n\n## Página 4: Projeção de Crescimento e Capacidade\n\n1. **Expansão de RAM:** Adicionar 32GB de memória no host principal.\n2. **Auto-scaling:** Configurar réplicas dinâmicas de 2 para 6 instâncias em pico de acesso.\n3. **Cache de PDF:** Ativar cache distribuído em Redis para documentos estáticos repetidos.\n\n<div style="page-break-after: always;"></div>\n\n## Página 5: Conclusões e Encerramento\n\nSed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.\n\n* **Relatório emitido em:** 29/07/2026 17:34:00\n* **Responsável:** Equipe de Engenharia de Plataforma ADSoft\n* **Status:** Aprovado e Homologado em Produção\n'
    }
  },
  {
    id: '15_quadro_borda_arredondada_padding_duplo',
    name: 'Moldura Moderna com Cantos Arredondados e Padding Duplo',
    endpoint: '/html-to-pdf',
    payload: {
      title: 'Moldura Arredondada',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @page { margin: 15mm; }
            body { font-family: 'Inter', Roboto, sans-serif; background-color: #2c3e50; color: #fff; padding: 20px; }
            .outer-frame {
              border: 4px solid #16a085;
              border-radius: 16px;
              padding: 15px;
              background-color: #34495e;
            }
            .inner-frame {
              border: 2px dashed #1abc9c;
              border-radius: 12px;
              padding: 30px;
              background-color: #1e2b37;
              text-align: center;
            }
            h1 { color: #1abc9c; font-size: 32px; margin-bottom: 5px; }
            p { color: #bdc3c7; font-size: 16px; line-height: 1.8; }
            .tag { background: #16a085; color: white; padding: 6px 16px; border-radius: 20px; display: inline-block; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="outer-frame">
            <div class="inner-frame">
              <h1>DESIGN DE MOLDURA MODERNA</h1>
              <p class="tag">PULSE STYLING</p>
              <p>Este exemplo combina <strong>borda dupla (sólida + tracejada)</strong> com <strong>cantos arredondados (border-radius: 16px)</strong> e duplo nível de <strong>padding</strong> para criar um visual de cartão de alta fidelidade visual.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }
  }
];

async function run() {
  console.log('====================================================');
  console.log('🚀 EXECUÇÃO DE TESTES AVANÇADOS (BORDAS, PADDING & MULTIPÁGINAS)');
  console.log(`🌐 Alvo: ${BASE_URL}`);
  console.log('====================================================\n');

  for (let i = 0; i < advancedTests.length; i++) {
    const t = advancedTests[i];
    const startTime = Date.now();
    console.log(`[${i+1}/${advancedTests.length}] Executando: ${t.name}...`);

    try {
      const response = await fetch(`${BASE_URL}${t.endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(t.payload)
      });

      const duration = Date.now() - startTime;

      if (!response.ok) {
        const err = await response.text();
        console.log(`  ❌ Falhou! HTTP ${response.status} (${duration}ms)`);
        continue;
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const fileName = `${t.id}.pdf`;
      const filePath = path.join(OUTPUT_DIR, fileName);
      fs.writeFileSync(filePath, buffer);

      const sizeKb = (buffer.length / 1024).toFixed(1);
      console.log(`  ✅ Sucesso! HTTP ${response.status} (${duration}ms) | Arquivo: ${fileName} (${sizeKb} KB)`);
    } catch (e) {
      console.log(`  ❌ Erro: ${e.message}`);
    }
  }

  console.log('\n====================================================');
  console.log(`✨ Testes avançados concluídos! Arquivos salvos em: ${OUTPUT_DIR}`);
  console.log('====================================================\n');
}

run();
