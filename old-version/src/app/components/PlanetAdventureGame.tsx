import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Zap, ChevronRight, Trophy, Rocket, CheckCircle, Lock } from 'lucide-react';
import { Mascot } from './Mascot';
import type { CommonProps } from '../App';

interface PlanetAdventureGameProps extends CommonProps {
  addXP: (amount: number) => void;
}

type Planet = {
  id: number;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  challenge: {
    question: string;
    options: string[];
    correct: number;
    fact: string;
  };
};

const PLANETS: Planet[] = [
  {
    id: 1,
    name: 'Mercúrio',
    emoji: '☿️',
    color: '#9CA3AF',
    bgColor: '#F3F4F6',
    challenge: {
      question: 'Mercúrio é o planeta mais próximo de qual astro?',
      options: ['Lua', 'Sol', 'Terra', 'Vênus'],
      correct: 1,
      fact: 'Mercúrio é o planeta mais próximo do Sol e não tem atmosfera!',
    },
  },
  {
    id: 2,
    name: 'Vênus',
    emoji: '♀️',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    challenge: {
      question: 'Vênus é frequentemente chamado de planeta gêmeo de qual planeta?',
      options: ['Marte', 'Terra', 'Júpiter', 'Saturno'],
      correct: 1,
      fact: 'Vênus tem tamanho similar à Terra, mas é muito mais quente!',
    },
  },
  {
    id: 3,
    name: 'Terra',
    emoji: '🌍',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    challenge: {
      question: 'Qual é o único satélite natural da Terra?',
      options: ['Fobos', 'Lua', 'Europa', 'Titã'],
      correct: 1,
      fact: 'A Lua é o único satélite natural da Terra e influencia as marés!',
    },
  },
  {
    id: 4,
    name: 'Marte',
    emoji: '♂️',
    color: '#EF4444',
    bgColor: '#FEE2E2',
    challenge: {
      question: 'Por que Marte é chamado de planeta vermelho?',
      options: ['Por causa do fogo', 'Por causa do óxido de ferro', 'Por causa das flores', 'Por causa do céu'],
      correct: 1,
      fact: 'Marte é vermelho devido ao óxido de ferro (ferrugem) em sua superfície!',
    },
  },
  {
    id: 5,
    name: 'Júpiter',
    emoji: '♃',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    challenge: {
      question: 'Júpiter é o maior planeta do sistema solar. Ele é feito principalmente de:',
      options: ['Rocha', 'Gelo', 'Gás', 'Metal'],
      correct: 2,
      fact: 'Júpiter é um gigante gasoso feito principalmente de hidrogênio e hélio!',
    },
  },
  {
    id: 6,
    name: 'Saturno',
    emoji: '🪐',
    color: '#EAB308',
    bgColor: '#FEF9C3',
    challenge: {
      question: 'Qual é a característica mais famosa de Saturno?',
      options: ['Seus vulcões', 'Seus anéis', 'Suas montanhas', 'Suas tempestades'],
      correct: 1,
      fact: 'Saturno tem anéis espetaculares feitos de gelo e rocha!',
    },
  },
];

export function PlanetAdventureGame({ navigate, user, reduceMotion, addXP }: PlanetAdventureGameProps) {
  const [currentPlanet, setCurrentPlanet] = useState<number | null>(null);
  const [completedPlanets, setCompletedPlanets] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [stars, setStars] = useState<number[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  const planet = currentPlanet !== null ? PLANETS.find((p) => p.id === currentPlanet) : null;
  const allCompleted = completedPlanets.length === PLANETS.length;

  const handlePlanetClick = (planetId: number) => {
    if (completedPlanets.includes(planetId)) return;
    if (planetId > 1 && !completedPlanets.includes(planetId - 1)) return;

    setCurrentPlanet(planetId);
    setSelectedOption(null);
    setShowFeedback(false);
  };

  const handleAnswer = (optionIdx: number) => {
    if (showFeedback || !planet) return;

    setSelectedOption(optionIdx);
    setShowFeedback(true);

    if (optionIdx === planet.challenge.correct) {
      const earnedStars = 3;
      setStars([...stars, earnedStars]);
      setCompletedPlanets([...completedPlanets, planet.id]);
      setTotalScore((s) => s + 100);

      setTimeout(() => {
        setCurrentPlanet(null);
      }, 3000);
    }
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setShowFeedback(false);
  };

  const handleFinish = () => {
    addXP(totalScore);
    navigate('games');
  };

  if (allCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="size-full flex flex-col items-center justify-center p-6"
        style={{ background: 'linear-gradient(160deg, #1E1B4B, #4F46E5)' }}
      >
        <motion.div
          animate={reduceMotion ? {} : { rotate: [0, 360], transition: { duration: 3, repeat: Infinity, ease: 'linear' } }}
        >
          <span style={{ fontSize: '6rem' }}>🚀</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-4 w-full max-w-sm"
        >
          <h2 style={{ color: 'white', marginBottom: 4 }}>🎉 Missão Concluída!</h2>
          <p style={{ color: '#C4B5FD', marginBottom: 24 }}>Você explorou todo o sistema solar!</p>

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
                  <span style={{ color: '#1E1B4B', fontWeight: 800, fontSize: '1.2rem' }}>{totalScore}</span>
                </div>
                <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>XP Total</p>
              </div>
              <div className="text-center">
                <p style={{ color: '#1E1B4B', fontWeight: 800, fontSize: '1.2rem' }}>
                  {completedPlanets.length}/{PLANETS.length}
                </p>
                <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>Planetas</p>
              </div>
            </div>
          </div>

          <motion.button
            onClick={handleFinish}
            whileHover={reduceMotion ? {} : { scale: 1.02 }}
            whileTap={reduceMotion ? {} : { scale: 0.97 }}
            className="w-full rounded-xl py-3 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}
          >
            Voltar aos jogos <ChevronRight size={16} />
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  if (planet) {
    const isCorrect = selectedOption === planet.challenge.correct;

    return (
      <div className="size-full flex flex-col" style={{ background: '#F5F3FF' }}>
        <div
          className="px-5 pt-4 pb-4"
          style={{ background: `linear-gradient(135deg, ${planet.color}, #4F46E5)` }}
        >
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setCurrentPlanet(null)}
              style={{ color: 'white', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              aria-label="Voltar ao mapa"
            >
              <X size={18} />
            </button>

            <div className="flex-1 text-center">
              <h3 style={{ color: 'white' }}>
                <span style={{ fontSize: '1.8rem', marginRight: 8 }}>{planet.emoji}</span>
                {planet.name}
              </h3>
            </div>

            <div className="flex items-center gap-1 rounded-full px-3 py-1" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <Star size={14} color="#FCD34D" fill="#FCD34D" />
              <span style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>
                {completedPlanets.length}/{PLANETS.length}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="rounded-2xl p-5 mb-4 shadow-sm" style={{ background: 'white' }}>
            <div className="flex items-start gap-3 mb-4">
              <Mascot mood="thinking" size={48} reduceMotion={reduceMotion} />
              <div className="flex-1">
                <p style={{ color: '#9CA3AF', fontSize: '0.78rem', marginBottom: 4 }}>Desafio do Planeta</p>
                <h3 style={{ color: '#1E1B4B', lineHeight: 1.3 }}>{planet.challenge.question}</h3>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            {planet.challenge.options.map((opt, idx) => {
              const isSelected = idx === selectedOption;
              const isCorrectOption = idx === planet.challenge.correct;

              let bg = '#F9FAFB';
              let border = '#E5E7EB';
              let color = '#1E1B4B';

              if (showFeedback) {
                if (isCorrectOption) {
                  bg = '#ECFDF5';
                  border = '#6EE7B7';
                  color = '#065F46';
                } else if (isSelected) {
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
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={!showFeedback && !reduceMotion ? { scale: 1.02, x: 4 } : {}}
                  whileTap={!showFeedback && !reduceMotion ? { scale: 0.97 } : {}}
                  className="w-full rounded-xl p-4 flex items-center gap-3 text-left"
                  style={{
                    background: bg,
                    border: `2px solid ${border}`,
                    color: color,
                    cursor: showFeedback ? 'default' : 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                  }}
                >
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: showFeedback && isCorrectOption ? '#10B981' : showFeedback && isSelected ? '#EF4444' : '#E5E7EB',
                      color: showFeedback && (isCorrectOption || isSelected) ? 'white' : '#6B7280',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                    }}
                  >
                    {showFeedback && isCorrectOption ? <CheckCircle size={16} /> : String.fromCharCode(65 + idx)}
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
                className="rounded-2xl p-4 shadow-sm"
                style={{
                  background: isCorrect ? '#ECFDF5' : '#FEF2F2',
                  border: `2px solid ${isCorrect ? '#6EE7B7' : '#FECACA'}`,
                }}
              >
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle size={20} color="#10B981" className="mt-0.5 shrink-0" />
                  ) : (
                    <span style={{ fontSize: '1.2rem' }}>❌</span>
                  )}
                  <div>
                    <p style={{ fontWeight: 700, color: isCorrect ? '#065F46' : '#991B1B', fontSize: '0.9rem', marginBottom: 4 }}>
                      {isCorrect ? '🎉 Correto!' : 'Ops! Tente novamente!'}
                    </p>
                    {isCorrect && (
                      <p style={{ color: '#047857', fontSize: '0.82rem' }}>
                        {planet.challenge.fact}
                      </p>
                    )}
                  </div>
                </div>

                {!isCorrect && (
                  <motion.button
                    onClick={handleRetry}
                    whileHover={reduceMotion ? {} : { scale: 1.02 }}
                    whileTap={reduceMotion ? {} : { scale: 0.97 }}
                    className="w-full mt-3 rounded-xl py-2"
                    style={{ background: '#EF4444', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                  >
                    Tentar novamente
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col" style={{ background: 'linear-gradient(160deg, #1E1B4B, #4F46E5)' }}>
      <div className="px-5 pt-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setShowConfirmExit(true)}
            style={{ color: 'white', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            aria-label="Sair do jogo"
          >
            <X size={18} />
          </button>

          <div className="flex-1 text-center">
            <h3 style={{ color: 'white' }}>🚀 Aventura dos Planetas</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>
              Explore o sistema solar!
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-full px-3 py-1" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <Zap size={14} color="#FCD34D" fill="#FCD34D" />
            <span style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>{totalScore}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="rounded-2xl p-4 mb-6 shadow-sm" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
          <div className="flex items-start gap-3">
            <Mascot mood="waving" size={48} reduceMotion={reduceMotion} />
            <div className="flex-1">
              <p style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>
                Bem-vindo, astronauta!
              </p>
              <p style={{ color: '#C4B5FD', fontSize: '0.78rem' }}>
                Clique em cada planeta para responder desafios e desbloquear o próximo!
              </p>
            </div>
          </div>
        </div>

        <div className="relative" style={{ minHeight: 600 }}>
          {PLANETS.map((p, idx) => {
            const isCompleted = completedPlanets.includes(p.id);
            const isLocked = p.id > 1 && !completedPlanets.includes(p.id - 1);
            const canPlay = !isCompleted && !isLocked;

            const positions = [
              { top: '5%', left: '10%' },
              { top: '15%', right: '15%' },
              { top: '30%', left: '5%' },
              { top: '45%', right: '10%' },
              { top: '60%', left: '15%' },
              { top: '75%', right: '20%' },
            ];

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.15 }}
                className="absolute"
                style={positions[idx]}
              >
                <motion.button
                  onClick={() => handlePlanetClick(p.id)}
                  disabled={isLocked}
                  whileHover={canPlay && !reduceMotion ? { scale: 1.15 } : {}}
                  whileTap={canPlay && !reduceMotion ? { scale: 0.95 } : {}}
                  animate={
                    canPlay && !reduceMotion
                      ? { y: [0, -8, 0], transition: { duration: 2, repeat: Infinity, delay: idx * 0.3 } }
                      : {}
                  }
                  className="relative flex flex-col items-center gap-2"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    opacity: isLocked ? 0.4 : 1,
                  }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg relative"
                    style={{
                      background: isCompleted ? p.bgColor : isLocked ? '#374151' : p.bgColor,
                      border: `4px solid ${isCompleted ? '#10B981' : isLocked ? '#6B7280' : p.color}`,
                    }}
                  >
                    <span style={{ fontSize: '2.5rem' }}>{isLocked ? '🔒' : p.emoji}</span>

                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: '#10B981', border: '3px solid white' }}
                      >
                        <CheckCircle size={16} color="white" />
                      </motion.div>
                    )}

                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock size={20} color="#6B7280" />
                      </div>
                    )}
                  </div>

                  <span
                    className="rounded-full px-3 py-1"
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    {p.name}
                  </span>
                </motion.button>
              </motion.div>
            );
          })}

          <motion.div
            className="absolute"
            style={{ bottom: '5%', left: '50%', transform: 'translateX(-50%)' }}
            animate={reduceMotion ? {} : { y: [0, -10, 0], transition: { duration: 2, repeat: Infinity } }}
          >
            <Rocket size={48} color="white" />
          </motion.div>
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
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#E0E7FF' }}>
                  <Trophy size={28} color="#6366F1" />
                </div>
                <h3 style={{ color: '#1E1B4B', marginBottom: 8 }}>Sair da aventura?</h3>
                <p style={{ color: '#6B7280', fontSize: '0.88rem', marginBottom: 20 }}>
                  Seu progresso será salvo!
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
                    style={{ background: '#6366F1', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}
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
