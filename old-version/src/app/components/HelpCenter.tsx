import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, Search, ChevronDown, ChevronUp,
  MessageCircle, Phone, BookOpen, Play, HelpCircle,
} from 'lucide-react';
import { Mascot } from './Mascot';
import type { CommonProps } from '../App';

const TUTORIALS = [
  { id: 1, title: 'Como criar seu plano de estudos', duration: '3:45', emoji: '📅' },
  { id: 2, title: 'Como acompanhar seu desempenho', duration: '2:10', emoji: '📊' },
  { id: 3, title: 'Como usar os flashcards', duration: '2:38', emoji: '📝' },
  { id: 4, title: 'Jogos educativos — primeiros passos', duration: '1:55', emoji: '🎮' },
];

const FAQ_ITEMS = [
  {
    q: 'Como recuperar minha senha?',
    a: 'Na tela de login, clique em "Esqueci minha senha". Informe seu e-mail cadastrado e você receberá um link para criar uma nova senha. Verifique também a caixa de spam.',
  },
  {
    q: 'Como funciona o plano de estudos?',
    a: 'O plano de estudos é criado automaticamente com base nas suas metas e matérias. Você pode personalizá-lo acessando Início > Plano de hoje > Editar. Adicione, remova ou mova atividades livremente.',
  },
  {
    q: 'Como acompanhar meu progresso?',
    a: 'Acesse a aba "Desempenho" na barra de navegação inferior. Lá você encontra gráficos semanais, progresso por matéria, conquistas desbloqueadas e seu ranking na turma.',
  },
  {
    q: 'Posso usar o Estuda+ offline?',
    a: 'Algumas funcionalidades estão disponíveis offline, como flashcards e materiais baixados. Para sincronizar seu progresso e acessar novos conteúdos, você precisa de conexão com a internet.',
  },
  {
    q: 'Como ganhar mais XP?',
    a: 'Você ganha XP completando aulas, respondendo quizzes corretamente (mais XP para acertos sem dicas!), mantendo sua sequência diária e desbloqueando conquistas. Cada atividade mostra quantos XP você ganhará.',
  },
  {
    q: 'Como entrar em contato com meu professor?',
    a: 'No perfil da turma, acesse a aba "Mensagens" para enviar uma mensagem diretamente ao seu professor. Você também pode usar o chatbot Edu para tirar dúvidas rápidas.',
  },
];

export function HelpCenter({ navigate, reduceMotion }: CommonProps) {
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredFaq = FAQ_ITEMS.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="size-full flex flex-col" style={{ background: '#F5F3FF' }}>
      {/* Header */}
      <div
        className="px-5 pt-5 pb-6"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', borderRadius: '0 0 28px 28px' }}
      >
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate('dashboard')}
            style={{ color: 'white', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            aria-label="Voltar"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 style={{ color: 'white' }}>Central de Ajuda</h2>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Mascot mood="waving" size={52} reduceMotion={reduceMotion} />
          <div>
            <p style={{ color: 'white', fontWeight: 700 }}>Como podemos te ajudar hoje?</p>
            <p style={{ color: '#C4B5FD', fontSize: '0.8rem' }}>Encontre tutoriais, FAQs e suporte</p>
          </div>
        </div>

        {/* Search (H#10 - help & docs) */}
        <div
          className="flex items-center gap-2 rounded-xl px-4 py-3"
          style={{ background: 'white' }}
        >
          <Search size={18} color="#9CA3AF" />
          <input
            type="search"
            placeholder="Buscar por dúvidas ou temas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#1E1B4B', flex: 1, outline: 'none', fontSize: '0.9rem' }}
            aria-label="Buscar na central de ajuda"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Quick support channels (H#10) */}
        {!search && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <MessageCircle size={22} color="#7C3AED" />, label: 'Chat ao vivo', color: '#7C3AED', bg: '#EDE9FE', action: () => navigate('chatbot') },
              { icon: <Phone size={22} color="#10B981" />, label: 'Suporte', color: '#10B981', bg: '#D1FAE5', action: () => {} },
              { icon: <BookOpen size={22} color="#3B82F6" />, label: 'Guia rápido', color: '#3B82F6', bg: '#DBEAFE', action: () => {} },
            ].map(({ icon, label, color, bg, action }) => (
              <motion.button
                key={label}
                onClick={action}
                whileHover={reduceMotion ? {} : { scale: 1.05, y: -2 }}
                whileTap={reduceMotion ? {} : { scale: 0.97 }}
                className="rounded-2xl py-4 px-2 flex flex-col items-center gap-2 shadow-sm"
                style={{ background: 'white', border: 'none', cursor: 'pointer' }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                  {icon}
                </div>
                <span style={{ color, fontSize: '0.78rem', fontWeight: 700 }}>{label}</span>
              </motion.button>
            ))}
          </div>
        )}

        {/* Video tutorials (H#10) */}
        {!search && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 style={{ color: '#1E1B4B' }}>Tutoriais rápidos</h4>
              <button style={{ color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700 }}>
                Ver todos
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {TUTORIALS.map((tut, i) => (
                <motion.div
                  key={tut.id}
                  initial={{ opacity: 0, x: reduceMotion ? 0 : 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.07 }}
                  className="shrink-0 rounded-2xl overflow-hidden shadow-sm cursor-pointer"
                  style={{ width: 160, background: 'white' }}
                >
                  <div
                    className="h-20 flex items-center justify-center relative"
                    style={{ background: 'linear-gradient(135deg, #EDE9FE, #E0E7FF)', fontSize: '2.5rem' }}
                  >
                    {tut.emoji}
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: 'rgba(124,58,237,0.15)' }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(124,58,237,0.9)' }}
                      >
                        <Play size={14} color="white" fill="white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p style={{ color: '#1E1B4B', fontSize: '0.78rem', fontWeight: 700, lineHeight: 1.3, marginBottom: 4 }}>
                      {tut.title}
                    </p>
                    <p style={{ color: '#9CA3AF', fontSize: '0.7rem' }}>{tut.duration}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ (H#10) */}
        <div>
          <h4 style={{ color: '#1E1B4B', marginBottom: 10 }}>
            {search ? `Resultados para "${search}"` : 'Perguntas frequentes'}
          </h4>

          {filteredFaq.length === 0 ? (
            <div className="text-center py-8">
              <HelpCircle size={40} color="#C4B5FD" className="mx-auto mb-3" />
              <p style={{ color: '#6B7280', fontWeight: 600 }}>Nenhum resultado encontrado</p>
              <p style={{ color: '#9CA3AF', fontSize: '0.85rem', marginTop: 4 }}>
                Tente outras palavras ou entre em contato com o suporte
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFaq.map(({ q, a }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="rounded-2xl overflow-hidden shadow-sm"
                  style={{ background: 'white' }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center gap-3 px-4 py-4 text-left"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                    aria-expanded={openFaq === i}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: '#EDE9FE' }}
                    >
                      <HelpCircle size={14} color="#7C3AED" />
                    </div>
                    <span style={{ flex: 1, color: '#1E1B4B', fontWeight: 600, fontSize: '0.9rem' }}>{q}</span>
                    {openFaq === i ? (
                      <ChevronUp size={18} color="#7C3AED" />
                    ) : (
                      <ChevronDown size={18} color="#9CA3AF" />
                    )}
                  </button>

                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0.05 : 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-0" style={{ borderTop: '1px solid #F3F4F6' }}>
                          <p style={{ color: '#6B7280', fontSize: '0.88rem', lineHeight: 1.6, marginTop: 10 }}>{a}</p>
                          <button
                            className="mt-3 flex items-center gap-1"
                            style={{ color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                          >
                            👍 Isso me ajudou
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Contact support */}
        <div className="rounded-2xl p-5 shadow-sm" style={{ background: 'linear-gradient(135deg, #EDE9FE, #E0E7FF)' }}>
          <div className="flex items-center gap-3 mb-3">
            <Mascot mood="waving" size={44} reduceMotion={reduceMotion} />
            <div>
              <p style={{ color: '#1E1B4B', fontWeight: 700 }}>Precisa de mais ajuda?</p>
              <p style={{ color: '#6B7280', fontSize: '0.82rem' }}>Fale com nossa equipe ou a comunidade.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('chatbot')}
              className="flex-1 rounded-xl py-2.5 flex items-center justify-center gap-2"
              style={{ background: '#7C3AED', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
            >
              <MessageCircle size={16} /> Falar com suporte
            </button>
            <button
              className="flex-1 rounded-xl py-2.5 flex items-center justify-center gap-2"
              style={{ background: 'white', color: '#7C3AED', border: '2px solid #7C3AED', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
            >
              👥 Comunidade
            </button>
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
