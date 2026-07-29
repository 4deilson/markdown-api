# Guia de Deploy — markdown-api

API de conversao de Markdown para PDF usando Puppeteer + Chromium, hospedada no Portainer.

---

## Configuracao do servidor

| | Valor |
|---|---|
| **Imagem Docker** | `markdown-api:latest` |
| **Container** | `markdown-to-pdf-api` |
| **Porta externa** | `7000` |
| **Porta interna** | `7000` |
| **Rede** | `rede-01` (external) |
| **Browser** | Chromium (apt — amd64 e arm64) |
| **Health check** | `GET /health` |

---

## IMPORTANTE — Fluxo obrigatorio no Portainer

> O build da imagem e o deploy da stack sao DOIS passos separados.
> Nunca tente buildar via stack — isso causa o erro de BuildKit HTTP/2.
> 
> Erro que acontece se tentar buildar pela stack:
> "compose build operation failed: listing workers for Build: failed to list workers"

```
Passo 1  →  PowerShell: .\make-release.ps1 -Version "X.Y.Z"
                         (gera o .tar.gz)

Passo 2  →  Portainer: Images > Build image
                        (faz o build da imagem a partir do .tar.gz)
                        Aguardar "Image successfully built" antes de continuar

Passo 3  →  Portainer: Stacks > Editor
                        (usa a imagem ja pronta — sem build na stack)

Passo 4  →  Testar: GET http://<SERVIDOR>:7000/health
```

---

## Passo 1 — Gerar o arquivo .tar.gz

Abra o **PowerShell** na pasta do projeto e execute:

```powershell
cd C:\DEV\Node\markdown-api

.\make-release.ps1 -Version "1.0.0"
```

O arquivo `markdown-api_v1.0.0.tar.gz` sera salvo dentro da propria pasta do projeto.

> Sem a versao, o nome usara timestamp automatico (ex: `markdown-api_20260729_1638.tar.gz`)

---

## Passo 2 — Buildar a imagem no Portainer

> Este passo DEVE ser feito antes do deploy da stack.
> A stack apenas referencia a imagem — nao faz build.

1. Acesse o **Portainer**
2. Va em **Images** → **Build image**
3. Preencha:
   - **Name**: `markdown-api:latest`
   - **Build method**: `Upload`
4. Faca upload do arquivo `markdown-api_vX.Y.Z.tar.gz`
5. Clique em **Build the image**
6. Aguarde: **"Image successfully built"** antes de ir para o Passo 3

> Se a imagem `markdown-api:latest` ja existir, o Portainer vai sobrescrevela automaticamente.

---

## Passo 3 — Deploy da Stack no Portainer

> A stack usa apenas `image: markdown-api:latest` — sem secao `build:`.
> Isso evita o erro de BuildKit.

1. Va em **Stacks**
   - **Primeira vez**: clique em **+ Add stack**, nome: `markdown-api`
   - **Atualizacao**: abra a stack existente → **Editor**
2. **Build method**: `Web editor`
3. Cole o conteudo abaixo no editor (mesmo conteudo do arquivo `portainer-stack.yml`):

```yaml
services:

  markdown-api:
    image: markdown-api:latest
    container_name: markdown-to-pdf-api
    ports:
      - "7000:7000"
    environment:
      - NODE_ENV=production
      - PORT=7000
      - API_KEY=${API_KEY}
      - PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
      - PUPPETEER_DISABLE_DEV_SHM_USAGE=true
      - CHROME_BIN=/usr/bin/chromium
      - DISPLAY=:99
    restart: unless-stopped
    security_opt:
      - seccomp:unconfined
    shm_size: 2gb
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.25'
    healthcheck:
      test: ["CMD", "node", "-e", "const http = require('http'); const options = { hostname: 'localhost', port: 7000, path: '/health', timeout: 10000 }; const req = http.request(options, (res) => { if (res.statusCode === 200) { process.exit(0); } else { process.exit(1); } }); req.on('error', () => { process.exit(1); }); req.end();"]
      interval: 60s
      timeout: 30s
      retries: 3
      start_period: 30s
    volumes:
      - /tmp:/tmp
    networks:
      - rede-01
    labels:
      - "traefik.enable=false"
      - "portainer.project=markdown-api"

networks:
  rede-01:
    external: true
```

4. Role ate **Environment variables** → **Advanced mode** → cole:

```env
API_KEY=md-api-ae4a14b70333ce2424fcc5db55a6c00a0255939688adf76f02f6b0e32a9261eb
```

5. Clique em **Deploy the stack** (ou **Update the stack**)

---

## Passo 4 — Testar o servico

```
GET http://<SERVIDOR>:7000/health
```

Resposta esperada:
```json
{ "status": "ok", "timestamp": "...", "uptime": 123 }
```

Outros containers na rede `rede-01` podem chamar pelo nome do container:
```
http://markdown-to-pdf-api:7000/convert/pdf
```

---

## Rotas disponiveis

| Metodo | Rota | Autenticacao | Descricao |
|--------|------|:---:|-----------|
| GET | /health | Nao | Health check |
| GET | / | Nao | Documentacao da API |
| POST | /convert/pdf | Sim | Converte Markdown para PDF |
| POST | /convert/html | Sim | Converte Markdown para HTML |

Autenticacao: envie o header `x-api-key: <API_KEY>` nas rotas protegidas.

---

## Atualizar a API (novo deploy)

Quando houver mudancas no codigo, repita **apenas os passos 1, 2 e Update do passo 3**:

1. `.\make-release.ps1 -Version "X.Y.Z"` — gera novo `.tar.gz`
2. **Images** → **Build image** → upload com o mesmo nome `markdown-api:latest`
3. **Stacks** → `markdown-api` → **Update the stack** (sem alterar nada no editor)

Os containers serao reiniciados automaticamente com a nova imagem.

---

## Arquivos essenciais do projeto

| Arquivo | Funcao |
|---|---|
| `server.js` | Servidor principal Express |
| `config.js` | Configuracoes globais e variaveis de ambiente |
| `auth.js` | Middleware de autenticacao por API Key |
| `routes.js` | Definicao de todas as rotas da API |
| `markdown.js` | Parser Markdown para HTML com highlight.js |
| `pdf.js` | Geracao de PDF via Puppeteer + Chromium |
| `documentation.js` | Documentacao inline da API |
| `tempFiles.js` | Gerenciamento de arquivos temporarios |
| `package.json` | Dependencias Node.js |
| `Dockerfile` | Build da imagem Docker (usa Chromium via apt) |
| `docker-compose.yml` | Configuracao local para desenvolvimento |
| `portainer-stack.yml` | YAML da stack para colar no Portainer |
| `.env` | Variaveis de ambiente (local, NAO vai para o servidor) |
| `make-release.ps1` | Script para gerar o `.tar.gz` de deploy |
| `DEPLOY.md` | **Este guia** |

---

## Observacao — Arquitetura ARM64

O servidor usa arquitetura **ARM64** (aarch64). O Dockerfile usa **Chromium** via `apt`
do Debian em vez do `google-chrome-stable` (que so tem pacote para `amd64`).

Erro que acontecia com o Chrome:
```
E: Unable to locate package google-chrome-stable
```

O Chromium do Debian tem suporte nativo para `amd64` e `arm64`.
