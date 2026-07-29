const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.API_URL || 'https://test.adsoftcode.com';
const API_KEY = process.env.API_KEY || 'md-api-ae4a14b70333ce2424fcc5db55a6c00a0255939688adf76f02f6b0e32a9261eb';
const OUTPUT_DIR = path.join(__dirname, 'test-results');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const testCases = [
  {
    id: '01_relatorio_executivo',
    name: 'Relatorio Executivo (Tabelas e KPIs)',
    endpoint: '/convert/pdf',
    type: 'json',
    payload: {
      title: 'Relatorio Executivo Q3',
      markdown: '# Relatório de Desempenho Executivo - Q3\n\n> **Status:** Finalizado | **Autor:** Diretoria de Operações\n\n---\n\n## 1. Visão Geral\nNeste trimestre, alcançamos um crescimento de **+24%** no faturamento bruto.\n\n### Indicadores Chave (KPIs)\n* **Receita Bruta:** R$ 1.450.000,00\n* **Novos Clientes:** 128 contratos fechados\n* **Churn Rate:** 1.2%\n\n---\n\n## 2. Detalhamento Financeiro\n\n| Departamento | Orçamento | Gasto Real | Variação |\n| :--- | :---: | :---: | ---: |\n| Tecnologia | R$ 350.000 | R$ 342.000 | -2.3% |\n| Marketing | R$ 200.000 | R$ 215.000 | +7.5% |\n| Operações | R$ 400.000 | R$ 390.000 | -2.5% |\n| **Total** | **R$ 950.000** | **R$ 947.000** | **-0.3%** |\n'
    }
  },
  {
    id: '02_documentacao_tecnica_codigo',
    name: 'Documentação Técnica (Highlight.js Code)',
    endpoint: '/convert/pdf',
    type: 'json',
    payload: {
      title: 'Documentacao Tecnica API',
      markdown: '# Guia de Integração Node.js & Express\n\nExemplo de código com realce de sintaxe:\n\n```javascript\nconst express = require("express");\nconst app = express();\n\nconst authMiddleware = (req, res, next) => {\n  const token = req.headers["authorization"];\n  if (token === "Bearer secret-key") return next();\n  res.status(401).json({ error: "Acesso negado" });\n};\n\napp.listen(3000, () => console.log("Server running"));\n```\n'
    }
  },
  {
    id: '03_fatura_recibo',
    name: 'Fatura / Recibo de Serviço',
    endpoint: '/convert/pdf',
    type: 'json',
    payload: {
      title: 'Fatura #1094',
      markdown: '# FATURA DE SERVIÇOS #1094\n\n**Prestador:** ADSoft Technologies LTDA  \n**CNPJ:** 12.345.678/0001-90  \n**Cliente:** Empresa Exemplo SA  \n\n---\n\n| Item | Descrição | Qtd | Valor Unit. | Subtotal |\n|---|---|:---:|---:|---:|\n| 01 | Consultoria em Arquitetura Docker/Cloud | 20h | R$ 150,00 | R$ 3.000,00 |\n| 02 | Otimização de Pipeline de PDF Puppeteer | 1 | R$ 1.500,00 | R$ 1.500,00 |\n| 03 | Suporte Técnico Mensal | 1 | R$ 800,00 | R$ 800,00 |\n\n### **TOTAL A PAGAR:** **R$ 5.300,00**\n'
    }
  },
  {
    id: '04_artigo_blog_post',
    name: 'Artigo Formatado (Post de Blog)',
    endpoint: '/convert/pdf',
    type: 'json',
    payload: {
      title: 'Artigo Otimizacao Docker',
      markdown: '# Como Otimizar Containers Node.js para Produção\n\nA conteinerização se tornou o padrão da indústria para implantação de aplicações modernas.\n\n> *"A simplicidade é o último grau de sofisticação."* — Leonardo da Vinci\n\n## 1. Utilize Imagens Base Otimizadas\nEm vez de usar a imagem completa do Node, prefira variações como `node:20-slim`.\n\n## 2. Multi-stage Builds\nCom multi-stage builds, você separa a etapa de compilação da etapa de execução final.\n'
    }
  },
  {
    id: '05_checklist_operacional',
    name: 'Checklist e Lista de Tarefas',
    endpoint: '/convert/pdf',
    type: 'json',
    payload: {
      title: 'Checklist de Deploy',
      markdown: '# Checklist de Deploy em Produção\n\n### Pré-Deploy\n- [x] Rodar testes unitários e de integração\n- [x] Validar variáveis de ambiente (.env)\n- [x] Gerar arquivo .tar.gz de release\n\n### Deploy\n- [x] Build da imagem no Portainer\n- [x] Atualizar a Stack do serviço\n- [ ] Verificar logs de inicialização do container\n'
    }
  },
  {
    id: '06_contrato_termos_servico',
    name: 'Termos de Serviço / Contrato Legal',
    endpoint: '/convert/pdf',
    type: 'json',
    payload: {
      title: 'Termos de Servico',
      markdown: '# CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE TECNOLOGIA\n\nPelo presente instrumento particular, de um lado **CONTRATANTE** e de outro **CONTRATADA**:\n\n### CLÁUSULA PRIMEIRA - DO OBJETO\nO presente contrato tem como objeto a prestação de serviços de desenvolvimento de software.\n\n### CLÁUSULA SEGUNDA - DOS DEVERES DA CONTRATADA\n1. Manter a disponibilidade dos serviços em no mínimo **99.9%** ao mês.\n2. Garantir o sigilo e a confidencialidade dos dados processados.\n'
    }
  },
  {
    id: '07_html_direto_para_pdf',
    name: 'HTML Customizado Direto para PDF (Certificado)',
    endpoint: '/html-to-pdf',
    type: 'json',
    payload: {
      title: 'Certificado de Conclusao',
      html: '<!DOCTYPE html><html><head><style>body { font-family: sans-serif; text-align: center; padding: 40px; background-color: #f9f9f9; } .card { border: 10px solid #2c3e50; padding: 40px; background: #fff; } h1 { color: #2c3e50; font-size: 32px; } .name { font-size: 26px; color: #e74c3c; font-weight: bold; margin: 20px 0; }</style></head><body><div class="card"><h1>CERTIFICADO DE CONCLUSÃO</h1><h3>Certificamos que</h3><div class="name">Engenheiro DevOps / Fullstack</div><p>Concluiu com êxito o treinamento de Implantação de APIs de PDF com Docker & Puppeteer.</p></div></body></html>'
    }
  },
  {
    id: '08_html_full_load_aguardar_recursos',
    name: 'HTML Full Load (Sem Timeout)',
    endpoint: '/html-to-pdf-full',
    type: 'json',
    payload: {
      title: 'Relatorio Full Load',
      html: '<!DOCTYPE html><html><head><style>body { font-family: Arial, sans-serif; padding: 30px; } .box { background: #eef9ff; border-left: 5px solid #00a8ff; padding: 15px; }</style></head><body><h2>Dashboard de Performance</h2><div class="box"><p>Este relatório testa a renderização com carregamento completo de recursos.</p></div></body></html>'
    }
  },
  {
    id: '09_text_plain_markdown_simples',
    name: 'Markdown em Texto Puro (text/plain)',
    endpoint: '/convert/pdf',
    type: 'text',
    payload: '# Nota Simples em Texto Puro\n\nEsta é uma requisição enviada como **text/plain**.\n\n* Item 1\n* Item 2\n* Item 3\n'
  },
  {
    id: '10_relatorio_longo_multiplas_paginas',
    name: 'Documento Longo Múltiplas Páginas',
    endpoint: '/convert/pdf',
    type: 'json',
    payload: {
      title: 'Manual Completo',
      markdown: '# Manual do Usuário - Sistema API PDF\n\n## Capítulo 1: Introdução\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n---\n\n## Capítulo 2: Configurações Avançadas\nCurabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.\n\n---\n\n## Capítulo 3: Tabelas de Referência\n\n| Código | Descrição | Status |\n|---|---|---|\n| ERR-01 | Timeout na conexão | Corrigido |\n| ERR-02 | Memória excedida | Corrigido |\n'
    }
  },
  {
    id: '11_caracteres_especiais_e_emojis',
    name: 'Suporte a UTF-8 e Emojis 🚀⚡',
    endpoint: '/convert/pdf',
    type: 'json',
    payload: {
      title: 'UTF8 Emojis Test',
      markdown: '# Teste de Caracteres Especiais & Emojis 🚀🌐\n\n### 1. Acentuação em Português\n* Ação, Reação, Proteção, Edição, Comunicação\n* É, À, Ô, Ã, Õ, Ü, Ç\n\n### 2. Símbolos e Emojis\n* Status: ✅ Funcionando | ❌ Erro | ⚠️ Alerta\n* Tecnologia: 💻 ⚡ 🐳 📦 🔒 📄\n'
    }
  },
  {
    id: '12_debug_html_sem_gerar_pdf',
    name: 'Debug HTML (Verifica Saída HTML)',
    endpoint: '/debug-html',
    type: 'json',
    payload: {
      title: 'Debug de Estrutura',
      markdown: '# Teste de Debug\n\nVerificando a saída HTML gerada antes de ir para o Puppeteer.'
    }
  }
];

async function runTestSuite() {
  console.log('====================================================');
  console.log(`🚀 INICIANDO ESTEIRA DE TESTES DA API DE PDF`);
  console.log(`🌐 Alvo: ${BASE_URL}`);
  console.log(`📋 Total de casos de teste: ${testCases.length}`);
  console.log('====================================================\n');

  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const test = testCases[i];
    const indexStr = String(i + 1).padStart(2, '0');
    const startTime = Date.now();

    try {
      let headers = {
        'Authorization': `Bearer ${API_KEY}`
      };

      let body;
      if (test.type === 'json') {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(test.payload);
      } else {
        headers['Content-Type'] = 'text/plain';
        body = test.payload;
      }

      const response = await fetch(`${BASE_URL}${test.endpoint}`, {
        method: 'POST',
        headers: headers,
        body: body
      });

      const duration = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        console.log(`[${indexStr}/${testCases.length}] ❌ ${test.name} -> HTTP ${response.status} (${duration}ms)`);
        results.push({ ...test, success: false, status: response.status, duration, error: errorText });
        continue;
      }

      const contentType = response.headers.get('content-type') || '';
      const buffer = Buffer.from(await response.arrayBuffer());

      let ext = '.pdf';
      if (contentType.includes('application/json')) ext = '.json';
      else if (contentType.includes('text/html')) ext = '.html';

      const fileName = `${test.id}${ext}`;
      const filePath = path.join(OUTPUT_DIR, fileName);
      fs.writeFileSync(filePath, buffer);

      const sizeKb = (buffer.length / 1024).toFixed(1);
      console.log(`[${indexStr}/${testCases.length}] ✅ ${test.name} -> HTTP ${response.status} (${duration}ms) | ${fileName} (${sizeKb} KB)`);
      results.push({ ...test, success: true, status: response.status, duration, sizeKb, fileName });

    } catch (err) {
      const duration = Date.now() - startTime;
      console.log(`[${indexStr}/${testCases.length}] ❌ ${test.name} -> Erro: ${err.message} (${duration}ms)`);
      results.push({ ...test, success: false, status: 'NET_ERR', duration, error: err.message });
    }
  }

  console.log('\n====================================================');
  console.log('📊 RESUMO DA EXECUÇÃO DA ESTEIRA DE TESTES');
  console.log('====================================================');
  const totalPassed = results.filter(r => r.success).length;
  console.log(`Passaram: ${totalPassed} / ${results.length}`);
  console.log(`Falharam: ${results.length - totalPassed} / ${results.length}`);
  console.log(`Arquivos gerados salvos em: ${OUTPUT_DIR}`);
  console.log('====================================================\n');
}

runTestSuite();
