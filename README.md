# La'vie Pet Banho Experience - MVP

Sistema de autoatendimento para banho de pets em containers self-service.

## 🚀 Tecnologias

- **Frontend & Backend**: Next.js 14 (App Router + TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui
- **Autenticação**: NextAuth.js v5
- **Database**: PostgreSQL + Prisma ORM
- **Pagamentos**: Mercado Pago API
- **Notificações**: Twilio WhatsApp + Resend Email
- **Cache**: Upstash Redis
- **Validação**: Zod

## 📋 Pré-requisitos

- Node.js 18+ 
- Docker & Docker Compose
- npm ou yarn

## 🛠️ Setup Inicial

### 1. Clonar e instalar dependências

```bash
git clone <repository-url>
cd mvp-la-vie
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/laviepet"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN="TEST-your-access-token"
MERCADOPAGO_PUBLIC_KEY="TEST-your-public-key"

# Twilio WhatsApp
TWILIO_ACCOUNT_SID="your-account-sid"
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_WHATSAPP_NUMBER="your-whatsapp-number"

# Email
RESEND_API_KEY="your-resend-api-key"

# Redis
UPSTASH_REDIS_REST_URL="your-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"
```

### 3. Inicializar banco de dados

```bash
# Usando o script automatizado
./scripts/setup-db.sh

# Ou manualmente:
docker compose up -d
npm run db:migrate
npm run db:seed
```

### 4. Iniciar desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

## 🎯 Credenciais de Teste

- **Email**: teste@laviepet.com
- **Senha**: 123456

## 📚 Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Linting
npm run typecheck    # Verificação TypeScript

# Database
npm run db:migrate   # Executar migrações
npm run db:seed      # Popular banco com dados teste
npm run db:studio    # Interface visual do banco
npm run db:generate  # Gerar cliente Prisma
```

## 🏗️ Arquitetura

```
app/
├── (auth)/              # Páginas de autenticação
│   ├── login/
│   ├── register/
│   └── forgot-password/
├── (dashboard)/         # Área protegida
│   ├── page.tsx        # Dashboard principal
│   ├── agendamentos/   # Gestão de agendamentos
│   ├── perfil/         # Perfil do usuário
│   └── ajuda/          # Central de ajuda
├── api/                # API routes
│   ├── auth/          # Autenticação
│   ├── appointments/  # Agendamentos
│   ├── pets/          # Pets
│   └── payments/      # Pagamentos
components/
├── ui/                # Componentes shadcn/ui
├── auth/              # Componentes de auth
├── booking/           # Componentes de agendamento
├── layout/            # Layout components
└── profile/           # Componentes de perfil
lib/
├── auth.ts            # Configuração NextAuth
├── db.ts              # Cliente Prisma
├── mercadopago.ts     # Integração MP
└── utils.ts           # Utilitários
```

## 📊 Fluxo Principal

1. **Cadastro/Login** → NextAuth.js
2. **Agendamento** → Seleção de data/hora/local
3. **Pagamento** → Mercado Pago (PIX/Cartão)
4. **Confirmação** → Webhook automático
5. **QR Code** → Geração e envio
6. **Acesso** → Validação no container

## 🔧 Desenvolvimento

### Adicionando novos componentes

```bash
npx shadcn@latest add [component-name]
```

### Modificando o banco

```bash
# Criar nova migração
npx prisma migrate dev --name [migration-name]

# Aplicar mudanças
npx prisma db push
```

### Executando testes

```bash
npm run test          # Testes unitários
npm run test:e2e     # Testes E2E
npm run test:coverage # Cobertura
```

## 🚢 Deploy

### Vercel (Recomendado)

1. Conectar repositório no Vercel
2. Configurar variáveis de ambiente
3. Deploy automático via Git

### Outras plataformas

- **Database**: Supabase PostgreSQL
- **Cache**: Upstash Redis
- **Storage**: Vercel Blob

## 📋 Checklist MVP

- ✅ Autenticação completa
- ✅ Dashboard protegido
- ✅ Gestão de pets
- ✅ Sistema de agendamentos
- ⏳ Integração Mercado Pago
- ⏳ Geração QR Code
- ⏳ Notificações WhatsApp/Email
- ⏳ Validação de acesso

## 🐛 Troubleshooting

### Problemas comuns

1. **Erro de conexão com banco**
   ```bash
   docker compose down
   docker compose up -d
   ```

2. **Tipos TypeScript**
   ```bash
   npm run db:generate
   npm run typecheck
   ```

3. **Problemas de cache**
   ```bash
   rm -rf .next
   npm run dev
   ```

## 📖 Documentação

Para mais informações, consulte:

- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)

---

**Desenvolvido com ❤️ para La'vie Pet**
