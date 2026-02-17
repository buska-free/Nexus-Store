import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  X,
  ChevronDown,
  Grid3X3,
  List,
  SlidersHorizontal,
  Star,
  Check,
} from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { products, categories, brands } from '@/data/products';
import { useFilterStore } from '@/store/filterStore';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { SortOption } from '@/types';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
  { value: 'rating', label: 'Melhor avaliação' },
  { value: 'newest', label: 'Mais recentes' },
];

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const {
    filters,
    sortBy,
    searchQuery,
    setCategory,
    removeCategory,
    setBrand,
    removeBrand,
    setPriceRange,
    setRating,
    setSortBy,
    setSearchQuery,
    clearFilters,
  } = useFilterStore();

  // Inicializar filtros a partir da URL
  useEffect(() => {
    const categoryParam = searchParams.get('categoria');
    const searchParam = searchParams.get('busca');
    
    if (categoryParam) {
      setCategory(categoryParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams, setCategory, setSearchQuery]);

  // Filtrar produtos
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filtro de busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query)
      );
    }

    // Filtro de categoria
    if (filters.categories.length > 0) {
      result = result.filter(
        (p) =>
          filters.categories.includes(p.category) ||
          filters.categories.includes(p.subcategory || '')
      );
    }

    // Filtro de marca
    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand));
    }

    // Filtro de preço
    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Filtro de avaliação
    if (filters.rating > 0) {
      result = result.filter((p) => p.rating >= filters.rating);
    }

    // Filtro de disponibilidade
    if (filters.availability) {
      result = result.filter((p) => p.stock > 0);
    }

    // Ordenação
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a) => (a.badges?.includes('new') ? -1 : 1));
        break;
    }

    return result;
  }, [filters, sortBy, searchQuery]);

  const activeFiltersCount =
    filters.categories.length +
    filters.brands.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.availability ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? 1 : 0);

  const FilterSidebar = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`space-y-6 ${isMobile ? '' : 'sticky top-40'}`}>
      {/* Header dos filtros */}
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="bg-[#FF6600] text-white text-xs px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-[#FF6600] hover:text-[#FF8533] transition-colors"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Categorias */}
      <div className="border-b border-[#2C2C2C] pb-6">
        <h4 className="text-white font-medium mb-3">Categorias</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <Checkbox
                checked={filters.categories.includes(category.slug)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setCategory(category.slug);
                  } else {
                    removeCategory(category.slug);
                  }
                }}
                className="border-[#4A4A4A] data-[state=checked]:bg-[#FF6600] data-[state=checked]:border-[#FF6600]"
              />
              <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
                {category.name}
              </span>
              <span className="text-gray-600 text-xs ml-auto">
                {category.productCount}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Marcas */}
      <div className="border-b border-[#2C2C2C] pb-6">
        <h4 className="text-white font-medium mb-3">Marcas</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <Checkbox
                checked={filters.brands.includes(brand)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setBrand(brand);
                  } else {
                    removeBrand(brand);
                  }
                }}
                className="border-[#4A4A4A] data-[state=checked]:bg-[#FF6600] data-[state=checked]:border-[#FF6600]"
              />
              <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Preço */}
      <div className="border-b border-[#2C2C2C] pb-6">
        <h4 className="text-white font-medium mb-3">Faixa de Preço</h4>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          max={20000}
          step={100}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            R$ {filters.priceRange[0].toLocaleString()}
          </span>
          <span className="text-gray-400">
            R$ {filters.priceRange[1].toLocaleString()}
          </span>
        </div>
      </div>

      {/* Avaliação */}
      <div className="border-b border-[#2C2C2C] pb-6">
        <h4 className="text-white font-medium mb-3">Avaliação</h4>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <Checkbox
                checked={filters.rating === rating}
                onCheckedChange={(checked) => {
                  setRating(checked ? rating : 0);
                }}
                className="border-[#4A4A4A] data-[state=checked]:bg-[#FF6600] data-[state=checked]:border-[#FF6600]"
              />
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-400 text-sm">ou mais</span>
            </label>
          ))}
        </div>
      </div>

      {/* Disponibilidade */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer group">
          <Checkbox
            checked={filters.availability}
            onCheckedChange={() => {
              // setAvailability(checked as boolean);
            }}
            className="border-[#4A4A4A] data-[state=checked]:bg-[#FF6600] data-[state=checked]:border-[#FF6600]"
          />
          <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
            Apenas produtos em estoque
          </span>
        </label>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#1A1A1A] py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb e título */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>Início</span>
            <span>/</span>
            <span className="text-white">Produtos</span>
            {searchQuery && (
              <>
                <span>/</span>
                <span className="text-[#FF6600]">Busca: {searchQuery}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {searchQuery ? `Resultados para "${searchQuery}"` : 'Todos os Produtos'}
          </h1>
          <p className="text-gray-400 mt-2">
            {filteredProducts.length} produtos encontrados
          </p>
        </motion.div>

        <div className="flex gap-8">
          {/* Sidebar de filtros - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Conteúdo principal */}
          <div className="flex-1">
            {/* Barra de ferramentas */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-[#2C2C2C] rounded-lg">
              <div className="flex items-center gap-4">
                {/* Filtros mobile */}
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="lg:hidden border-[#4A4A4A] text-white hover:bg-[#3C3C3C]"
                    >
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Filtros
                      {activeFiltersCount > 0 && (
                        <span className="ml-2 bg-[#FF6600] text-white text-xs px-2 py-0.5 rounded-full">
                          {activeFiltersCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 bg-[#1A1A1A] border-[#2C2C2C] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle className="text-white">Filtros</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar isMobile />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Ordenação */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-[#4A4A4A] text-white hover:bg-[#3C3C3C]"
                    >
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      {sortOptions.find((o) => o.value === sortBy)?.label}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#2C2C2C] border-[#4A4A4A]">
                    {sortOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`text-white hover:bg-[#3C3C3C] cursor-pointer ${
                          sortBy === option.value ? 'text-[#FF6600]' : ''
                        }`}
                      >
                        {sortBy === option.value && (
                          <Check className="w-4 h-4 mr-2" />
                        )}
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Modo de visualização */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-[#FF6600] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-[#3C3C3C]'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-[#FF6600] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-[#3C3C3C]'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filtros ativos */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#FF6600]/20 text-[#FF6600] text-sm rounded-full"
                  >
                    {categories.find((c) => c.slug === cat)?.name || cat}
                    <button
                      onClick={() => removeCategory(cat)}
                      className="hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.brands.map((brand) => (
                  <span
                    key={brand}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#FF6600]/20 text-[#FF6600] text-sm rounded-full"
                  >
                    {brand}
                    <button
                      onClick={() => removeBrand(brand)}
                      className="hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Grid de produtos */}
            {filteredProducts.length > 0 ? (
              <div
                className={`grid gap-4 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-[#2C2C2C] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-400 mb-6">
                  Tente ajustar os filtros ou buscar por outro termo.
                </p>
                <Button
                  onClick={clearFilters}
                  className="bg-[#FF6600] hover:bg-[#E55A00]"
                >
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
