import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  Tag,
  Truck,
  Shield,
  Package,
  ChevronRight,
  Check,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAdminStore } from '@/store/adminStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function CartPage() {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  const getProductPrice = useAdminStore((state) => state.getProductPrice);
  const {
    items,
    couponCode: appliedCoupon,
    discount,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscountAmount,
    getTotal,
    clearCart,
  } = useCartStore();

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Digite um código de cupom');
      return;
    }
    
    setIsApplyingCoupon(true);
    setTimeout(() => {
      const success = applyCoupon(couponCode);
      if (success) {
        toast.success(`Cupom ${couponCode.toUpperCase()} aplicado!`, {
          description: `Você economizou ${(discount * 100).toFixed(0)}%`,
        });
        setCouponCode('');
      } else {
        toast.error('Cupom inválido ou expirado');
      }
      setIsApplyingCoupon(false);
    }, 500);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast.success('Cupom removido');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#1A1A1A] py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-24 h-24 bg-[#2C2C2C] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Seu carrinho está vazio</h1>
            <p className="text-gray-400 mb-8">
              Parece que você ainda não adicionou nenhum produto ao carrinho.
            </p>
            <Link to="/produtos">
              <Button className="bg-[#FF6600] hover:bg-[#E55A00] text-white px-8 py-3">
                Continuar Comprando
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1A1A1A] py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-sm text-gray-500 mb-8"
        >
          <Link to="/" className="hover:text-white transition-colors">Início</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">Carrinho</span>
        </motion.nav>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold text-white mb-8"
        >
          Meu Carrinho
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de produtos */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#2C2C2C] rounded-xl overflow-hidden"
            >
              {/* Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-[#4A4A4A] text-sm text-gray-500">
                <div className="col-span-6">Produto</div>
                <div className="col-span-2 text-center">Quantidade</div>
                <div className="col-span-2 text-center">Preço</div>
                <div className="col-span-2 text-center">Total</div>
              </div>

              {/* Produtos */}
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={`${item.product.id}-${item.variant}`}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-4 border-b border-[#4A4A4A] last:border-0"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      {/* Produto */}
                      <div className="sm:col-span-6 flex gap-4">
                        <Link to={`/produto/${item.product.id}`}>
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-lg bg-[#1A1A1A]"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/placeholder-product.jpg';
                            }}
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/produto/${item.product.id}`}
                            className="text-white font-medium hover:text-[#FF6600] transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-gray-500 text-sm">{item.product.brand}</p>
                          {item.variant && (
                            <p className="text-[#FF6600] text-sm">
                              {item.product.variants?.find((v) => v.id === item.variant)?.name}
                            </p>
                          )}
                          <button
                            onClick={() => removeItem(item.product.id, item.variant)}
                            className="sm:hidden text-red-400 text-sm flex items-center gap-1 mt-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remover
                          </button>
                        </div>
                      </div>

                      {/* Quantidade */}
                      <div className="sm:col-span-2 flex items-center justify-between sm:justify-center">
                        <span className="sm:hidden text-gray-500">Quantidade:</span>
                        <div className="flex items-center bg-[#1A1A1A] rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1, item.variant)
                            }
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center text-white text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1, item.variant)
                            }
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Preço unitário */}
                      <div className="sm:col-span-2 flex items-center justify-between sm:justify-center">
                        <span className="sm:hidden text-gray-500">Preço:</span>
                        <span className="text-gray-400 text-sm">
                          {formatPrice(getProductPrice(item.product.id).currentPrice)}
                        </span>
                      </div>

                      {/* Total */}
                      <div className="sm:col-span-2 flex items-center justify-between sm:justify-center">
                        <span className="sm:hidden text-gray-500">Total:</span>
                        <div className="flex items-center gap-4">
                          <span className="text-white font-semibold">
                            {formatPrice(getProductPrice(item.product.id).currentPrice * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(item.product.id, item.variant)}
                            className="hidden sm:block text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
              <Link
                to="/produtos"
                className="text-[#FF6600] hover:text-[#FF8533] font-medium flex items-center gap-2 transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Continuar comprando
              </Link>
              <button
                onClick={() => {
                  clearCart();
                  toast.success('Carrinho esvaziado');
                }}
                className="text-red-400 hover:text-red-300 font-medium flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Esvaziar carrinho
              </button>
            </div>
          </div>

          {/* Resumo do pedido */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-[#2C2C2C] rounded-xl p-6 sticky top-40">
              <h2 className="text-xl font-bold text-white mb-6">Resumo do Pedido</h2>

              {/* Cupom */}
              <div className="mb-6">
                <label className="text-gray-400 text-sm mb-2 block">Cupom de desconto</label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-green-400 font-medium">{appliedCoupon}</p>
                        <p className="text-green-400/70 text-xs">
                          {(discount * 100).toFixed(0)}% de desconto
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        type="text"
                        placeholder="Digite o código"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="pl-10 bg-[#1A1A1A] border-[#4A4A4A] text-white placeholder:text-gray-500"
                      />
                    </div>
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon}
                      className="bg-[#FF6600] hover:bg-[#E55A00] text-white"
                    >
                      {isApplyingCoupon ? 'Aplicando...' : 'Aplicar'}
                    </Button>
                  </div>
                )}
                <p className="text-gray-500 text-xs mt-2">
                  Tente: DESCONTO10, DESCONTO20, PRIMEIRA, BLACK50
                </p>
              </div>

              {/* Totais */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Frete</span>
                  <span className="text-green-400">Grátis</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Desconto</span>
                    <span>-{formatPrice(getDiscountAmount())}</span>
                  </div>
                )}
                <div className="border-t border-[#4A4A4A] pt-3">
                  <div className="flex justify-between text-white">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold text-[#FF6600]">
                      {formatPrice(getTotal())}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm text-right">
                    ou em até 12x de {formatPrice(getTotal() / 12)}
                  </p>
                </div>
              </div>

              {/* Botão de checkout */}
              <Button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#FF6600] hover:bg-[#E55A00] text-white h-14 text-lg font-semibold mb-4"
              >
                Finalizar Compra
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {/* Informações de segurança */}
              <div className="space-y-3 pt-4 border-t border-[#4A4A4A]">
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Truck className="w-5 h-5 text-[#FF6600]" />
                  <span>Frete grátis para todo o Brasil</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Shield className="w-5 h-5 text-[#FF6600]" />
                  <span>Compra 100% segura</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Package className="w-5 h-5 text-[#FF6600]" />
                  <span>Entrega em até 30 dias úteis</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
