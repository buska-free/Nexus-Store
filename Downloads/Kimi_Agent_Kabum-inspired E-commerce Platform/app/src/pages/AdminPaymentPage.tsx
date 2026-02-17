import { useState } from 'react';
import { Save, Edit2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { paymentConfig } from '@/config/paymentConfig';

export function AdminPaymentPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [config, setConfig] = useState(paymentConfig);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Aqui você faria um POST para o seu backend
      // await api.post('/admin/payment-config', config);
      
      // Por enquanto, salva no localStorage
      localStorage.setItem('paymentConfig', JSON.stringify(config));
      toast.success('✅ Configurações salvas com sucesso!');
      setIsEditing(false);
    } catch (error) {
      toast.error('❌ Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const updateConfig = (path: string, value: string | boolean) => {
    const keys = path.split('.');
    const newConfig = JSON.parse(JSON.stringify(config));
    let current = newConfig;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setConfig(newConfig);
  };

  const renderInput = (label: string, path: string, placeholder: string, isSecret = false) => (
    <div className="space-y-2">
      <Label className="text-gray-300">{label}</Label>
      <div className="relative">
        <Input
          type={isSecret && !showSecrets ? 'password' : 'text'}
          value={getValueFromPath(config, path) || ''}
          onChange={(e) => updateConfig(path, e.target.value)}
          placeholder={placeholder}
          disabled={!isEditing}
          className={`bg-[#2C2C2C] border-[#4A4A4A] text-white ${
            !isEditing ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        />
        {isSecret && (
          <button
            onClick={() => setShowSecrets(!showSecrets)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showSecrets ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        )}
      </div>
    </div>
  );

  const renderToggle = (label: string, path: string) => (
    <div className="flex items-center justify-between">
      <Label className="text-gray-300">{label}</Label>
      <input
        type="checkbox"
        checked={getValueFromPath(config, path) as boolean}
        onChange={(e) => updateConfig(path, e.target.checked)}
        disabled={!isEditing}
        className="w-5 h-5 rounded cursor-pointer"
      />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#1A1A1A] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">💰 Configurar Pagamentos</h1>
            <p className="text-gray-400">Adicione suas informações de recebimento</p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-8">
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className="border-[#FF6600] text-[#FF6600] hover:bg-[#FF6600]/10"
            >
              <Edit2 size={18} className="mr-2" />
              {isEditing ? 'Cancelar' : 'Editar'}
            </Button>
            {isEditing && (
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#FF6600] hover:bg-[#E55A00]"
              >
                <Save size={18} className="mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            )}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="pix" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-[#2C2C2C]">
              <TabsTrigger value="pix" className="data-[state=active]:bg-[#FF6600]">
                Pix
              </TabsTrigger>
              <TabsTrigger value="bank" className="data-[state=active]:bg-[#FF6600]">
                Banco
              </TabsTrigger>
              <TabsTrigger value="mercado" className="data-[state=active]:bg-[#FF6600]">
                Mercado Pago
              </TabsTrigger>
              <TabsTrigger value="company" className="data-[state=active]:bg-[#FF6600]">
                Empresa
              </TabsTrigger>
            </TabsList>

            {/* PIX */}
            <TabsContent value="pix">
              <Card className="bg-[#2C2C2C] border-[#4A4A4A] p-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    {renderToggle('Ativar Pix', 'pix.enabled')}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {renderInput('Chave Pix', 'pix.key', 'seu-email@banco.com ou CPF', true)}
                    {renderInput('Nome do Recebedor', 'pix.recipientName', 'Seu Nome Completo')}
                  </div>

                  {renderInput('Banco', 'pix.bankName', 'Ex: Banco do Brasil')}

                  <div className="bg-[#1A1A1A] border border-[#4A4A4A] rounded p-4">
                    <p className="text-gray-400 text-sm">
                      ℹ️ <strong>Tipos de Chave Pix:</strong> Email, CPF, Telefone ou Chave Aleatória (gerada pelo banco)
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* BANCO */}
            <TabsContent value="bank">
              <Card className="bg-[#2C2C2C] border-[#4A4A4A] p-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    {renderToggle('Ativar Transferência Bancária', 'bankAccount.enabled')}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {renderInput('Código do Banco', 'bankAccount.bankCode', '001')}
                    {renderInput('Nome do Banco', 'bankAccount.bankName', 'Banco do Brasil')}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {renderInput('Agência', 'bankAccount.agency', '1234')}
                    {renderInput('Número da Conta', 'bankAccount.accountNumber', '123456-7')}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {renderInput('CPF/CNPJ', 'bankAccount.cpfCnpj', '123.456.789-00', true)}
                    {renderInput('Titular da Conta', 'bankAccount.accountHolder', 'Seu Nome')}
                  </div>

                  <div className="bg-[#1A1A1A] border border-[#4A4A4A] rounded p-4">
                    <p className="text-gray-400 text-sm">
                      ℹ️ Esses dados são usados para gerar boletos e informações de transferência para seus clientes
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* MERCADO PAGO */}
            <TabsContent value="mercado">
              <Card className="bg-[#2C2C2C] border-[#4A4A4A] p-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    {renderToggle('Ativar Mercado Pago', 'mercadoPago.enabled')}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {renderInput('Email da Conta', 'mercadoPago.accountEmail', 'seu-email@mercadopago.com')}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {renderInput('Access Token', 'mercadoPago.accessToken', 'APP_USR_xxxxxxxx', true)}
                    {renderInput('Public Key', 'mercadoPago.publicKey', 'PROD_xxxxxxxx', true)}
                  </div>

                  <div className="bg-[#1A1A1A] border border-[#4A4A4A] rounded p-4 space-y-2">
                    <p className="text-gray-400 text-sm">
                      ℹ️ <a href="https://www.mercadopago.com.br/developers/pt/guides/resources/credentials" target="_blank" className="text-[#FF6600] hover:underline">Gerar suas credenciais aqui</a>
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* EMPRESA */}
            <TabsContent value="company">
              <Card className="bg-[#2C2C2C] border-[#4A4A4A] p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {renderInput('Nome da Empresa', 'company.name', 'Nexus Store')}
                    {renderInput('CNPJ', 'company.cnpj', '12.345.678/0001-90')}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {renderInput('Email', 'company.email', 'contato@empresa.com')}
                    {renderInput('Telefone', 'company.phone', '(11) 98765-4321')}
                  </div>

                  {renderInput('Website', 'company.website', 'www.empresa.com')}

                  <div className="border-t border-[#4A4A4A] pt-6 mt-6">
                    <h3 className="text-white font-semibold mb-4">Endereço</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {renderInput('Rua', 'address.street', 'Rua das Flores')}
                      {renderInput('Número', 'address.number', '123')}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {renderInput('Complemento', 'address.complement', 'Sala 10')}
                      {renderInput('Bairro', 'address.neighborhood', 'Centro')}
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {renderInput('Cidade', 'address.city', 'São Paulo')}
                      {renderInput('Estado', 'address.state', 'SP')}
                      {renderInput('CEP', 'address.zipCode', '01310-100')}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}

// Helper para pegar valor do objeto aninhado
function getValueFromPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}
