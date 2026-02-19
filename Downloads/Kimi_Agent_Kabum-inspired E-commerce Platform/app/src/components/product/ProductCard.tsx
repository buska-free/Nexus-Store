import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Check } from 'lucide-react';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useAdminStore } from '@/store/adminStore';
import { toast } from 'sonner';
import { useFavoritesStore } from '@/store/favoritesStore';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const favorites = useFavoritesStore((state) => state.items);
  const toggleFavorite = useFavoritesStore((state) => state.toggle);
  const isLiked = favorites.includes(product.id);
  const addItem = useCartStore((state) => state.addItem);
  const getProductPrice = useAdminStore((state) => state.getProductPrice);
  
  const pricing = getProductPrice(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`${product.name} adicionado ao carrinho!`, {
      icon: <Check className="w-4 h-4 text-green-500" />,
      description: 'Clique no carrinho para finalizar a compra',
    });
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nowFavorite = toggleFavorite(product.id);
    toast.success(nowFavorite ? 'Adicionado aos favoritos' : 'Removido dos favoritos');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const getBadgeClass = (badge: string) => {
    switch (badge) {
      case 'offer':
        return 'badge-offer';
      case 'new':
        return 'badge-new';
      case 'bestseller':
        return 'badge-bestseller';
      case 'limited':
        return 'badge-limited';
      default:
        return 'badge-offer';
    }
  };

  const getBadgeText = (badge: string) => {
    switch (badge) {
      case 'offer':
        return 'OFERTA';
      case 'new':
        return 'NOVO';
      case 'bestseller':
        return 'MAIS VENDIDO';
      case 'limited':
        return 'LIMITADO';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/produto/${product.id}`}>
        <div className="product-card relative h-full flex flex-col">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
            {product.badges?.map((badge, idx) => (
              <span key={idx} className={getBadgeClass(badge)}>
                {getBadgeText(badge)}
              </span>
            ))}
          </div>

          {/* Botão de favorito */}
          <button
            onClick={handleLike}
            className="absolute top-3 right-3 z-10 w-8 h-8 bg-[#1A1A1A]/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'
              }`}
            />
          </button>

          {/* Imagem do produto */}
          <div className="relative aspect-square overflow-hidden bg-[#1A1A1A] rounded-t-xl">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/placeholder-product.jpg';
              }}
            />
            
            {/* Overlay com botão de adicionar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center"
            >
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#FF6600] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg"
              >
                <ShoppingCart className="w-4 h-4" />
                Adicionar
              </motion.button>
            </motion.div>
          </div>

          {/* Informações do produto */}
          <div className="p-4 flex flex-col flex-1">
            {/* Marca */}
            <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
            
            {/* Nome */}
            <h3 className="text-white font-medium text-sm line-clamp-2 mb-2 flex-1 group-hover:text-[#FF6600] transition-colors">
              {product.name}
            </h3>

            {/* Avaliação */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= Math.round(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.reviewCount})</span>
            </div>

            {/* Preço */}
            <div className="mt-auto">
              {pricing.originalPrice && pricing.originalPrice !== pricing.currentPrice && (
                <p className="text-gray-500 text-xs line-through">
                  {formatPrice(pricing.originalPrice)}
                </p>
              )}
              <p className="text-[#FF6600] font-bold text-lg">
                {formatPrice(pricing.currentPrice)}
              </p>
              
              {pricing.originalPrice && pricing.originalPrice !== pricing.currentPrice && (
                <p className="text-green-400 text-xs mt-1">
                  Economize {formatPrice(pricing.originalPrice - pricing.currentPrice)}
                </p>
              )}
            </div>

            {/* Botão mobile */}
            <button
              onClick={handleAddToCart}
              className="mt-3 w-full bg-[#2C2C2C] hover:bg-[#FF6600] text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors lg:hidden"
            >
              <ShoppingCart className="w-4 h-4" />
              Adicionar
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
