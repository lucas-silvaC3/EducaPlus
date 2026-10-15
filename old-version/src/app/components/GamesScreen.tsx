import { motion } from 'motion/react';
import { ChevronLeft, Star, Zap, Play } from 'lucide-react';
import { BottomNav } from './BottomNav';
import type { CommonProps, Screen } from '../App';

const GAME_CATEGORIES = [
  { id: 'math', label: 'Matemática', color: '#7C3AED', bg: '#EDE9FE' },
  { id: 'all', label: 'Todos', color: '#4F46E5', bg: '#E0E7FF' },
  { id: 'lang', label: 'Português', color: '#3B82F6', bg: '#DBEAFE' },
  { id: 'science', label: 'Ciências', color: '#10B981', bg: '#D1FAE5' },
];

const GAMES: Array<{
  id: string;
  title: string;
  subject: string;
  difficulty: string;
  xp: number;
  stars: number;
  totalStars: number;
  players: string;
  color: string;
  bg: string;
  emoji: string;
  description: string;
  screen: Screen;
}> = [
  {
    id: 'fractions',
    title: 'Frações Mágicas',
    subject: 'Matemática',
    difficulty: 'Médio',
    xp: 120,
    stars: 3,
    totalStars: 3,
    players: '2.4k',
    color: '#7C3AED',
    bg: '#EDE9FE',
    emoji: '🔢',
    description: 'Aprenda frações equivalentes de forma divertida!',
    screen: 'gameplay' as Screen,
  },
  {
    id: 'words',
    title: 'Caça-Palavras',
    subject: 'Português',
    difficulty: 'Fácil',
    xp: 80,
    stars: 2,
    totalStars: 3,
    players: '1.8k',
    color: '#3B82F6',
    bg: '#DBEAFE',
    emoji: '📝',
    description: 'Encontre palavras escondidas e amplie seu vocabulário!',
    screen: 'wordsearch' as Screen,
  },
  {
    id: 'memory',
    title: 'Jogo da Memória',
    subject: 'Ciências',
    difficulty: 'Fácil',
    xp: 60,
    stars: 3,
    totalStars: 3,
    players: '3.2k',
    color: '#10B981',
    bg: '#D1FAE5',
    emoji: '🧠',
    description: 'Associe conceitos científicos e treina a memória!',
    screen: 'memory' as Screen,
  },
  {
    id: 'quiz',
    title: 'Quiz Veloz',
    subject: 'Geral',
    difficulty: 'Difícil',
    xp: 200,
    stars: 1,
    totalStars: 3,
    players: '980',
    color: '#F59E0B',
    bg: '#FEF3C7',
    emoji: '⚡',
    description: 'Responda perguntas contra o tempo!',
    screen: 'quiz' as Screen,
  },
  {
    id: 'planet',
    title: 'Aventura dos Planetas',
    subject: 'Ciências',
    difficulty: 'Médio',
    xp: 150,
    stars: 0,
    totalStars: 3,
    players: '1.1k',
    color: '#6366F1',
    bg: '#E0E7FF',
    emoji: '🚀',
    description: 'Explore o sistema solar respondendo perguntas!',
    screen: 'planet' as Screen,
  },
  {
    id: 'geo',
    title: 'GeoDesafio',
    subject: 'Geografia',
    difficulty: 'Médio',
    xp: 110,
    stars: 2,
    totalStars: 3,
    players: '760',
    color: '#EC4899',
    bg: '#FCE7F3',
    emoji: '🌍',
    description: 'Descubra países, capitais e curiosidades geográficas!',
    screen: 'geo' as Screen,
  },
  {
    id: 'platformer',
    title: 'Aventura Educativa',
    subject: 'Geral',
    difficulty: 'Médio',
    xp: 180,
    stars: 0,
    totalStars: 3,
    players: '1.5k',
    color: '#F59E0B',
    bg: '#FEF3C7',
    emoji: '👦',
    description: 'Jogo de plataforma com perguntas educativas!',
    screen: 'platformer' as Screen,
  },
];

const DIFFICULTY_COLOR: Record<string, string> = {
  Fácil: '#10B981',
  Médio: '#F59E0B',
  Difícil: '#EF4444',
};

export function GamesScreen({ navigate, reduceMotion }: CommonProps) {
  return (
    <div className="size-full flex flex-col" style={{ background: '#F5F3FF' }}>
      {/* Header */}
      <div
        className="px-5 pt-5 pb-5"
        style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', borderRadius: '0 0 24px 24px' }}
      >
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate('dashboard')}
            style={{ color: 'white', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            aria-label="Voltar"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 style={{ color: 'white' }}>Jogos Educativos 🎮</h2>
            <p style={{ color: '#C4B5FD', fontSize: '0.8rem' }}>Aprenda jogando!</p>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {GAME_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className="rounded-full px-4 py-1.5 shrink-0 transition-all"
              style={{
                background: cat.id === 'math' ? 'white' : 'rgba(255,255,255,0.2)',
                color: cat.id === 'math' ? '#7C3AED' : 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured game */}
      <div className="px-5 py-4">
        <motion.div
          onClick={() => navigate(GAMES[0].screen)}
          whileHover={reduceMotion ? {} : { scale: 1.02 }}
          whileTap={reduceMotion ? {} : { scale: 0.98 }}
          className="rounded-3xl overflow-hidden shadow-lg cursor-pointer relative"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', minHeight: 160 }}
          role="button"
          tabIndex={0}
          aria-label="Jogar Frações Mágicas - Jogo em destaque"
        >
          {/* Game platform decoration */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating platforms */}
            <div style={{ position: 'absolute', bottom: 40, left: 20, width: 60, height: 14, borderRadius: 8, background: '#6EE7B7', opacity: 0.8 }} />
            <div style={{ position: 'absolute', bottom: 60, left: 100, width: 80, height: 14, borderRadius: 8, background: '#FCD34D', opacity: 0.8 }} />
            <div style={{ position: 'absolute', bottom: 80, right: 60, width: 50, height: 14, borderRadius: 8, background: '#F472B6', opacity: 0.8 }} />
            {/* Coins */}
            {[1, 2, 3].map((c) => (
              <motion.div
                key={c}
                style={{ position: 'absolute', bottom: 78 + c * 10, left: 60 + c * 25, width: 16, height: 16, borderRadius: '50%', background: '#FCD34D', border: '2px solid #D97706' }}
                animate={reduceMotion ? {} : { y: [0, -6, 0], transition: { duration: 1.2, delay: c * 0.3, repeat: Infinity } }}
              />
            ))}
          </div>

          <div className="relative p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ background: 'rgba(255,255,255,0.25)', color: 'white', fontSize: '0.72rem', fontWeight: 700, borderRadius: 99, padding: '2px 8px' }}>
                    EM DESTAQUE
                  </span>
                  <span style={{ background: '#FEF3C7', color: '#D97706', fontSize: '0.72rem', fontWeight: 700, borderRadius: 99, padding: '2px 8px' }}>
                    +120 XP
                  </span>
                </div>
                <h3 style={{ color: 'white', marginBottom: 2 }}>🔢 Frações Mágicas</h3>
                <p style={{ color: '#C4B5FD', fontSize: '0.82rem' }}>Matemática • Médio</p>
              </div>

              <motion.div
                whileHover={reduceMotion ? {} : { scale: 1.1 }}
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                style={{ background: 'white' }}
              >
                <Play size={20} color="#7C3AED" fill="#7C3AED" />
              </motion.div>
            </div>

            <div className="flex items-center gap-3">
              {[1, 2, 3].map((s) => (
                <Star key={s} size={16} color="#FCD34D" fill={s <= 3 ? '#FCD34D' : 'none'} />
              ))}
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>2.4k jogadores</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Games grid */}
      <div className="flex-1 overflow-y-auto px-5">
        <p style={{ color: '#374151', fontWeight: 700, marginBottom: 12 }}>Todos os jogos</p>
        <div className="grid grid-cols-2 gap-3 pb-4">
          {GAMES.slice(1).map((game, i) => (
            <motion.button
              key={game.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.06 }}
              onClick={() => navigate(game.screen)}
              whileHover={reduceMotion ? {} : { scale: 1.03, y: -2 }}
              whileTap={reduceMotion ? {} : { scale: 0.97 }}
              className="rounded-2xl p-4 text-left shadow-sm"
              style={{ background: 'white', border: 'none', cursor: 'pointer' }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: game.bg, fontSize: '1.8rem' }}
              >
                {game.emoji}
              </div>
              <p style={{ color: '#1E1B4B', fontWeight: 700, fontSize: '0.85rem', marginBottom: 2 }}>{game.title}</p>
              <p style={{ color: '#9CA3AF', fontSize: '0.72rem', marginBottom: 6 }}>{game.subject}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map((s) => (
                    <Star key={s} size={12} color="#FCD34D" fill={s <= game.stars ? '#FCD34D' : 'none'} />
                  ))}
                </div>
                <div className="flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background: '#FEF3C7' }}>
                  <Zap size={10} color="#D97706" fill="#D97706" />
                  <span style={{ color: '#D97706', fontSize: '0.7rem', fontWeight: 700 }}>+{game.xp}</span>
                </div>
              </div>

              <div className="mt-2">
                <span
                  className="rounded-full px-2 py-0.5"
                  style={{ background: `${DIFFICULTY_COLOR[game.difficulty]}20`, color: DIFFICULTY_COLOR[game.difficulty], fontSize: '0.68rem', fontWeight: 700 }}
                >
                  {game.difficulty}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <BottomNav current="games" navigate={navigate} reduceMotion={reduceMotion} />
    </div>
  );
}
