#!/bin/bash

# Script para construir e executar a API no Docker

echo "🐳 Construindo imagem Docker da API Markdown para PDF..."

# Build da imagem
docker build -t markdown-to-pdf-api:latest .

if [ $? -eq 0 ]; then
    echo "✅ Imagem construída com sucesso!"
    
    echo "🚀 Iniciando container..."
    
    # Parar container existente se estiver rodando
    docker stop markdown-api 2>/dev/null || true
    docker rm markdown-api 2>/dev/null || true
    
    # Executar novo container
    docker run -d \
        --name markdown-api \
        -p 7000:7000 \
        --restart unless-stopped \
        markdown-to-pdf-api:latest
    
    if [ $? -eq 0 ]; then
        echo "✅ Container iniciado com sucesso!"
        echo "🌐 API disponível em: http://localhost:7000"
        echo "📖 Documentação: http://localhost:7000"
        echo "❤️ Health check: http://localhost:7000/health"
        echo ""
        echo "📋 Comandos úteis:"
        echo "   docker logs markdown-api          # Ver logs"
        echo "   docker stop markdown-api          # Parar"
        echo "   docker restart markdown-api       # Reiniciar"
        echo "   docker exec -it markdown-api sh   # Acessar container"
    else
        echo "❌ Erro ao iniciar container"
        exit 1
    fi
else
    echo "❌ Erro ao construir imagem"
    exit 1
fi
