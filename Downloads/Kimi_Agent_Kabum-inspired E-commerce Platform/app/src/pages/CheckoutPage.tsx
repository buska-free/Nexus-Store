import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  CreditCard,
  QrCode,
  Receipt,
  Truck,
  Check,
  Lock,
  Package,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAdminStore } from '@/store/adminStore';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

type CheckoutStep = 'address' | 'shipping' | 'payment' | 'review';

const steps: { id: CheckoutStep; title: string; icon: React.ElementType }[] = [
  { id: 'address', title: 'Endereço', icon: MapPin },
  { id: 'shipping', title: 'Entrega', icon: Truck },
  { id: 'payment', title: 'Pagamento', icon: CreditCard },
  { id: 'review', title: 'Revisão', icon: Check },
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { items, getSubtotal, getDiscountAmount, getTotal, clearCart } = useCartStore();
  const getProductPrice = useAdminStore((state) => state.getProductPrice);
  const { user } = useUserStore();

  // Form states
  const [address, setAddress] = useState({
    cep: user?.addresses?.[0]?.zipCode || '',
    street: user?.addresses?.[0]?.street || '',
    number: user?.addresses?.[0]?.number || '',
    complement: user?.addresses?.[0]?.complement || '',
    neighborhood: user?.addresses?.[0]?.neighborhood || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardData, setCardData] = useState({
    number: '',
    holderName: '',
    expiry: '',
    cvv: '',
    installments: '1',
  });

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#1A1A1A] py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-[#2C2C2C] rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Carrinho vazio</h1>
          <p className="text-gray-400 mb-8">Adicione produtos ao carrinho para continuar.</p>
          <Button onClick={() => navigate('/produtos')} className="bg-[#FF6600] hover:bg-[#E55A00]">
            Ver Produtos
          </Button>
        </div>
      </main>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const shippingOptions = [
    { id: 'standard', name: 'Envio Correios Pac', price: 0, time: '25-30 Dias úteis' },
    { id: 'express', name: 'Expresso', price: 29.99, time: '15-20 Dias úteis' },
    { id: 'same_day', name: 'Nuvem Envio Correios Sedex', price: 59.99, time: '7-12 Dias Úteis' },
  ];

  const selectedShipping = shippingOptions.find((s) => s.id === shippingMethod);
  const shippingPrice = selectedShipping?.price || 0;
  const finalTotal = getTotal() + shippingPrice;

  const handleNext = () => {
    const stepIndex = steps.findIndex((s) => s.id === currentStep);
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1].id);
    }
  };

  const handleBack = () => {
    const stepIndex = steps.findIndex((s) => s.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].id);
    } else {
      navigate('/carrinho');
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast.success('Pedido realizado com sucesso!', {
      description: 'Você receberá um e-mail com os detalhes do pedido.',
    });
    
    clearCart();
    navigate('/pedido-sucesso');
    setIsProcessing(false);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 'address':
        return (
          address.cep &&
          address.street &&
          address.number &&
          address.neighborhood &&
          address.city &&
          address.state
        );
      case 'shipping':
        return !!shippingMethod;
      case 'payment':
        if (paymentMethod === 'credit_card') {
          return (
            cardData.number &&
            cardData.holderName &&
            cardData.expiry &&
            cardData.cvv
          );
        }
        return true;
      default:
        return true;
    }
  };

  const sanitizeCep = (raw: string) => raw.replace(/[^0-9]/g, '');

  const lookupCep = async (rawCep: string) => {
    const cep = sanitizeCep(rawCep);
    if (!cep || cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!res.ok) throw new Error('Erro ao consultar CEP');
      const data = await res.json();
      if (data.erro) {
        toast.error('CEP não encontrado');
        return;
      }
      setAddress((prev) => ({
        ...prev,
        street: data.logradouro || prev.street,
        neighborhood: data.bairro || prev.neighborhood,
        city: data.localidade || prev.city,
        state: data.uf || prev.state,
      }));
      toast.success('Endereço preenchido automaticamente');
    } catch (err) {
      toast.error('Não foi possível buscar o CEP');
    }
  };

  const handleCepChange = (value: string) => {
    setAddress((prev) => ({ ...prev, cep: value }));
    const digits = sanitizeCep(value);
    if (digits.length === 8) lookupCep(digits);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'address':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <Label className="text-white mb-2 block">CEP</Label>
                <Input
                  value={address.cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  onBlur={() => lookupCep(address.cep)}
                  placeholder="00000-000"
                  maxLength={9}
                  className="bg-[#1A1A1A] border-[#4A4A4A] text-white"
                />
              </div>
            </div>
            <div>
              <Label className="text-white mb-2 block">Rua</Label>
              <Input
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                placeholder="Nome da rua"
                className="bg-[#1A1A1A] border-[#4A4A4A] text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white mb-2 block">Número</Label>
                <Input
                  value={address.number}
                  onChange={(e) => setAddress({ ...address, number: e.target.value })}
                  placeholder="123"
                  className="bg-[#1A1A1A] border-[#4A4A4A] text-white"
                />
              </div>
              <div>
                <Label className="text-white mb-2 block">Complemento</Label>
                <Input
                  value={address.complement}
                  onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                  placeholder="Apto, bloco, etc."
                  className="bg-[#1A1A1A] border-[#4A4A4A] text-white"
                />
              </div>
            </div>
            <div>
              <Label className="text-white mb-2 block">Bairro</Label>
              <Input
                value={address.neighborhood}
                onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                placeholder="Bairro"
                className="bg-[#1A1A1A] border-[#4A4A4A] text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white mb-2 block">Cidade</Label>
                <Input
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="Cidade"
                  className="bg-[#1A1A1A] border-[#4A4A4A] text-white"
                />
              </div>
              <div>
                <Label className="text-white mb-2 block">Estado</Label>
                <Input
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  placeholder="UF"
                  maxLength={2}
                  className="bg-[#1A1A1A] border-[#4A4A4A] text-white"
                />
              </div>
            </div>
          </div>
        );

      case 'shipping':
        return (
          <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-4">
            {shippingOptions.map((option) => (
              <label
                key={option.id}
                className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                  shippingMethod === option.id
                    ? 'border-[#FF6600] bg-[#FF6600]/10'
                    : 'border-[#4A4A4A] hover:border-[#FF6600]/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <RadioGroupItem value={option.id} className="border-[#FF6600] text-[#FF6600]" />
                  <div>
                    <p className="text-white font-medium">{option.name}</p>
                    <p className="text-gray-400 text-sm">{option.time}</p>
                  </div>
                </div>
                <span className="text-[#FF6600] font-semibold">
                  {option.price === 0 ? 'Grátis' : formatPrice(option.price)}
                </span>
              </label>
            ))}
          </RadioGroup>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            {/* Métodos de pagamento */}
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
              {/* Cartão de Crédito */}
              <label
                className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                  paymentMethod === 'credit_card'
                    ? 'border-[#FF6600] bg-[#FF6600]/10'
                    : 'border-[#4A4A4A] hover:border-[#FF6600]/50'
                }`}
              >
                <RadioGroupItem value="credit_card" className="border-[#FF6600] text-[#FF6600]" />
                <CreditCard className="w-6 h-6 text-[#FF6600]" />
                <div className="flex-1">
                  <p className="text-white font-medium">Cartão de Crédito</p>
                  <p className="text-gray-400 text-sm">Visa, Mastercard, Elo, Amex</p>
                </div>
                <div className="flex gap-1">
                  <img src="/images/payments/visa.svg" alt="Visa" className="h-6" />
                  <img src="/images/payments/mastercard.svg" alt="Mastercard" className="h-6" />
                </div>
              </label>

              {/* Pix */}
              <label
                className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                  paymentMethod === 'pix'
                    ? 'border-[#FF6600] bg-[#FF6600]/10'
                    : 'border-[#4A4A4A] hover:border-[#FF6600]/50'
                }`}
              >
                <RadioGroupItem value="pix" className="border-[#FF6600] text-[#FF6600]" />
                <QrCode className="w-6 h-6 text-[#FF6600]" />
                <div className="flex-1">
                  <p className="text-white font-medium">Pix</p>
                  <p className="text-gray-400 text-sm">Pagamento instantâneo</p>
                </div>
                <img src="/images/payments/pix.svg" alt="Pix" className="h-6" />
              </label>

              {/* Boleto */}
              <label
                className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                  paymentMethod === 'boleto'
                    ? 'border-[#FF6600] bg-[#FF6600]/10'
                    : 'border-[#4A4A4A] hover:border-[#FF6600]/50'
                }`}
              >
                <RadioGroupItem value="boleto" className="border-[#FF6600] text-[#FF6600]" />
                <Receipt className="w-6 h-6 text-[#FF6600]" />
                <div className="flex-1">
                  <p className="text-white font-medium">Boleto Bancário</p>
                  <p className="text-gray-400 text-sm">Pague em qualquer banco</p>
                </div>
                <img src="/images/payments/boleto.svg" alt="Boleto" className="h-6" />
              </label>
            </RadioGroup>

            {/* Formulário do cartão */}
            {paymentMethod === 'credit_card' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <Label className="text-white mb-2 block">Número do Cartão</Label>
                  <Input
                    value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                    placeholder="0000 0000 0000 0000"
                    className="bg-[#1A1A1A] border-[#4A4A4A] text-white"
                  />
                </div>
                <div>
                  <Label className="text-white mb-2 block">Nome no Cartão</Label>
                  <Input
                    value={cardData.holderName}
                    onChange={(e) => setCardData({ ...cardData, holderName: e.target.value })}
                    placeholder="Como aparece no cartão"
                    className="bg-[#1A1A1A] border-[#4A4A4A] text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white mb-2 block">Validade</Label>
                    <Input
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      placeholder="MM/AA"
                      className="bg-[#1A1A1A] border-[#4A4A4A] text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white mb-2 block">CVV</Label>
                    <Input
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      placeholder="123"
                      maxLength={4}
                      className="bg-[#1A1A1A] border-[#4A4A4A] text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white mb-2 block">Parcelas</Label>
                  <select
                    value={cardData.installments}
                    onChange={(e) => setCardData({ ...cardData, installments: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#4A4A4A] rounded-lg px-4 py-2 text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                      <option key={n} value={n}>
                        {n}x de {formatPrice(finalTotal / n)} {n === 1 ? 'à vista' : 'sem juros'}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {/* Info Pix */}
            {paymentMethod === 'pix' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-[#1A1A1A] rounded-lg p-4 text-center"
              >
                <QrCode className="w-32 h-32 mx-auto mb-4 text-[#FF6600]" />
                <p className="text-white mb-2">QR Code será gerado após confirmar o pedido</p>
                <p className="text-gray-400 text-sm">Você terá 30 minutos para realizar o pagamento</p>
              </motion.div>
            )}

            {/* Info Boleto */}
            {paymentMethod === 'boleto' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-[#1A1A1A] rounded-lg p-4"
              >
                <p className="text-white mb-2">O boleto será gerado após confirmar o pedido</p>
                <p className="text-gray-400 text-sm">Vencimento em 3 dias úteis</p>
              </motion.div>
            )}
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            {/* Resumo do pedido */}
            <div className="bg-[#1A1A1A] rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4">Produtos</h3>
              <div className="space-y-3">
                {items.map((item) => {
                  const pricing = getProductPrice(item.product.id);
                  return (
                    <div key={`${item.product.id}-${item.variant}`} className="flex gap-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-white text-sm">{item.product.name}</p>
                        <p className="text-gray-400 text-xs">
                          {item.quantity}x {formatPrice(pricing.currentPrice)}
                        </p>
                      </div>
                      <p className="text-white font-medium">
                        {formatPrice(pricing.currentPrice * item.quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Endereço */}
            <div className="bg-[#1A1A1A] rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Endereço de Entrega</h3>
              <p className="text-gray-400 text-sm">
                {address.street}, {address.number}
                {address.complement && ` - ${address.complement}`}
              </p>
              <p className="text-gray-400 text-sm">
                {address.neighborhood} - {address.city}, {address.state}
              </p>
              <p className="text-gray-400 text-sm">CEP: {address.cep}</p>
            </div>

            {/* Entrega */}
            <div className="bg-[#1A1A1A] rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Método de Entrega</h3>
              <p className="text-gray-400 text-sm">
                {selectedShipping?.name} - {selectedShipping?.time}
              </p>
            </div>

            {/* Pagamento */}
            <div className="bg-[#1A1A1A] rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Forma de Pagamento</h3>
              <p className="text-gray-400 text-sm">
                {paymentMethod === 'credit_card' && 'Cartão de Crédito'}
                {paymentMethod === 'pix' && 'Pix'}
                {paymentMethod === 'boleto' && 'Boleto Bancário'}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-[#1A1A1A] py-8">
      <div className="container mx-auto px-4">
        {/* Progresso */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = steps.findIndex((s) => s.id === currentStep) > index;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex flex-col items-center ${
                      isActive
                        ? 'text-[#FF6600]'
                        : isCompleted
                        ? 'text-green-500'
                        : 'text-gray-500'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        isActive
                          ? 'border-[#FF6600] bg-[#FF6600]/10'
                          : isCompleted
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-gray-600'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 sm:w-20 h-0.5 mx-2 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo do passo */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#2C2C2C] rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">
                {steps.find((s) => s.id === currentStep)?.title}
              </h2>
              {renderStepContent()}
            </motion.div>

            {/* Botões de navegação */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-[#4A4A4A] text-white hover:bg-[#3C3C3C]"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              {currentStep === 'review' ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="bg-[#FF6600] hover:bg-[#E55A00] text-white"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Confirmar Pedido
                      <Check className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="bg-[#FF6600] hover:bg-[#E55A00] text-white disabled:opacity-50"
                >
                  Continuar
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Resumo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-[#2C2C2C] rounded-xl p-6 sticky top-40">
              <h3 className="text-white font-semibold mb-4">Resumo do Pedido</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(getSubtotal())}</span>
                </div>
                {getDiscountAmount() > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Desconto</span>
                    <span>-{formatPrice(getDiscountAmount())}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400">
                  <span>Frete</span>
                  <span>{shippingPrice === 0 ? 'Grátis' : formatPrice(shippingPrice)}</span>
                </div>
              </div>

              <div className="border-t border-[#4A4A4A] pt-4 mb-4">
                <div className="flex justify-between text-white">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold text-[#FF6600]">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Lock className="w-4 h-4" />
                <span>Pagamento seguro e criptografado</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
