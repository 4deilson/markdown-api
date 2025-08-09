# 🚀 Deploy no Portainer - Markdown to PDF API

## Resumo da Imagem
- **Nome da Imagem**: `markdown-to-pdf-api:latest`
- **Base**: Node.js 20-slim + Chrome + Puppeteer
- **Porta**: 7000
- **API Key**: Embarcada no container para uso privado
- **Funcionalidades**: Markdown → HTML, Markdown → PDF, HTML → PDF

## 📋 Configuração no Portainer

### 1. Container Settings
```yaml
Name: markdown-pdf-api
Image: markdown-to-pdf-api:latest
Port Mapping: 7000:7000
Restart Policy: Always
```

### 2. Variáveis de Ambiente (Opcionais)
```bash
# Já está configurada no Dockerfile, mas pode sobrescrever se necessário
# API_KEY=sua-chave-personalizada-aqui
```

### 3. Volumes (Opcionais)
```bash
# Para logs persistentes (opcional)
/var/logs/markdown-api:/app/logs
```

### 4. Network
- Usar rede padrão do Docker ou bridge
- Expor porta 7000

## 🔧 Deploy via Docker Run
```bash
docker run -d \
  --name markdown-pdf-api \
  --restart unless-stopped \
  -p 7000:7000 \
  markdown-to-pdf-api:latest
```

## 🧪 Teste Rápido
Após deploy, acesse:
- **Interface**: http://localhost:7000
- **Health Check**: http://localhost:7000/health
- **API Key na documentação**: `md-api-exemplo-1234567890abcdef` (apenas exemplo!)

## 📚 Endpoints Disponíveis

### 🔐 Autenticação
```bash
Authorization: Bearer md-api-ae4a14b70333ce2424fcc5db55a6c00a0255939688adf76f02f6b0e32a9261eb
```

### 📝 Conversões
- `POST /convert` - Markdown → HTML simples
- `POST /convert/full` - Markdown → HTML completo
- `POST /convert/pdf` - Markdown → PDF
- `POST /html-to-pdf` - HTML → PDF
- `GET /health` - Status da API

## 💡 Exemplo de Uso (cURL)
```bash
curl -X POST http://localhost:7000/convert/pdf \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer md-api-ae4a14b70333ce2424fcc5db55a6c00a0255939688adf76f02f6b0e32a9261eb" \
  -d '{"markdown": "# Teste\n\nEste é um **teste** da API!", "title": "Documento"}' \
  --output teste.pdf
```

## 🔒 Segurança
- ✅ API Key embarcada para uso privado
- ✅ Usuário não-root no container
- ✅ Chrome com sandboxing configurado para containers
- ✅ Documentação pública usa chave de exemplo

## 📊 Recursos do Container
- **CPU**: ~200m recomendado
- **RAM**: ~512MB recomendado  
- **Storage**: ~500MB para imagem + temp files

## 🐛 Troubleshooting
- **Chrome não funciona**: Verificar se `--no-sandbox` está ativo
- **PDF vazio**: Verificar logs do Puppeteer
- **API Key inválida**: Usar a chave embarcada no container
