import { motion } from 'motion/react';
import { Home, BookOpen, Gamepad2, BarChart2, User } from 'lucide-react';
import type { Screen } from '../App';

interface BottomNavProps {
  current: Screen;
  navigate: (to: Screen) => void;
  reduceMotion: boolean;
}

const NAV_ITEMS = [
  { id: 'dashboard' as Screen, label: 'Início', Icon: Home },
  { id: 'aulas' as Screen, label: 'Aulas', Icon: BookOpen },
  { id: 'games' as Screen, label: 'Jogos', Icon: Gamepad2 },
  { id: 'progress' as Screen, label: 'Desempenho', Icon: BarChart2 },
  { id: 'settings' as Screen, label: 'Perfil', Icon: User },
];

export function BottomNav({ current, navigate, reduceMotion }: BottomNavProps) {
  return (
    <nav
      className="flex items-center justify-around border-t"
      style={{
        background: 'white',
        borderColor: '#E5E7EB',
        padding: '8px 0 12px',
        position: 'relative',
        zIndex: 50,
      }}
      aria-label="Navegação principal"
      role="navigation"
    >
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const isActive = current === id || (id === 'settings' && current === 'settings');
        return (
          <button
            key={id}
            onClick={() => navigate(id)}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            className="flex flex-col items-center gap-0.5 min-w-[56px] relative"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
          >
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full"
                style={{ background: '#7C3AED' }}
                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <motion.div
              animate={isActive ? { scale: reduceMotion ? 1 : 1.1 } : { scale: 1 }}
              transition={{ duration: 0.15 }}
            >
              <Icon
                size={22}
                color={isActive ? '#7C3AED' : '#9CA3AF'}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </motion.div>
            <span
              style={{
                fontSize: '10px',
                color: isActive ? '#7C3AED' : '#9CA3AF',
                fontWeight: isActive ? 700 : 500,
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
