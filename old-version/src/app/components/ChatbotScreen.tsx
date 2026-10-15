import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ChevronLeft, Sparkles, RefreshCw } from 'lucide-react';
import { Mascot } from './Mascot';
import type { CommonProps } from '../App';

interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const QUICK_CHIPS = [
  { label: '📐 Ajuda com matemática', msg: 'Pode me explicar como resolver frações?' },
  { label: '📝 Revisar redação', msg: 'Como melhorar minha redação dissertativa?' },
  { label: '🧪 Dúvida de ciências', msg: 'O que é fotossíntese?' },
  { label: '📅 Plano de estudos', msg: 'Me ajude a criar um plano de estudos para esta semana.' },
];

const BOT_RESPONSES: Record<string, string> = {
  default: 'Olá! Estou aqui para te ajudar a estudar. Pode me perguntar qualquer coisa sobre suas matérias! 😊',
  frac: `Claro! **Frações** representam partes de um todo.\n\n📌 **Exemplos:**\n• 1/2 = metade\n• 2/3 = dois terços\n\n💡 **Dica:** Frações com o mesmo denominador são fáceis de somar: 1/4 + 2/4 = 3/4\n\nQuer um exercício para praticar?`,
  redacao: `Para melhorar sua redação dissertativa, siga este esquema:\n\n📝 **Estrutura:**\n1. **Introdução** — apresente o tema e sua tese\n2. **Desenvolvimento** — 2 parágrafos com argumentos\n3. **Conclusão** — retome a tese e proponha solução\n\n💡 Use conectivos como *portanto*, *além disso*, *entretanto*.\n\nQuer que eu analise um texto seu?`,
  fotossíntese: `**Fotossíntese** é o processo pelo qual as plantas produzem alimento! 🌿\n\n☀️ **Equação:**\nCO₂ + H₂O + luz solar → glicose + O₂\n\n📌 **Resumindo:**\n• Acontece nos cloroplastos\n• Usa CO₂ do ar e H₂O do solo\n• Produz glicose (alimento) e libera O₂\n\nQuer mais detalhes sobre alguma parte?`,
  plano: `Ótimo! Vou montar um **plano de estudos** para esta semana:\n\n📅 **Segunda a Sexta:**\n• 09:00 - 10:00 → Matemática\n• 10:30 - 11:30 → Português\n• 14:00 - 15:00 → Ciências/Geografia\n\n⭐ **Dicas:**\n• Faça pausas de 5 min a cada 25 min (Técnica Pomodoro)\n• Revise o conteúdo no final do dia\n• Nos fins de semana, resolva exercícios\n\nQuer ajustar algum horário?`,
};

function getBotResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes('frac') || lower.includes('matemat')) return BOT_RESPONSES.frac;
  if (lower.includes('reda') || lower.includes('texto')) return BOT_RESPONSES.redacao;
  if (lower.includes('fotos') || lower.includes('ciên') || lower.includes('plant')) return BOT_RESPONSES.fotossíntese;
  if (lower.includes('plano') || lower.includes('seman')) return BOT_RESPONSES.plano;
  return `Entendi! Sobre **"${msg}"**, posso te ajudar com explicações, exercícios e resumos. O que você gostaria?\n\n• 📖 Explicação do conteúdo\n• ✏️ Exercícios para praticar\n• 📋 Resumo rápido`;
}

function formatText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') ? (
      <strong key={i}>{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

export function ChatbotScreen({ navigate, user, reduceMotion }: CommonProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'bot',
      text: `Olá, ${user?.name}! 👋 Sou o Edu, seu assistente educacional.\n\nPosso te ajudar com:\n• Explicações de qualquer matéria\n• Exercícios e desafios\n• Planos de estudo personalizados\n\nO que você quer aprender hoje?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [messages, isTyping, reduceMotion]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: 'user', text, timestamp: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));
    const response = getBotResponse(text);
    const botMsg: Message = { id: Date.now() + 1, role: 'bot', text: response, timestamp: new Date() };
    setMessages((m) => [...m, botMsg]);
    setIsTyping(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleReset = () => {
    setMessages([
      {
        id: 0,
        role: 'bot',
        text: `Conversa reiniciada! 🔄 Como posso te ajudar, ${user?.name}?`,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="size-full flex flex-col" style={{ background: '#F5F3FF' }}>
      {/* Header */}
      <div
        className="px-5 pt-5 pb-4 flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', borderRadius: '0 0 20px 20px' }}
      >
        <button
          onClick={() => navigate('dashboard')}
          style={{ color: 'white', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          aria-label="Voltar"
        >
          <ChevronLeft size={20} />
        </button>

        <Mascot mood="happy" size={40} reduceMotion={reduceMotion} />

        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h3 style={{ color: 'white' }}>Edu</h3>
            <Sparkles size={14} color="#FCD34D" />
          </div>
          <div className="flex items-center gap-1.5">
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80' }} />
            <span style={{ color: '#C4B5FD', fontSize: '0.75rem' }}>Assistente educacional online</span>
          </div>
        </div>

        <button
          onClick={handleReset}
          style={{ color: 'white', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          aria-label="Reiniciar conversa"
          title="Reiniciar conversa"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 12, scale: reduceMotion ? 1 : 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: reduceMotion ? 0.05 : 0.25 }}
              className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'bot' && (
                <Mascot mood="reading" size={32} reduceMotion={reduceMotion} />
              )}
              <div
                className="max-w-[78%] rounded-2xl px-4 py-3"
                style={{
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #7C3AED, #4F46E5)'
                    : 'white',
                  color: msg.role === 'user' ? 'white' : '#1E1B4B',
                  borderBottomRightRadius: msg.role === 'user' ? 4 : undefined,
                  borderBottomLeftRadius: msg.role === 'bot' ? 4 : undefined,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  fontSize: '0.9rem',
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.role === 'bot' ? formatText(msg.text) : msg.text}
              </div>
              {msg.role === 'user' && (
                <div
                  style={{ width: 32, height: 32, borderRadius: '50%', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}
                >
                  🧒
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator (H#1 - system status) */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex items-end gap-2"
              aria-live="polite"
              aria-label="Edu está digitando..."
            >
              <Mascot mood="thinking" size={32} reduceMotion={reduceMotion} />
              <div
                className="rounded-2xl px-4 py-3 flex items-center gap-1"
                style={{ background: 'white', borderBottomLeftRadius: 4, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={reduceMotion ? {} : {
                      y: [0, -6, 0],
                      transition: { duration: 0.5, delay: i * 0.15, repeat: Infinity },
                    }}
                    style={{ width: 7, height: 7, borderRadius: '50%', background: '#C4B5FD' }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Quick chips */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p style={{ color: '#9CA3AF', fontSize: '0.78rem', marginBottom: 8 }}>Sugestões rápidas:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_CHIPS.map(({ label, msg }) => (
              <motion.button
                key={label}
                onClick={() => sendMessage(msg)}
                whileHover={reduceMotion ? {} : { scale: 1.03 }}
                whileTap={reduceMotion ? {} : { scale: 0.97 }}
                className="rounded-full px-3 py-1.5"
                style={{ background: '#EDE9FE', color: '#7C3AED', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
              >
                {label}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="px-4 pb-5 pt-3 flex items-center gap-2"
        style={{ background: 'white', borderTop: '1px solid #F3F4F6' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte qualquer coisa..."
          disabled={isTyping}
          aria-label="Mensagem para o assistente"
          className="flex-1 rounded-xl px-4 py-3 outline-none"
          style={{
            border: '2px solid #E5E7EB',
            background: '#F9FAFB',
            color: '#1E1B4B',
            fontSize: '0.9rem',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#7C3AED')}
          onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
        />
        <motion.button
          type="submit"
          disabled={!input.trim() || isTyping}
          whileHover={input.trim() && !isTyping && !reduceMotion ? { scale: 1.08 } : {}}
          whileTap={input.trim() && !isTyping && !reduceMotion ? { scale: 0.92 } : {}}
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: input.trim() && !isTyping ? 'linear-gradient(135deg, #7C3AED, #4F46E5)' : '#E5E7EB',
            border: 'none',
            cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s',
          }}
          aria-label="Enviar mensagem"
        >
          <Send size={18} color={input.trim() && !isTyping ? 'white' : '#9CA3AF'} />
        </motion.button>
      </form>
    </div>
  );
}
