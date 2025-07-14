#!/bin/bash

echo "🚀 Configurando La'vie Pet MVP Database..."

# Navegar para o diretório raiz do projeto
cd "$(dirname "$0")/.."

# Verificar se o Docker está disponível
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Por favor, instale o Docker primeiro."
    echo "📖 Guia: https://docs.docker.com/get-docker/"
    exit 1
fi

# Iniciar containers
echo "🐳 Iniciando containers..."
docker compose up -d

# Aguardar PostgreSQL inicializar
echo "⏳ Aguardando PostgreSQL inicializar..."
sleep 10

# Executar migrações
echo "📦 Executando migrações do banco..."
npx prisma migrate deploy

# Executar seed
echo "🌱 Populando banco com dados iniciais..."
npx prisma db seed

echo "✅ Setup concluído!"
echo ""
echo "🎯 Próximos passos:"
echo "1. Execute: npm run dev"
echo "2. Acesse: http://localhost:3000"
echo "3. Use as credenciais de teste:"
echo "   Email: teste@laviepet.com"
echo "   Senha: 123456"
echo ""
echo "📊 Para visualizar o banco: npx prisma studio"