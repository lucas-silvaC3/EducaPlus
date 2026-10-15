import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell, Search, BookOpen, Calculator, FileText, Zap,
  ChevronRight, Star, Flame, Trophy, MessageCircle, Plus,
  CheckCircle, Clock, Play,
} from 'lucide-react';
import { Mascot } from './Mascot';
import { BottomNav } from './BottomNav';
import type { CommonProps, Screen } from '../App';

interface DashboardProps extends CommonProps {
  addXP: (amount: number) => void;
}

const QUICK_ACCESS = [
  { id: 'math', label: 'Matemática', icon: Calculator, color: '#7C3AED', bg: '#EDE9FE' },
  { id: 'redacao', label: 'Redação', icon: FileText, color: '#3B82F6', bg: '#DBEAFE' },
  { id: 'simulados', label: 'Simulados', icon: BookOpen, color: '#10B981', bg: '#D1FAE5' },
  { id: 'flashcards', label: 'Flashcards', icon: Zap, color: '#F59E0B', bg: '#FEF3C7' },
];

const DAILY_PLAN = [
  { time: '09:00', title: 'Revisão de matemática', done: true },
  { time: '10:30', title: 'Leitura: Interpretação de texto', done: true },
  { time: '14:00', title: 'Exercícios de ciências', done: false },
  { time: '16:00', title: 'Flashcards de história', done: false },
];

const RECENT_MATERIALS = [
  { id: 1, name: 'Apostila — Frações.pdf', subject: 'Matemática', when: 'Hoje às 08:32', color: '#7C3AED' },
  { id: 2, name: 'Resumo — Português.pdf', subject: 'Português', when: 'Ontem às 18:20', color: '#3B82F6' },
  { id: 3, name: 'Exercícios — Ciências.pdf', subject: 'Ciências', when: 'Ontem às 16:45', color: '#10B981' },
];

const CONTINUE_ACTIVITY = {
  subject: 'Matemática',
  title: 'Frações equivalentes',
  progress: 65,
  xp: 80,
};

export function Dashboard({ navigate, user, reduceMotion, addXP }: DashboardProps) {
  const [showNotif, setShowNotif] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [currentScreen] = useState<Screen>('dashboard');

  useEffect(() => {
    const t = setTimeout(() => setShowAchievement(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  const xpToNext = 500 - (user!.xp % 500);
  const xpPercent = ((user!.xp % 500) / 500) * 100;

  return (
    <div className="size-full flex flex-col relative" style={{ background: '#F5F3FF' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="px-5 pt-5 pb-4"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', borderRadius: '0 0 24px 24px' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Mascot mood="happy" size={48} reduceMotion={reduceMotion} />
            <div>
              <p style={{ color: '#C4B5FD', fontSize: '0.8rem' }}>
                {greeting}! 👋
              </p>
              <h2 style={{ color: 'white', lineHeight: 1.2 }}>{user?.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* System status: streak (H#1) */}
            <div
              className="flex items-center gap-1 rounded-full px-3 py-1"
              style={{ background: 'rgba(255,255,255,0.2)' }}
              title={`${user?.streak} dias de sequência`}
              aria-label={`Sequência: ${user?.streak} dias`}
            >
              <Flame size={16} color="#FCD34D" />
              <span style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>{user?.streak}</span>
            </div>

            <button
              onClick={() => setShowNotif((v) => !v)}
              style={{ position: 'relative', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              aria-label="Notificações"
            >
              <Bell size={18} color="white" />
              <span
                style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', border: '2px solid #7C3AED' }}
                aria-label="2 notificações novas"
              />
            </button>
          </div>
        </div>

        {/* XP bar (H#1 - system status) */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1.5">
              <Star size={14} color="#FCD34D" fill="#FCD34D" />
              <span style={{ color: 'white', fontSize: '0.82rem', fontWeight: 700 }}>
                Nível {user?.level} • {user?.xp} XP
              </span>
            </div>
            <span style={{ color: '#C4B5FD', fontSize: '0.75rem' }}>
              +{xpToNext} XP para o próx. nível
            </span>
          </div>
          <div className="rounded-full overflow-hidden" style={{ height: 8, background: 'rgba(255,255,255,0.2)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: reduceMotion ? 0.1 : 0.8, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #FCD34D, #F59E0B)' }}
            />
          </div>
        </div>

        {/* Search (H#7 - efficiency) */}
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          <Search size={16} color="#C4B5FD" />
          <input
            type="search"
            placeholder="Pesquisar aulas, temas... ⌘ K"
            style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, outline: 'none', fontSize: '0.88rem' }}
            className="placeholder:text-purple-300"
          />
        </div>
      </motion.div>

      {/* Body (scrollable) */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Focus mode toggle (H#7) */}
        <div className="flex items-center justify-between">
          <p style={{ color: '#374151', fontWeight: 700 }}>Acesso rápido</p>
          <button
            onClick={() => setFocusMode((v) => !v)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1 transition-all"
            style={{
              background: focusMode ? '#7C3AED' : '#EDE9FE',
              color: focusMode ? 'white' : '#7C3AED',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
            aria-pressed={focusMode}
          >
            🎯 {focusMode ? 'Modo foco ON' : 'Modo foco'}
          </button>
        </div>

        {/* Quick access (H#6 - recognition, H#7 - efficiency) */}
        <div className="grid grid-cols-4 gap-3">
          {QUICK_ACCESS.map(({ id, label, icon: Icon, color, bg }) => (
            <motion.button
              key={id}
              onClick={() => navigate('aulas')}
              whileHover={reduceMotion ? {} : { scale: 1.06, y: -2 }}
              whileTap={reduceMotion ? {} : { scale: 0.95 }}
              className="flex flex-col items-center gap-1.5 rounded-2xl py-3 px-1"
              style={{ background: bg, border: 'none', cursor: 'pointer' }}
              aria-label={label}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: color }}
              >
                <Icon size={20} color="white" />
              </div>
              <span style={{ color, fontSize: '0.72rem', fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>
                {label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Continue studying (H#6 - recognition over recall) */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p style={{ color: '#374151', fontWeight: 700 }}>Continue estudando</p>
            <button
              onClick={() => navigate('aulas')}
              style={{ color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}
            >
              Ver tudo <ChevronRight size={14} />
            </button>
          </div>

          <motion.div
            whileHover={reduceMotion ? {} : { scale: 1.01, y: -2 }}
            className="rounded-2xl p-4 shadow-sm"
            style={{ background: 'white', cursor: 'pointer' }}
            onClick={() => navigate('gameplay')}
            role="button"
            tabIndex={0}
            aria-label={`Continuar: ${CONTINUE_ACTIVITY.title}`}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: '#EDE9FE' }}
              >
                <Calculator size={28} color="#7C3AED" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 600 }}>
                    {CONTINUE_ACTIVITY.subject} • 8º ano
                  </span>
                  <span style={{ color: '#7C3AED', fontSize: '0.75rem', fontWeight: 700 }}>
                    +{CONTINUE_ACTIVITY.xp} XP
                  </span>
                </div>
                <h4 style={{ color: '#1E1B4B', marginBottom: 6 }}>{CONTINUE_ACTIVITY.title}</h4>
                <div>
                  <div className="flex justify-between mb-1">
                    <span style={{ color: '#9CA3AF', fontSize: '0.72rem' }}>Progresso</span>
                    <span style={{ color: '#7C3AED', fontSize: '0.72rem', fontWeight: 700 }}>
                      {CONTINUE_ACTIVITY.progress}%
                    </span>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ height: 6, background: '#EDE9FE' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${CONTINUE_ACTIVITY.progress}%` }}
                      transition={{ duration: reduceMotion ? 0.1 : 0.7, delay: 0.3 }}
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #7C3AED, #4F46E5)' }}
                    />
                  </div>
                </div>
              </div>
              <motion.div
                whileHover={reduceMotion ? {} : { scale: 1.15 }}
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}
              >
                <Play size={16} color="white" fill="white" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Daily plan (H#6) */}
        {!focusMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-2">
              <p style={{ color: '#374151', fontWeight: 700 }}>Plano de hoje</p>
              <button
                style={{ color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700 }}
              >
                Editar
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: 'white' }}>
              {DAILY_PLAN.map(({ time, title, done }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ borderBottom: i < DAILY_PLAN.length - 1 ? '1px solid #F3F4F6' : undefined }}
                >
                  <div className="flex items-center gap-2 w-16 shrink-0">
                    <Clock size={14} color="#9CA3AF" />
                    <span style={{ color: '#9CA3AF', fontSize: '0.78rem' }}>{time}</span>
                  </div>
                  <p
                    style={{
                      flex: 1,
                      color: done ? '#9CA3AF' : '#1E1B4B',
                      fontSize: '0.88rem',
                      textDecoration: done ? 'line-through' : undefined,
                    }}
                  >
                    {title}
                  </p>
                  <CheckCircle size={20} color={done ? '#10B981' : '#E5E7EB'} fill={done ? '#10B981' : 'none'} />
                </div>
              ))}
              <button
                className="w-full flex items-center gap-2 px-4 py-3"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7C3AED' }}
              >
                <Plus size={16} />
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Adicionar atividade</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Recent materials (H#6) */}
        {!focusMode && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <p style={{ color: '#374151', fontWeight: 700 }}>Materiais recentes</p>
              <button
                style={{ color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}
              >
                Ver todos <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-2">
              {RECENT_MATERIALS.map(({ id, name, subject, when, color }) => (
                <motion.div
                  key={id}
                  whileHover={reduceMotion ? {} : { x: 4 }}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 shadow-sm"
                  style={{ background: 'white', cursor: 'pointer' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${color}15` }}
                  >
                    <FileText size={18} color={color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ color: '#1E1B4B', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</p>
                    <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>{subject} • {when}</p>
                  </div>
                  <ChevronRight size={16} color="#D1D5DB" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="h-4" />
      </div>

      {/* Achievement toast (H#1 - system status) */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 80, scale: reduceMotion ? 1 : 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 80, scale: reduceMotion ? 1 : 0.9 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.4, ease: 'easeOut' }}
            className="absolute left-4 right-4 bottom-24 rounded-2xl p-4 shadow-2xl flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', zIndex: 100 }}
            role="status"
            aria-live="polite"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(255,255,255,0.25)' }}
            >
              <Trophy size={24} color="white" />
            </div>
            <div className="flex-1">
              <p style={{ color: 'white', fontWeight: 800, fontSize: '0.9rem' }}>🎉 Conquista desbloqueada!</p>
              <p style={{ color: '#FEF3C7', fontSize: '0.8rem' }}>Sequência de 5 dias — "Estudante dedicado"</p>
            </div>
            <button
              onClick={() => setShowAchievement(false)}
              style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              aria-label="Fechar notificação"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot FAB (H#10) */}
      <motion.button
        onClick={() => navigate('chatbot')}
        whileHover={reduceMotion ? {} : { scale: 1.1 }}
        whileTap={reduceMotion ? {} : { scale: 0.95 }}
        className="absolute bottom-20 right-4 w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', border: 'none', cursor: 'pointer', zIndex: 40 }}
        aria-label="Assistente educacional"
      >
        <MessageCircle size={22} color="white" />
      </motion.button>

      {/* Notification panel */}
      <AnimatePresence>
        {showNotif && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50"
              onClick={() => setShowNotif(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.95 }}
              className="absolute top-20 right-4 w-72 rounded-2xl shadow-2xl z-50 p-4"
              style={{ background: 'white' }}
            >
              <h4 style={{ color: '#1E1B4B', marginBottom: 12 }}>Notificações</h4>
              {[
                { icon: '🏆', text: 'Você ganhou 80 XP na atividade de matemática!', time: '2min' },
                { icon: '📚', text: 'Nova aula disponível: Equações do 2º grau', time: '1h' },
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-3 py-2.5" style={{ borderTop: i > 0 ? '1px solid #F3F4F6' : undefined }}>
                  <span style={{ fontSize: '1.2rem' }}>{n.icon}</span>
                  <div>
                    <p style={{ color: '#374151', fontSize: '0.83rem' }}>{n.text}</p>
                    <p style={{ color: '#9CA3AF', fontSize: '0.72rem', marginTop: 2 }}>{n.time} atrás</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BottomNav current={currentScreen} navigate={navigate} reduceMotion={reduceMotion} />
    </div>
  );
}
