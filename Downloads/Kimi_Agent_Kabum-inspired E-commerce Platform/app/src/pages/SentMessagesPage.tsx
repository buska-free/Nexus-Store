import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import useMessageStore from '@/store/messageStore';

export function SentMessagesPage() {
  const messages = useMessageStore((s) => s.messages);
  const remove = useMessageStore((s) => s.removeMessage);
  const clear = useMessageStore((s) => s.clear);
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#1A1A1A] py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Sent Messages (SMS / WhatsApp)</h1>
          <div className="flex gap-2">
            <Button onClick={() => clear()}>Clear All</Button>
            <Button onClick={() => navigate(-1)}>Voltar</Button>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="text-gray-400">Nenhuma mensagem enviada ainda.</div>
        ) : (
          <div className="grid gap-4">
            {messages.map((m) => (
              <div key={m.id} className="bg-[#2C2C2C] p-4 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-gray-300">Para: {m.to} • {m.channel.toUpperCase()}</div>
                    <div className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        const linkMatch = m.body.match(/https?:\/\/[^\s]+/);
                        if (linkMatch) navigator.clipboard.writeText(linkMatch[0]);
                      }}
                    >
                      Copiar link
                    </Button>
                    <Button onClick={() => remove(m.id)}>Remover</Button>
                  </div>
                </div>
                <pre className="whitespace-pre-wrap mt-3 text-sm text-gray-200">{m.body}</pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default SentMessagesPage;
