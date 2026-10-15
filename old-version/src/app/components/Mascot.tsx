import { motion } from 'motion/react';

type MascotMood = 'happy' | 'thinking' | 'celebrating' | 'reading' | 'waving';

interface MascotProps {
  mood?: MascotMood;
  size?: number;
  reduceMotion?: boolean;
  className?: string;
}

export function Mascot({ mood = 'happy', size = 80, reduceMotion = false, className = '' }: MascotProps) {
  const eyeVariants = {
    animate: reduceMotion
      ? {}
      : { scaleY: [1, 0.1, 1], transition: { duration: 3, repeat: Infinity, repeatDelay: 2 } },
  };

  const bodyVariants = {
    animate: reduceMotion
      ? {}
      : { y: [0, -4, 0], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } },
  };

  const celebrateVariants = {
    animate: reduceMotion
      ? {}
      : { rotate: [-8, 8, -8], transition: { duration: 0.5, repeat: Infinity } },
  };

  const mouthPath: Record<MascotMood, string> = {
    happy: 'M 38 64 Q 50 74 62 64',
    thinking: 'M 40 66 Q 50 66 60 66',
    celebrating: 'M 35 62 Q 50 76 65 62',
    reading: 'M 40 65 Q 50 68 60 65',
    waving: 'M 38 64 Q 50 74 62 64',
  };

  const isWaving = mood === 'waving';
  const isCelebrating = mood === 'celebrating';

  return (
    <motion.div
      className={className}
      variants={isCelebrating ? celebrateVariants : bodyVariants}
      animate="animate"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        {/* Shadow */}
        <ellipse cx="50" cy="96" rx="28" ry="5" fill="#4F46E5" opacity="0.15" />

        {/* Body */}
        <ellipse cx="50" cy="56" rx="36" ry="42" fill="#4F46E5" />
        <ellipse cx="50" cy="56" rx="36" ry="42" fill="url(#bodyGrad)" />

        {/* Belly patch */}
        <ellipse cx="50" cy="65" rx="20" ry="22" fill="#6366F1" opacity="0.4" />

        {/* Left ear/horn */}
        <ellipse cx="22" cy="25" rx="11" ry="16" fill="#5B21B6" transform="rotate(-15 22 25)" />
        <ellipse cx="22" cy="25" rx="6" ry="9" fill="#7C3AED" transform="rotate(-15 22 25)" />

        {/* Right ear/horn */}
        <ellipse cx="78" cy="25" rx="11" ry="16" fill="#5B21B6" transform="rotate(15 78 25)" />
        <ellipse cx="78" cy="25" rx="6" ry="9" fill="#7C3AED" transform="rotate(15 78 25)" />

        {/* Left eye white */}
        <circle cx="38" cy="48" r="10" fill="white" />
        {/* Right eye white */}
        <circle cx="62" cy="48" r="10" fill="white" />

        {/* Left pupil */}
        <motion.circle
          cx={mood === 'thinking' ? 36 : 39}
          cy={mood === 'thinking' ? 46 : 49}
          r="5"
          fill="#1E1B4B"
          variants={eyeVariants}
          animate="animate"
        />
        {/* Right pupil */}
        <motion.circle
          cx={mood === 'thinking' ? 64 : 63}
          cy={mood === 'thinking' ? 46 : 49}
          r="5"
          fill="#1E1B4B"
          variants={eyeVariants}
          animate="animate"
        />

        {/* Eye shine left */}
        <circle cx="42" cy="45" r="2" fill="white" />
        {/* Eye shine right */}
        <circle cx="66" cy="45" r="2" fill="white" />

        {/* Thinking eyebrow */}
        {mood === 'thinking' && (
          <>
            <path d="M 30 38 Q 38 34 46 38" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 54 38 Q 62 34 70 38" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Mouth */}
        <path
          d={mouthPath[mood]}
          stroke="white"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Cheek blush */}
        {(mood === 'happy' || mood === 'celebrating' || mood === 'waving') && (
          <>
            <circle cx="28" cy="58" r="7" fill="#EC4899" opacity="0.3" />
            <circle cx="72" cy="58" r="7" fill="#EC4899" opacity="0.3" />
          </>
        )}

        {/* Left arm */}
        <ellipse
          cx="16"
          cy="65"
          rx="10"
          ry="12"
          fill="#4F46E5"
          transform="rotate(20 16 65)"
        />

        {/* Right arm - waving if mood is waving */}
        {isWaving ? (
          <motion.ellipse
            cx="84"
            cy="55"
            rx="10"
            ry="12"
            fill="#4F46E5"
            transform="rotate(-40 84 55)"
            animate={reduceMotion ? {} : { rotate: [-40, -20, -40], transition: { duration: 0.6, repeat: Infinity } }}
            style={{ transformOrigin: '84px 65px' }}
          />
        ) : (
          <ellipse
            cx="84"
            cy="65"
            rx="10"
            ry="12"
            fill="#4F46E5"
            transform="rotate(-20 84 65)"
          />
        )}

        {/* Stars for celebrating */}
        {isCelebrating && (
          <>
            <text x="5" y="30" fontSize="14" fill="#F59E0B">⭐</text>
            <text x="75" y="25" fontSize="14" fill="#F59E0B">⭐</text>
          </>
        )}

        {/* Reading book */}
        {mood === 'reading' && (
          <rect x="30" y="75" width="40" height="24" rx="3" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
        )}

        <defs>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
