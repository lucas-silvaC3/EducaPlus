import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Onboarding } from './components/Onboarding';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { AulasScreen } from './components/AulasScreen';
import { GamesScreen } from './components/GamesScreen';
import { GamePlay } from './components/GamePlay';
import { WordSearchGame } from './components/WordSearchGame';
import { MemoryGame } from './components/MemoryGame';
import { QuizGame } from './components/QuizGame';
import { PlanetAdventureGame } from './components/PlanetAdventureGame';
import { GeoGame } from './components/GeoGame';
import { ProgressScreen } from './components/ProgressScreen';
import { ChatbotScreen } from './components/ChatbotScreen';
import { TeacherPanel } from './components/TeacherPanel';
import { HelpCenter } from './components/HelpCenter';
import { SettingsScreen } from './components/SettingsScreen';
import { SubjectScreen, SUBJECTS_CONFIG } from './components/SubjectScreen';
import { ImprovedLoginScreen } from './components/ImprovedLoginScreen';
import { AddActivityScreen } from './components/AddActivityScreen';
import { StudyMaterialScreen, STUDY_MATERIALS } from './components/StudyMaterialScreen';
import { PlatformerGame } from './components/PlatformerGame';

export type Screen =
  | 'login'
  | 'improvedLogin'
  | 'dashboard'
  | 'aulas'
  | 'ciencias'
  | 'portugues'
  | 'geografia'
  | 'artes'
  | 'educacaoFisica'
  | 'addActivity'
  | 'materialFracoes'
  | 'materialPortugues'
  | 'materialCiencias'
  | 'games'
  | 'gameplay'
  | 'wordsearch'
  | 'memory'
  | 'quiz'
  | 'planet'
  | 'geo'
  | 'platformer'
  | 'progress'
  | 'chatbot'
  | 'teacher'
  | 'help'
  | 'settings';

export interface UserSettings {
  reduceMotion: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  soundEffects: boolean;
  focusMode: boolean;
  darkMode: boolean;
}

export interface AppUser {
  name: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
  role: 'student' | 'teacher';
  settings: UserSettings;
}

export interface CommonProps {
  navigate: (to: Screen) => void;
  user: AppUser | null;
  reduceMotion: boolean;
  logout: () => void;
  updateSettings: (s: Partial<UserSettings>) => void;
}

const DEFAULT_STUDENT: AppUser = {
  name: 'Lucas',
  email: 'lucas.silva@email.com',
  xp: 1250,
  level: 7,
  streak: 5,
  role: 'student',
  settings: {
    reduceMotion: false,
    fontSize: 'normal',
    highContrast: false,
    soundEffects: true,
    focusMode: false,
    darkMode: false,
  },
};

const DEFAULT_TEACHER: AppUser = {
  name: 'Ana Souza',
  email: 'ana.souza@escola.com',
  xp: 0,
  level: 0,
  streak: 0,
  role: 'teacher',
  settings: {
    reduceMotion: false,
    fontSize: 'normal',
    highContrast: false,
    soundEffects: false,
    focusMode: false,
    darkMode: false,
  },
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [user, setUser] = useState<AppUser | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding && user && user.role === 'student') {
      setShowOnboarding(true);
    }
  }, [user]);

  const navigate = (to: Screen) => setScreen(to);

  const login = (asTeacher = false) => {
    setUser(asTeacher ? DEFAULT_TEACHER : DEFAULT_STUDENT);
    setScreen(asTeacher ? 'teacher' : 'dashboard');
  };

  const logout = () => {
    setUser(null);
    setScreen('login');
  };

  const updateSettings = (settings: Partial<UserSettings>) => {
    if (!user) return;
    setUser({ ...user, settings: { ...user.settings, ...settings } });
  };

  const handleOnboardingComplete = (darkMode: boolean) => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
    updateSettings({ darkMode });
  };

  const addXP = (amount: number) => {
    if (!user) return;
    const newXP = user.xp + amount;
    const newLevel = Math.floor(newXP / 500) + 1;
    setUser({ ...user, xp: newXP, level: newLevel });
  };

  const reduceMotion = user?.settings.reduceMotion ?? false;

  const commonProps: CommonProps = {
    navigate,
    user,
    reduceMotion,
    logout,
    updateSettings,
  };

  const pageVariants = {
    initial: { opacity: 0, y: reduceMotion ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduceMotion ? 0 : -16 },
  };

  const renderScreen = () => {
    switch (screen) {
      case 'login':
        return <LoginScreen {...commonProps} onLogin={login} />;
      case 'improvedLogin':
        return <ImprovedLoginScreen onLogin={login} reduceMotion={reduceMotion} />;
      case 'dashboard':
        return <Dashboard {...commonProps} addXP={addXP} />;
      case 'aulas':
        return <AulasScreen {...commonProps} />;
      case 'ciencias':
        return <SubjectScreen {...commonProps} config={SUBJECTS_CONFIG.ciencias} />;
      case 'portugues':
        return <SubjectScreen {...commonProps} config={SUBJECTS_CONFIG.portugues} />;
      case 'geografia':
        return <SubjectScreen {...commonProps} config={SUBJECTS_CONFIG.geografia} />;
      case 'artes':
        return <SubjectScreen {...commonProps} config={SUBJECTS_CONFIG.artes} />;
      case 'educacaoFisica':
        return <SubjectScreen {...commonProps} config={SUBJECTS_CONFIG.educacaoFisica} />;
      case 'addActivity':
        return <AddActivityScreen {...commonProps} />;
      case 'materialFracoes':
        return <StudyMaterialScreen {...commonProps} config={STUDY_MATERIALS.fracoes} />;
      case 'materialPortugues':
        return <StudyMaterialScreen {...commonProps} config={STUDY_MATERIALS.portugues} />;
      case 'materialCiencias':
        return <StudyMaterialScreen {...commonProps} config={STUDY_MATERIALS.ciencias} />;
      case 'games':
        return <GamesScreen {...commonProps} />;
      case 'gameplay':
        return <GamePlay {...commonProps} addXP={addXP} />;
      case 'wordsearch':
        return <WordSearchGame {...commonProps} addXP={addXP} />;
      case 'memory':
        return <MemoryGame {...commonProps} addXP={addXP} />;
      case 'quiz':
        return <QuizGame {...commonProps} addXP={addXP} />;
      case 'planet':
        return <PlanetAdventureGame {...commonProps} addXP={addXP} />;
      case 'geo':
        return <GeoGame {...commonProps} addXP={addXP} />;
      case 'platformer':
        return <PlatformerGame {...commonProps} addXP={addXP} />;
      case 'progress':
        return <ProgressScreen {...commonProps} />;
      case 'chatbot':
        return <ChatbotScreen {...commonProps} />;
      case 'teacher':
        return <TeacherPanel {...commonProps} />;
      case 'help':
        return <HelpCenter {...commonProps} />;
      case 'settings':
        return <SettingsScreen {...commonProps} />;
      default:
        return <Dashboard {...commonProps} addXP={addXP} />;
    }
  };

  return (
    <div
      className={`size-full overflow-hidden ${user?.settings.darkMode ? 'dark' : ''}`}
      style={{
        fontFamily: "'Nunito', sans-serif",
        background: user?.settings.darkMode ? '#1E1B4B' : '#F5F3FF',
        fontSize: user?.settings.fontSize === 'large' ? '18px' : user?.settings.fontSize === 'xlarge' ? '20px' : '16px',
        filter: user?.settings.highContrast ? 'contrast(1.2)' : undefined,
        transition: 'background 0.3s ease',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: reduceMotion ? 0.08 : 0.28, ease: 'easeOut' }}
          className="size-full"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {showOnboarding && (
        <Onboarding onComplete={handleOnboardingComplete} reduceMotion={reduceMotion} />
      )}
    </div>
  );
}
