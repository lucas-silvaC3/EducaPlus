import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Zap, ChevronRight, Trophy, Globe, CheckCircle, XCircle, Map } from 'lucide-react';
import { Mascot } from './Mascot';
import type { CommonProps } from '../App';

interface GeoGameProps extends CommonProps {
  addXP: (amount: number) => void;
}

type Challenge = {
  id: number;
  type: 'flag' | 'capital' | 'location' | 'fact';
  question: string;
  options: string[];
  correct: number;
  flag?: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    type: 'capital',
    question: 'Qual é a capital da França?',
    options: ['Londres', 'Paris', 'Roma', 'Berlim'],
    correct: 1,
    flag: '🇫🇷',
    explanation: 'Paris é a capital da França, conhecida pela Torre Eiffel!',
    difficulty: 'easy',
  },
  {
    id: 2,
    type: 'flag',
    question: 'Qual país tem esta bandeira? 🇧🇷',
    options: ['Argentina', 'Brasil', 'Colômbia', 'México'],
    correct: 1,
    explanation: 'A bandeira verde e amarela é do Brasil!',
    difficulty: 'easy',
  },
  {
    id: 3,
    type: 'location',
    question: 'Em que continente fica o Egito?',
    options: ['Ásia', 'Europa', 'África', 'América'],
    correct: 2,
    flag: '🇪🇬',
    explanation: 'O Egito fica no continente africano!',
    difficulty: 'easy',
  },
  {
    id: 4,
    type: 'capital',
    question: 'Qual é a capital do Japão?',
    options: ['Pequim', 'Seul', 'Tóquio', 'Bangkok'],
    correct: 2,
    flag: '🇯🇵',
    explanation: 'Tóquio é a capital do Japão, uma das maiores cidades do mundo!',
    difficulty: 'medium',
  },
  {
    id: 5,
    type: 'fact',
    question: 'Qual é o maior país do mundo em área?',
    options: ['Canadá', 'China', 'Rússia', 'Estados Unidos'],
    correct: 2,
    flag: '🇷🇺',
    explanation: 'A Rússia é o maior país do mundo em extensão territorial!',
    difficulty: 'medium',
  },
  {
    id: 6,
    type: 'location',
    question: 'Onde fica a Muralha da China?',
    options: ['Japão', 'Índia', 'China', 'Coreia'],
    correct: 2,
    flag: '🇨🇳',
    explanation: 'A Grande Muralha da China fica na China e tem mais de 20 mil km!',
    difficulty: 'easy',
  },
  {
    id: 7,
    type: 'capital',
    question: 'Qual é a capital da Austrália?',
    options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'],
    correct: 2,
    flag: '🇦🇺',
    explanation: 'Canberra é a capital da Austrália, embora Sydney seja mais famosa!',
    difficulty: 'hard',
  },
  {
    id: 8,
    type: 'fact',
    question: 'Qual oceano banha o Brasil?',
    options: ['Pacífico', 'Atlântico', 'Índico', 'Ártico'],
    correct: 1,
    explanation: 'O Oceano Atlântico banha toda a costa brasileira!',
    difficulty: 'easy',
  },
];

export function GeoGame({ navigate, user, reduceMotion, addXP }: GeoGameProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [finished, setFinished] = useState(false);
  const [medals, setMedals] = useState<Array<'gold' | 'silver' | 'bronze'>>([]);
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  const challenge = CHALLENGES[currentQ];
  const progress = ((currentQ + 1) / CHALLENGES.length) * 100;

  const handleSelect = (idx: number) => {
    if (showFeedback) return;

    setSelected(idx);
    setShowFeedback(true);

    const isCorrect = idx === challenge.correct;

    if (isCorrect) {
      const difficultyBonus = challenge.difficulty === 'hard' ? 50 : challenge.difficulty === 'medium' ? 30 : 20;
      const earned = 50 + difficultyBonus;

      setScore((s) => s + earned);
      setCorrectAnswers((c) => c + 1);
      setMedals([...medals, wrongAttempts === 0 ? 'gold' : wrongAttempts === 1 ? 'silver' : 'bronze']);
    } else {
      setWrongAttempts((w) => w + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < CHALLENGES.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setShowFeedback(false);
      setWrongAttempts(0);
    } else {
      addXP(score);
      setFinished(true);
    }
  };

  const stars = correctAnswers >= 7 ? 3 : correctAnswers >= 5 ? 2 : correctAnswers >= 3 ? 1 : 0;
  const goldMedals = medals.filter((m) => m === 'gold').length;

  const MEDAL_EMOJI: Record<'gold' | 'silver' | 'bronze', string> = {
    gold: '🥇',
    silver: '🥈',
    bronze: '🥉',
  };

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="size-full flex flex-col items-center justify-center p-6"
        style={{ background: 'linear-gradient(160deg, #FCE7F3, #F5F3FF)' }}
      >
        <motion.div
          animate={reduceMotion ? {} : { y: [0, -12, 0], transition: { duration: 2, repeat: Infinity } }}
        >
          <Mascot mood="celebrating" size={100} reduceMotion={reduceMotion} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-4 w-full max-w-sm"
        >
          <h2 style={{ color: '#1E1B4B', marginBottom: 4 }}>
            {stars === 3 ? '🎉 Explorador incrível!' : stars === 2 ? '👏 Muito bem!' : stars === 1 ? '💪 Continue explorando!' : '🌍 Pratique mais!'}
          </h2>
          <p style={{ color: '#6B7280', marginBottom: 24 }}>
            {stars === 3 ? 'Você é um mestre da geografia!' : stars === 2 ? 'Ótimo conhecimento!' : stars === 1 ? 'Você está aprendendo!' : 'Continue estudando!'}
          </p>

          <div className="flex justify-center gap-4 mb-6">
            {[1, 2, 3].map((s) => (
              <motion.div
                key={s}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: s <= stars ? 1 : 0.6, rotate: 0 }}
                transition={{ delay: s * 0.2, type: 'spring' }}
              >
                <Star size={48} color="#FCD34D" fill={s <= stars ? '#FCD34D' : 'none'} />
              </motion.div>
            ))}
          </div>

          <div className="rounded-2xl p-5 mb-4 shadow-sm" style={{ background: 'white' }}>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Zap size={16} color="#F59E0B" />
                  <span style={{ color: '#1E1B4B', fontWeight: 800, fontSize: '1.2rem' }}>{score}</span>
                </div>
                <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>Pontos</p>
              </div>
              <div className="text-center">
                <p style={{ color: '#1E1B4B', fontWeight: 800, fontSize: '1.2rem' }}>
                  {correctAnswers}/{CHALLENGES.length}
                </p>
                <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>Acertos</p>
              </div>
              <div className="text-center">
                <p style={{ color: '#1E1B4B', fontWeight: 800, fontSize: '1.2rem' }}>{goldMedals}</p>
                <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>Medalhas 🥇</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 mb-6" style={{ background: '#FCE7F3' }}>
            <p style={{ color: '#831843', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>Medalhas conquistadas:</p>
            <div className="flex justify-center gap-2">
              {medals.map((medal, idx) => (
                <motion.span
                  key={idx}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  style={{ fontSize: '1.8rem' }}
                >
                  {MEDAL_EMOJI[medal]}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={() => navigate('games')}
              whileHover={reduceMotion ? {} : { scale: 1.02 }}
              whileTap={reduceMotion ? {} : { scale: 0.97 }}
              className="flex-1 rounded-xl py-3"
              style={{ background: '#FCE7F3', color: '#EC4899', border: 'none', cursor: 'pointer', fontWeight: 700 }}
            >
              Outros jogos
            </motion.button>
            <motion.button
              onClick={() => window.location.reload()}
              whileHover={reduceMotion ? {} : { scale: 1.02 }}
              whileTap={reduceMotion ? {} : { scale: 0.97 }}
              className="flex-1 rounded-xl py-3 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #EC4899, #EF4444)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}
            >
              Jogar novamente <ChevronRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const optionColors = (idx: number) => {
    if (!showFeedback) return { bg: '#F9FAFB', border: '#E5E7EB', color: '#1E1B4B' };
    if (idx === challenge.correct) return { bg: '#ECFDF5', border: '#6EE7B7', color: '#065F46' };
    if (idx === selected && idx !== challenge.correct) return { bg: '#FEF2F2', border: '#FECACA', color: '#991B1B' };
    return { bg: '#F9FAFB', border: '#E5E7EB', color: '#9CA3AF' };
  };

  const TYPE_ICONS: Record<Challenge['type'], React.ReactNode> = {
    flag: <span style={{ fontSize: '1.5rem' }}>🏳️</span>,
    capital: <span style={{ fontSize: '1.5rem' }}>🏛️</span>,
    location: <Map size={24} color="#EC4899" />,
    fact: <Globe size={24} color="#EC4899" />,
  };

  const TYPE_LABELS: Record<Challenge['type'], string> = {
    flag: 'Bandeira',
    capital: 'Capital',
    location: 'Localização',
    fact: 'Curiosidade',
  };

  return (
    <div className="size-full flex flex-col" style={{ background: '#F5F3FF' }}>
      <div
        className="px-5 pt-4 pb-4"
        style={{ background: 'linear-gradient(135deg, #EC4899, #EF4444)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setShowConfirmExit(true)}
            style={{ color: 'white', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            aria-label="Sair do jogo"
          >
            <X size={18} />
          </button>

          <div className="flex-1 text-center">
            <h3 style={{ color: 'white' }}>🌍 GeoDesafio</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>
              Desafio {currentQ + 1}/{CHALLENGES.length}
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-full px-3 py-1" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <Zap size={14} color="#FCD34D" fill="#FCD34D" />
            <span style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>{score}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span
            className="rounded-full px-3 py-1 flex items-center gap-1.5"
            style={{ background: 'rgba(255,255,255,0.3)', color: 'white', fontSize: '0.75rem', fontWeight: 700 }}
          >
            {TYPE_ICONS[challenge.type]}
            {TYPE_LABELS[challenge.type]}
          </span>

          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.78rem', fontWeight: 700 }}>
            {correctAnswers} acertos
          </span>
        </div>

        <div className="rounded-full overflow-hidden" style={{ height: 8, background: 'rgba(255,255,255,0.2)' }}>
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: reduceMotion ? 0.05 : 0.5 }}
            style={{ height: '100%', background: 'linear-gradient(90deg, #FCD34D, #10B981)', borderRadius: 99 }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: reduceMotion ? 0 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduceMotion ? 0 : -40 }}
            transition={{ duration: 0.25 }}
          >
            <div className="rounded-2xl p-5 mb-4 shadow-sm" style={{ background: 'white' }}>
              <div className="flex items-start gap-3">
                <Mascot mood="reading" size={48} reduceMotion={reduceMotion} />
                <div className="flex-1">
                  {challenge.flag && (
                    <p style={{ fontSize: '2rem', marginBottom: 8, textAlign: 'center' }}>{challenge.flag}</p>
                  )}
                  <h3 style={{ color: '#1E1B4B', lineHeight: 1.3 }}>{challenge.question}</h3>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {challenge.options.map((opt, idx) => {
                const colors = optionColors(idx);
                const isCorrect = showFeedback && idx === challenge.correct;
                const isWrong = showFeedback && idx === selected && idx !== challenge.correct;

                return (
                  <motion.button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={showFeedback}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    whileHover={!showFeedback && !reduceMotion ? { scale: 1.02, x: 4 } : {}}
                    whileTap={!showFeedback && !reduceMotion ? { scale: 0.97 } : {}}
                    className="w-full rounded-xl p-4 flex items-center gap-3 text-left"
                    style={{
                      background: colors.bg,
                      border: `2px solid ${colors.border}`,
                      color: colors.color,
                      cursor: showFeedback ? 'default' : 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                    }}
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: isCorrect ? '#10B981' : isWrong ? '#EF4444' : '#E5E7EB',
                        color: isCorrect || isWrong ? 'white' : '#6B7280',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                      }}
                    >
                      {isCorrect ? <CheckCircle size={16} /> : isWrong ? <XCircle size={16} /> : String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 16, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-2xl p-4 mb-4 shadow-sm"
                  style={{
                    background: selected === challenge.correct ? '#ECFDF5' : '#FEF2F2',
                    border: `2px solid ${selected === challenge.correct ? '#6EE7B7' : '#FECACA'}`,
                  }}
                >
                  <div className="flex items-start gap-2">
                    {selected === challenge.correct ? (
                      <CheckCircle size={20} color="#10B981" className="mt-0.5 shrink-0" />
                    ) : (
                      <XCircle size={20} color="#EF4444" className="mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p style={{ fontWeight: 700, color: selected === challenge.correct ? '#065F46' : '#991B1B', fontSize: '0.9rem' }}>
                        {selected === challenge.correct
                          ? wrongAttempts === 0
                            ? '🥇 Perfeito! Medalha de ouro!'
                            : wrongAttempts === 1
                            ? '🥈 Muito bem! Medalha de prata!'
                            : '🥉 Correto! Medalha de bronze!'
                          : '❌ Ops! Tente novamente!'}
                      </p>
                      <p style={{ color: selected === challenge.correct ? '#047857' : '#7F1D1D', fontSize: '0.82rem', marginTop: 2 }}>
                        {challenge.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {showFeedback && selected === challenge.correct && (
        <div className="px-5 pb-6 pt-3" style={{ background: 'white', borderTop: '1px solid #F3F4F6' }}>
          <motion.button
            onClick={handleNext}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={reduceMotion ? {} : { scale: 1.02 }}
            whileTap={reduceMotion ? {} : { scale: 0.97 }}
            className="w-full rounded-xl py-3 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #EC4899, #EF4444)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}
          >
            {currentQ < CHALLENGES.length - 1 ? 'Próximo desafio' : '🏆 Ver resultado'}
            <ChevronRight size={18} />
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {showConfirmExit && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50"
              style={{ background: 'rgba(0,0,0,0.45)' }}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="absolute z-50 rounded-2xl p-6 shadow-2xl"
              style={{ background: 'white', width: 'min(90vw, 340px)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            >
              <div className="text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#FCE7F3' }}>
                  <Trophy size={28} color="#EC4899" />
                </div>
                <h3 style={{ color: '#1E1B4B', marginBottom: 8 }}>Sair do jogo?</h3>
                <p style={{ color: '#6B7280', fontSize: '0.88rem', marginBottom: 20 }}>
                  Você perderá o progresso desta partida.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmExit(false)}
                    className="flex-1 rounded-xl py-2.5"
                    style={{ background: '#F3F4F6', color: '#374151', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                  >
                    Continuar
                  </button>
                  <button
                    onClick={() => navigate('games')}
                    className="flex-1 rounded-xl py-2.5"
                    style={{ background: '#EF4444', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                  >
                    Sair
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
