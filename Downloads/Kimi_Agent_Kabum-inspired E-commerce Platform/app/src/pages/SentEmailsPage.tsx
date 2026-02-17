import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEmailStore } from '@/store/emailStore';

export function SentEmailsPage() {
  const emails = useEmailStore((s) => s.emails);
  const removeEmail = useEmailStore((s) => s.removeEmail);
  const clear = useEmailStore((s) => s.clear);
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#1A1A1A] py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Sent Emails (in-app inbox)</h1>
          <div className="flex gap-2">
            <Button onClick={() => clear()}>Clear All</Button>
            <Button onClick={() => navigate(-1)}>Voltar</Button>
          </div>
        </div>

        {emails.length === 0 ? (
          <div className="text-gray-400">Nenhum e-mail enviado ainda.</div>
        ) : (
          <div className="grid gap-4">
            {emails.map((e) => (
              <div key={e.id} className="bg-[#2C2C2C] p-4 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-gray-300">Para: {e.to}</div>
                    <div className="text-lg font-semibold text-white">{e.subject}</div>
                    <div className="text-xs text-gray-400">{new Date(e.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        // copy verification link if present in body
                        const linkMatch = e.body.match(/https?:\/\/[^\s]+/);
                        if (linkMatch) navigator.clipboard.writeText(linkMatch[0]);
                      }}
                    >
                      Copiar link
                    </Button>
                    <Button onClick={() => removeEmail(e.id)}>Remover</Button>
                  </div>
                </div>
                <pre className="whitespace-pre-wrap mt-3 text-sm text-gray-200">{e.body}</pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default SentEmailsPage;
