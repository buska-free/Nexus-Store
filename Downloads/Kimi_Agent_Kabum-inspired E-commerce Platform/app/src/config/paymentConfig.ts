/**
 * Configuração de Dados Bancários e de Recebimento
 * Adicione aqui suas informações para receber os pagamentos
 */

export const paymentConfig = {
  // Dados do Pix
  pix: {
    enabled: true,
    key: 'sua-chave-pix-aqui@email.com', // Pode ser: email, CPF, telefone ou chave aleatória
    recipientName: 'Seu Nome Completo',
    bankName: 'Seu Banco',
  },

  // Dados da Conta Bancária para Boleto e Transferência
  bankAccount: {
    enabled: true,
    bankCode: '001', // Código do banco (001 = Banco do Brasil, 341 = Itaú, 033 = Santander, etc)
    bankName: 'Banco do Brasil',
    accountType: 'corrente', // 'corrente' ou 'poupança'
    accountNumber: '123456-7', // Número da conta com dígito
    agency: '1234', // Agência com dígito
    cpfCnpj: '123.456.789-00', // CPF ou CNPJ do titular
    accountHolder: 'Seu Nome Completo',
  },

  // Dados do Mercado Pago (opcional)
  mercadoPago: {
    enabled: false,
    accessToken: 'sua-access-token-aqui',
    publicKey: 'sua-public-key-aqui',
    accountEmail: 'seu-email@mercadopago.com',
  },

  // Dados do PayPal (opcional)
  paypal: {
    enabled: false,
    clientId: 'seu-client-id-aqui',
    businessEmail: 'seu-email@paypal.com',
  },

  // Dados da Empresa
  company: {
    name: 'Nexus Store LTDA',
    cnpj: '12.345.678/0001-90',
    email: 'contato@nexusstore.com',
    phone: '(11) 98765-4321',
    website: 'www.nexusstore.com',
  },

  // Endereço para notas fiscais
  address: {
    street: 'Rua das Flores',
    number: '123',
    complement: 'Sala 10',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
  },
};

// Tipos de dados de recebimento
export interface PaymentMethodData {
  type: 'pix' | 'bank_transfer' | 'mercado_pago' | 'paypal';
  enabled: boolean;
  details: Record<string, string | boolean>;
}

export const activePaymentMethods: PaymentMethodData[] = [
  {
    type: 'pix',
    enabled: paymentConfig.pix.enabled,
    details: {
      key: paymentConfig.pix.key,
      name: paymentConfig.pix.recipientName,
      bank: paymentConfig.pix.bankName,
    },
  },
  {
    type: 'bank_transfer',
    enabled: paymentConfig.bankAccount.enabled,
    details: {
      bank: paymentConfig.bankAccount.bankName,
      agency: paymentConfig.bankAccount.agency,
      account: paymentConfig.bankAccount.accountNumber,
      holder: paymentConfig.bankAccount.accountHolder,
    },
  },
  {
    type: 'mercado_pago',
    enabled: paymentConfig.mercadoPago.enabled,
    details: {
      email: paymentConfig.mercadoPago.accountEmail,
    },
  },
  {
    type: 'paypal',
    enabled: paymentConfig.paypal.enabled,
    details: {
      email: paymentConfig.paypal.businessEmail,
    },
  },
];
