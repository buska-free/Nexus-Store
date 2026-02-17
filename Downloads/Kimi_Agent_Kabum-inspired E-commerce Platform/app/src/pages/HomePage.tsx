import { HeroSection } from '@/sections/HeroSection';
import { CategoriesSection } from '@/sections/CategoriesSection';
import { FeaturedProductsSection, NewProductsSection, TrendingProductsSection } from '@/sections/FeaturedProductsSection';
import { motion } from 'framer-motion';
import { Truck, Shield, CreditCard, Headphones, Zap, Award } from 'lucide-react';

function BenefitsSection() {
  const benefits = [
    {
      icon: Truck,
      title: 'Frete Grátis',
      description: 'Em compras acima de R$ 999',
    },
    {
      icon: Shield,
      title: 'Compra Segura',
      description: 'Site 100% protegido com SSL',
    },
    {
      icon: CreditCard,
      title: 'Parcelamento',
      description: 'Em até 12x sem juros',
    },
    {
      icon: Headphones,
      title: 'Suporte 24/7',
      description: 'Atendimento especializado',
    },
    {
      icon: Zap,
      title: 'Entrega Rápida',
      description: 'Envio em até 24h',
    },
    {
      icon: Award,
      title: 'Garantia',
      description: 'Produtos com garantia oficial',
    },
  ];

  return (
    <section className="py-16 bg-[#2C2C2C]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Por que comprar na <span className="text-[#FF6600]">Nexus Store</span>?
          </h2>
          <p className="text-gray-400">Oferecemos a melhor experiência de compra online</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#FF6600]/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#FF6600]/20 transition-colors">
                  <Icon className="w-8 h-8 text-[#FF6600]" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{benefit.title}</h3>
                <p className="text-gray-500 text-xs">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-[#FF6600] to-[#E55A00]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Receba ofertas exclusivas!
          </h2>
          <p className="text-white/80 mb-8">
            Cadastre-se na nossa newsletter e seja o primeiro a saber das novidades e promoções.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Digite seu e-mail"
              className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#1A1A1A] text-white font-semibold rounded-lg hover:bg-[#2C2C2C] transition-colors"
            >
              Cadastrar
            </button>
          </form>
          
          <p className="text-white/60 text-xs mt-4">
            Ao se cadastrar, você concorda com nossa Política de Privacidade.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <NewProductsSection />
      <TrendingProductsSection />
      <BenefitsSection />
      <NewsletterSection />
    </main>
  );
}
