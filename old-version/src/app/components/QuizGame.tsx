import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Zap, ChevronRight, Trophy, Flame, CheckCircle, XCircle } from 'lucide-react';
import { Mascot } from './Mascot';
import type { CommonProps } from '../App';

interface QuizGameProps extends CommonProps {
  addXP: (amount: number) => void;
}

type Question = {
  id: number;
  question: string;
  options: string[];
  correct: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

const QUESTIONS: Question[] = [
  { id: 1, question: 'Qual é a capital do Brasil?', options: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'], correct: 2, category: 'Geografia', difficulty: 'easy' },
  { id: 2, question: 'Quanto é 7 x 8?', options: ['54', '56', '63', '48'], correct: 1, category: 'Matemática', difficulty: 'easy' },
  { id: 3, question: 'Qual planeta é conhecido como planeta vermelho?', options: ['Vênus', 'Marte', 'Júpiter', 'Saturno'], correct: 1, category: 'Ciências', difficulty: 'easy' },
  { id: 4, question: 'Quem escreveu "Dom Casmurro"?', options: ['Machado de Assis', 'José de Alencar', 'Monteiro Lobato', 'Carlos Drummond'], correct: 0, category: 'Português', difficulty: 'medium' },
  { id: 5, question: 'Qual é o maior mamífero do mundo?', options: ['Elefante', 'Girafa', 'Baleia Azul', 'Urso Polar'], correct: 2, category: 'Ciências', difficulty: 'easy' },
  { id: 6, question: 'Quantos lados tem um hexágono?', options: ['5', '6', '7', '8'], correct: 1, category: 'Matemática', difficulty: 'medium' },
  { id: 7, question: 'Qual é o rio mais extenso do mundo?', options: ['Nilo', 'Amazonas', 'Yangtzé', 'Mississippi'], correct: 1, category: 'Geografia', difficulty: 'medium' },
  { id: 8, question: 'Qual é a fórmula química da água?', options: ['H2O', 'CO2', 'O2', 'NaCl'], correct: 0, category: 'Ciências', difficulty: 'easy' },
  { id: 9, question: 'Quem pintou a Mona Lisa?', options: ['Van Gogh', 'Picasso', 'Leonardo da Vinci', 'Michelangelo'], correct: 2, category: 'Arte', difficulty: 'medium' },
  { id: 10, question: 'Em que ano o Brasil foi descoberto?', options: ['1492', '1500', '1508', '1520'], correct: 1, category: 'História', difficulty: 'easy' },
];

const TIME_PER_QUESTION = 15;
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Geografia: { bg: '#FCE7F3', text: '#EC4899' },
  Matemática: { bg: '#EDE9FE', text: '#7C3AED' },
  Ciências: { bg: '#D1FAE5', text: '#10B981' },
  Português: { bg: '#DBEAFE', text: '#3B82F6' },
  Arte: { bg: '#FEF3C7', text: '#F59E0B' },
  História: { bg: '#FFE4E6', text: '#F43F5E' },
};

export function QuizGame({ navigate, user, reduceMotion, addXP }: QuizGameProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [finished, setFinished] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  const question = QUESTIONS[currentQ];
  const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

  useEffect(() => {
    if (finished || showFeedback) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleSelect(null);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQ, finished, showFeedback]);

  const handleSelect = useCallback((idx: number | null) => {
    if (showFeedback) return;

    setSelected(idx);
    setShowFeedback(true);

    const isCorrect = idx === question.correct;

    if (isCorrect) {
      const timeBonus = Math.floor((timeLeft / TIME_PER_QUESTION) * 20);
      const streakBonus = streak * 5;
      const earned = 50 + timeBonus + streakBonus;

      setScore((s) => s + earned);
      setCorrectAnswers((c) => c + 1);
      setStreak((s) => {
        const newStreak = s + 1;
        setMaxStreak((max) => Math.max(max, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
    }
  }, [showFeedback, question.correct, timeLeft, streak]);

  const handleNext = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setShowFeedback(false);
      setTimeLeft(TIME_PER_QUESTION);
    } else {
      addXP(score);
      setFinished(true);
    }
  };

  const categoryColor = CATEGORY_COLORS[question.category] || { bg: '#F3F4F6', text: '#6B7280' };
  const stars = correctAnswers >= 9 ? 3 : correctAnswers >= 7 ? 2 : correctAnswers >= 5 ? 1 : 0;

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="size-full flex flex-col items-center justify-center p-6"
        style={{ background: 'linear-gradient(160deg, #FEF3C7, #F5F3FF)' }}
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
            {stars === 3 ? '🎉 Incrível!' : stars === 2 ? '👏 Muito bem!' : stars === 1 ? '💪 Bom trabalho!' : '📚 Continue praticando!'}
          </h2>
          <p style={{ color: '#6B7280', marginBottom: 24 }}>
            {stars === 3 ? 'Você é um gênio!' : stars === 2 ? 'Ótimo desempenho!' : stars === 1 ? 'Você está progredindo!' : 'Não desista!'}
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

          <div className="rounded-2xl p-5 mb-6 shadow-sm" style={{ background: 'white' }}>
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
                  {correctAnswers}/{QUESTIONS.length}
                </p>
                <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>Acertos</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Flame size={16} color="#EF4444" />
                  <span style={{ color: '#1E1B4B', fontWeight: 800, fontSize: '1.2rem' }}>{maxStreak}</span>
                </div>
                <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>Streak</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={() => navigate('games')}
              whileHover={reduceMotion ? {} : { scale: 1.02 }}
              whileTap={reduceMotion ? {} : { scale: 0.97 }}
              className="flex-1 rounded-xl py-3"
              style={{ background: '#FEF3C7', color: '#F59E0B', border: 'none', cursor: 'pointer', fontWeight: 700 }}
            >
              Outros jogos
            </motion.button>
            <motion.button
              onClick={() => window.location.reload()}
              whileHover={reduceMotion ? {} : { scale: 1.02 }}
              whileTap={reduceMotion ? {} : { scale: 0.97 }}
              className="flex-1 rounded-xl py-3 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}
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
    if (idx === question.correct) return { bg: '#ECFDF5', border: '#6EE7B7', color: '#065F46' };
    if (idx === selected && idx !== question.correct) return { bg: '#FEF2F2', border: '#FECACA', color: '#991B1B' };
    return { bg: '#F9FAFB', border: '#E5E7EB', color: '#9CA3AF' };
  };

  return (
    <div className="size-full flex flex-col" style={{ background: '#F5F3FF' }}>
      <div
        className="px-5 pt-4 pb-4"
        style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}
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
            <h3 style={{ color: 'white' }}>⚡ Quiz Veloz</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>
              Pergunta {currentQ + 1}/{QUESTIONS.length}
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-full px-3 py-1" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <Zap size={14} color="#FCD34D" fill="#FCD34D" />
            <span style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>{score}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {streak > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 rounded-full px-2 py-0.5"
                style={{ background: 'rgba(255,255,255,0.3)' }}
              >
                <Flame size={14} color="#FCD34D" />
                <span style={{ color: 'white', fontWeight: 700, fontSize: '0.75rem' }}>{streak}x</span>
              </motion.div>
            )}
            <span
              className="rounded-full px-2 py-0.5"
              style={{ background: categoryColor.bg, color: categoryColor.text, fontSize: '0.7rem', fontWeight: 700 }}
            >
              {question.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: timeLeft <= 5 ? '#FEE2E2' : 'rgba(255,255,255,0.3)',
                border: `3px solid ${timeLeft <= 5 ? '#EF4444' : 'rgba(255,255,255,0.5)'}`,
              }}
            >
              <span
                style={{
                  color: timeLeft <= 5 ? '#EF4444' : 'white',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                }}
              >
                {timeLeft}
              </span>
            </div>
          </div>
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
                <Mascot mood="thinking" size={48} reduceMotion={reduceMotion} />
                <div className="flex-1">
                  <h3 style={{ color: '#1E1B4B', lineHeight: 1.3 }}>{question.question}</h3>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {question.options.map((opt, idx) => {
                const colors = optionColors(idx);
                const isCorrect = showFeedback && idx === question.correct;
                const isWrong = showFeedback && idx === selected && idx !== question.correct;

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
                    background: selected === question.correct ? '#ECFDF5' : '#FEF2F2',
                    border: `2px solid ${selected === question.correct ? '#6EE7B7' : '#FECACA'}`,
                  }}
                >
                  <p style={{ fontWeight: 700, color: selected === question.correct ? '#065F46' : '#991B1B', fontSize: '0.9rem' }}>
                    {selected === question.correct ? '🎉 Correto! Ótimo trabalho!' : selected === null ? '⏰ Tempo esgotado!' : '❌ Ops! Tente novamente!'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {showFeedback && (
        <div className="px-5 pb-6 pt-3" style={{ background: 'white', borderTop: '1px solid #F3F4F6' }}>
          <motion.button
            onClick={handleNext}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={reduceMotion ? {} : { scale: 1.02 }}
            whileTap={reduceMotion ? {} : { scale: 0.97 }}
            className="w-full rounded-xl py-3 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}
          >
            {currentQ < QUESTIONS.length - 1 ? 'Próxima pergunta' : '🏆 Ver resultado'}
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
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#FEF3C7' }}>
                  <Trophy size={28} color="#F59E0B" />
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
