import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, Check, Phone } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const register = useUserStore((state) => state.register);
  const resendVerification = useUserStore((state) => state.resendVerification);
  const registerWithPhone = useUserStore((s) => s.registerWithPhone);
  const sendPhoneVerification = useUserStore((s) => s.sendPhoneVerification);
  const loginWithGoogle = useUserStore((s) => s.loginWithGoogle);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    if (!acceptTerms) {
      toast.error('Aceite os termos de uso para continuar');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await register(formData.name, formData.email, formData.password);
      if (success) {
        toast.success('Conta criada com sucesso! Verifique seu e-mail para ativar a conta.', {
          icon: <Check className="w-4 h-4 text-green-500" />,
        });
        // Generate demo verification token and show to user
        const token = resendVerification(formData.email);
        if (token) {
          toast('Código de verificação (demo): ' + token, { duration: 12000 });
        }
        navigate('/login');
      } else {
        toast.error('Erro ao criar conta. E-mail possivelmente já cadastrado.');
      }
    } catch (error) {
      toast.error('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#1A1A1A] flex flex-col items-center justify-center py-12 px-4">
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
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <span className="text-white font-bold text-2xl">
              Nexus<span className="text-[#FF6600]">Store</span>
            </span>
          </Link>
        </div>

        {/* Card de cadastro */}
        <div className="bg-[#2C2C2C] rounded-xl p-8">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Crie sua conta
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Preencha os dados abaixo para se cadastrar
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Nome completo *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome completo"
                  className="pl-10 bg-[#1A1A1A] border-[#4A4A4A] text-white placeholder:text-gray-500 focus:border-[#FF6600] focus:ring-[#FF6600]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                E-mail *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  className="pl-10 bg-[#1A1A1A] border-[#4A4A4A] text-white placeholder:text-gray-500 focus:border-[#FF6600] focus:ring-[#FF6600]"
                />
              </div>
            </div>

            {/* Telefone */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 98765-4321"
                  className="pl-10 bg-[#1A1A1A] border-[#4A4A4A] text-white placeholder:text-gray-500 focus:border-[#FF6600] focus:ring-[#FF6600]"
                />
              </div>
              <div className="mt-2 flex gap-2">
                <Button
                  onClick={async () => {
                    if (!formData.phone) return toast.error('Informe o telefone');
                    if (!formData.name) return toast.error('Informe seu nome antes');
                    const ok = await registerWithPhone(formData.name, formData.phone, formData.password);
                    if (ok) {
                      toast.success('Código enviado por SMS/WhatsApp (demo). Verifique em Sent Messages.');
                      navigate('/verificar-codigo');
                    } else {
                      toast.error('Telefone já cadastrado');
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
                Senha *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
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

            {/* Confirmar senha */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Confirmar senha *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Digite a senha novamente"
                  className="pl-10 pr-10 bg-[#1A1A1A] border-[#4A4A4A] text-white placeholder:text-gray-500 focus:border-[#FF6600] focus:ring-[#FF6600]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Termos */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-[#4A4A4A] bg-[#1A1A1A] text-[#FF6600] focus:ring-[#FF6600]"
              />
              <span className="text-gray-400 text-sm">
                Li e aceito os{' '}
                <Link to="/termos" className="text-[#FF6600] hover:text-[#FF8533]">
                  Termos de Uso
                </Link>{' '}
                e{' '}
                <Link to="/privacidade" className="text-[#FF6600] hover:text-[#FF8533]">
                  Política de Privacidade
                </Link>
              </span>
            </label>

            {/* Botão de cadastro */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FF6600] hover:bg-[#E55A00] text-white h-12 text-lg font-semibold"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Criar conta
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

          {/* Link para login */}
          <p className="text-center text-gray-400 mt-6">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-[#FF6600] hover:text-[#FF8533] font-medium transition-colors"
            >
              Entre aqui
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Cadastrar com Google */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md mt-6"
      >
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
          Cadastrar com Google
        </button>
      </motion.div>
    </main>
  );
}
