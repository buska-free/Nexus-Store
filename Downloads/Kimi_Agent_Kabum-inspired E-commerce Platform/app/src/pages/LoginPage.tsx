import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Check } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const login = useUserStore((state) => state.login);
  const resendVerification = useUserStore((state) => state.resendVerification);
  const sendPhoneVerification = useUserStore((s) => s.sendPhoneVerification);
  const loginWithGoogle = useUserStore((s) => s.loginWithGoogle);
  const loginWithFacebook = useUserStore((s) => s.loginWithFacebook);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      if (result === 'ok') {
        toast.success('Login realizado com sucesso!', {
          icon: <Check className="w-4 h-4 text-green-500" />,
        });
        navigate('/');
      } else if (result === 'unverified') {
        toast.error('Conta não verificada. Enviando novamente o código de verificação...');
        const token = resendVerification(email);
        if (token) {
          // For demo we show the token so user can "verify"
          toast('Código de verificação (demo): ' + token, { duration: 8000 });
        }
      } else {
        toast.error('E-mail ou senha incorretos');
      }
    } catch (error) {
      toast.error('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#1A1A1A] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-[#FF6600] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
            <span className="text-white font-bold text-2xl">
              Nexus<span className="text-[#FF6600]">Store</span>
            </span>
          </Link>
        </div>

        {/* Card de login */}
        <div className="bg-[#2C2C2C] rounded-xl p-8">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Bem-vindo de volta
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Entre com sua conta para continuar
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="pl-10 bg-[#1A1A1A] border-[#4A4A4A] text-white placeholder:text-gray-500 focus:border-[#FF6600] focus:ring-[#FF6600]"
                />
              </div>
            </div>

            {/* Login via phone (code) */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Telefone</label>
              <div className="relative">
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="pl-3 bg-[#1A1A1A] border-[#4A4A4A] text-white placeholder:text-gray-500 focus:border-[#FF6600] focus:ring-[#FF6600]"
                />
              </div>
              <div className="mt-2">
                <Button
                  onClick={() => {
                    if (!phone) return toast.error('Informe o telefone');
                    const code = sendPhoneVerification(phone);
                    if (code) {
                      toast.success('Código enviado (demo). Verifique em Sent Messages.');
                      navigate('/verificar-codigo?code=' + code);
                    } else {
                      toast.error('Telefone não cadastrado');
                    }
                  }}
                >
                  Enviar código (SMS/WhatsApp)
                </Button>
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-[#1A1A1A] border-[#4A4A4A] text-white placeholder:text-gray-500 focus:border-[#FF6600] focus:ring-[#FF6600]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Esqueceu a senha */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-[#4A4A4A] bg-[#1A1A1A] text-[#FF6600] focus:ring-[#FF6600]" />
                <span className="text-gray-400 text-sm">Lembrar-me</span>
              </label>
              <Link
                to="/recuperar-senha"
                className="text-[#FF6600] hover:text-[#FF8533] text-sm transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>

            {/* Botão de login */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FF6600] hover:bg-[#E55A00] text-white h-12 text-lg font-semibold"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#4A4A4A]" />
            <span className="text-gray-500 text-sm">ou</span>
            <div className="flex-1 h-px bg-[#4A4A4A]" />
          </div>

          {/* Login social */}
          <div className="space-y-3">
            <button
              onClick={async () => {
                const ok = await loginWithGoogle();
                if (ok) {
                  toast.success('Logado via Google (demo)');
                  navigate('/');
                }
              }}
              className="w-full flex items-center justify-center gap-3 bg-[#1A1A1A] hover:bg-[#3C3C3C] text-white py-3 rounded-lg border border-[#4A4A4A] transition-colors"
            >
              <img src="/images/social/google.svg" alt="Google" className="w-5 h-5" />
              Continuar com Google
            </button>
            <button
              onClick={async () => {
                const ok = await loginWithFacebook();
                if (ok) {
                  toast.success('Logado via Facebook (demo)');
                  navigate('/');
                }
              }}
              className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white py-3 rounded-lg transition-colors"
            >
              <img src="/images/social/facebook.svg" alt="Facebook" className="w-5 h-5" />
              Continuar com Facebook
            </button>
          </div>

          {/* Link para cadastro */}
          <p className="text-center text-gray-400 mt-6">
            Não tem uma conta?{' '}
            <Link
              to="/cadastro"
              className="text-[#FF6600] hover:text-[#FF8533] font-medium transition-colors"
            >
              Cadastre-se
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Demo: Use qualquer e-mail e senha para entrar
          </p>
        </div>
      </motion.div>
    </main>
  );
}
