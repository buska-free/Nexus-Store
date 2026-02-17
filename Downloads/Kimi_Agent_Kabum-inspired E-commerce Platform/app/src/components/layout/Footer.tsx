import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  MapPin,
  CreditCard,
  Shield,
  Lock,
  Truck,
  RefreshCw,
  Headphones,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de newsletter
    alert('Obrigado por se inscrever!');
  };

  return (
    <footer className="bg-[#1A1A1A] border-t border-[#2C2C2C]">
      {/* Barra de benefícios */}
      <div className="bg-[#2C2C2C] py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FF6600]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-[#FF6600]" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Frete Grátis</p>
                <p className="text-gray-500 text-xs">Em compras acima de R$ 999</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FF6600]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6 text-[#FF6600]" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Parcelamento</p>
                <p className="text-gray-500 text-xs">Em até 12x sem juros</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FF6600]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-[#FF6600]" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Compra Segura</p>
                <p className="text-gray-500 text-xs">Site 100% protegido</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FF6600]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-6 h-6 text-[#FF6600]" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Devolução</p>
                <p className="text-gray-500 text-xs">7 dias para trocar</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo e descrição */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#FF6600] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-white font-bold text-xl">
                Nexus<span className="text-[#FF6600]">Store</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-6 max-w-sm">
              Sua loja de tecnologia com os melhores preços em hardware, 
              periféricos, notebooks e muito mais. Qualidade garantida 
              e atendimento especializado.
            </p>
            
            {/* Newsletter */}
            <div className="mb-6">
              <p className="text-white font-medium mb-3">Assine nossa newsletter</p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Seu e-mail"
                  className="flex-1 bg-[#2C2C2C] border-[#4A4A4A] text-white placeholder:text-gray-500"
                />
                <Button type="submit" className="bg-[#FF6600] hover:bg-[#E55A00]">
                  <Mail className="w-4 h-4" />
                </Button>
              </form>
            </div>

            {/* Redes sociais */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#2C2C2C] rounded-lg flex items-center justify-center text-gray-400 hover:bg-[#FF6600] hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#2C2C2C] rounded-lg flex items-center justify-center text-gray-400 hover:bg-[#FF6600] hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#2C2C2C] rounded-lg flex items-center justify-center text-gray-400 hover:bg-[#FF6600] hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#2C2C2C] rounded-lg flex items-center justify-center text-gray-400 hover:bg-[#FF6600] hover:text-white transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links úteis */}
          <div>
            <h3 className="text-white font-semibold mb-4">Institucional</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/sobre" className="text-gray-400 hover:text-[#FF6600] text-sm transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/lojas" className="text-gray-400 hover:text-[#FF6600] text-sm transition-colors">
                  Nossas Lojas
                </Link>
              </li>
              <li>
                <Link to="/trabalhe" className="text-gray-400 hover:text-[#FF6600] text-sm transition-colors">
                  Trabalhe Conosco
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-[#FF6600] text-sm transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/imprensa" className="text-gray-400 hover:text-[#FF6600] text-sm transition-colors">
                  Sala de Imprensa
                </Link>
              </li>
            </ul>
          </div>

          {/* Atendimento */}
          <div>
            <h3 className="text-white font-semibold mb-4">Atendimento</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contato" className="text-gray-400 hover:text-[#FF6600] text-sm transition-colors">
                  Fale Conosco
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-[#FF6600] text-sm transition-colors">
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link to="/trocas" className="text-gray-400 hover:text-[#FF6600] text-sm transition-colors">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link to="/garantia" className="text-gray-400 hover:text-[#FF6600] text-sm transition-colors">
                  Política de Garantia
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="text-gray-400 hover:text-[#FF6600] text-sm transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/termos" className="text-gray-400 hover:text-[#FF6600] text-sm transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Headphones className="w-5 h-5 text-[#FF6600] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white text-sm">Central de Atendimento</p>
                  <p className="text-gray-400 text-sm">0800 123 4567</p>
                  <p className="text-gray-500 text-xs">Seg-Sex: 8h às 20h</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#FF6600] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white text-sm">E-mail</p>
                  <p className="text-gray-400 text-sm">contato@nexusstore.com.br</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#FF6600] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white text-sm">Endereço</p>
                  <p className="text-gray-400 text-sm">
                    Av. Paulista, 1000<br />
                    São Paulo - SP, 01310-100
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-[#2C2C2C]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © 2026 Nexus Store. Todos os direitos reservados.
            </p>
            
            {/* Selos de segurança */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-500">
                <Lock className="w-4 h-4" />
                <span className="text-xs">SSL Seguro</span>
              </div>
              <div className="flex items-center gap-1">
                <img
                  src="/images/payments/visa.svg"
                  alt="Visa"
                  className="h-6 opacity-50 hover:opacity-100 transition-opacity"
                />
                <img
                  src="/images/payments/mastercard.svg"
                  alt="Mastercard"
                  className="h-6 opacity-50 hover:opacity-100 transition-opacity"
                />
                <img
                  src="/images/payments/amex.svg"
                  alt="American Express"
                  className="h-6 opacity-50 hover:opacity-100 transition-opacity"
                />
                <img
                  src="/images/payments/elo.svg"
                  alt="Elo"
                  className="h-6 opacity-50 hover:opacity-100 transition-opacity"
                />
                <img
                  src="/images/payments/pix.svg"
                  alt="Pix"
                  className="h-6 opacity-50 hover:opacity-100 transition-opacity"
                />
                <img
                  src="/images/payments/boleto.svg"
                  alt="Boleto"
                  className="h-6 opacity-50 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
