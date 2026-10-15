import { motion } from 'motion/react';
import { ChevronLeft, Star, Play, BookOpen, FileText, CheckCircle, Clock } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { Mascot } from './Mascot';
import type { CommonProps } from '../App';

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  xp: number;
  type: 'video' | 'exercise' | 'reading';
}

interface SubjectConfig {
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  bannerGradient: string;
  lessons: Lesson[];
  progress: number;
}

interface SubjectScreenProps extends CommonProps {
  config: SubjectConfig;
}

export function SubjectScreen({ navigate, user, reduceMotion, config }: SubjectScreenProps) {
  const completedLessons = config.lessons.filter((l) => l.completed).length;

  return (
    <div className="size-full flex flex-col" style={{ background: '#F5F3FF' }}>
      <div
        className="px-5 pt-5 pb-16"
        style={{ background: config.bannerGradient, borderRadius: '0 0 32px 32px', position: 'relative' }}
      >
        <button
          onClick={() => navigate('aulas')}
          style={{
            color: 'white',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginBottom: 16,
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <span style={{ fontSize: '3rem' }}>{config.emoji}</span>
          <div>
            <h2 style={{ color: 'white', marginBottom: 4 }}>{config.name}</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
              {completedLessons}/{config.lessons.length} aulas concluídas
            </p>
          </div>
        </div>

        <div className="rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.3)', height: 8 }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${config.progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ background: 'white', height: '100%', borderRadius: 999 }}
          />
        </div>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.78rem', fontWeight: 700 }}>
          {config.progress}% concluído
        </p>

        <div className="absolute bottom-4 right-4">
          <Mascot mood="happy" size={80} reduceMotion={reduceMotion} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex justify-between items-center mb-4">
          <h3 style={{ color: '#1E1B4B' }}>Aulas disponíveis</h3>
        </div>

        <div className="space-y-3 pb-20">
          {config.lessons.map((lesson, idx) => (
            <motion.button
              key={lesson.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              whileHover={reduceMotion ? {} : { scale: 1.02, x: 4 }}
              whileTap={reduceMotion ? {} : { scale: 0.98 }}
              className="w-full rounded-2xl p-4 text-left shadow-sm"
              style={{
                background: 'white',
                border: lesson.completed ? `2px solid ${config.color}` : '2px solid #E5E7EB',
                cursor: 'pointer',
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: lesson.completed ? config.bgColor : '#F3F4F6',
                  }}
                >
                  {lesson.type === 'video' ? (
                    <Play size={20} color={lesson.completed ? config.color : '#9CA3AF'} />
                  ) : lesson.type === 'exercise' ? (
                    <FileText size={20} color={lesson.completed ? config.color : '#9CA3AF'} />
                  ) : (
                    <BookOpen size={20} color={lesson.completed ? config.color : '#9CA3AF'} />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4 style={{ color: '#1E1B4B', fontWeight: 700, fontSize: '0.95rem' }}>
                      {lesson.title}
                    </h4>
                    {lesson.completed && (
                      <CheckCircle size={20} color={config.color} fill={config.bgColor} />
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock size={14} color="#9CA3AF" />
                      <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>{lesson.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={14} color="#F59E0B" fill="#F59E0B" />
                      <span style={{ color: '#6B7280', fontSize: '0.8rem', fontWeight: 700 }}>
                        +{lesson.xp} XP
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <BottomNav current="aulas" navigate={navigate} reduceMotion={reduceMotion} />
    </div>
  );
}

// Configurações pré-definidas para cada matéria
export const SUBJECTS_CONFIG = {
  ciencias: {
    name: 'Ciências',
    emoji: '🔬',
    color: '#10B981',
    bgColor: '#D1FAE5',
    bannerGradient: 'linear-gradient(135deg, #10B981, #059669)',
    progress: 45,
    lessons: [
      { id: 1, title: 'Sistema Solar', duration: '15 min', completed: true, xp: 50, type: 'video' as const },
      { id: 2, title: 'Fotossíntese', duration: '20 min', completed: true, xp: 60, type: 'video' as const },
      { id: 3, title: 'Exercícios: Ciclo da Água', duration: '10 min', completed: false, xp: 40, type: 'exercise' as const },
      { id: 4, title: 'Cadeia Alimentar', duration: '18 min', completed: false, xp: 55, type: 'reading' as const },
    ],
  },
  portugues: {
    name: 'Português',
    emoji: '📚',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    bannerGradient: 'linear-gradient(135deg, #3B82F6, #2563EB)',
    progress: 60,
    lessons: [
      { id: 1, title: 'Verbos: Presente e Passado', duration: '25 min', completed: true, xp: 70, type: 'video' as const },
      { id: 2, title: 'Interpretação de Texto', duration: '30 min', completed: true, xp: 80, type: 'reading' as const },
      { id: 3, title: 'Exercícios de Ortografia', duration: '15 min', completed: true, xp: 50, type: 'exercise' as const },
      { id: 4, title: 'Substantivos e Adjetivos', duration: '20 min', completed: false, xp: 60, type: 'video' as const },
    ],
  },
  geografia: {
    name: 'Geografia',
    emoji: '🌍',
    color: '#EC4899',
    bgColor: '#FCE7F3',
    bannerGradient: 'linear-gradient(135deg, #EC4899, #DB2777)',
    progress: 35,
    lessons: [
      { id: 1, title: 'Continentes e Oceanos', duration: '22 min', completed: true, xp: 65, type: 'video' as const },
      { id: 2, title: 'Relevo Brasileiro', duration: '18 min', completed: false, xp: 55, type: 'reading' as const },
      { id: 3, title: 'Exercícios: Capitais do Brasil', duration: '12 min', completed: false, xp: 45, type: 'exercise' as const },
    ],
  },
  artes: {
    name: 'Artes',
    emoji: '🎨',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    bannerGradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
    progress: 50,
    lessons: [
      { id: 1, title: 'Cores Primárias e Secundárias', duration: '16 min', completed: true, xp: 50, type: 'video' as const },
      { id: 2, title: 'Desenho: Perspectiva Básica', duration: '25 min', completed: true, xp: 70, type: 'exercise' as const },
      { id: 3, title: 'História da Arte Moderna', duration: '20 min', completed: false, xp: 60, type: 'reading' as const },
    ],
  },
  educacaoFisica: {
    name: 'Educação Física',
    emoji: '⚽',
    color: '#EF4444',
    bgColor: '#FEE2E2',
    bannerGradient: 'linear-gradient(135deg, #EF4444, #DC2626)',
    progress: 40,
    lessons: [
      { id: 1, title: 'Alongamento e Aquecimento', duration: '12 min', completed: true, xp: 40, type: 'video' as const },
      { id: 2, title: 'Esportes Coletivos', duration: '18 min', completed: false, xp: 55, type: 'video' as const },
      { id: 3, title: 'Exercícios de Coordenação', duration: '15 min', completed: false, xp: 50, type: 'exercise' as const },
    ],
  },
};
