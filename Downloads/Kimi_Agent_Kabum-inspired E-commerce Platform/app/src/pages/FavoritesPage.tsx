import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ChevronRight } from 'lucide-react';
import { useFavoritesStore } from '@/store/favoritesStore';
import { getProductById } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';

export function FavoritesPage() {
  const favoriteIds = useFavoritesStore((state) => state.items);
  const products = favoriteIds.map((id) => getProductById(id)).filter(Boolean);

  return (
    <main className="min-h-screen bg-[#1A1A1A] py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Meus Favoritos</span>
          </nav>

          {/* Title */}
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-[#FF6600]" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">Meus Favoritos</h1>
          </div>
          <p className="text-gray-400">
            {products.length === 0
              ? 'Você ainda não adicionou nenhum produto aos favoritos'
              : `Você tem ${products.length} produto${products.length !== 1 ? 's' : ''} nos favoritos`}
          </p>
        </motion.div>

        {/* Content */}
        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-[#2C2C2C] rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Nenhum favorito ainda</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Comece a adicionar produtos aos seus favoritos para salvá-los para depois.
            </p>
            <Button asChild className="bg-[#FF6600] hover:bg-[#E55A00]">
              <Link to="/produtos" className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Explorar Produtos
              </Link>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        )}

        {/* Continue Shopping */}
        {products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 pt-8 border-t border-[#4A4A4A] flex items-center justify-between"
          >
            <p className="text-gray-400">Descubra mais produtos</p>
            <Button asChild variant="outline" className="border-[#FF6600] text-[#FF6600] hover:bg-[#FF6600]/10">
              <Link to="/produtos" className="flex items-center gap-2">
                Ver Todos os Produtos
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </main>
  );
}
