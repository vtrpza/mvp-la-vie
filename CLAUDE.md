# Claude Context - La'vie Pet MVP

## Visão Geral do Projeto

**La'vie Pet Banho Experience** é um sistema de autoatendimento para banho de pets em containers. O MVP permite que tutores agendem horários, paguem online e recebam QR Code para acesso físico aos containers de banho self-service.

**Valor por sessão**: R$ 30,00
**Duração**: 30 minutos + intervalo de limpeza
**Primeira unidade**: Tambaú/SP

## Stack Tecnológico

### Frontend & Backend
- **Next.js 14** (App Router + TypeScript)
- **Tailwind CSS** + **shadcn/ui**
- **NextAuth.js v5** (Auth.js) para autenticação
- **Prisma ORM** com PostgreSQL
- **Zod** para validação de dados

### Integrações
- **Pagamento**: Mercado Pago API (PIX + Cartão)
- **Notificações**: Twilio WhatsApp Business API + Resend Email
- **QR Code**: qrcode library
- **Rate Limiting**: Upstash Redis

### Hosting
- **App**: Vercel
- **Database**: Supabase PostgreSQL
- **Cache**: Upstash Redis

## Arquitetura Aprovada

### Estrutura de Pastas
```
app/
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── forgot-password/page.tsx
├── (dashboard)/
│   ├── layout.tsx (protected)
│   ├── page.tsx
│   ├── agendamentos/
│   ├── perfil/page.tsx
│   └── ajuda/page.tsx
├── api/
│   ├── auth/[...nextauth]/route.ts
│   ├── appointments/
│   ├── payments/
│   ├── notifications/
│   └── qr-codes/
components/
├── ui/ (shadcn)
├── auth/
├── booking/
├── payment/
└── layout/
lib/
├── auth.ts
├── db.ts
├── mercadopago.ts
├── notifications.ts
└── utils.ts
```

### Modelos de Dados (Prisma)
```prisma
User {
  id, email, name, phone, password
  pets[], appointments[]
}

Pet {
  id, name, breed, size, notes
  user, appointments[]
}

Appointment {
  id, date, startTime, endTime, status, totalAmount, qrCode
  user, pet, location, payment
}

Payment {
  id, amount, status, paymentMethod, mercadoPagoId
  appointment
}

Location {
  id, name, address, isActive, capacity
  appointments[]
}
```

## Fluxo Principal

1. **Cadastro/Login** → NextAuth.js
2. **Agendamento** → Seleção de data/hora/local
3. **Pagamento** → Mercado Pago checkout
4. **Webhook** → Confirmação automática
5. **QR Code** → Geração e envio via WhatsApp/Email
6. **Acesso** → Validação no container

## Padrões de Código

### TypeScript
- Interfaces explícitas para todos os dados
- Strict mode habilitado
- Zod schemas para validação

### Componentes React
- Server Components por padrão
- 'use client' apenas quando necessário
- Composição over inheritance

### Tratamento de Erros
```typescript
try {
  // código
} catch (error) {
  console.error('[CONTEXTO]:', error)
  // tratamento adequado
}
```

### Validação com Zod
```typescript
const appointmentSchema = z.object({
  date: z.string().datetime(),
  petId: z.string().cuid(),
  locationId: z.string().cuid()
})
```

## Comandos Importantes

### Desenvolvimento
```bash
npm run dev          # Servidor desenvolvimento
npm run build        # Build produção
npm run lint         # ESLint
npm run typecheck    # TypeScript check
```

### Database
```bash
npx prisma migrate dev    # Migração desenvolvimento
npx prisma migrate deploy # Migração produção
npx prisma generate       # Gerar cliente
npx prisma studio         # Interface visual
```

### Testes
```bash
npm run test              # Testes unitários
npm run test:e2e         # Testes E2E
npm run test:coverage    # Cobertura
```

## Variáveis de Ambiente

### Desenvolvimento (.env.local)
```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN="TEST-..."
MERCADOPAGO_PUBLIC_KEY="TEST-..."

# Twilio WhatsApp
TWILIO_ACCOUNT_SID="..."
TWILIO_AUTH_TOKEN="..."
TWILIO_WHATSAPP_NUMBER="..."

# Email
RESEND_API_KEY="..."

# Redis
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."
```

## Regras de Negócio

### Agendamentos
- Slots de 30 minutos
- Intervalo de 15 minutos para limpeza
- Funcionamento: 7:30 às 22:30, todos os dias
- Máximo 1 agendamento simultâneo por container
- Cancelamento até 2h antes do horário

### Pagamentos
- Valor fixo: R$ 30,00
- PIX e Cartão aceitos
- Webhook obrigatório para confirmação
- Reembolso automático em casos de falha

### QR Code
- Válido 30 min antes até fim do slot
- Gerado apenas após confirmação de pagamento
- Único por agendamento
- Não reutilizável

## Segurança

### Implementações Obrigatórias
- Input validation com Zod
- Rate limiting (5 req/min por IP)
- CSRF protection (NextAuth)
- SQL injection prevention (Prisma)
- XSS prevention (React + CSP)
- Secrets never in client-side

### Logs e Monitoramento
- Structured logging
- No sensitive data in logs
- Error tracking com Sentry
- Performance monitoring

## Critérios de Aceitação MVP

✅ Usuário pode se cadastrar e fazer login
✅ Usuário pode agendar horário disponível
✅ Pagamento processado com sucesso
✅ QR Code gerado e enviado
✅ Notificações WhatsApp/Email funcionando
✅ Responsivo e mobile-first
✅ Deploy funcional na Vercel

## Próximas Funcionalidades (Pós-MVP)

### Fase 2
- Dashboard admin
- Relatórios de uso

## Troubleshooting Comum

### Problemas de Build
1. Verificar tipos TypeScript
2. Validar variáveis de ambiente
3. Testar queries Prisma
4. Verificar imports/exports

### Problemas de Pagamento
1. Verificar webhook URL
2. Validar credenciais MP
3. Testar em ambiente sandbox
4. Verificar logs de webhook

### Problemas de Notificação
1. Verificar credenciais Twilio
2. Testar números de telefone
3. Verificar templates de email
4. Validar rate limits

## Comandos MCP Context7

Para consultar documentação atualizada durante desenvolvimento:

```bash
# Tecnologias principais
@context7 Next.js 14 App Router best practices
@context7 NextAuth.js v5 setup with credentials
@context7 Prisma PostgreSQL schema patterns
@context7 Mercado Pago Node.js integration
@context7 Twilio WhatsApp Business API
@context7 Tailwind CSS component patterns
@context7 Zod validation schemas
```

## Notas Importantes

1. **Mobile First**: Maioria dos acessos via celular
2. **Offline Capable**: PWA com cache estratégico
3. **Performance**: Otimizar Core Web Vitals
4. **Accessibility**: WCAG 2.1 AA compliance
5. **SEO**: Meta tags e structured data

---

**Última atualização**: 2025-01-11
**Versão**: 1.0.0
**Responsável**: Claude Code Assistant