import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RefreshCw,
  Star,
  ChevronRight,
  Minus,
  Plus,
  Check,
} from 'lucide-react';
import { getProductById, getRelatedProducts } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState(id ? getProductById(id) : undefined);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  
  const addItem = useCartStore((state) => state.addItem);
  const relatedProducts = product ? getRelatedProducts(product.id, 4) : [];
  const favorites = useFavoritesStore((state) => state.items);
  const toggleFavorite = useFavoritesStore((state) => state.toggle);
  const isLiked = product ? favorites.includes(product.id) : false;

  useEffect(() => {
    if (id) {
      const foundProduct = getProductById(id);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedImage(0);
        setQuantity(1);
      } else {
        navigate('/produtos');
      }
    }
  }, [id, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF6600] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Carregando produto...</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant);
    toast.success(`${product.name} adicionado ao carrinho!`, {
      icon: <Check className="w-4 h-4 text-green-500" />,
      description: `${quantity} unidade(s) adicionada(s)`,
    });
  };

  const handleLike = () => {
    if (product) {
      const nowFavorite = toggleFavorite(product.id);
      toast.success(nowFavorite ? 'Adicionado aos favoritos' : 'Removido dos favoritos');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copiado para a área de transferência!');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const calculateDiscount = () => {
    if (product.originalPrice) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  const images = product.images?.length ? product.images : [product.image];

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
          <Link to="/produtos" className="hover:text-white transition-colors">Produtos</Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            to={`/produtos?categoria=${product.category}`}
            className="hover:text-white transition-colors capitalize"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white truncate max-w-[200px]">{product.name}</span>
        </motion.nav>

        {/* Produto principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Galeria de imagens */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Imagem principal */}
            <div className="relative aspect-square bg-[#2C2C2C] rounded-xl overflow-hidden">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder-product.jpg';
                }}
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badges?.map((badge, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded text-xs font-bold ${
                      badge === 'offer'
                        ? 'bg-[#FF6600] text-white'
                        : badge === 'new'
                        ? 'bg-green-500 text-white'
                        : badge === 'bestseller'
                        ? 'bg-purple-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {badge === 'offer'
                      ? 'OFERTA'
                      : badge === 'new'
                      ? 'NOVO'
                      : badge === 'bestseller'
                      ? 'MAIS VENDIDO'
                      : 'LIMITADO'}
                  </span>
                ))}
              </div>

              {/* Botões de ação */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={handleLike}
                  className="w-10 h-10 bg-[#1A1A1A]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[#FF6600] transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="w-10 h-10 bg-[#1A1A1A]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[#FF6600] transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Miniaturas */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-[#FF6600]'
                        : 'border-transparent hover:border-[#4A4A4A]'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-product.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Informações do produto */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Marca e SKU */}
            <div className="flex items-center justify-between">
              <span className="text-[#FF6600] font-medium">{product.brand}</span>
              <span className="text-gray-500 text-sm">SKU: {product.sku}</span>
            </div>

            {/* Nome */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              {product.name}
            </h1>

            {/* Avaliação */}
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-white font-medium">{product.rating}</span>
              <span className="text-gray-500">({product.reviewCount} avaliações)</span>
            </div>

            {/* Preço */}
            <div className="bg-[#2C2C2C] rounded-xl p-6">
              {product.originalPrice && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="bg-green-500/20 text-green-400 text-sm px-2 py-0.5 rounded">
                    -{calculateDiscount()}%
                  </span>
                </div>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-bold text-[#FF6600]">
                  {formatPrice(product.price)}
                </span>
                <span className="text-gray-500">à vista</span>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                ou em até 12x de {formatPrice(product.price / 12)} sem juros
              </p>
            </div>

            {/* Variações */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="text-white font-medium mb-3">Variações</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedVariant === variant.id
                          ? 'border-[#FF6600] bg-[#FF6600]/10 text-white'
                          : 'border-[#4A4A4A] text-gray-400 hover:border-[#FF6600] hover:text-white'
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantidade */}
            <div>
              <h3 className="text-white font-medium mb-3">Quantidade</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-[#2C2C2C] rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-16 text-center text-white font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <span className={`text-sm ${product.stock > 5 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {product.stock > 5
                    ? `${product.stock} unidades em estoque`
                    : `Apenas ${product.stock} unidades restantes!`}
                </span>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-[#FF6600] hover:bg-[#E55A00] text-white h-14 text-lg font-semibold"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Adicionar ao Carrinho
              </Button>
              <Button
                onClick={() => {
                  handleAddToCart();
                  navigate('/carrinho');
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white h-14 text-lg font-semibold"
              >
                Comprar Agora
              </Button>
            </div>

            {/* Informações adicionais */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#2C2C2C]">
              <div className="text-center">
                <Truck className="w-6 h-6 text-[#FF6600] mx-auto mb-2" />
                <p className="text-white text-sm">{product.shippingInfo}</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-[#FF6600] mx-auto mb-2" />
                <p className="text-white text-sm">{product.warranty}</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-6 h-6 text-[#FF6600] mx-auto mb-2" />
                <p className="text-white text-sm">7 dias para troca</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs de informações */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full bg-[#2C2C2C] p-1 mb-6">
              <TabsTrigger
                value="description"
                className="flex-1 data-[state=active]:bg-[#FF6600] data-[state=active]:text-white"
              >
                Descrição
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="flex-1 data-[state=active]:bg-[#FF6600] data-[state=active]:text-white"
              >
                Especificações
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="flex-1 data-[state=active]:bg-[#FF6600] data-[state=active]:text-white"
              >
                Avaliações ({product.reviewCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-0">
              <div className="bg-[#2C2C2C] rounded-xl p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Sobre o produto</h3>
                <p className="text-gray-400 leading-relaxed">
                  {product.fullDescription || product.description}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-0">
              <div className="bg-[#2C2C2C] rounded-xl p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Especificações Técnicas</h3>
                {product.specifications ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between py-3 border-b border-[#4A4A4A] last:border-0"
                      >
                        <span className="text-gray-500">{key}</span>
                        <span className="text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">Especificações não disponíveis.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              <div className="bg-[#2C2C2C] rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white font-semibold text-lg">Avaliações dos Clientes</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= Math.round(product.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-white font-medium">{product.rating}</span>
                      <span className="text-gray-500">({product.reviewCount} avaliações)</span>
                    </div>
                  </div>
                  <Button className="bg-[#FF6600] hover:bg-[#E55A00]">
                    Escrever Avaliação
                  </Button>
                </div>

                {/* Mock reviews */}
                <div className="space-y-4">
                  {[
                    {
                      name: 'João Silva',
                      rating: 5,
                      date: '15/01/2026',
                      comment: 'Produto excelente! Superou minhas expectativas. Entrega rápida e embalagem perfeita.',
                      verified: true,
                    },
                    {
                      name: 'Maria Santos',
                      rating: 4,
                      date: '10/01/2026',
                      comment: 'Muito bom, recomendo. O único ponto negativo foi o prazo de entrega que demorou um pouco mais do que o esperado.',
                      verified: true,
                    },
                    {
                      name: 'Pedro Costa',
                      rating: 5,
                      date: '05/01/2026',
                      comment: 'Melhor custo-benefício do mercado. Já comprei vários produtos nesta loja e sempre fui muito bem atendido.',
                      verified: true,
                    },
                  ].map((review, index) => (
                    <div key={index} className="border-b border-[#4A4A4A] last:border-0 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{review.name}</span>
                          {review.verified && (
                            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Compra verificada
                            </span>
                          )}
                        </div>
                        <span className="text-gray-500 text-sm">{review.date}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-400">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Produtos relacionados */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Produtos <span className="text-[#FF6600]">Relacionados</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
