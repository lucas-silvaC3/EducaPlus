import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronLeft, BookOpen, Calculator, FlaskConical, Globe, Music, Dumbbell, Lock } from 'lucide-react';
import { BottomNav } from './BottomNav';
import type { CommonProps, Screen } from '../App';

const SUBJECTS: Array<{ id: string; name: string; icon: any; color: string; bg: string; lessons: number; done: number; screen: Screen }> = [
  { id: 'math', name: 'Matemática', icon: Calculator, color: '#7C3AED', bg: '#EDE9FE', lessons: 24, done: 16, screen: 'aulas' },
  { id: 'port', name: 'Português', icon: BookOpen, color: '#3B82F6', bg: '#DBEAFE', lessons: 18, done: 10, screen: 'portugues' },
  { id: 'science', name: 'Ciências', icon: FlaskConical, color: '#10B981', bg: '#D1FAE5', lessons: 15, done: 8, screen: 'ciencias' },
  { id: 'geo', name: 'Geografia', icon: Globe, color: '#F59E0B', bg: '#FEF3C7', lessons: 12, done: 5, screen: 'geografia' },
  { id: 'arts', name: 'Artes', icon: Music, color: '#EC4899', bg: '#FCE7F3', lessons: 10, done: 3, screen: 'artes' },
  { id: 'ed', name: 'Ed. Física', icon: Dumbbell, color: '#6B7280', bg: '#F3F4F6', lessons: 8, done: 6, screen: 'educacaoFisica' },
];

const MATH_LESSONS = [
  { id: 1, title: 'Frações equivalentes', duration: '15 min', xp: 80, done: true, locked: false },
  { id: 2, title: 'Operações com frações', duration: '20 min', xp: 100, done: true, locked: false },
  { id: 3, title: 'Números decimais', duration: '18 min', xp: 90, done: false, locked: false },
  { id: 4, title: 'Porcentagem', duration: '22 min', xp: 110, done: false, locked: false },
  { id: 5, title: 'Equações do 1º grau', duration: '25 min', xp: 130, done: false, locked: true },
  { id: 6, title: 'Equações do 2º grau', duration: '30 min', xp: 150, done: false, locked: true },
];

export function AulasScreen({ navigate, user, reduceMotion }: CommonProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = SUBJECTS.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
  const selectedSubject = SUBJECTS.find((s) => s.id === selected);

  if (selected && selectedSubject) {
    return (
      <div className="size-full flex flex-col" style={{ background: '#F5F3FF' }}>
        {/* Header */}
        <div
          className="px-5 pt-5 pb-6"
          style={{ background: `linear-gradient(135deg, ${selectedSubject.color}, ${selectedSubject.color}BB)`, borderRadius: '0 0 24px 24px' }}
        >
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-1 mb-4"
            style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
          >
            <ChevronLeft size={20} /> Voltar
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.25)' }}>
              <selectedSubject.icon size={24} color="white" />
            </div>
            <div>
              <h2 style={{ color: 'white' }}>{selectedSubject.name}</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem' }}>
                {selectedSubject.done}/{selectedSubject.lessons} aulas concluídas
              </p>
            </div>
          </div>
          <div className="mt-3 rounded-full overflow-hidden" style={{ height: 8, background: 'rgba(255,255,255,0.25)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(selectedSubject.done / selectedSubject.lessons) * 100}%` }}
              transition={{ duration: reduceMotion ? 0.1 : 0.7 }}
              style={{ height: '100%', background: 'white', borderRadius: 99 }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          <p style={{ color: '#6B7280', fontSize: '0.85rem', fontWeight: 600 }}>Aulas disponíveis</p>
          {MATH_LESSONS.map((lesson, i) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, x: reduceMotion ? 0 : -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              onClick={() => !lesson.locked && navigate('gameplay')}
              className="flex items-center gap-3 rounded-2xl p-4 shadow-sm"
              style={{
                background: lesson.locked ? '#F9FAFB' : 'white',
                cursor: lesson.locked ? 'not-allowed' : 'pointer',
                opacity: lesson.locked ? 0.6 : 1,
                border: lesson.done ? `2px solid ${selectedSubject.color}30` : '2px solid transparent',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: lesson.done ? selectedSubject.bg : lesson.locked ? '#F3F4F6' : '#EDE9FE' }}
              >
                {lesson.locked ? (
                  <Lock size={18} color="#9CA3AF" />
                ) : lesson.done ? (
                  <span style={{ fontSize: '1.2rem' }}>✅</span>
                ) : (
                  <span style={{ color: selectedSubject.color, fontWeight: 800, fontSize: '0.9rem' }}>{lesson.id}</span>
                )}
              </div>
              <div className="flex-1">
                <p style={{ color: lesson.locked ? '#9CA3AF' : '#1E1B4B', fontWeight: 600, fontSize: '0.9rem' }}>
                  {lesson.title}
                </p>
                <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>{lesson.duration}</p>
              </div>
              <div className="flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background: '#FEF3C7' }}>
                <span style={{ color: '#D97706', fontSize: '0.75rem', fontWeight: 700 }}>+{lesson.xp} XP</span>
              </div>
            </motion.div>
          ))}
        </div>

        <BottomNav current="aulas" navigate={navigate} reduceMotion={reduceMotion} />
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col" style={{ background: '#F5F3FF' }}>
      {/* Header */}
      <div
        className="px-5 pt-5 pb-5"
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
          <h2 style={{ color: 'white' }}>Aulas</h2>
        </div>
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <Search size={16} color="white" />
          <input
            type="search"
            placeholder="Buscar matéria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, outline: 'none', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <p style={{ color: '#374151', fontWeight: 700, marginBottom: 12 }}>Minhas matérias</p>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((sub, i) => (
            <motion.button
              key={sub.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.06 }}
              onClick={() => navigate(sub.screen)}
              whileHover={reduceMotion ? {} : { scale: 1.03, y: -2 }}
              whileTap={reduceMotion ? {} : { scale: 0.97 }}
              className="rounded-2xl p-4 text-left shadow-sm"
              style={{ background: 'white', border: 'none', cursor: 'pointer' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: sub.bg }}
              >
                <sub.icon size={22} color={sub.color} />
              </div>
              <p style={{ color: '#1E1B4B', fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>{sub.name}</p>
              <p style={{ color: '#9CA3AF', fontSize: '0.75rem', marginBottom: 6 }}>
                {sub.done}/{sub.lessons} aulas
              </p>
              <div className="rounded-full overflow-hidden" style={{ height: 6, background: sub.bg }}>
                <div
                  style={{
                    height: '100%',
                    width: `${(sub.done / sub.lessons) * 100}%`,
                    background: sub.color,
                    borderRadius: 99,
                    transition: 'width 0.7s ease',
                  }}
                />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <BottomNav current="aulas" navigate={navigate} reduceMotion={reduceMotion} />
    </div>
  );
}
