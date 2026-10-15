import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users, BarChart2, BookOpen, Bell, Settings, LogOut,
  TrendingUp, AlertCircle, CheckCircle, ChevronRight,
  Plus, Search, Zap, Flame,
} from 'lucide-react';
import type { CommonProps } from '../App';

const STUDENTS = [
  { id: 1, name: 'Lucas Silva', xp: 1250, level: 7, streak: 5, avatar: '🧒', alert: false, progress: 68 },
  { id: 2, name: 'Maria Santos', xp: 4200, level: 12, streak: 15, avatar: '👧', alert: false, progress: 92 },
  { id: 3, name: 'João Costa', xp: 320, level: 2, streak: 0, avatar: '👦', alert: true, progress: 22 },
  { id: 4, name: 'Ana Lima', xp: 2100, level: 9, streak: 8, avatar: '👩', alert: false, progress: 75 },
  { id: 5, name: 'Pedro Alves', xp: 680, level: 4, streak: 2, avatar: '🧑', alert: true, progress: 38 },
  { id: 6, name: 'Sofia Nunes', xp: 3400, level: 11, streak: 12, avatar: '👧', alert: false, progress: 85 },
];

const ACTIVITIES = [
  { id: 1, title: 'Quiz — Frações', subject: 'Matemática', due: 'Amanhã', submissions: 4, total: 6, color: '#7C3AED' },
  { id: 2, title: 'Redação — Meio ambiente', subject: 'Português', due: 'Sex', submissions: 2, total: 6, color: '#3B82F6' },
  { id: 3, title: 'Experimento — Reações', subject: 'Ciências', due: 'Próx. seg.', submissions: 0, total: 6, color: '#10B981' },
];

type PanelView = 'overview' | 'students' | 'activities' | 'reports';

export function TeacherPanel({ navigate, user, logout, reduceMotion }: CommonProps) {
  const [view, setView] = useState<PanelView>('overview');
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  const alertStudents = STUDENTS.filter((s) => s.alert);
  const filtered = STUDENTS.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
  const avgProgress = Math.round(STUDENTS.reduce((s, st) => s + st.progress, 0) / STUDENTS.length);

  const NAV_ITEMS: { id: PanelView; icon: React.ReactNode; label: string }[] = [
    { id: 'overview', icon: <BarChart2 size={20} />, label: 'Visão geral' },
    { id: 'students', icon: <Users size={20} />, label: 'Alunos' },
    { id: 'activities', icon: <BookOpen size={20} />, label: 'Atividades' },
    { id: 'reports', icon: <TrendingUp size={20} />, label: 'Relatórios' },
  ];

  return (
    <div className="size-full flex" style={{ background: '#F5F3FF' }}>
      {/* Sidebar */}
      <div
        className="flex flex-col py-6"
        style={{
          width: 220,
          background: 'linear-gradient(180deg, #7C3AED, #4F46E5)',
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div className="px-5 mb-8">
          <h2 style={{ color: 'white' }}>Estuda+</h2>
          <p style={{ color: '#C4B5FD', fontSize: '0.75rem' }}>Painel do Professor</p>
        </div>

        {/* Teacher info */}
        <div className="px-4 py-3 mx-3 rounded-2xl mb-6" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <div className="flex items-center gap-2">
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
              👩‍🏫
            </div>
            <div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2 }}>{user?.name}</p>
              <p style={{ color: '#C4B5FD', fontSize: '0.7rem' }}>Professora</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map(({ id, icon, label }) => (
            <motion.button
              key={id}
              onClick={() => setView(id)}
              whileHover={reduceMotion ? {} : { x: 4 }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left"
              style={{
                background: view === id ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: view === id ? 'white' : '#C4B5FD',
                border: 'none',
                cursor: 'pointer',
                fontWeight: view === id ? 700 : 500,
                fontSize: '0.88rem',
              }}
              aria-current={view === id ? 'page' : undefined}
            >
              {icon}
              {label}
            </motion.button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 space-y-1 mt-4">
          <button
            onClick={() => navigate('settings')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: 'transparent', color: '#C4B5FD', border: 'none', cursor: 'pointer', fontSize: '0.88rem' }}
          >
            <Settings size={20} /> Configurações
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: 'transparent', color: '#FCA5A5', border: 'none', cursor: 'pointer', fontSize: '0.88rem' }}
          >
            <LogOut size={20} /> Sair
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="px-6 py-4 flex items-center justify-between" style={{ background: 'white', borderBottom: '1px solid #F3F4F6' }}>
          <div>
            <h3 style={{ color: '#1E1B4B' }}>
              {view === 'overview' ? 'Visão Geral' :
               view === 'students' ? 'Alunos' :
               view === 'activities' ? 'Atividades' : 'Relatórios'}
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '0.78rem' }}>
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {alertStudents.length > 0 && (
              <div className="relative">
                <Bell size={22} color="#6B7280" />
                <span
                  style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', background: '#EF4444', color: 'white', fontSize: '0.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {alertStudents.length}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* OVERVIEW */}
          {view === 'overview' && (
            <div className="space-y-5">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Total de alunos', value: STUDENTS.length, icon: <Users size={20} color="#7C3AED" />, bg: '#EDE9FE', color: '#7C3AED' },
                  { label: 'Progresso médio', value: `${avgProgress}%`, icon: <TrendingUp size={20} color="#10B981" />, bg: '#D1FAE5', color: '#10B981' },
                  { label: 'Alertas', value: alertStudents.length, icon: <AlertCircle size={20} color="#EF4444" />, bg: '#FEE2E2', color: '#EF4444' },
                  { label: 'Atividades', value: ACTIVITIES.length, icon: <BookOpen size={20} color="#3B82F6" />, bg: '#DBEAFE', color: '#3B82F6' },
                ].map(({ label, value, icon, bg, color }) => (
                  <motion.div
                    key={label}
                    whileHover={reduceMotion ? {} : { y: -3 }}
                    className="rounded-2xl p-4 shadow-sm"
                    style={{ background: 'white' }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
                      {icon}
                    </div>
                    <p style={{ color, fontWeight: 800, fontSize: '1.4rem' }}>{value}</p>
                    <p style={{ color: '#9CA3AF', fontSize: '0.78rem' }}>{label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Alerts */}
              {alertStudents.length > 0 && (
                <div>
                  <h4 style={{ color: '#1E1B4B', marginBottom: 10 }}>⚠️ Alunos que precisam de atenção</h4>
                  <div className="space-y-2">
                    {alertStudents.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center gap-3 rounded-xl p-4 shadow-sm"
                        style={{ background: '#FEF2F2', border: '2px solid #FECACA' }}
                      >
                        <span style={{ fontSize: '1.4rem' }}>{s.avatar}</span>
                        <div className="flex-1">
                          <p style={{ color: '#1E1B4B', fontWeight: 700, fontSize: '0.9rem' }}>{s.name}</p>
                          <p style={{ color: '#EF4444', fontSize: '0.78rem' }}>
                            {s.streak === 0 ? '🚨 Sem sequência ativa' : '📉 Progresso abaixo da média'}
                          </p>
                        </div>
                        <button
                          className="rounded-xl px-3 py-1.5"
                          style={{ background: '#EF4444', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
                        >
                          Contatar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent activity */}
              <div>
                <h4 style={{ color: '#1E1B4B', marginBottom: 10 }}>Atividades recentes da turma</h4>
                <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: 'white' }}>
                  {STUDENTS.slice(0, 4).map((s, i) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 px-5 py-3"
                      style={{ borderBottom: i < 3 ? '1px solid #F3F4F6' : undefined }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{s.avatar}</span>
                      <div className="flex-1">
                        <p style={{ color: '#1E1B4B', fontSize: '0.88rem', fontWeight: 600 }}>{s.name}</p>
                        <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>Completou: Frações equivalentes</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap size={14} color="#F59E0B" />
                        <span style={{ color: '#F59E0B', fontWeight: 700, fontSize: '0.82rem' }}>+{Math.round(s.progress)} XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STUDENTS */}
          {view === 'students' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: 'white', border: '2px solid #E5E7EB' }}>
                  <Search size={16} color="#9CA3AF" />
                  <input
                    type="search"
                    placeholder="Buscar aluno..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: '#1E1B4B', flex: 1, outline: 'none', fontSize: '0.9rem' }}
                  />
                </div>
                <button
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5"
                  style={{ background: '#7C3AED', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
                >
                  <Plus size={16} /> Adicionar
                </button>
              </div>

              <div className="space-y-3">
                {filtered.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    onClick={() => setSelectedStudent(s.id === selectedStudent ? null : s.id)}
                    className="rounded-2xl p-4 shadow-sm cursor-pointer"
                    style={{
                      background: 'white',
                      border: s.id === selectedStudent ? '2px solid #7C3AED' : s.alert ? '2px solid #FECACA' : '2px solid transparent',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: '1.6rem' }}>{s.avatar}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p style={{ color: '#1E1B4B', fontWeight: 700 }}>{s.name}</p>
                          {s.alert && <AlertCircle size={16} color="#EF4444" />}
                          {!s.alert && <CheckCircle size={16} color="#10B981" />}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>Nível {s.level}</span>
                          <div className="flex items-center gap-1">
                            <Flame size={12} color="#F59E0B" />
                            <span style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>{s.streak} dias</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap size={12} color="#7C3AED" />
                            <span style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>{s.xp} XP</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span style={{ color: '#7C3AED', fontWeight: 800, fontSize: '1rem' }}>{s.progress}%</span>
                        <ChevronRight size={16} color="#D1D5DB" />
                      </div>
                    </div>

                    {s.id === selectedStudent && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mt-3 pt-3"
                        style={{ borderTop: '1px solid #F3F4F6' }}
                      >
                        <div className="mb-2">
                          <div className="flex justify-between mb-1">
                            <span style={{ color: '#6B7280', fontSize: '0.78rem' }}>Progresso geral</span>
                            <span style={{ color: '#7C3AED', fontWeight: 700, fontSize: '0.78rem' }}>{s.progress}%</span>
                          </div>
                          <div className="rounded-full overflow-hidden" style={{ height: 8, background: '#F3F4F6' }}>
                            <div style={{ height: '100%', width: `${s.progress}%`, background: s.progress >= 60 ? '#10B981' : '#F59E0B', borderRadius: 99 }} />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 rounded-xl py-2 text-center" style={{ background: '#EDE9FE', color: '#7C3AED', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>
                            Ver detalhes
                          </button>
                          <button className="flex-1 rounded-xl py-2 text-center" style={{ background: '#7C3AED', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>
                            Atribuir atividade
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVITIES */}
          {view === 'activities' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 style={{ color: '#1E1B4B' }}>Atividades atribuídas</h4>
                <button
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5"
                  style={{ background: '#7C3AED', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
                >
                  <Plus size={16} /> Nova atividade
                </button>
              </div>
              <div className="space-y-3">
                {ACTIVITIES.map((act) => (
                  <div
                    key={act.id}
                    className="rounded-2xl p-5 shadow-sm"
                    style={{ background: 'white', borderLeft: `4px solid ${act.color}` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p style={{ color: '#1E1B4B', fontWeight: 700 }}>{act.title}</p>
                        <p style={{ color: '#9CA3AF', fontSize: '0.78rem' }}>{act.subject} • Prazo: {act.due}</p>
                      </div>
                      <span
                        className="rounded-full px-2 py-1"
                        style={{ background: `${act.color}15`, color: act.color, fontSize: '0.72rem', fontWeight: 700 }}
                      >
                        {act.submissions}/{act.total} entregas
                      </span>
                    </div>
                    <div className="rounded-full overflow-hidden" style={{ height: 8, background: '#F3F4F6' }}>
                      <div style={{ height: '100%', width: `${(act.submissions / act.total) * 100}%`, background: act.color, borderRadius: 99 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REPORTS */}
          {view === 'reports' && (
            <div className="space-y-5">
              <div className="rounded-2xl p-5 shadow-sm" style={{ background: 'white' }}>
                <h4 style={{ color: '#1E1B4B', marginBottom: 16 }}>Desempenho da turma por matéria</h4>
                {[
                  { name: 'Matemática', avg: 72, color: '#7C3AED' },
                  { name: 'Português', avg: 64, color: '#3B82F6' },
                  { name: 'Ciências', avg: 58, color: '#10B981' },
                  { name: 'Geografia', avg: 48, color: '#F59E0B' },
                ].map(({ name, avg, color }) => (
                  <div key={name} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span style={{ color: '#374151', fontSize: '0.88rem', fontWeight: 600 }}>{name}</span>
                      <span style={{ color, fontWeight: 700, fontSize: '0.85rem' }}>{avg}%</span>
                    </div>
                    <div className="rounded-full overflow-hidden" style={{ height: 10, background: '#F3F4F6' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${avg}%` }}
                        transition={{ duration: reduceMotion ? 0.1 : 0.7 }}
                        style={{ height: '100%', background: color, borderRadius: 99 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl p-5 shadow-sm" style={{ background: 'white' }}>
                <h4 style={{ color: '#1E1B4B', marginBottom: 12 }}>Ranking da turma</h4>
                {STUDENTS.sort((a, b) => b.xp - a.xp).slice(0, 5).map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3 py-2" style={{ borderBottom: i < 4 ? '1px solid #F3F4F6' : undefined }}>
                    <span style={{ width: 24, height: 24, borderRadius: '50%', background: i === 0 ? '#FCD34D' : i === 1 ? '#E5E7EB' : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', color: '#374151', flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    <span>{s.avatar}</span>
                    <span style={{ flex: 1, color: '#374151', fontSize: '0.88rem', fontWeight: 600 }}>{s.name}</span>
                    <div className="flex items-center gap-1">
                      <Zap size={14} color="#F59E0B" />
                      <span style={{ color: '#374151', fontWeight: 700, fontSize: '0.85rem' }}>{s.xp.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
