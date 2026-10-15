import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Zap, ChevronRight, Trophy, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import { Mascot } from './Mascot';
import type { CommonProps } from '../App';

interface PlatformerGameProps extends CommonProps {
  addXP: (amount: number) => void;
}

type GameState = 'playing' | 'question' | 'finished';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Quanto é 5 + 3?',
    options: ['6', '7', '8', '9'],
    correct: 2,
  },
  {
    id: 2,
    question: 'Qual é a capital do Brasil?',
    options: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
    correct: 2,
  },
  {
    id: 3,
    question: 'Qual planeta é conhecido como planeta vermelho?',
    options: ['Vênus', 'Marte', 'Júpiter', 'Saturno'],
    correct: 1,
  },
];

export function PlatformerGame({ navigate, user, reduceMotion, addXP }: PlatformerGameProps) {
  const [gameState, setGameState] = useState<GameState>('playing');
  const [playerX, setPlayerX] = useState(50);
  const [playerY, setPlayerY] = useState(300);
  const [isJumping, setIsJumping] = useState(false);
  const [isCrouching, setIsCrouching] = useState(false);
  const [facingRight, setFacingRight] = useState(true);
  const [coins, setCoins] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

  const checkQuestionPoint = useCallback(() => {
    // Pontos especiais para perguntas nas posições: 200, 400, 600
    const questionPoints = [200, 400, 600];
    const nearPoint = questionPoints.find((point) => Math.abs(playerX - point) < 30);

    if (nearPoint && questionsAnswered < 3 && gameState === 'playing') {
      const questionIndex = questionPoints.indexOf(nearPoint);
      if (questionIndex !== -1 && questionIndex < QUESTIONS.length) {
        setCurrentQuestion(QUESTIONS[questionIndex]);
        setGameState('question');
      }
    }

    // Chegou ao final (posição > 700)
    if (playerX > 700 && questionsAnswered >= 3) {
      const totalScore = coins * 10 + questionsAnswered * 50;
      setScore(totalScore);
      addXP(totalScore);
      setGameState('finished');
    }
  }, [playerX, questionsAnswered, gameState, coins, addXP]);

  useEffect(() => {
    checkQuestionPoint();
  }, [playerX, checkQuestionPoint]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeysPressed((prev) => new Set(prev).add(e.key));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed((prev) => {
        const next = new Set(prev);
        next.delete(e.key);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      setKeysPressed((keys) => {
        if (keys.has('ArrowLeft')) {
          setPlayerX((x) => Math.max(0, x - 5));
          setFacingRight(false);
        }
        if (keys.has('ArrowRight')) {
          setPlayerX((x) => Math.min(800, x + 5));
          setFacingRight(true);
        }
        if (keys.has('ArrowUp') && !isJumping) {
          setIsJumping(true);
          setTimeout(() => setIsJumping(false), 600);
        }
        if (keys.has('ArrowDown')) {
          setIsCrouching(true);
        } else {
          setIsCrouching(false);
        }
        return keys;
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameState, isJumping]);

  const handleMove = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameState !== 'playing') return;

    if (direction === 'left') {
      setPlayerX((x) => Math.max(0, x - 10));
      setFacingRight(false);
    } else if (direction === 'right') {
      setPlayerX((x) => Math.min(800, x + 10));
      setFacingRight(true);
    } else if (direction === 'up' && !isJumping) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 600);
    } else if (direction === 'down') {
      setIsCrouching(true);
      setTimeout(() => setIsCrouching(false), 200);
    }
  };

  const handleAnswer = (index: number) => {
    if (showFeedback || !currentQuestion) return;

    setSelectedAnswer(index);
    setShowFeedback(true);

    if (index === currentQuestion.correct) {
      setQuestionsAnswered((q) => q + 1);
      setCoins((c) => c + 3);
    }

    setTimeout(() => {
      setGameState('playing');
      setCurrentQuestion(null);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }, 2000);
  };

  const progress = (questionsAnswered / 3) * 100;

  if (gameState === 'finished') {
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
          <h2 style={{ color: '#1E1B4B', marginBottom: 4 }}>🎉 Fase Completa!</h2>
          <p style={{ color: '#6B7280', marginBottom: 24 }}>Você completou a aventura educativa!</p>

          <div className="flex justify-center gap-4 mb-6">
            {[1, 2, 3].map((s) => (
              <motion.div
                key={s}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: s * 0.2, type: 'spring' }}
              >
                <Star size={48} color="#FCD34D" fill="#FCD34D" />
              </motion.div>
            ))}
          </div>

          <div className="rounded-2xl p-5 mb-6 shadow-sm" style={{ background: 'white' }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Zap size={16} color="#F59E0B" />
                  <span style={{ color: '#1E1B4B', fontWeight: 800, fontSize: '1.2rem' }}>{score}</span>
                </div>
                <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>Pontos</p>
              </div>
              <div className="text-center">
                <p style={{ color: '#1E1B4B', fontWeight: 800, fontSize: '1.2rem' }}>
                  {coins} 🪙
                </p>
                <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>Moedas</p>
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

  if (gameState === 'question' && currentQuestion) {
    const isCorrect = selectedAnswer === currentQuestion.correct;

    return (
      <div className="size-full flex flex-col" style={{ background: 'linear-gradient(160deg, #DBEAFE, #F5F3FF)' }}>
        <div className="px-5 pt-4 pb-4" style={{ background: 'linear-gradient(135deg, #3B82F6, #4F46E5)' }}>
          <h3 style={{ color: 'white', textAlign: 'center', marginBottom: 8 }}>❓ Pergunta Especial</h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', textAlign: 'center' }}>
            Pergunta {questionsAnswered + 1} de 3
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="rounded-2xl p-5 mb-4 shadow-sm" style={{ background: 'white' }}>
            <div className="flex items-start gap-3">
              <Mascot mood="thinking" size={48} reduceMotion={reduceMotion} />
              <h3 style={{ color: '#1E1B4B', flex: 1 }}>{currentQuestion.question}</h3>
            </div>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelectedOption = idx === selectedAnswer;
              const isCorrectOption = idx === currentQuestion.correct;

              let bg = '#F9FAFB';
              let border = '#E5E7EB';
              let color = '#1E1B4B';

              if (showFeedback) {
                if (isCorrectOption) {
                  bg = '#ECFDF5';
                  border = '#6EE7B7';
                  color = '#065F46';
                } else if (isSelectedOption) {
                  bg = '#FEF2F2';
                  border = '#FECACA';
                  color = '#991B1B';
                } else {
                  color = '#9CA3AF';
                }
              }

              return (
                <motion.button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={showFeedback}
                  whileHover={!showFeedback && !reduceMotion ? { scale: 1.02, x: 4 } : {}}
                  whileTap={!showFeedback && !reduceMotion ? { scale: 0.98 } : {}}
                  className="w-full rounded-xl p-4 text-left"
                  style={{
                    background: bg,
                    border: `2px solid ${border}`,
                    color: color,
                    cursor: showFeedback ? 'default' : 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-4 mt-4 shadow-sm text-center"
                style={{
                  background: isCorrect ? '#ECFDF5' : '#FEF2F2',
                  border: `2px solid ${isCorrect ? '#6EE7B7' : '#FECACA'}`,
                }}
              >
                <p style={{ color: isCorrect ? '#065F46' : '#991B1B', fontWeight: 700, fontSize: '1.1rem' }}>
                  {isCorrect ? '🎉 Correto! +3 moedas!' : '❌ Ops! Tente novamente na próxima!'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #87CEEB, #E0F2FE)' }}>
      <div className="px-4 pt-4 pb-3 flex items-center justify-between relative z-10">
        <button
          onClick={() => navigate('games')}
          style={{ color: 'white', background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 rounded-full px-3 py-1" style={{ background: 'rgba(255,255,255,0.9)' }}>
            <span style={{ fontSize: '1rem' }}>🪙</span>
            <span style={{ color: '#1E1B4B', fontWeight: 700 }}>{coins}</span>
          </div>

          <div className="rounded-full px-4 py-1" style={{ background: 'rgba(255,255,255,0.9)' }}>
            <span style={{ color: '#1E1B4B', fontWeight: 700, fontSize: '0.85rem' }}>
              {questionsAnswered}/3 ❓
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        {/* Nuvens */}
        <motion.div
          animate={reduceMotion ? {} : { x: [0, -100, 0], transition: { duration: 20, repeat: Infinity } }}
          className="absolute top-10 left-20"
          style={{ fontSize: '3rem', opacity: 0.7 }}
        >
          ☁️
        </motion.div>
        <motion.div
          animate={reduceMotion ? {} : { x: [0, 100, 0], transition: { duration: 25, repeat: Infinity } }}
          className="absolute top-20 right-10"
          style={{ fontSize: '2.5rem', opacity: 0.7 }}
        >
          ☁️
        </motion.div>

        {/* Árvores */}
        <div className="absolute bottom-20 left-10" style={{ fontSize: '3rem' }}>🌳</div>
        <div className="absolute bottom-20 left-40" style={{ fontSize: '2.5rem' }}>🌲</div>
        <div className="absolute bottom-20 right-40" style={{ fontSize: '3rem' }}>🌳</div>

        {/* Plataformas */}
        <div className="absolute bottom-16 left-0 right-0 h-2 bg-green-600" />
        <div className="absolute bottom-24 left-32 w-24 h-2 bg-amber-700" />
        <div className="absolute bottom-32 left-64 w-24 h-2 bg-amber-700" />
        <div className="absolute bottom-40 right-40 w-24 h-2 bg-amber-700" />

        {/* Pontos de pergunta */}
        {[200, 400, 600].map((pos, idx) => (
          <motion.div
            key={pos}
            className="absolute bottom-16"
            style={{ left: pos, transform: 'translateX(-50%)' }}
            animate={reduceMotion ? {} : { y: [0, -8, 0], transition: { duration: 1.5, repeat: Infinity, delay: idx * 0.3 } }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
                border: '3px solid white',
                fontSize: '1.2rem',
              }}
            >
              ❓
            </div>
          </motion.div>
        ))}

        {/* Moedas */}
        {[100, 150, 250, 350, 450, 550, 650].map((pos, idx) => (
          <motion.div
            key={pos}
            className="absolute bottom-28"
            style={{ left: pos }}
            animate={reduceMotion ? {} : { rotate: [0, 360], transition: { duration: 2, repeat: Infinity, delay: idx * 0.2 } }}
          >
            <span style={{ fontSize: '1.5rem' }}>🪙</span>
          </motion.div>
        ))}

        {/* Personagem */}
        <motion.div
          className="absolute"
          style={{
            left: playerX,
            bottom: isJumping ? playerY + 60 : playerY,
            transform: facingRight ? 'scaleX(1)' : 'scaleX(-1)',
          }}
          animate={{
            bottom: isJumping ? playerY + 60 : playerY,
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={reduceMotion ? {} : { rotate: facingRight ? [0, 5, -5, 0] : [0, -5, 5, 0], transition: { duration: 0.5, repeat: Infinity } }}
            style={{ fontSize: isCrouching ? '2rem' : '2.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
          >
            {isCrouching ? '🐢' : '👦'}
          </motion.div>
        </motion.div>

        {/* Bandeira final */}
        <div className="absolute bottom-16 right-10" style={{ fontSize: '3rem' }}>
          🏁
        </div>
      </div>

      {/* Controles touch para mobile */}
      <div className="pb-4 px-4 flex justify-between gap-3 relative z-10">
        <div className="flex gap-2">
          <motion.button
            onTouchStart={() => handleMove('left')}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
          >
            <ArrowLeft size={24} color="#1E1B4B" />
          </motion.button>
          <motion.button
            onTouchStart={() => handleMove('right')}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
          >
            <ArrowRight size={24} color="#1E1B4B" />
          </motion.button>
        </div>

        <div className="flex gap-2">
          <motion.button
            onTouchStart={() => handleMove('down')}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
          >
            <ArrowDown size={24} color="#1E1B4B" />
          </motion.button>
          <motion.button
            onTouchStart={() => handleMove('up')}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
          >
            <ArrowUp size={24} color="#1E1B4B" />
          </motion.button>
        </div>
      </div>

      <div className="px-4 pb-2">
        <div className="rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.3)', height: 6 }}>
          <motion.div
            animate={{ width: `${progress}%` }}
            style={{ background: 'linear-gradient(90deg, #10B981, #FCD34D)', height: '100%', borderRadius: 999 }}
          />
        </div>
      </div>
    </div>
  );
}
