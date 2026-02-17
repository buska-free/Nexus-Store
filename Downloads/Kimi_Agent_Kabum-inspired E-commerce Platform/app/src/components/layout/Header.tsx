import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  Settings,
  Cpu,
  Mouse,
  Laptop,
  Monitor,
  Armchair,
  Wifi,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { categories } from '@/data/products';
// import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { paymentConfig } from '@/config/paymentConfig';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const iconMap: Record<string, React.ElementType> = {
  Cpu,
  Mouse,
  Laptop,
  Monitor,
  Armchair,
  Wifi,
};

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  // const cartItems = useCartStore((state) => state.items);
  const cartTotal = useCartStore((state) => state.getTotalItems());
  const { user, isAuthenticated, logout } = useUserStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produtos?busca=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSearchSuggestions(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const searchSuggestions = [
    'Processadores AMD',
    'RTX 4090',
    'Notebook Gamer',
    'Teclado Mecânico',
    'Mouse Sem Fio',
    'Monitor 144Hz',
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#1A1A1A]/95 backdrop-blur-lg shadow-lg'
            : 'bg-[#1A1A1A]'
        }`}
      >
        {/* Barra superior */}
        <div className="bg-[#FF6600] text-white text-xs py-1.5">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <p className="hidden sm:block">
              Frete grátis em compras acima de R$ 999 | Parcelamento em até 12x
            </p>
            <div className="flex items-center gap-4 ml-auto">
              <Link to="/atendimento" className="hover:underline">
                Atendimento
              </Link>
              <Link to="/rastreio" className="hover:underline">
                Rastrear Pedido
              </Link>
            </div>
          </div>
        </div>

        {/* Header principal */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 bg-[#FF6600] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">{(paymentConfig.company?.name || 'Meu Negócio').charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-white font-bold text-xl hidden sm:block">
                {paymentConfig.company?.name || 'Meu Negócio'}
              </span>
            </Link>

            {/* Barra de busca - Desktop */}
            <div ref={searchRef} className="hidden md:flex flex-1 max-w-2xl relative">
              <form onSubmit={handleSearch} className="w-full relative">
                <Input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSearchSuggestions(searchQuery.length > 0)}
                  className="w-full bg-[#2C2C2C] border-[#4A4A4A] text-white placeholder:text-gray-500 pr-12 focus:border-[#FF6600] focus:ring-[#FF6600]"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#FF6600] transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>

              {/* Sugestões de busca */}
              <AnimatePresence>
                {showSearchSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-[#2C2C2C] border border-[#4A4A4A] rounded-lg shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-3">
                      <p className="text-xs text-gray-500 mb-2">Sugestões populares</p>
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchQuery(suggestion);
                            navigate(`/produtos?busca=${encodeURIComponent(suggestion)}`);
                            setShowSearchSuggestions(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#3C3C3C] hover:text-white rounded transition-colors flex items-center gap-2"
                        >
                          <Search className="w-4 h-4 text-gray-500" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Ícones de ação */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Favoritos */}
              <Link
                to="/favoritos"
                className="hidden sm:flex p-2 text-gray-300 hover:text-[#FF6600] transition-colors"
              >
                <Heart className="w-6 h-6" />
              </Link>

              {/* Conta */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-2 text-gray-300 hover:text-white transition-colors">
                      <img
                        src={user?.avatar}
                        alt={user?.name}
                        className="w-8 h-8 rounded-full bg-[#2C2C2C]"
                      />
                      <span className="hidden lg:block text-sm">{user?.name}</span>
                      <ChevronDown className="w-4 h-4 hidden lg:block" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#2C2C2C] border-[#4A4A4A]">
                    <DropdownMenuItem className="text-white hover:bg-[#3C3C3C] cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Minha Conta
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-[#3C3C3C] cursor-pointer">
                      <Package className="w-4 h-4 mr-2" />
                      Meus Pedidos
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-[#3C3C3C] cursor-pointer">
                      <Heart className="w-4 h-4 mr-2" />
                      Favoritos
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-[#3C3C3C] cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurações
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#4A4A4A]" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-400 hover:bg-[#3C3C3C] cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 p-2 text-gray-300 hover:text-white transition-colors"
                >
                  <User className="w-6 h-6" />
                  <span className="hidden lg:block text-sm">Entrar</span>
                </Link>
              )}

              {/* Carrinho */}
              <Link
                to="/carrinho"
                className="relative p-2 text-gray-300 hover:text-[#FF6600] transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartTotal > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6600] text-white text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {cartTotal > 99 ? '99+' : cartTotal}
                  </motion.span>
                )}
              </Link>

              {/* Menu mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Navegação de categorias - Desktop */}
        <nav className="hidden lg:block border-t border-[#2C2C2C]">
          <div className="container mx-auto px-4">
            <ul className="flex items-center gap-1">
              <li>
                <Link
                  to="/"
                  className={`block px-4 py-3 text-sm font-medium transition-colors ${
                    location.pathname === '/' ? 'text-[#FF6600]' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Início
                </Link>
              </li>
              {categories.map((category) => {
                const Icon = iconMap[category.icon] || Cpu;
                return (
                  <li key={category.id} className="group relative">
                    <Link
                      to={`/produtos?categoria=${category.slug}`}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      {category.name}
                      {category.subcategories && (
                        <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform" />
                      )}
                    </Link>

                    {/* Dropdown de subcategorias */}
                    {category.subcategories && (
                      <div className="absolute top-full left-0 w-56 bg-[#2C2C2C] border border-[#4A4A4A] rounded-b-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-40">
                        <ul className="py-2">
                          {category.subcategories.map((sub) => (
                            <li key={sub.id}>
                              <Link
                                to={`/produtos?categoria=${sub.slug}`}
                                className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#3C3C3C] transition-colors"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
              <li>
                <Link
                  to="/ofertas"
                  className="block px-4 py-3 text-sm font-medium text-[#FF6600] hover:text-[#FF8533] transition-colors"
                >
                  Ofertas
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </motion.header>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              className="absolute right-0 top-0 h-full w-80 bg-[#1A1A1A] shadow-xl overflow-y-auto"
            >
              <div className="p-4">
                {/* Busca mobile */}
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Buscar produtos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#2C2C2C] border-[#4A4A4A] text-white pr-12"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </form>

                {/* Links de navegação */}
                <nav className="space-y-2">
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-white hover:bg-[#2C2C2C] rounded-lg transition-colors"
                  >
                    Início
                  </Link>
                  {categories.map((category) => {
                    const Icon = iconMap[category.icon] || Cpu;
                    return (
                      <Link
                        key={category.id}
                        to={`/produtos?categoria=${category.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-[#2C2C2C] rounded-lg transition-colors"
                      >
                        <Icon className="w-5 h-5" />
                        {category.name}
                      </Link>
                    );
                  })}
                  <Link
                    to="/ofertas"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-[#FF6600] hover:bg-[#2C2C2C] rounded-lg transition-colors"
                  >
                    Ofertas
                  </Link>
                </nav>

                {/* Ações do usuário */}
                <div className="mt-6 pt-6 border-t border-[#2C2C2C]">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-3 px-4 py-3 mb-4">
                        <img
                          src={user?.avatar}
                          alt={user?.name}
                          className="w-10 h-10 rounded-full bg-[#2C2C2C]"
                        />
                        <div>
                          <p className="text-white font-medium">{user?.name}</p>
                          <p className="text-gray-500 text-sm">{user?.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-[#2C2C2C] rounded-lg transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        Sair
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#2C2C2C] rounded-lg transition-colors"
                    >
                      <User className="w-5 h-5" />
                      Entrar / Cadastrar
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer para compensar o header fixo */}
      <div className="h-[120px] lg:h-[160px]" />
    </>
  );
}
