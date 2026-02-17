import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/button';

export function VerifyAccountPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const verifyAccount = useUserStore((state) => state.verifyAccount);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!token) return;
    const ok = verifyAccount(token);
    setStatus(ok ? 'success' : 'error');
  }, [token, verifyAccount]);

  return (
    <main className="min-h-screen bg-[#1A1A1A] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#2C2C2C] rounded-xl p-8 text-center"
      >
        {status === 'idle' && (
          <>
            <h1 className="text-2xl font-bold text-white mb-4">Verificação de Conta</h1>
            <p className="text-gray-400 mb-6">Aguardando código de verificação...</p>
            <p className="text-sm text-gray-500">Se você recebeu um código, acesse este link com o parâmetro <strong>?token=SEU_TOKEN</strong></p>
            <div className="mt-6">
              <Button asChild>
                <Link to="/login">Voltar ao login</Link>
              </Button>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Conta verificada</h2>
            <p className="text-gray-400 mb-6">Sua conta foi ativada com sucesso. Faça login para continuar.</p>
            <Button asChild>
              <Link to="/login">Ir para Login</Link>
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Código inválido</h2>
            <p className="text-gray-400 mb-6">O código de verificação não foi encontrado ou já foi usado.</p>
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <Link to="/cadastro">Criar conta</Link>
              </Button>
              <Button asChild variant="outline" className="border-[#FF6600] text-[#FF6600]">
                <Link to="/login">Voltar ao Login</Link>
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </main>
  );
}
