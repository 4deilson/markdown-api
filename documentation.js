const config = require('./config');

// Função para gerar a página de documentação
const getDocumentationHtml = (req) => {
  const baseUrl = config.getBaseUrl(req);
  
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀 API Markdown → HTML & PDF</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px;
        }
        
        .auth-info {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
        }
        
        .auth-info h3 {
            color: #856404;
            margin-bottom: 10px;
        }
        
        .auth-info p {
            color: #856404;
            margin-bottom: 10px;
        }
        
        .api-key {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
            word-break: break-all;
        }
        
        .endpoint {
            background: #f8f9fa;
            border-left: 4px solid #3498db;
            padding: 25px;
            margin: 30px 0;
            border-radius: 8px;
        }
        
        .endpoint h3 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 1.4rem;
        }
        
        .endpoint p {
            margin-bottom: 15px;
            color: #666;
        }
        
        .code-block {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            margin: 15px 0;
            position: relative;
        }
        
        .copy-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #3498db;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        
        .copy-btn:hover {
            background: #2980b9;
        }
        
        .method {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 12px;
            margin-right: 10px;
        }
        
        .method.get {
            background: #27ae60;
            color: white;
        }
        
        .method.post {
            background: #e74c3c;
            color: white;
        }
        
        .status {
            background: #27ae60;
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            display: inline-block;
            margin: 20px 0;
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        
        .feature {
            background: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        
        .feature h4 {
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .emoji {
            font-size: 2rem;
            margin-bottom: 10px;
            display: block;
        }
        
        .protected {
            color: #e74c3c;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 API de Conversão Markdown</h1>
            <p>HTML & PDF • Simples & Direto • v1.0.0</p>
            <div class="status">✅ API Online - Porta ${config.PORT}</div>
            <div class="status">🌐 URL: ${baseUrl}</div>
        </div>
        
        <div class="content">
            <div class="auth-info">
                <h3>🔐 Autenticação Necessária</h3>
                <p>Para usar os endpoints de conversão, inclua a API Key no header:</p>
                <p><strong>Authorization: Bearer sua-api-key</strong></p>
                <p>API Key de exemplo:</p>
                <div class="api-key">md-api-exemplo-1234567890abcdef</div>
            </div>
            
            <div class="features">
                <div class="feature">
                    <span class="emoji">📝</span>
                    <h4>Markdown → HTML</h4>
                    <p>Conversão rápida e limpa</p>
                </div>
                <div class="feature">
                    <span class="emoji">🎨</span>
                    <h4>HTML Completo</h4>
                    <p>Com CSS e formatação</p>
                </div>
                <div class="feature">
                    <span class="emoji">📑</span>
                    <h4>PDF A4</h4>
                    <p>Formatação profissional</p>
                </div>
                <div class="feature">
                    <span class="emoji">🔐</span>
                    <h4>API Segura</h4>
                    <p>Autenticação por API Key</p>
                </div>
            </div>
            
            <div class="endpoint">
                <h3><span class="method get">GET</span> / - Esta Página</h3>
                <p>📖 Documentação interativa da API com exemplos de uso</p>
                <div class="code-block">
                    <button class="copy-btn" onclick="copyCode(this)">📋 Copiar</button>
curl ${baseUrl}/
                </div>
            </div>
            
            <div class="endpoint">
                <h3><span class="method post">POST</span> /convert - HTML Simples <span class="protected">🔐</span></h3>
                <p>🔄 Converte Markdown para HTML puro (sem CSS)</p>
                <div class="code-block">
                    <button class="copy-btn" onclick="copyCode(this)">📋 Copiar</button>
curl -X POST ${baseUrl}/convert \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer md-api-exemplo-1234567890abcdef" \\
  -d '{"markdown": "# Título\\n\\nEste é um **texto** em markdown."}'
                </div>
            </div>
            
            <div class="endpoint">
                <h3><span class="method post">POST</span> /convert/full - HTML Completo <span class="protected">🔐</span></h3>
                <p>🎨 Converte para documento HTML completo com CSS e styling</p>
                <div class="code-block">
                    <button class="copy-btn" onclick="copyCode(this)">📋 Copiar</button>
curl -X POST ${baseUrl}/convert/full \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer md-api-exemplo-1234567890abcdef" \\
  -d '{"markdown": "# Meu Documento\\n\\nEste é um **texto** em markdown.", "title": "Meu Título"}'
                </div>
            </div>
            
            <div class="endpoint">
                <h3><span class="method post">POST</span> /convert/pdf - PDF Direto <span class="protected">🔐</span> 📑</h3>
                <p>📄 Converte Markdown diretamente para PDF formato A4</p>
                <div class="code-block">
                    <button class="copy-btn" onclick="copyCode(this)">📋 Copiar</button>
curl -X POST ${baseUrl}/convert/pdf \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer md-api-exemplo-1234567890abcdef" \\
  -d '{"markdown": "# Relatório\\n\\nConteúdo do relatório.", "title": "Meu Relatório"}' \\
  --output documento.pdf
                </div>
            </div>
            
            <div class="endpoint">
                <h3><span class="method post">POST</span> /html-to-pdf - HTML para PDF <span class="protected">🔐</span> 📄</h3>
                <p>🔄 Converte HTML existente para PDF mantendo formatação</p>
                <div class="code-block">
                    <button class="copy-btn" onclick="copyCode(this)">📋 Copiar</button>
curl -X POST ${baseUrl}/html-to-pdf \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer md-api-exemplo-1234567890abcdef" \\
  -d '{"html": "<h1>Título</h1><p>Conteúdo</p>", "title": "Documento"}' \\
  --output documento.pdf
                </div>
            </div>
            
            <div class="endpoint">
                <h3><span class="method get">GET</span> /health - Status da API</h3>
                <p>❤️ Verifica se a API está funcionando corretamente</p>
                <div class="code-block">
                    <button class="copy-btn" onclick="copyCode(this)">📋 Copiar</button>
curl ${baseUrl}/health
                </div>
            </div>
            
            <div style="margin-top: 40px; padding: 20px; background: #e8f5e8; border-radius: 8px; border-left: 4px solid #27ae60;">
                <h3>💡 Exemplo de Markdown Completo</h3>
                <div class="code-block">
                    <button class="copy-btn" onclick="copyCode(this)">📋 Copiar</button>
{
  "markdown": "# Relatório Mensal\\n\\n## Resumo Executivo\\n\\nEste é um **relatório importante** com *dados relevantes*.\\n\\n### Métricas\\n\\n- ✅ Vendas: 150%\\n- 📊 Crescimento: 25%\\n- 🎯 Meta: Atingida\\n\\n### Código de Exemplo\\n\\n\`\`\`javascript\\nfunction calcular() {\\n    return vendas * 1.25;\\n}\\n\`\`\`\\n\\n### Tabela de Resultados\\n\\n| Mês | Vendas | Meta |\\n|-----|--------|------|\\n| Jan | 100    | 80   |\\n| Fev | 120    | 90   |\\n| Mar | 150    | 100  |\\n\\n> **Conclusão**: Resultados excelentes!",
  "title": "Relatório Q1 2025"
}
                </div>
            </div>
        </div>
    </div>
    
    <script>
        function copyCode(button) {
            const codeBlock = button.parentElement;
            const code = codeBlock.textContent.replace('📋 Copiar', '').trim();
            
            navigator.clipboard.writeText(code).then(() => {
                button.textContent = '✅ Copiado!';
                setTimeout(() => {
                    button.textContent = '📋 Copiar';
                }, 2000);
            });
        }
    </script>
</body>
</html>`;
};

module.exports = {
  getDocumentationHtml
};
