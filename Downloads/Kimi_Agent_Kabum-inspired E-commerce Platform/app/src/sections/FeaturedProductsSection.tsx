import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Flame, Sparkles, TrendingUp } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { getFeaturedProducts, getNewProducts } from '@/data/products';
import { Button } from '@/components/ui/button';

interface ProductSectionProps {
  title: string;
  highlightText: string;
  subtitle: string;
  products: ReturnType<typeof getFeaturedProducts>;
  icon: React.ElementType;
  viewAllLink: string;
  variant?: 'default' | 'new' | 'trending';
}

function ProductSection({
  title,
  highlightText,
  subtitle,
  products,
  icon: Icon,
  viewAllLink,
  variant = 'default',
}: ProductSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'new':
        return {
          iconBg: 'bg-green-500/20',
          iconColor: 'text-green-500',
          badge: 'border-green-500/30',
        };
      case 'trending':
        return {
          iconBg: 'bg-purple-500/20',
          iconColor: 'text-purple-500',
          badge: 'border-purple-500/30',
        };
      default:
        return {
          iconBg: 'bg-orange-500/20',
          iconColor: 'text-orange-500',
          badge: 'border-orange-500/30',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <section className="py-16 bg-[#1A1A1A]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${styles.iconBg} rounded-xl flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${styles.iconColor}`} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {title} <span className="text-[#FF6600]">{highlightText}</span>
              </h2>
              <p className="text-gray-400 text-sm">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Botões de navegação */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-10 h-10 bg-[#2C2C2C] hover:bg-[#FF6600] rounded-lg flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-10 h-10 bg-[#2C2C2C] hover:bg-[#FF6600] rounded-lg flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <Link to={viewAllLink}>
              <Button
                variant="outline"
                className={`border-[#4A4A4A] text-white hover:bg-[#FF6600] hover:border-[#FF6600] hidden sm:flex items-center gap-2`}
              >
                Ver todos
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Carrossel de produtos */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[280px] sm:w-[300px] snap-start"
              >
                <ProductCard product={product} index={index} />
              </div>
            ))}
          </div>

          {/* Gradientes de fade nas laterais */}
          <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-[#1A1A1A] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-[#1A1A1A] to-transparent pointer-events-none" />
        </div>

        {/* Link mobile */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            to={viewAllLink}
            className="inline-flex items-center gap-2 text-[#FF6600] hover:text-[#FF8533] font-medium transition-colors"
          >
            Ver todos os produtos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function FeaturedProductsSection() {
  const featuredProducts = getFeaturedProducts();

  return (
    <ProductSection
      title="Produtos em"
      highlightText="Destaque"
      subtitle="Os produtos mais vendidos com os melhores preços"
      products={featuredProducts}
      icon={Flame}
      viewAllLink="/produtos?destaque=true"
      variant="default"
    />
  );
}

export function NewProductsSection() {
  const newProducts = getNewProducts();

  return (
    <ProductSection
      title="Lançamentos"
      highlightText="2026"
      subtitle="As novidades mais esperadas do mundo tech"
      products={newProducts}
      icon={Sparkles}
      viewAllLink="/produtos?lancamentos=true"
      variant="new"
    />
  );
}

export function TrendingProductsSection() {
  const trendingProducts = getFeaturedProducts().slice(0, 6);

  return (
    <ProductSection
      title="Mais"
      highlightText="Populares"
      subtitle="Produtos que estão bombando entre nossos clientes"
      products={trendingProducts}
      icon={TrendingUp}
      viewAllLink="/produtos?populares=true"
      variant="trending"
    />
  );
}
