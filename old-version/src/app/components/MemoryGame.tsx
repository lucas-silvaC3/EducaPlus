import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Zap, ChevronRight, Trophy, RotateCcw } from 'lucide-react';
import { Mascot } from './Mascot';
import type { CommonProps } from '../App';

interface MemoryGameProps extends CommonProps {
  addXP: (amount: number) => void;
}

type CardContent = {
  id: number;
  emoji: string;
  label: string;
};

const CARD_PAIRS: CardContent[] = [
  { id: 1, emoji: '🌍', label: 'Terra' },
  { id: 2, emoji: '🌙', label: 'Lua' },
  { id: 3, emoji: '☀️', label: 'Sol' },
  { id: 4, emoji: '⭐', label: 'Estrela' },
  { id: 5, emoji: '🪐', label: 'Saturno' },
  { id: 6, emoji: '🌊', label: 'Água' },
  { id: 7, emoji: '🌳', label: 'Árvore' },
  { id: 8, emoji: '🦋', label: 'Borboleta' },
];

type Card = CardContent & {
  cardId: number;
  isFlipped: boolean;
  isMatched: boolean;
};

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function generateCards(): Card[] {
  const pairs = CARD_PAIRS.flatMap((card, idx) => [
    { ...card, cardId: idx * 2, isFlipped: false, isMatched: false },
    { ...card, cardId: idx * 2 + 1, isFlipped: false, isMatched: false },
  ]);
  return shuffleArray(pairs);
}

export function MemoryGame({ navigate, user, reduceMotion, addXP }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>(generateCards);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const [canFlip, setCanFlip] = useState(true);

  const handleCardClick = useCallback((cardId: number) => {
    if (!canFlip) return;

    const card = cards.find((c) => c.cardId === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.includes(cardId)) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    setCards((prev) =>
      prev.map((c) => (c.cardId === cardId ? { ...c, isFlipped: true } : c))
    );

    if (newFlipped.length === 2) {
      setCanFlip(false);
      setMoves((m) => m + 1);

      const [first, second] = newFlipped;
      const firstCard = cards.find((c) => c.cardId === first);
      const secondCard = cards.find((c) => c.cardId === second);

      if (firstCard && secondCard && firstCard.id === secondCard.id) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.cardId === first || c.cardId === second ? { ...c, isMatched: true } : c
            )
          );
          setMatchedPairs((m) => m + 1);
          setScore((s) => s + 50);
          setFlippedCards([]);
          setCanFlip(true);
        }, 800);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.cardId === first || c.cardId === second ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
          setCanFlip(true);
        }, 1200);
      }
    }
  }, [canFlip, cards, flippedCards]);

  useEffect(() => {
    if (matchedPairs === CARD_PAIRS.length) {
      const bonusScore = Math.max(0, 500 - moves * 10);
      const totalXP = score + bonusScore;
      addXP(totalXP);
      setFinished(true);
    }
  }, [matchedPairs, moves, score, addXP]);

  const progress = (matchedPairs / CARD_PAIRS.length) * 100;
  const stars = matchedPairs === CARD_PAIRS.length ? (moves <= 12 ? 3 : moves <= 18 ? 2 : 1) : 0;

  const resetGame = () => {
    setCards(generateCards());
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setScore(0);
    setFinished(false);
    setCanFlip(true);
  };

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="size-full flex flex-col items-center justify-center p-6"
        style={{ background: 'linear-gradient(160deg, #D1FAE5, #F5F3FF)' }}
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
            {stars === 3 ? '🎉 Memória incrível!' : stars === 2 ? '👏 Muito bem!' : '💪 Bom trabalho!'}
          </h2>
          <p style={{ color: '#6B7280', marginBottom: 24 }}>
            {stars === 3 ? 'Você tem uma memória excelente!' : stars === 2 ? 'Continue praticando!' : 'Tente de novo!'}
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
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Zap size={16} color="#F59E0B" />
                  <span style={{ color: '#1E1B4B', fontWeight: 800, fontSize: '1.2rem' }}>{score}</span>
                </div>
                <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>Pontos</p>
              </div>
              <div className="text-center">
                <p style={{ color: '#1E1B4B', fontWeight: 800, fontSize: '1.2rem' }}>{moves}</p>
                <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>Movimentos</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={() => navigate('games')}
              whileHover={reduceMotion ? {} : { scale: 1.02 }}
              whileTap={reduceMotion ? {} : { scale: 0.97 }}
              className="flex-1 rounded-xl py-3"
              style={{ background: '#D1FAE5', color: '#10B981', border: 'none', cursor: 'pointer', fontWeight: 700 }}
            >
              Outros jogos
            </motion.button>
            <motion.button
              onClick={resetGame}
              whileHover={reduceMotion ? {} : { scale: 1.02 }}
              whileTap={reduceMotion ? {} : { scale: 0.97 }}
              className="flex-1 rounded-xl py-3 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #10B981, #4F46E5)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}
            >
              Jogar novamente <ChevronRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="size-full flex flex-col" style={{ background: '#F5F3FF' }}>
      <div
        className="px-5 pt-4 pb-4"
        style={{ background: 'linear-gradient(135deg, #10B981, #4F46E5)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setShowConfirmExit(true)}
            style={{ color: 'white', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            aria-label="Sair do jogo"
          >
            <X size={18} />
          </button>

          <div>
            <h3 style={{ color: 'white', textAlign: 'center' }}>🧠 Jogo da Memória</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', textAlign: 'center' }}>
              {matchedPairs}/{CARD_PAIRS.length} pares encontrados
            </p>
          </div>

          <button
            onClick={resetGame}
            style={{ color: 'white', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            aria-label="Reiniciar jogo"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 rounded-full px-3 py-1" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <Zap size={14} color="#FCD34D" fill="#FCD34D" />
            <span style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>{score}</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.82rem', fontWeight: 700 }}>
            {moves} movimentos
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
        <div className="rounded-2xl p-4 mb-4 shadow-sm" style={{ background: 'white' }}>
          <div className="flex items-start gap-3">
            <Mascot mood="thinking" size={48} reduceMotion={reduceMotion} />
            <div className="flex-1">
              <p style={{ color: '#1E1B4B', fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>
                Encontre os pares!
              </p>
              <p style={{ color: '#6B7280', fontSize: '0.78rem' }}>
                Clique nas cartas para virá-las e encontre os pares correspondentes.
              </p>
            </div>
          </div>
        </div>

        <div
          className="grid gap-3 max-w-md mx-auto"
          style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
        >
          {cards.map((card) => {
            const isFlipped = card.isFlipped || card.isMatched;

            return (
              <motion.div
                key={card.cardId}
                onClick={() => handleCardClick(card.cardId)}
                className="relative cursor-pointer"
                style={{
                  aspectRatio: '3/4',
                  perspective: '1000px',
                }}
                whileHover={!isFlipped && !reduceMotion ? { scale: 1.05 } : {}}
                whileTap={!isFlipped && !reduceMotion ? { scale: 0.95 } : {}}
              >
                <motion.div
                  className="size-full relative"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: reduceMotion ? 0.1 : 0.6, ease: 'easeInOut' }}
                >
                  {/* Card back */}
                  <div
                    className="absolute inset-0 rounded-xl flex items-center justify-center"
                    style={{
                      backfaceVisibility: 'hidden',
                      background: 'linear-gradient(135deg, #10B981, #6EE7B7)',
                      border: '3px solid #047857',
                    }}
                  >
                    <span style={{ fontSize: '2rem' }}>🌟</span>
                  </div>

                  {/* Card front */}
                  <div
                    className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-1 p-2"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: card.isMatched ? '#ECFDF5' : 'white',
                      border: `3px solid ${card.isMatched ? '#6EE7B7' : '#E5E7EB'}`,
                    }}
                  >
                    <span style={{ fontSize: '2.2rem' }}>{card.emoji}</span>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        color: card.isMatched ? '#047857' : '#6B7280',
                        fontWeight: 700,
                        textAlign: 'center',
                      }}
                    >
                      {card.label}
                    </span>
                  </div>
                </motion.div>

                {card.isMatched && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: '#10B981', border: '2px solid white' }}
                  >
                    <Star size={12} color="white" fill="white" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

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
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#D1FAE5' }}>
                  <Trophy size={28} color="#10B981" />
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
