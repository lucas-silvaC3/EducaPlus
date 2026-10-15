import { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Flame, Trophy, Zap, ChevronLeft, Lock } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { Mascot } from './Mascot';
import type { CommonProps } from '../App';

const ACHIEVEMENTS = [
  { id: 1, icon: '🔥', title: 'Sequência de 5 dias', desc: 'Estudou 5 dias seguidos', xp: 50, unlocked: true },
  { id: 2, icon: '🧠', title: 'Mestre das Frações', desc: 'Completou todas as aulas de frações', xp: 100, unlocked: true },
  { id: 3, icon: '⭐', title: '3 estrelas!', desc: 'Ganhou 3 estrelas em um jogo', xp: 75, unlocked: true },
  { id: 4, icon: '🎮', title: 'Gamer', desc: 'Jogou 10 jogos educativos', xp: 80, unlocked: false },
  { id: 5, icon: '📚', title: 'Leitor voraz', desc: 'Completou 20 aulas no total', xp: 120, unlocked: false },
  { id: 6, icon: '🚀', title: 'Decolar!', desc: 'Atingiu o nível 10', xp: 200, unlocked: false },
  { id: 7, icon: '💎', title: 'Diamante', desc: 'Sequência de 30 dias', xp: 500, unlocked: false },
  { id: 8, icon: '🏆', title: 'Campeão', desc: 'Top 10 no ranking', xp: 300, unlocked: false },
];

const WEEKLY_DATA = [
  { day: 'Seg', xp: 120, done: true },
  { day: 'Ter', xp: 80, done: true },
  { day: 'Qua', xp: 200, done: true },
  { day: 'Qui', xp: 150, done: true },
  { day: 'Sex', xp: 90, done: true },
  { day: 'Sáb', xp: 40, done: false },
  { day: 'Dom', xp: 0, done: false },
];

const SUBJECT_PROGRESS = [
  { name: 'Matemática', progress: 68, color: '#7C3AED', done: 16, total: 24 },
  { name: 'Português', progress: 55, color: '#3B82F6', done: 10, total: 18 },
  { name: 'Ciências', progress: 53, color: '#10B981', done: 8, total: 15 },
  { name: 'Geografia', progress: 42, color: '#F59E0B', done: 5, total: 12 },
];

const RANKING = [
  { rank: 1, name: 'Maria Santos', xp: 4200, avatar: '👩' },
  { rank: 2, name: 'João Silva', xp: 3850, avatar: '👦' },
  { rank: 3, name: 'Lucas (você)', xp: 1250, avatar: '🧒', isMe: true },
  { rank: 4, name: 'Ana Costa', xp: 980, avatar: '👧' },
  { rank: 5, name: 'Pedro Lima', xp: 740, avatar: '👦' },
];

const maxXP = Math.max(...WEEKLY_DATA.map((d) => d.xp));

export function ProgressScreen({ navigate, user, reduceMotion }: CommonProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'ranking'>('overview');
  const xpPercent = ((user!.xp % 500) / 500) * 100;
  const totalWeeklyXP = WEEKLY_DATA.reduce((s, d) => s + d.xp, 0);

  return (
    <div className="size-full flex flex-col" style={{ background: '#F5F3FF' }}>
      {/* Header */}
      <div
        className="px-5 pt-5 pb-4"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', borderRadius: '0 0 24px 24px' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('dashboard')}
            style={{ color: 'white', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            aria-label="Voltar"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 style={{ color: 'white' }}>Desempenho</h2>
            <p style={{ color: '#C4B5FD', fontSize: '0.8rem' }}>Acompanhe sua evolução</p>
          </div>
        </div>

        {/* Level card */}
        <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <div className="flex items-center gap-3 mb-3">
            <Mascot mood="happy" size={48} reduceMotion={reduceMotion} />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Star size={18} color="#FCD34D" fill="#FCD34D" />
                  <span style={{ color: 'white', fontWeight: 800 }}>Nível {user?.level}</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full px-3 py-1" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <Flame size={14} color="#FCD34D" />
                  <span style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>{user?.streak} dias</span>
                </div>
              </div>
              <div className="rounded-full overflow-hidden" style={{ height: 10, background: 'rgba(255,255,255,0.2)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ duration: reduceMotion ? 0.1 : 0.9, ease: 'easeOut', delay: 0.2 }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #FCD34D, #F59E0B)', borderRadius: 99 }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span style={{ color: '#C4B5FD', fontSize: '0.72rem' }}>{user?.xp} XP</span>
                <span style={{ color: '#C4B5FD', fontSize: '0.72rem' }}>Próx. nível: {(Math.floor(user!.xp / 500) + 1) * 500} XP</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: <Zap size={16} color="#FCD34D" />, val: user?.xp, label: 'Total XP' },
              { icon: <Trophy size={16} color="#FCD34D" />, val: ACHIEVEMENTS.filter((a) => a.unlocked).length, label: 'Conquistas' },
              { icon: <Flame size={16} color="#FCD34D" />, val: totalWeeklyXP, label: 'XP esta sem.' },
            ].map(({ icon, val, label }) => (
              <div key={label} className="rounded-xl p-2 text-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  {icon}
                  <span style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem' }}>{val}</span>
                </div>
                <p style={{ color: '#C4B5FD', fontSize: '0.65rem' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-5 gap-1 py-3">
        {(['overview', 'achievements', 'ranking'] as const).map((tab) => {
          const labels = { overview: 'Visão geral', achievements: 'Conquistas', ranking: 'Ranking' };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 rounded-xl py-2 transition-all"
              style={{
                background: activeTab === tab ? '#7C3AED' : '#EDE9FE',
                color: activeTab === tab ? 'white' : '#7C3AED',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.78rem',
              }}
              aria-selected={activeTab === tab}
              role="tab"
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {/* Overview tab */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Weekly chart */}
            <div className="rounded-2xl p-4 shadow-sm" style={{ background: 'white' }}>
              <p style={{ color: '#374151', fontWeight: 700, marginBottom: 12 }}>Atividade semanal</p>
              <div className="flex items-end gap-2 h-28">
                {WEEKLY_DATA.map(({ day, xp, done }, i) => {
                  const height = maxXP > 0 ? (xp / maxXP) * 100 : 0;
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: reduceMotion ? 0.1 : 0.6, delay: i * 0.07 }}
                        className="w-full rounded-lg"
                        style={{
                          background: done ? 'linear-gradient(180deg, #7C3AED, #4F46E5)' : '#EDE9FE',
                          minHeight: xp > 0 ? 8 : 4,
                        }}
                      />
                      <span style={{ color: '#9CA3AF', fontSize: '0.65rem' }}>{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subject progress */}
            <div className="rounded-2xl p-4 shadow-sm" style={{ background: 'white' }}>
              <p style={{ color: '#374151', fontWeight: 700, marginBottom: 12 }}>Progresso por matéria</p>
              <div className="space-y-4">
                {SUBJECT_PROGRESS.map(({ name, progress, color, done, total }) => (
                  <div key={name}>
                    <div className="flex justify-between mb-1">
                      <span style={{ color: '#374151', fontSize: '0.88rem', fontWeight: 600 }}>{name}</span>
                      <span style={{ color, fontSize: '0.82rem', fontWeight: 700 }}>
                        {done}/{total} aulas
                      </span>
                    </div>
                    <div className="rounded-full overflow-hidden" style={{ height: 8, background: '#F3F4F6' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: reduceMotion ? 0.1 : 0.7, ease: 'easeOut' }}
                        style={{ height: '100%', background: color, borderRadius: 99 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Achievements tab */}
        {activeTab === 'achievements' && (
          <div>
            <div className="flex items-center gap-2 mb-3 rounded-xl p-3" style={{ background: '#EDE9FE' }}>
              <Trophy size={18} color="#7C3AED" />
              <p style={{ color: '#7C3AED', fontSize: '0.85rem', fontWeight: 600 }}>
                {ACHIEVEMENTS.filter((a) => a.unlocked).length}/{ACHIEVEMENTS.length} conquistas desbloqueadas
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {ACHIEVEMENTS.map((ach, i) => (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="rounded-2xl p-4 shadow-sm"
                  style={{
                    background: ach.unlocked ? 'white' : '#F9FAFB',
                    opacity: ach.unlocked ? 1 : 0.6,
                    border: ach.unlocked ? '2px solid #EDE9FE' : '2px solid #F3F4F6',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ fontSize: ach.unlocked ? '1.8rem' : '1.4rem' }}>
                      {ach.unlocked ? ach.icon : <Lock size={20} color="#9CA3AF" />}
                    </span>
                    <div className="flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background: ach.unlocked ? '#FEF3C7' : '#F3F4F6' }}>
                      <Zap size={10} color={ach.unlocked ? '#D97706' : '#9CA3AF'} />
                      <span style={{ color: ach.unlocked ? '#D97706' : '#9CA3AF', fontSize: '0.68rem', fontWeight: 700 }}>+{ach.xp}</span>
                    </div>
                  </div>
                  <p style={{ color: ach.unlocked ? '#1E1B4B' : '#9CA3AF', fontWeight: 700, fontSize: '0.82rem', marginBottom: 2 }}>
                    {ach.title}
                  </p>
                  <p style={{ color: '#9CA3AF', fontSize: '0.72rem', lineHeight: 1.3 }}>{ach.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Ranking tab */}
        {activeTab === 'ranking' && (
          <div className="space-y-3">
            <p style={{ color: '#6B7280', fontSize: '0.82rem', fontWeight: 600 }}>Ranking da turma — Esta semana</p>
            {RANKING.map(({ rank, name, xp, avatar, isMe }, i) => (
              <motion.div
                key={rank}
                initial={{ opacity: 0, x: reduceMotion ? 0 : -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.06 }}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 shadow-sm"
                style={{
                  background: isMe ? 'linear-gradient(135deg, #7C3AED15, #4F46E515)' : 'white',
                  border: isMe ? '2px solid #7C3AED40' : '2px solid transparent',
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: rank === 1 ? '#FCD34D' : rank === 2 ? '#E5E7EB' : rank === 3 ? '#D97706' : '#F3F4F6',
                    color: rank <= 3 ? (rank === 1 ? '#92400E' : rank === 2 ? '#374151' : 'white') : '#6B7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    flexShrink: 0,
                  }}
                >
                  {rank}
                </span>
                <span style={{ fontSize: '1.3rem' }}>{avatar}</span>
                <div className="flex-1">
                  <p style={{ color: isMe ? '#7C3AED' : '#1E1B4B', fontWeight: 700, fontSize: '0.88rem' }}>
                    {name} {isMe && '(você)'}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Zap size={14} color="#F59E0B" fill="#F59E0B" />
                  <span style={{ color: '#374151', fontWeight: 700, fontSize: '0.88rem' }}>{xp.toLocaleString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BottomNav current="progress" navigate={navigate} reduceMotion={reduceMotion} />
    </div>
  );
}
