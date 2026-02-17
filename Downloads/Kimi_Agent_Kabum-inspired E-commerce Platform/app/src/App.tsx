import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HomePage } from '@/pages/HomePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { VerifyAccountPage } from '@/pages/VerifyAccountPage';
import { OrderSuccessPage } from '@/pages/OrderSuccessPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { SentEmailsPage } from '@/pages/SentEmailsPage';
import { SentMessagesPage } from '@/pages/SentMessagesPage';
import { VerifyCodePage } from '@/pages/VerifyCodePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#1A1A1A]">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#2C2C2C',
              color: '#fff',
              border: '1px solid #4A4A4A',
            },
          }}
        />
        
        <Routes>
          {/* Rotas sem Header/Footer */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />
          
          {/* Rotas com Header/Footer */}
          <Route
            path="/*"
            element={
              <>
                <Header />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/produtos" element={<ProductsPage />} />
                  <Route path="/produto/:id" element={<ProductDetailPage />} />
                  <Route path="/carrinho" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/pedido-sucesso" element={<OrderSuccessPage />} />
                  
                  {/* Rotas placeholder para links do footer */}
                  <Route
                    path="/sobre"
                    element={<PlaceholderPage title="Sobre Nós" />}
                  />
                  <Route
                    path="/contato"
                    element={<PlaceholderPage title="Contato" />}
                  />
                  <Route
                    path="/faq"
                    element={<PlaceholderPage title="Perguntas Frequentes" />}
                  />
                  <Route
                    path="/privacidade"
                    element={<PlaceholderPage title="Política de Privacidade" />}
                  />
                  <Route
                    path="/termos"
                    element={<PlaceholderPage title="Termos de Uso" />}
                  />
                  <Route
                    path="/trocas"
                    element={<PlaceholderPage title="Trocas e Devoluções" />}
                  />
                  <Route
                    path="/garantia"
                    element={<PlaceholderPage title="Política de Garantia" />}
                  />
                  <Route
                    path="/ofertas"
                    element={<PlaceholderPage title="Ofertas Especiais" />}
                  />
                  <Route path="/favoritos" element={<FavoritesPage />} />
                  <Route path="/sent-emails" element={<SentEmailsPage />} />
                  <Route path="/sent-messages" element={<SentMessagesPage />} />
                  <Route path="/verificar-codigo" element={<VerifyCodePage />} />
                  <Route path="/verificar" element={<VerifyAccountPage />} />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

// Componente placeholder para páginas em construção
function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="min-h-screen bg-[#1A1A1A] py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="w-24 h-24 bg-[#2C2C2C] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🚧</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
        <p className="text-gray-400 mb-8">Esta página está em construção.</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-[#FF6600] hover:bg-[#E55A00] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Voltar para o início
        </a>
      </div>
    </main>
  );
}

export default App;
