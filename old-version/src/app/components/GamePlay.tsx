import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, HelpCircle, ChevronRight, Zap, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { Mascot } from './Mascot';
import type { CommonProps } from '../App';

interface GamePlayProps extends CommonProps {
  addXP: (amount: number) => void;
}

const QUESTIONS = [
  {
    id: 1,
    question: 'Qual fração é equivalente a 1/2?',
    options: ['2/4', '1/3', '3/5', '2/6'],
    correct: 0,
    explanation: '2/4 = 1/2 porque dividimos numerador e denominador por 2.',
    visual: { numerator: 1, denominator: 2 },
  },
  {
    id: 2,
    question: 'Quanto é 3/4 de 100?',
    options: ['25', '50', '75', '80'],
    correct: 2,
    explanation: '3/4 × 100 = 75. Dividimos 100 por 4 (= 25) e multiplicamos por 3.',
    visual: null,
  },
  {
    id: 3,
    question: 'Qual fração representa a parte pintada?',
    options: ['1/3', '2/3', '1/4', '2/4'],
    correct: 1,
    explanation: '2 partes de 3 estão pintadas, logo a fração é 2/3.',
    visual: { numerator: 2, denominator: 3 },
  },
  {
    id: 4,
    question: 'Simplifique: 6/8',
    options: ['1/2', '3/4', '2/3', '4/6'],
    correct: 1,
    explanation: 'Dividindo numerador e denominador por 2: 6÷2=3 e 8÷2=4, logo 3/4.',
    visual: null,
  },
  {
    id: 5,
    question: 'Qual é maior: 2/3 ou 3/4?',
    options: ['2/3', '3/4', 'São iguais', 'Impossível comparar'],
    correct: 1,
    explanation: 'Convertendo para denominador comum (12): 2/3=8/12 e 3/4=9/12. Portanto 3/4 é maior.',
    visual: null,
  },
];

const HINTS: Record<number, string> = {
  1: 'Multiplique o numerador e o denominador pelo mesmo número!',
  2: 'Divida o total pelo denominador, depois multiplique pelo numerador.',
  3: 'Conte as partes pintadas (numerador) e o total de partes (denominador).',
  4: 'Encontre o maior número que divide tanto 6 quanto 8.',
  5: 'Use o mesmo denominador para comparar!',
};

function FractionVisual({ numerator, denominator }: { numerator: number; denominator: number }) {
  return (
    <div className="flex items-center justify-center gap-1 my-2">
      {Array.from({ length: denominator }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1 }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: i < numerator ? '#7C3AED' : '#EDE9FE',
            border: `2px solid ${i < numerator ? '#6D28D9' : '#C4B5FD'}`,
          }}
        />
      ))}
    </div>
  );
}

export function GamePlay({ navigate, user, reduceMotion, addXP }: GamePlayProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [finished, setFinished] = useState(false);
  const [stars, setStars] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [shakeOption, setShakeOption] = useState<number | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  const question = QUESTIONS[currentQ];
  const progress = ((currentQ) / QUESTIONS.length) * 100;

  const handleSelect = useCallback((idx: number) => {
    if (selected !== null || showFeedback) return;
    setSelected(idx);
    setShowFeedback(true);

    if (idx === question.correct) {
      const earned = showHint ? 10 : wrongAttempts > 0 ? 15 : 25;
      setScore((s) => s + earned);
      setXpEarned((x) => x + earned);
    } else {
      setLives((l) => l - 1);
      setWrongAttempts((a) => a + 1);
      setShakeOption(idx);
      setTimeout(() => setShakeOption(null), 600);
    }
  }, [selected, showFeedback, question.correct, showHint, wrongAttempts]);

  const handleNext = () => {
    setShowHint(false);
    setWrongAttempts(0);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      const finalStars = lives === 3 ? 3 : lives === 2 ? 2 : 1;
      setStars(finalStars);
      addXP(xpEarned + score);
      setFinished(true);
    }
  };

  // Auto-advance if lives run out
  useEffect(() => {
    if (lives === 0) {
      setFinished(true);
      setStars(1);
    }
  }, [lives]);

  const optionColors = (idx: number) => {
    if (!showFeedback) return { bg: '#F9FAFB', border: '#E5E7EB', color: '#1E1B4B' };
    if (idx === question.correct) return { bg: '#ECFDF5', border: '#6EE7B7', color: '#065F46' };
    if (idx === selected && idx !== question.correct) return { bg: '#FEF2F2', border: '#FECACA', color: '#991B1B' };
    return { bg: '#F9FAFB', border: '#E5E7EB', color: '#9CA3AF' };
  };

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="size-full flex flex-col items-center justify-center p-6"
        style={{ background: 'linear-gradient(160deg, #EDE9FE, #F5F3FF)' }}
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
            {stars === 3 ? '🎉 Incrível!' : stars === 2 ? '👏 Muito bem!' : '💪 Bom esforço!'}
          </h2>
          <p style={{ color: '#6B7280', marginBottom: 24 }}>
            {stars === 3 ? 'Você dominou as frações!' : stars === 2 ? 'Continue assim!' : 'Pratique mais e tente de novo!'}
          </p>

          {/* Stars */}
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

          {/* Stats */}
          <div className="rounded-2xl p-5 mb-6 shadow-sm" style={{ background: 'white' }}>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Zap size={16} color="#F59E0B" />
                  <span style={{ color: '#1E1B4B', fontWeight: 800, fontSize: '1.2rem' }}>{xpEarned + score}</span>
                </div>
                <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>XP ganho</p>
              </div>
              <div className="text-center">
                <p style={{ color: '#1E1B4B', fontWeight: 800, fontSize: '1.2rem' }}>
                  {QUESTIONS.length - wrongAttempts}/{QUESTIONS.length}
                </p>
                <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>Acertos</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-0.5 mb-1">
                  {[1, 2, 3].map((l) => (
                    <span key={l} style={{ fontSize: '1rem' }}>{l <= lives ? '❤️' : '🖤'}</span>
                  ))}
                </div>
                <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>Vidas</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={() => navigate('games')}
              whileHover={reduceMotion ? {} : { scale: 1.02 }}
              whileTap={reduceMotion ? {} : { scale: 0.97 }}
              className="flex-1 rounded-xl py-3"
              style={{ background: '#EDE9FE', color: '#7C3AED', border: 'none', cursor: 'pointer', fontWeight: 700 }}
            >
              Outros jogos
            </motion.button>
            <motion.button
              onClick={() => {
                setCurrentQ(0); setSelected(null); setShowFeedback(false);
                setLives(3); setScore(0); setXpEarned(0); setFinished(false);
              }}
              whileHover={reduceMotion ? {} : { scale: 1.02 }}
              whileTap={reduceMotion ? {} : { scale: 0.97 }}
              className="flex-1 rounded-xl py-3 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}
            >
              Jogar novamente <ChevronRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="size-full flex flex-col relative" style={{ background: '#F5F3FF' }}>
      {/* Header */}
      <div
        className="px-5 pt-4 pb-4"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setShowConfirmExit(true)}
            style={{ color: 'white', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            aria-label="Sair do jogo"
          >
            <X size={18} />
          </button>

          {/* Lives (H#1 - visibility of system status) */}
          <div className="flex items-center gap-1" aria-label={`${lives} vidas restantes`}>
            {[1, 2, 3].map((l) => (
              <motion.span
                key={l}
                animate={l === lives && !reduceMotion ? { scale: [1, 1.3, 1] } : {}}
                style={{ fontSize: '1.1rem' }}
              >
                {l <= lives ? '❤️' : '🖤'}
              </motion.span>
            ))}
          </div>

          {/* Score */}
          <div className="flex items-center gap-1 rounded-full px-3 py-1" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <Zap size={14} color="#FCD34D" fill="#FCD34D" />
            <span style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>{score} XP</span>
          </div>
        </div>

        {/* Progress bar (H#1) */}
        <div className="mb-1">
          <div className="flex justify-between mb-1">
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>
              Questão {currentQ + 1} de {QUESTIONS.length}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="rounded-full overflow-hidden" style={{ height: 8, background: 'rgba(255,255,255,0.2)' }}>
            <motion.div
              animate={{ width: `${((currentQ) / QUESTIONS.length) * 100}%` }}
              transition={{ duration: reduceMotion ? 0.05 : 0.5 }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #FCD34D, #10B981)', borderRadius: 99 }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: reduceMotion ? 0 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduceMotion ? 0 : -40 }}
            transition={{ duration: 0.25 }}
          >
            {/* Mascot + Question card */}
            <div className="rounded-2xl p-5 mb-4 shadow-sm" style={{ background: 'white' }}>
              <div className="flex items-start gap-3 mb-4">
                <Mascot mood="thinking" size={48} reduceMotion={reduceMotion} />
                <div className="flex-1">
                  <p style={{ color: '#9CA3AF', fontSize: '0.78rem', marginBottom: 4 }}>Frações Mágicas • Nível {currentQ + 1}</p>
                  <h3 style={{ color: '#1E1B4B', lineHeight: 1.3 }}>{question.question}</h3>
                </div>
              </div>

              {/* Visual fraction */}
              {question.visual && (
                <FractionVisual
                  numerator={question.visual.numerator}
                  denominator={question.visual.denominator}
                />
              )}
            </div>

            {/* Options */}
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
                    animate={
                      shakeOption === idx && !reduceMotion
                        ? { x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.4 } }
                        : isCorrect && !reduceMotion
                        ? { scale: [1, 1.03, 1], transition: { duration: 0.3 } }
                        : {}
                    }
                    whileHover={!showFeedback && !reduceMotion ? { scale: 1.02 } : {}}
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
                    aria-disabled={showFeedback}
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

            {/* Feedback panel (H#9) */}
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
                  <div className="flex items-start gap-2">
                    {selected === question.correct ? (
                      <CheckCircle size={20} color="#10B981" className="mt-0.5 shrink-0" />
                    ) : (
                      <XCircle size={20} color="#EF4444" className="mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p style={{ fontWeight: 700, color: selected === question.correct ? '#065F46' : '#991B1B', fontSize: '0.9rem' }}>
                        {selected === question.correct ? '🎉 Correto! Muito bem!' : '❌ Ops! Quase lá...'}
                      </p>
                      <p style={{ color: selected === question.correct ? '#047857' : '#7F1D1D', fontSize: '0.82rem', marginTop: 2 }}>
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hint */}
            <AnimatePresence>
              {showHint && !showFeedback && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-2xl p-4 mb-4"
                  style={{ background: '#FFFBEB', border: '2px solid #FDE68A' }}
                >
                  <div className="flex items-start gap-2">
                    <span style={{ fontSize: '1.1rem' }}>💡</span>
                    <p style={{ color: '#92400E', fontSize: '0.85rem' }}>{HINTS[question.id]}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="px-5 pb-6 pt-3 flex gap-3" style={{ background: 'white', borderTop: '1px solid #F3F4F6' }}>
        {!showFeedback && (
          <motion.button
            onClick={() => setShowHint(true)}
            whileHover={reduceMotion ? {} : { scale: 1.03 }}
            whileTap={reduceMotion ? {} : { scale: 0.97 }}
            className="flex items-center gap-2 rounded-xl px-4 py-3"
            style={{ background: '#FFFBEB', color: '#D97706', border: '2px solid #FDE68A', cursor: 'pointer', fontWeight: 700 }}
            aria-label="Ver dica"
          >
            <HelpCircle size={18} />
            Dica
          </motion.button>
        )}

        {showFeedback && (
          <motion.button
            onClick={handleNext}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={reduceMotion ? {} : { scale: 1.02 }}
            whileTap={reduceMotion ? {} : { scale: 0.97 }}
            className="flex-1 rounded-xl py-3 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}
          >
            {currentQ < QUESTIONS.length - 1 ? 'Próxima' : '🏆 Ver resultado'}
            <ChevronRight size={18} />
          </motion.button>
        )}
      </div>

      {/* Exit confirm (H#5 - error prevention) */}
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
              role="alertdialog"
              aria-modal="true"
            >
              <div className="text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#FEF3C7' }}>
                  <Trophy size={28} color="#F59E0B" />
                </div>
                <h3 style={{ color: '#1E1B4B', marginBottom: 8 }}>Sair do jogo?</h3>
                <p style={{ color: '#6B7280', fontSize: '0.88rem', marginBottom: 20 }}>
                  Você perderá o progresso desta partida. Tem certeza?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmExit(false)}
                    className="flex-1 rounded-xl py-2.5"
                    style={{ background: '#F3F4F6', color: '#374151', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                  >
                    Continuar jogando
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
