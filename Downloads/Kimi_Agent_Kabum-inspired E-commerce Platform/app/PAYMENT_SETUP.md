# 💰 Como Configurar Suas Formas de Recebimento

## 📍 Arquivo de Configuração

O arquivo `src/config/paymentConfig.ts` é onde você coloca **TODOS seus dados bancários** para receber os pagamentos dos clientes.

## 🎯 O que você precisa preencher:

### 1️⃣ **PIX** (Recomendado - Instantâneo)
```typescript
pix: {
  enabled: true,
  key: 'sua-chave-pix-aqui@email.com', // Email, CPF, telefone ou chave aleatória
  recipientName: 'Seu Nome Completo',
  bankName: 'Seu Banco (ex: Banco do Brasil)',
}
```
- [Como gerar chave Pix?](https://www.bcb.gov.br/pix)

### 2️⃣ **Conta Bancária** (Para boleto e transferência)
```typescript
bankAccount: {
  enabled: true,
  bankCode: '001', // 001 = BB, 341 = Itaú, 033 = Santander, etc
  bankName: 'Banco do Brasil',
  accountType: 'corrente',
  accountNumber: '123456-7',
  agency: '1234',
  cpfCnpj: '123.456.789-00',
  accountHolder: 'Seu Nome Completo',
}
```
- Encontre o código do seu banco [aqui](https://www.bcb.gov.br/)

### 3️⃣ **Mercado Pago** (Opcional - Mais taxas)
```typescript
mercadoPago: {
  enabled: false,
  accessToken: 'sua-access-token-aqui',
  publicKey: 'sua-public-key-aqui',
  accountEmail: 'seu-email@mercadopago.com',
}
```

### 4️⃣ **PayPal** (Opcional)
```typescript
paypal: {
  enabled: false,
  clientId: 'seu-client-id-aqui',
  businessEmail: 'seu-email@paypal.com',
}
```

---

## 📝 Dados da sua Empresa
```typescript
company: {
  name: 'Nexus Store',
  cnpj: '12.345.678/0001-90',
  email: 'contato@nexusstore.com',
  phone: '(11) 98765-4321',
  website: 'www.nexusstore.com',
}
```

---

## ⚙️ Como usar nos pagamentos

Esses dados serão usados para:
1. ✅ **Gerar QR Code do Pix** - Mostrado para o cliente
2. ✅ **Dados para boleto** - Cliente copia os dados do seu banco
3. ✅ **Recebimento automático** - Se integrar com APIs
4. ✅ **Notas Fiscais** - Dados da empresa

---

## 🔒 Segurança

**IMPORTANTE:**
- Nunca compartilhe sua chave Pix ou tokens
- Use variáveis de ambiente para dados sensíveis (.env)
- Remova dados reais antes de fazer push para repositório público

### Opção: Usar .env

Crie um arquivo `.env` na raiz do projeto:
```
VITE_PIX_KEY=sua-chave-pix
VITE_MERCADO_PAGO_ACCESS_TOKEN=seu-token
VITE_PAYPAL_CLIENT_ID=seu-id
```

E acesse assim:
```typescript
const pixKey = import.meta.env.VITE_PIX_KEY;
```

---

## 📍 Próximos Passos

1. Edite `src/config/paymentConfig.ts` com seus dados reais
2. Escolha quais métodos ativar (enabled: true/false)
3. Teste o checkout com os dados preenchidos
