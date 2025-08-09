# 🚀 API de Conversão Markdown para HTML e PDF

Esta é uma API simples e direta para converter conteúdo Markdown em HTML e PDF com formatação perfeita.

## 🔐 Autenticação

A API agora requer autenticação via API Key para endpoints de conversão:

```bash
# Inclua o header Authorization em todas as requisições POST
Authorization: Bearer md-api-ae4a14b70333ce2424fcc5db55a6c00a0255939688adf76f02f6b0e32a9261eb
```

### 🔑 **Configuração da API Key:**

1. **Arquivo `.env`** (recomendado):
   ```bash
   API_KEY=md-api-ae4a14b70333ce2424fcc5db55a6c00a0255939688adf76f02f6b0e32a9261eb
   ```

2. **Variável de ambiente**:
   ```bash
   export API_KEY="sua-chave-super-segura"
   ```

3. **Gerar nova chave**:
   ```bash
   node -e "console.log('md-api-' + require('crypto').randomBytes(32).toString('hex'))"
   ```

**Endpoints públicos** (sem autenticação):
- `GET /` - Documentação
- `GET /health` - Status da API

**Endpoints protegidos** (requer API Key):
- `POST /convert` - Conversão simples
- `POST /convert/full` - HTML completo
- `POST /convert/pdf` - PDF direto
- `POST /html-to-pdf` - HTML para PDF

## 🎯 Endpoints Disponíveis

### `GET /` - Documentação Interativa
Retorna uma página HTML com documentação completa, exemplos de uso e interface para testar a API.

### `POST /convert` - Conversão Simples
Converte markdown para HTML puro.

**Exemplo de uso:**
```bash
curl -X POST http://localhost:7000/convert \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer md-api-ae4a14b70333ce2424fcc5db55a6c00a0255939688adf76f02f6b0e32a9261eb" \
  -d '{"markdown": "# Título\n\nEste é um **texto** em markdown."}'
```

### `POST /convert/full` - HTML Completo
Converte markdown para um documento HTML completo com CSS.

**Exemplo de uso:**
```bash
curl -X POST http://localhost:7000/convert/full \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer md-api-ae4a14b70333ce2424fcc5db55a6c00a0255939688adf76f02f6b0e32a9261eb" \
  -d '{"markdown": "# Meu Documento\n\nEste é um **texto** em markdown.", "title": "Meu Título"}'
```

### `POST /convert/pdf` - PDF Direto (NOVO! 📑)
Converte markdown diretamente para PDF no formato A4 com formatação preservada.

**Exemplo de uso:**
```bash
curl -X POST http://localhost:7000/convert/pdf \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer md-api-ae4a14b70333ce2424fcc5db55a6c00a0255939688adf76f02f6b0e32a9261eb" \
  -d '{"markdown": "# Relatório\n\nConteúdo do relatório.", "title": "Meu Relatório"}' \
  --output documento.pdf
```

### `POST /html-to-pdf` - HTML para PDF (NOVO! 📄)
Converte HTML completo para PDF mantendo formatação exata.

**Exemplo de uso:**
```bash
curl -X POST http://localhost:7000/html-to-pdf \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer md-api-ae4a14b70333ce2424fcc5db55a6c00a0255939688adf76f02f6b0e32a9261eb" \
  -d '{"html": "<h1>Título</h1><p>Conteúdo</p>", "title": "Documento"}' \
  --output documento.pdf
```

### `GET /health` - Status
Verifica se a API está funcionando.

## 🔧 Como Usar

1. **Inicie o servidor:**
   ```bash
   npm start
   ```

2. **Acesse a documentação interativa:**
   http://localhost:7000

3. **Teste a conversão:**
   - Envie texto markdown via POST para `/convert`
   - Receba HTML limpo de volta
   - Use `/convert/full` para documento completo

## 📝 Exemplos de Markdown

### Texto Básico
```markdown
# Título Principal
## Subtítulo

Este é um parágrafo com **texto em negrito** e *itálico*.

- Lista item 1
- Lista item 2

[Link para o Google](https://google.com)
```

### Código
```markdown
Código inline: `console.log('Hello')`

```javascript
function hello() {
    console.log('Hello, World!');
}
```

### Tabela
```markdown
| Nome | Idade | Cidade |
|------|--------|--------|
| João | 30     | SP     |
| Maria| 25     | RJ     |
```

## 🚀 Funcionalidades

- ✅ Conversão rápida e simples
- ✅ Suporte a markdown completo
- ✅ HTML com CSS styling
- ✅ **PDF em formato A4** com formatação preservada
- ✅ **API Segura** com autenticação por API Key
- ✅ **Conversão HTML → PDF** direta
- ✅ API RESTful
- ✅ CORS habilitado
- ✅ Validação de entrada
- ✅ Tratamento de erros

## 🆕 Novidades na Versão PDF

### Características dos PDFs gerados:
- 📑 **Formato A4** padrão
- 🎨 **Formatação preservada** exatamente como no HTML
- 📄 **Margens adequadas** (2cm em todos os lados)
- 🔧 **Quebras de página inteligentes** 
- 💼 **Qualidade profissional**
- 📊 **Tabelas bem formatadas**
- 🎯 **Código com syntax highlighting**

### Fluxo Completo:
```
Markdown → HTML → PDF
    ↓        ↓      ↓
 Simples  Estilizado  A4
```

## 📁 Estrutura Modular

O projeto foi organizado em módulos para facilitar manutenção:

```
├── server.js          # Servidor principal (apenas rotas)
├── config.js          # Configurações centralizadas
├── auth.js            # Middleware de autenticação
├── routes.js          # Rotas de conversão
├── markdown.js        # Processamento de Markdown
├── pdf.js             # Geração de PDFs
├── documentation.js   # Página de documentação
├── tempFiles.js       # Gerenciamento de arquivos temporários
└── .env.example       # Exemplo de variáveis de ambiente
```

## 🌐 URLs Dinâmicas

A API agora detecta automaticamente o host/servidor onde está rodando:

### 🔧 **Detecção Automática de Host:**
- ✅ **Request-based**: Usa o host do request HTTP (melhor opção)
- ✅ **Variável HOST**: Configuração manual via `HOST=exemplo.com`
- ✅ **Domínio personalizado**: Via `DOMAIN=api.exemplo.com`
- ✅ **IP local**: Detecta automaticamente o IP da máquina
- ✅ **Fallback**: localhost como último recurso

### 📋 **Variáveis de Ambiente Disponíveis:**
```bash
HOST=exemplo.com              # Host específico
DOMAIN=api.exemplo.com        # Domínio personalizado  
HTTPS=true                    # Usar HTTPS
USE_LOCAL_IP=true             # Usar IP local
PORT=7000                     # Porta da aplicação
```

### 🎯 **Comportamento:**
- **Desenvolvimento**: Mostra localhost ou IP local
- **Docker/Container**: Usa variáveis de ambiente
- **Cloud/Produção**: Detecta automaticamente do request
- **Documentação**: URLs sempre corretas para o ambiente atual

## 🗂️ Gerenciamento de Arquivos Temporários

A API agora gerencia automaticamente arquivos temporários:

- ✅ **Criação automática** de diretório temporário
- ✅ **Limpeza automática** após cada geração de PDF
- ✅ **Limpeza periódica** a cada 30 minutos
- ✅ **Limpeza na finalização** da aplicação
- ✅ **Arquivos únicos** com UUID para evitar conflitos

## 🧪 Testes Incluídos

Execute os testes para verificar todas as funcionalidades:

```bash
# Teste básico HTML
node test-api.js

# Teste específico PDF
node test-pdf.js
```
