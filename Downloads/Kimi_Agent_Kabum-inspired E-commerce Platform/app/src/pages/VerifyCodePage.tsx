import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useUserStore } from '@/store/userStore';

export function VerifyCodePage() {
  const [searchParams] = useSearchParams();
  const codeFromUrl = searchParams.get('code') || '';
  const [code, setCode] = useState(codeFromUrl);
  const navigate = useNavigate();
  const verifyPhoneCode = useUserStore((s) => s.verifyPhoneCode);

  useEffect(() => {
    if (codeFromUrl) setCode(codeFromUrl);
  }, [codeFromUrl]);

  const handleVerify = () => {
    if (!code) {
      toast.error('Digite o código de verificação');
      return;
    }
    const ok = verifyPhoneCode(code);
    if (ok) {
      toast.success('Conta verificada! Você já está logado.');
      navigate('/');
    } else {
      toast.error('Código inválido ou expirado');
    }
  };

  return (
    <main className="min-h-screen bg-[#1A1A1A] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-[#2C2C2C] rounded-xl p-8">
        <h2 className="text-xl font-bold text-white mb-4">Verificar código</h2>
        <p className="text-gray-400 mb-4">Digite o código enviado por SMS/WhatsApp ou use o link recebido.</p>
        <div className="mb-4">
          <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Código de verificação" />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleVerify}>Verificar</Button>
          <Button variant="ghost" onClick={() => navigate('/sent-messages')}>Abrir inbox de mensagens</Button>
        </div>
      </div>
    </main>
  );
}

export default VerifyCodePage;
