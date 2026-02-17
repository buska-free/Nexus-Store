import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Package, Truck, Mail, Home, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function OrderSuccessPage() {
  const orderNumber = Math.random().toString(36).substring(2, 10).toUpperCase();

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-[#1A1A1A] py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Ícone de sucesso */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <Check className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Pedido realizado com sucesso!
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Obrigado por comprar conosco. Seu pedido foi confirmado e está sendo processado.
          </p>

          {/* Número do pedido */}
          <div className="bg-[#2C2C2C] rounded-xl p-6 mb-8">
            <p className="text-gray-400 text-sm mb-2">Número do pedido</p>
            <p className="text-2xl font-bold text-[#FF6600] font-mono">#{orderNumber}</p>
          </div>

          {/* Próximos passos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#2C2C2C] rounded-xl p-6">
              <div className="w-12 h-12 bg-[#FF6600]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-[#FF6600]" />
              </div>
              <h3 className="text-white font-semibold mb-2">Confirmação</h3>
              <p className="text-gray-400 text-sm">
                Você receberá um e-mail com os detalhes do pedido
              </p>
            </div>
            <div className="bg-[#2C2C2C] rounded-xl p-6">
              <div className="w-12 h-12 bg-[#FF6600]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-[#FF6600]" />
              </div>
              <h3 className="text-white font-semibold mb-2">Separação</h3>
              <p className="text-gray-400 text-sm">
                Seu pedido está sendo preparado para envio
              </p>
            </div>
            <div className="bg-[#2C2C2C] rounded-xl p-6">
              <div className="w-12 h-12 bg-[#FF6600]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6 text-[#FF6600]" />
              </div>
              <h3 className="text-white font-semibold mb-2">Entrega</h3>
              <p className="text-gray-400 text-sm">
                Acompanhe o rastreamento do seu pedido
              </p>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-[#FF6600] hover:bg-[#E55A00] text-white px-8 py-3">
                <Home className="w-5 h-5 mr-2" />
                Voltar para o início
              </Button>
            </Link>
            <Link to="/produtos">
              <Button
                variant="outline"
                className="border-[#4A4A4A] text-white hover:bg-[#3C3C3C] px-8 py-3"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Continuar comprando
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
