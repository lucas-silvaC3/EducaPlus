import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Volume2, Highlighter, BookOpen, CheckCircle, ChevronRight } from 'lucide-react';
import { Mascot } from './Mascot';
import type { CommonProps } from '../App';

interface MaterialConfig {
  title: string;
  subject: string;
  color: string;
  bgColor: string;
  sections: Array<{
    id: number;
    title: string;
    content: string;
    highlight?: boolean;
  }>;
  exercises?: Array<{
    id: number;
    question: string;
    options: string[];
    correct: number;
  }>;
}

interface StudyMaterialScreenProps extends CommonProps {
  config: MaterialConfig;
}

export function StudyMaterialScreen({ navigate, user, reduceMotion, config }: StudyMaterialScreenProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [highlightedSections, setHighlightedSections] = useState<number[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showExercises, setShowExercises] = useState(false);
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<number, number>>({});

  const section = config.sections[currentSection];
  const progress = ((currentSection + 1) / config.sections.length) * 100;

  const handleNext = () => {
    if (currentSection < config.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else if (config.exercises) {
      setShowExercises(true);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const toggleHighlight = () => {
    if (highlightedSections.includes(currentSection)) {
      setHighlightedSections(highlightedSections.filter((s) => s !== currentSection));
    } else {
      setHighlightedSections([...highlightedSections, currentSection]);
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (!audioEnabled) {
      // Simulação de leitura de áudio
      console.log('Iniciando leitura de áudio...');
    }
  };

  if (showExercises && config.exercises) {
    return (
      <div className="size-full flex flex-col" style={{ background: '#F5F3FF' }}>
        <div className="px-5 pt-5 pb-4" style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}DD)` }}>
          <button
            onClick={() => setShowExercises(false)}
            className="flex items-center gap-2 mb-3"
            style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
          >
            <ChevronLeft size={20} /> Voltar à leitura
          </button>
          <h2 style={{ color: 'white' }}>Exercícios de Fixação ✏️</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem' }}>
            Teste seus conhecimentos!
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          {config.exercises.map((exercise, idx) => {
            const answered = exerciseAnswers[exercise.id] !== undefined;
            const isCorrect = exerciseAnswers[exercise.id] === exercise.correct;

            return (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-2xl p-5 mb-4 shadow-sm"
                style={{ background: 'white' }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: config.bgColor, color: config.color, fontWeight: 700 }}
                  >
                    {idx + 1}
                  </div>
                  <p style={{ color: '#1E1B4B', fontWeight: 600, flex: 1 }}>{exercise.question}</p>
                </div>

                <div className="space-y-2">
                  {exercise.options.map((option, optIdx) => {
                    const isSelected = exerciseAnswers[exercise.id] === optIdx;
                    const isCorrectOption = optIdx === exercise.correct;

                    return (
                      <motion.button
                        key={optIdx}
                        onClick={() => !answered && setExerciseAnswers({ ...exerciseAnswers, [exercise.id]: optIdx })}
                        disabled={answered}
                        whileHover={!answered && !reduceMotion ? { scale: 1.02, x: 4 } : {}}
                        whileTap={!answered && !reduceMotion ? { scale: 0.98 } : {}}
                        className="w-full rounded-xl p-3 text-left"
                        style={{
                          background: answered && isCorrectOption ? '#ECFDF5' : answered && isSelected ? '#FEF2F2' : '#F9FAFB',
                          border: `2px solid ${answered && isCorrectOption ? '#6EE7B7' : answered && isSelected ? '#FECACA' : '#E5E7EB'}`,
                          cursor: answered ? 'default' : 'pointer',
                          color: answered && isCorrectOption ? '#065F46' : answered && isSelected ? '#991B1B' : '#374151',
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {answered && (isCorrectOption || isSelected) && (
                            <CheckCircle size={16} color={isCorrectOption ? '#10B981' : '#EF4444'} />
                          )}
                          <span style={{ fontSize: '0.9rem' }}>{option}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}

          <motion.button
            onClick={() => navigate('aulas')}
            whileHover={reduceMotion ? {} : { scale: 1.02 }}
            whileTap={reduceMotion ? {} : { scale: 0.98 }}
            className="w-full rounded-xl py-3"
            style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}DD)`, color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}
          >
            Concluir Estudo 🎉
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col" style={{ background: '#F5F3FF' }}>
      <div className="px-5 pt-5 pb-4" style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}DD)` }}>
        <button
          onClick={() => navigate('aulas')}
          className="flex items-center gap-2 mb-3"
          style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
        >
          <ChevronLeft size={20} /> Voltar
        </button>

        <div className="flex items-center gap-3 mb-4">
          <Mascot mood="reading" size={56} reduceMotion={reduceMotion} />
          <div className="flex-1">
            <h2 style={{ color: 'white', marginBottom: 4 }}>{config.title}</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem' }}>{config.subject}</p>
          </div>
        </div>

        <div className="rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.3)', height: 6 }}>
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            style={{ background: 'white', height: '100%', borderRadius: 999 }}
          />
        </div>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.78rem' }}>
          Seção {currentSection + 1} de {config.sections.length}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: reduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: reduceMotion ? 0 : -20 }}
          transition={{ duration: 0.25 }}
          className="rounded-3xl p-6 shadow-sm"
          style={{
            background: highlightedSections.includes(currentSection) ? '#FFFBEB' : 'white',
            border: highlightedSections.includes(currentSection) ? '2px solid #FDE68A' : '2px solid transparent',
          }}
        >
          <h3 style={{ color: '#1E1B4B', marginBottom: 16 }}>{section.title}</h3>
          <p style={{ color: '#374151', lineHeight: 1.8, fontSize: '1.05rem' }}>{section.content}</p>
        </motion.div>

        <div className="mt-6 flex gap-3">
          <motion.button
            onClick={toggleHighlight}
            whileHover={reduceMotion ? {} : { scale: 1.05 }}
            whileTap={reduceMotion ? {} : { scale: 0.95 }}
            className="flex-1 rounded-xl py-3 flex items-center justify-center gap-2"
            style={{
              background: highlightedSections.includes(currentSection) ? '#FEF3C7' : '#F9FAFB',
              border: `2px solid ${highlightedSections.includes(currentSection) ? '#FDE68A' : '#E5E7EB'}`,
              color: highlightedSections.includes(currentSection) ? '#D97706' : '#6B7280',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            <Highlighter size={20} />
            {highlightedSections.includes(currentSection) ? 'Destacado' : 'Marcar'}
          </motion.button>

          <motion.button
            onClick={toggleAudio}
            whileHover={reduceMotion ? {} : { scale: 1.05 }}
            whileTap={reduceMotion ? {} : { scale: 0.95 }}
            className="flex-1 rounded-xl py-3 flex items-center justify-center gap-2"
            style={{
              background: audioEnabled ? config.bgColor : '#F9FAFB',
              border: `2px solid ${audioEnabled ? config.color : '#E5E7EB'}`,
              color: audioEnabled ? config.color : '#6B7280',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            <Volume2 size={20} />
            {audioEnabled ? 'Pausar' : 'Ouvir'}
          </motion.button>
        </div>
      </div>

      <div className="px-5 pb-6 pt-3 flex gap-3" style={{ background: 'white', borderTop: '1px solid #F3F4F6' }}>
        {currentSection > 0 && (
          <motion.button
            onClick={handlePrevious}
            whileHover={reduceMotion ? {} : { scale: 1.02 }}
            whileTap={reduceMotion ? {} : { scale: 0.98 }}
            className="rounded-xl py-3 px-4"
            style={{ background: '#F9FAFB', color: '#374151', border: '2px solid #E5E7EB', cursor: 'pointer', fontWeight: 700 }}
          >
            Anterior
          </motion.button>
        )}

        <motion.button
          onClick={handleNext}
          whileHover={reduceMotion ? {} : { scale: 1.02 }}
          whileTap={reduceMotion ? {} : { scale: 0.98 }}
          className="flex-1 rounded-xl py-3 flex items-center justify-center gap-2"
          style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}DD)`, color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}
        >
          {currentSection < config.sections.length - 1 ? 'Próxima' : config.exercises ? 'Fazer Exercícios' : 'Concluir'}
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </div>
  );
}

// Configurações dos materiais
export const STUDY_MATERIALS = {
  fracoes: {
    title: 'Apostila — Frações',
    subject: 'Matemática',
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    sections: [
      {
        id: 1,
        title: 'O que são frações?',
        content: 'Fração é uma forma de representar uma parte de um todo. Imagine uma pizza dividida em 8 fatias iguais. Se você comer 3 fatias, você comeu 3/8 (três oitavos) da pizza!',
      },
      {
        id: 2,
        title: 'Numerador e Denominador',
        content: 'Toda fração tem duas partes: o numerador (número de cima) indica quantas partes você tem. O denominador (número de baixo) indica em quantas partes o todo foi dividido.',
      },
      {
        id: 3,
        title: 'Frações Equivalentes',
        content: 'Frações diferentes podem representar a mesma quantidade! Por exemplo: 1/2 = 2/4 = 4/8. Isso acontece quando multiplicamos ou dividimos numerador e denominador pelo mesmo número.',
      },
    ],
    exercises: [
      {
        id: 1,
        question: 'Se uma pizza tem 8 fatias e você comeu 4, qual fração representa o que você comeu?',
        options: ['1/8', '4/8', '4/4', '8/4'],
        correct: 1,
      },
      {
        id: 2,
        question: 'Qual fração é equivalente a 1/2?',
        options: ['1/3', '2/4', '3/5', '1/4'],
        correct: 1,
      },
    ],
  },
  portugues: {
    title: 'Resumo — Português',
    subject: 'Língua Portuguesa',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    sections: [
      {
        id: 1,
        title: 'Substantivos',
        content: 'Substantivos são palavras que nomeiam seres, lugares, objetos, sentimentos e ideias. Exemplos: cachorro, escola, felicidade, Brasil.',
      },
      {
        id: 2,
        title: 'Adjetivos',
        content: 'Adjetivos são palavras que qualificam os substantivos, dando características a eles. Exemplos: cachorro grande, escola bonita, felicidade verdadeira.',
      },
      {
        id: 3,
        title: 'Verbos',
        content: 'Verbos são palavras que indicam ações, estados ou fenômenos da natureza. Exemplos: correr, estudar, ser, chover.',
      },
    ],
    exercises: [
      {
        id: 1,
        question: 'Qual palavra é um substantivo?',
        options: ['bonito', 'correr', 'casa', 'rapidamente'],
        correct: 2,
      },
      {
        id: 2,
        question: 'Em "O gato preto pulou", qual é o adjetivo?',
        options: ['gato', 'preto', 'pulou', 'o'],
        correct: 1,
      },
    ],
  },
  ciencias: {
    title: 'Exercícios — Ciências',
    subject: 'Ciências da Natureza',
    color: '#10B981',
    bgColor: '#D1FAE5',
    sections: [
      {
        id: 1,
        title: 'Fotossíntese',
        content: 'A fotossíntese é o processo pelo qual as plantas produzem seu próprio alimento. Elas usam luz solar, água e gás carbônico para criar glicose (açúcar) e liberar oxigênio.',
      },
      {
        id: 2,
        title: 'Importância da Fotossíntese',
        content: 'A fotossíntese é essencial para a vida na Terra! Ela produz o oxigênio que respiramos e é a base da cadeia alimentar, pois as plantas servem de alimento para muitos seres vivos.',
      },
      {
        id: 3,
        title: 'Componentes Necessários',
        content: 'Para fazer fotossíntese, as plantas precisam de: luz solar (energia), água (absorvida pelas raízes), gás carbônico (do ar) e clorofila (pigmento verde das folhas).',
      },
    ],
    exercises: [
      {
        id: 1,
        question: 'Qual gás as plantas liberam durante a fotossíntese?',
        options: ['Gás carbônico', 'Oxigênio', 'Nitrogênio', 'Hidrogênio'],
        correct: 1,
      },
      {
        id: 2,
        question: 'O que as plantas produzem através da fotossíntese?',
        options: ['Água', 'Glicose (açúcar)', 'Luz', 'Ar'],
        correct: 1,
      },
    ],
  },
};
