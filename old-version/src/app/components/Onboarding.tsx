import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Moon, Sun, Book, Gamepad2, Settings, HelpCircle, Sparkles } from 'lucide-react';
import { Mascot } from './Mascot';
import type { UserSettings } from '../App';

interface OnboardingProps {
  onComplete: (darkMode: boolean) => void;
  reduceMotion: boolean;
}

type Step = 'welcome' | 'theme' | 'tour' | 'complete';

const TOUR_STEPS = [
  {
    id: 'focus',
    title: 'Modo Foco',
    description: 'Ative o modo foco para estudar sem distrações!',
    icon: <Sparkles size={24} color="#7C3AED" />,
    position: { top: '20%', right: '5%' },
  },
  {
    id: 'aulas',
    title: 'Aulas',
    description: 'Aqui você encontra todas as suas aulas organizadas!',
    icon: <Book size={24} color="#3B82F6" />,
    position: { bottom: '10%', left: '10%' },
  },
  {
    id: 'games',
    title: 'Jogos',
    description: 'Aqui você encontra jogos educativos divertidos!',
    icon: <Gamepad2 size={24} color="#10B981" />,
    position: { bottom: '10%', left: '30%' },
  },
  {
    id: 'settings',
    title: 'Preferências',
    description: 'Personalize sua experiência de aprendizado aqui!',
    icon: <Settings size={24} color="#F59E0B" />,
    position: { bottom: '10%', right: '10%' },
  },
];

export function Onboarding({ onComplete, reduceMotion }: OnboardingProps) {
  const [step, setStep] = useState<Step>('welcome');
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark'>('light');
  const [tourIndex, setTourIndex] = useState(0);

  const handleThemeSelect = (theme: 'light' | 'dark') => {
    setSelectedTheme(theme);
  };

  const handleStartTour = () => {
    setStep('tour');
  };

  const handleNextTourStep = () => {
    if (tourIndex < TOUR_STEPS.length - 1) {
      setTourIndex(tourIndex + 1);
    } else {
      setStep('complete');
    }
  };

  const handleFinish = () => {
    onComplete(selectedTheme === 'dark');
  };

  if (step === 'welcome') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setStep('theme')}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="rounded-3xl p-8 text-center max-w-md mx-4"
            style={{ background: 'white' }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={
                reduceMotion
                  ? {}
                  : {
                      rotate: [0, 10, -10, 10, 0],
                      transition: { duration: 1.5, repeat: Infinity, repeatDelay: 2 },
                    }
              }
              className="mx-auto mb-6"
            >
              <Mascot mood="waving" size={120} reduceMotion={reduceMotion} />
            </motion.div>

            <h2 style={{ color: '#1E1B4B', marginBottom: 12, fontSize: '2rem' }}>
              Bem-vindo ao Estuda+! 🎉
            </h2>
            <p style={{ color: '#6B7280', fontSize: '1.1rem', marginBottom: 32 }}>
              Estamos muito felizes em ter você aqui!
            </p>

            <motion.button
              onClick={() => setStep('theme')}
              whileHover={reduceMotion ? {} : { scale: 1.05 }}
              whileTap={reduceMotion ? {} : { scale: 0.95 }}
              className="w-full rounded-xl py-3 px-6"
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              Toque para continuar
            </motion.button>

            <p style={{ color: '#9CA3AF', fontSize: '0.85rem', marginTop: 16 }}>
              Toque em qualquer lugar para começar
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (step === 'theme') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="rounded-3xl p-8 max-w-lg mx-4"
            style={{ background: 'white' }}
          >
            <h2 style={{ color: '#1E1B4B', marginBottom: 8, textAlign: 'center' }}>
              Escolha seu tema ✨
            </h2>
            <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: 24, textAlign: 'center' }}>
              Você prefere tema claro ou escuro?
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.button
                onClick={() => handleThemeSelect('light')}
                whileHover={reduceMotion ? {} : { scale: 1.03 }}
                whileTap={reduceMotion ? {} : { scale: 0.97 }}
                className="rounded-2xl p-6 flex flex-col items-center gap-3"
                style={{
                  background: selectedTheme === 'light' ? '#EDE9FE' : '#F9FAFB',
                  border: `3px solid ${selectedTheme === 'light' ? '#7C3AED' : '#E5E7EB'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: '#FEF3C7' }}
                >
                  <Sun size={32} color="#F59E0B" />
                </div>
                <div>
                  <p style={{ color: '#1E1B4B', fontWeight: 700, fontSize: '1rem', marginBottom: 2 }}>
                    Tema Claro
                  </p>
                  <p style={{ color: '#6B7280', fontSize: '0.75rem' }}>Cores vibrantes</p>
                </div>

                <div
                  className="rounded-xl p-3 w-full"
                  style={{ background: '#F5F3FF', border: '2px solid #E5E7EB' }}
                >
                  <div className="rounded-lg p-2 mb-2" style={{ background: 'white' }}>
                    <div className="h-2 rounded" style={{ background: '#7C3AED', width: '60%' }} />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-10 rounded-lg flex-1" style={{ background: '#DBEAFE' }} />
                    <div className="h-10 rounded-lg flex-1" style={{ background: '#D1FAE5' }} />
                  </div>
                </div>
              </motion.button>

              <motion.button
                onClick={() => handleThemeSelect('dark')}
                whileHover={reduceMotion ? {} : { scale: 1.03 }}
                whileTap={reduceMotion ? {} : { scale: 0.97 }}
                className="rounded-2xl p-6 flex flex-col items-center gap-3"
                style={{
                  background: selectedTheme === 'dark' ? '#312E81' : '#F9FAFB',
                  border: `3px solid ${selectedTheme === 'dark' ? '#6366F1' : '#E5E7EB'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: selectedTheme === 'dark' ? '#4C1D95' : '#F3F4F6' }}
                >
                  <Moon size={32} color={selectedTheme === 'dark' ? '#C4B5FD' : '#9CA3AF'} />
                </div>
                <div>
                  <p
                    style={{
                      color: selectedTheme === 'dark' ? 'white' : '#1E1B4B',
                      fontWeight: 700,
                      fontSize: '1rem',
                      marginBottom: 2,
                    }}
                  >
                    Tema Escuro
                  </p>
                  <p
                    style={{
                      color: selectedTheme === 'dark' ? '#C4B5FD' : '#6B7280',
                      fontSize: '0.75rem',
                    }}
                  >
                    Menos cansativo
                  </p>
                </div>

                <div
                  className="rounded-xl p-3 w-full"
                  style={{
                    background: selectedTheme === 'dark' ? '#1E1B4B' : '#F3F4F6',
                    border: `2px solid ${selectedTheme === 'dark' ? '#4C1D95' : '#E5E7EB'}`,
                  }}
                >
                  <div
                    className="rounded-lg p-2 mb-2"
                    style={{
                      background: selectedTheme === 'dark' ? '#312E81' : '#E5E7EB',
                    }}
                  >
                    <div
                      className="h-2 rounded"
                      style={{
                        background: selectedTheme === 'dark' ? '#818CF8' : '#9CA3AF',
                        width: '60%',
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div
                      className="h-10 rounded-lg flex-1"
                      style={{
                        background: selectedTheme === 'dark' ? '#1E3A8A' : '#D1D5DB',
                      }}
                    />
                    <div
                      className="h-10 rounded-lg flex-1"
                      style={{
                        background: selectedTheme === 'dark' ? '#065F46' : '#D1D5DB',
                      }}
                    />
                  </div>
                </div>
              </motion.button>
            </div>

            <motion.button
              onClick={handleStartTour}
              whileHover={reduceMotion ? {} : { scale: 1.02 }}
              whileTap={reduceMotion ? {} : { scale: 0.98 }}
              className="w-full rounded-xl py-3"
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Continuar
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (step === 'tour') {
    const currentTourStep = TOUR_STEPS[tourIndex];

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100]"
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={handleNextTourStep}
        >
          <motion.div
            key={tourIndex}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="absolute rounded-2xl p-6 max-w-sm"
            style={{
              background: 'white',
              ...currentTourStep.position,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              {currentTourStep.icon}
              <div className="flex-1">
                <h3 style={{ color: '#1E1B4B', fontWeight: 700, marginBottom: 4 }}>
                  {currentTourStep.title}
                </h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                  {currentTourStep.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {TOUR_STEPS.map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-full"
                    style={{
                      width: idx === tourIndex ? 24 : 8,
                      height: 8,
                      background: idx === tourIndex ? '#7C3AED' : '#E5E7EB',
                      transition: 'all 0.3s',
                    }}
                  />
                ))}
              </div>

              <motion.button
                onClick={handleNextTourStep}
                whileHover={reduceMotion ? {} : { scale: 1.05 }}
                whileTap={reduceMotion ? {} : { scale: 0.95 }}
                className="rounded-lg px-4 py-2"
                style={{
                  background: '#7C3AED',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                {tourIndex === TOUR_STEPS.length - 1 ? 'Finalizar' : 'Próximo'}
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="absolute"
            style={{ ...currentTourStep.position, transform: 'translate(-50%, -50%)' }}
            animate={
              reduceMotion
                ? {}
                : {
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                    transition: { duration: 2, repeat: Infinity },
                  }
            }
          >
            <div
              className="rounded-full"
              style={{
                width: 300,
                height: 300,
                border: '3px solid #7C3AED',
                pointerEvents: 'none',
              }}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (step === 'complete') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="rounded-3xl p-8 text-center max-w-md mx-4"
            style={{ background: 'white' }}
          >
            <motion.div
              animate={
                reduceMotion
                  ? {}
                  : {
                      y: [0, -10, 0],
                      transition: { duration: 2, repeat: Infinity },
                    }
              }
              className="mx-auto mb-6"
            >
              <Mascot mood="celebrating" size={120} reduceMotion={reduceMotion} />
            </motion.div>

            <h2 style={{ color: '#1E1B4B', marginBottom: 12, fontSize: '2rem' }}>
              Tudo pronto! 🎉
            </h2>
            <p style={{ color: '#6B7280', fontSize: '1rem', marginBottom: 24 }}>
              Você está pronto para começar sua jornada de aprendizado!
            </p>

            <div className="rounded-2xl p-4 mb-6" style={{ background: '#EDE9FE' }}>
              <div className="flex items-center gap-2 justify-center mb-2">
                <HelpCircle size={20} color="#7C3AED" />
                <p style={{ color: '#5B21B6', fontWeight: 700, fontSize: '0.9rem' }}>
                  Precisa de ajuda?
                </p>
              </div>
              <p style={{ color: '#6D28D9', fontSize: '0.85rem' }}>
                Visite nossa <span style={{ fontWeight: 700 }}>Central de Ajuda</span> sempre que precisar!
              </p>
            </div>

            <motion.button
              onClick={handleFinish}
              whileHover={reduceMotion ? {} : { scale: 1.05 }}
              whileTap={reduceMotion ? {} : { scale: 0.95 }}
              className="w-full rounded-xl py-3 px-6"
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              Começar Jornada 🚀
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}
