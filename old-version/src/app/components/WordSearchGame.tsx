import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Zap, ChevronRight, Trophy, HelpCircle, Sparkles } from 'lucide-react';
import { Mascot } from './Mascot';
import type { CommonProps } from '../App';

interface WordSearchGameProps extends CommonProps {
  addXP: (amount: number) => void;
}

const GRID_SIZE = 10;

const WORDS = [
  { word: 'MATEMÁTICA', hint: 'Ciência dos números' },
  { word: 'CIÊNCIAS', hint: 'Estudo da natureza' },
  { word: 'HISTÓRIA', hint: 'Estudo do passado' },
  { word: 'GEOGRAFIA', hint: 'Estudo do planeta' },
  { word: 'PORTUGUÊS', hint: 'Nossa língua' },
];

type Direction = 'horizontal' | 'vertical' | 'diagonal';

interface PlacedWord {
  word: string;
  row: number;
  col: number;
  direction: Direction;
  cells: Array<{ row: number; col: number }>;
}

function generateGrid(): { grid: string[][]; placedWords: PlacedWord[] } {
  const grid: string[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
  const placedWords: PlacedWord[] = [];

  const canPlaceWord = (word: string, row: number, col: number, direction: Direction): boolean => {
    const cells: Array<{ row: number; col: number }> = [];

    for (let i = 0; i < word.length; i++) {
      let r = row;
      let c = col;

      if (direction === 'horizontal') c += i;
      else if (direction === 'vertical') r += i;
      else { r += i; c += i; }

      if (r >= GRID_SIZE || c >= GRID_SIZE) return false;
      if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false;

      cells.push({ row: r, col: c });
    }

    return cells.length === word.length;
  };

  const placeWord = (word: string, row: number, col: number, direction: Direction) => {
    const cells: Array<{ row: number; col: number }> = [];

    for (let i = 0; i < word.length; i++) {
      let r = row;
      let c = col;

      if (direction === 'horizontal') c += i;
      else if (direction === 'vertical') r += i;
      else { r += i; c += i; }

      grid[r][c] = word[i];
      cells.push({ row: r, col: c });
    }

    placedWords.push({ word, row, col, direction, cells });
  };

  WORDS.forEach(({ word }) => {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      const direction: Direction = ['horizontal', 'vertical', 'diagonal'][Math.floor(Math.random() * 3)] as Direction;
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);

      if (canPlaceWord(word, row, col, direction)) {
        placeWord(word, row, col, direction);
        placed = true;
      }
      attempts++;
    }
  });

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }

  return { grid, placedWords };
}

export function WordSearchGame({ navigate, user, reduceMotion, addXP }: WordSearchGameProps) {
  const [{ grid, placedWords }] = useState(() => generateGrid());
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selecting, setSelecting] = useState(false);
  const [selectedCells, setSelectedCells] = useState<Array<{ row: number; col: number }>>([]);
  const [highlightedCells, setHighlightedCells] = useState<Set<string>>(new Set());
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  const cellKey = (row: number, col: number) => `${row},${col}`;

  const handleMouseDown = (row: number, col: number) => {
    setSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!selecting) return;

    const last = selectedCells[selectedCells.length - 1];
    if (!last) return;

    if (last.row === row || last.col === col || Math.abs(last.row - row) === Math.abs(last.col - col)) {
      setSelectedCells([selectedCells[0], { row, col }]);
    }
  };

  const handleMouseUp = useCallback(() => {
    if (!selecting || selectedCells.length < 2) {
      setSelecting(false);
      setSelectedCells([]);
      return;
    }

    const getCellsInSelection = () => {
      const [start, end] = selectedCells;
      const cells: Array<{ row: number; col: number }> = [];

      const rowDir = end.row > start.row ? 1 : end.row < start.row ? -1 : 0;
      const colDir = end.col > start.col ? 1 : end.col < start.col ? -1 : 0;

      let r = start.row;
      let c = start.col;

      while (true) {
        cells.push({ row: r, col: c });
        if (r === end.row && c === end.col) break;
        r += rowDir;
        c += colDir;
      }

      return cells;
    };

    const cells = getCellsInSelection();
    const selectedWord = cells.map(({ row, col }) => grid[row][col]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');

    const found = placedWords.find((pw) =>
      (pw.word === selectedWord || pw.word === reversedWord) && !foundWords.includes(pw.word)
    );

    if (found) {
      setFoundWords([...foundWords, found.word]);
      setScore((s) => s + found.word.length * 10);

      const newHighlighted = new Set(highlightedCells);
      cells.forEach(({ row, col }) => newHighlighted.add(cellKey(row, col)));
      setHighlightedCells(newHighlighted);

      if (foundWords.length + 1 === WORDS.length) {
        const totalXP = (foundWords.length + 1) * 50;
        addXP(totalXP);
        setFinished(true);
      }
    }

    setSelecting(false);
    setSelectedCells([]);
  }, [selecting, selectedCells, grid, placedWords, foundWords, highlightedCells, addXP]);

  const isCellSelected = (row: number, col: number) => {
    if (selectedCells.length < 2) return selectedCells.some((c) => c.row === row && c.col === col);

    const [start, end] = selectedCells;
    const rowDir = end.row > start.row ? 1 : end.row < start.row ? -1 : 0;
    const colDir = end.col > start.col ? 1 : end.col < start.col ? -1 : 0;

    let r = start.row;
    let c = start.col;

    while (true) {
      if (r === row && c === col) return true;
      if (r === end.row && c === end.col) break;
      r += rowDir;
      c += colDir;
    }

    return false;
  };

  const progress = (foundWords.length / WORDS.length) * 100;

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="size-full flex flex-col items-center justify-center p-6"
        style={{ background: 'linear-gradient(160deg, #DBEAFE, #F5F3FF)' }}
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
          <h2 style={{ color: '#1E1B4B', marginBottom: 4 }}>🎉 Parabéns!</h2>
          <p style={{ color: '#6B7280', marginBottom: 24 }}>Você encontrou todas as palavras!</p>

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
                  {foundWords.length}/{WORDS.length}
                </p>
                <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>Palavras</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={() => navigate('games')}
              whileHover={reduceMotion ? {} : { scale: 1.02 }}
              whileTap={reduceMotion ? {} : { scale: 0.97 }}
              className="flex-1 rounded-xl py-3"
              style={{ background: '#DBEAFE', color: '#3B82F6', border: 'none', cursor: 'pointer', fontWeight: 700 }}
            >
              Outros jogos
            </motion.button>
            <motion.button
              onClick={() => window.location.reload()}
              whileHover={reduceMotion ? {} : { scale: 1.02 }}
              whileTap={reduceMotion ? {} : { scale: 0.97 }}
              className="flex-1 rounded-xl py-3 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #4F46E5)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}
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
        style={{ background: 'linear-gradient(135deg, #3B82F6, #4F46E5)' }}
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
            <h3 style={{ color: 'white', textAlign: 'center' }}>📝 Caça-Palavras</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', textAlign: 'center' }}>
              {foundWords.length}/{WORDS.length} encontradas
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-full px-3 py-1" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <Zap size={14} color="#FCD34D" fill="#FCD34D" />
            <span style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>{score}</span>
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
        <div className="rounded-2xl p-4 mb-4 shadow-sm" style={{ background: 'white' }}>
          <div className="flex items-start gap-3 mb-3">
            <Mascot mood="reading" size={48} reduceMotion={reduceMotion} />
            <div className="flex-1">
              <p style={{ color: '#1E1B4B', fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>
                Encontre as palavras!
              </p>
              <p style={{ color: '#6B7280', fontSize: '0.78rem' }}>
                Arraste o dedo sobre as letras para selecionar as palavras escondidas.
              </p>
            </div>
          </div>

          {!reduceMotion && (
            <motion.button
              onClick={() => setShowHint(!showHint)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full rounded-xl py-2 flex items-center justify-center gap-2"
              style={{ background: '#FFFBEB', color: '#D97706', border: '2px solid #FDE68A', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
            >
              <HelpCircle size={16} />
              {showHint ? 'Ocultar dicas' : 'Ver dicas'}
            </motion.button>
          )}
        </div>

        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-2xl p-4 mb-4 shadow-sm"
              style={{ background: '#FFFBEB', border: '2px solid #FDE68A' }}
            >
              <p style={{ color: '#92400E', fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}>💡 Dicas:</p>
              {WORDS.map(({ word, hint }) => (
                <p
                  key={word}
                  style={{
                    color: foundWords.includes(word) ? '#9CA3AF' : '#92400E',
                    fontSize: '0.78rem',
                    marginBottom: 4,
                    textDecoration: foundWords.includes(word) ? 'line-through' : 'none',
                  }}
                >
                  {hint}
                </p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className="inline-grid gap-1 p-4 rounded-2xl shadow-lg mx-auto"
          style={{ background: 'white', gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, touchAction: 'none' }}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {grid.map((row, r) =>
            row.map((letter, c) => {
              const key = cellKey(r, c);
              const isHighlighted = highlightedCells.has(key);
              const isSelected = isCellSelected(r, c);

              return (
                <motion.div
                  key={key}
                  onMouseDown={() => handleMouseDown(r, c)}
                  onMouseEnter={() => handleMouseEnter(r, c)}
                  className="flex items-center justify-center rounded-lg cursor-pointer select-none"
                  style={{
                    width: 28,
                    height: 28,
                    background: isHighlighted
                      ? '#6EE7B7'
                      : isSelected
                      ? '#FCD34D'
                      : '#F9FAFB',
                    color: isHighlighted || isSelected ? '#1E1B4B' : '#374151',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    border: `2px solid ${isHighlighted ? '#10B981' : isSelected ? '#F59E0B' : '#E5E7EB'}`,
                    transition: 'all 0.15s',
                  }}
                  whileHover={reduceMotion ? {} : { scale: 1.1 }}
                  animate={isHighlighted && !reduceMotion ? { scale: [1, 1.15, 1] } : {}}
                >
                  {letter}
                </motion.div>
              );
            })
          )}
        </div>

        <div className="mt-4">
          <p style={{ color: '#374151', fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}>Palavras para encontrar:</p>
          <div className="flex flex-wrap gap-2">
            {WORDS.map(({ word }) => {
              const found = foundWords.includes(word);
              return (
                <motion.div
                  key={word}
                  animate={found && !reduceMotion ? { scale: [1, 1.1, 1] } : {}}
                  className="rounded-xl px-3 py-2 flex items-center gap-2"
                  style={{
                    background: found ? '#ECFDF5' : 'white',
                    border: `2px solid ${found ? '#6EE7B7' : '#E5E7EB'}`,
                    color: found ? '#047857' : '#6B7280',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                  }}
                >
                  {found && <Sparkles size={14} color="#10B981" />}
                  {word}
                </motion.div>
              );
            })}
          </div>
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
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#DBEAFE' }}>
                  <Trophy size={28} color="#3B82F6" />
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
