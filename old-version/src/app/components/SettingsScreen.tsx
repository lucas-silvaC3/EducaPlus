import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, ChevronRight, User, Bell, Shield, Palette,
  Accessibility, Volume2, Moon, LogOut, HelpCircle, Trash2,
} from 'lucide-react';
import { Mascot } from './Mascot';
import { ConfirmDialog } from './ConfirmDialog';
import { BottomNav } from './BottomNav';
import type { CommonProps, UserSettings } from '../App';

interface SettingsScreenProps extends CommonProps {
  // updateSettings is in CommonProps
}

type Section = null | 'account' | 'accessibility' | 'notifications' | 'appearance' | 'privacy';

export function SettingsScreen({ navigate, user, logout, updateSettings, reduceMotion }: SettingsScreenProps) {
  const [section, setSection] = useState<Section>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const settings = user?.settings!;

  const toggle = (key: keyof UserSettings) => {
    updateSettings({ [key]: !settings[key] });
    showSaved();
  };

  const setFontSize = (fs: 'normal' | 'large' | 'xlarge') => {
    updateSettings({ fontSize: fs });
    showSaved();
  };

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const MENU_SECTIONS = [
    { id: 'account' as Section, icon: <User size={20} color="#7C3AED" />, label: 'Minha conta', desc: user?.email, bg: '#EDE9FE' },
    { id: 'accessibility' as Section, icon: <Accessibility size={20} color="#10B981" />, label: 'Acessibilidade', desc: 'Animações, tamanho, contraste', bg: '#D1FAE5' },
    { id: 'notifications' as Section, icon: <Bell size={20} color="#F59E0B" />, label: 'Notificações', desc: 'Lembretes e alertas', bg: '#FEF3C7' },
    { id: 'appearance' as Section, icon: <Palette size={20} color="#3B82F6" />, label: 'Aparência', desc: 'Tema e cores', bg: '#DBEAFE' },
    { id: 'privacy' as Section, icon: <Shield size={20} color="#EC4899" />, label: 'Privacidade', desc: 'Dados e segurança', bg: '#FCE7F3' },
  ];

  if (section === 'accessibility') {
    return (
      <div className="size-full flex flex-col" style={{ background: '#F5F3FF' }}>
        <div
          className="px-5 pt-5 pb-5"
          style={{ background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: '0 0 24px 24px' }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSection(null)}
              style={{ color: 'white', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h2 style={{ color: 'white' }}>Acessibilidade</h2>
              <p style={{ color: '#A7F3D0', fontSize: '0.8rem' }}>Personalize sua experiência</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Reduce motion (autism-friendly) */}
          <div className="rounded-2xl p-5 shadow-sm" style={{ background: 'white' }}>
            <p style={{ color: '#374151', fontWeight: 700, marginBottom: 4 }}>♿ Reduzir animações</p>
            <p style={{ color: '#9CA3AF', fontSize: '0.82rem', marginBottom: 12 }}>
              Desativa movimentos e transições. Recomendado para pessoas sensíveis a animações ou com autismo.
            </p>
            <div className="flex items-center justify-between">
              <span style={{ color: '#374151', fontSize: '0.9rem' }}>
                {settings.reduceMotion ? '✅ Ativado' : '⭕ Desativado'}
              </span>
              <button
                onClick={() => toggle('reduceMotion')}
                className="relative rounded-full transition-all"
                style={{
                  width: 52,
                  height: 28,
                  background: settings.reduceMotion ? '#10B981' : '#D1D5DB',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
                aria-checked={settings.reduceMotion}
                role="switch"
                aria-label="Reduzir animações"
              >
                <motion.div
                  animate={{ x: settings.reduceMotion ? 26 : 2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  style={{ position: 'absolute', top: 3, width: 22, height: 22, borderRadius: '50%', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
                />
              </button>
            </div>
          </div>

          {/* Font size */}
          <div className="rounded-2xl p-5 shadow-sm" style={{ background: 'white' }}>
            <p style={{ color: '#374151', fontWeight: 700, marginBottom: 4 }}>Tamanho da fonte</p>
            <p style={{ color: '#9CA3AF', fontSize: '0.82rem', marginBottom: 12 }}>
              Textos maiores facilitam a leitura para crianças e usuários com baixa visão.
            </p>
            <div className="flex gap-2">
              {(['normal', 'large', 'xlarge'] as const).map((size) => {
                const labels = { normal: 'Normal', large: 'Grande', xlarge: 'Extra grande' };
                return (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className="flex-1 rounded-xl py-2.5"
                    style={{
                      background: settings.fontSize === size ? '#10B981' : '#F3F4F6',
                      color: settings.fontSize === size ? 'white' : '#374151',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: size === 'xlarge' ? '0.72rem' : '0.8rem',
                    }}
                    aria-pressed={settings.fontSize === size}
                  >
                    {labels[size]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* High contrast */}
          <div className="rounded-2xl p-5 shadow-sm" style={{ background: 'white' }}>
            <p style={{ color: '#374151', fontWeight: 700, marginBottom: 4 }}>Alto contraste</p>
            <p style={{ color: '#9CA3AF', fontSize: '0.82rem', marginBottom: 12 }}>
              Aumenta o contraste entre texto e fundo para melhor legibilidade.
            </p>
            <div className="flex items-center justify-between">
              <span style={{ color: '#374151', fontSize: '0.9rem' }}>
                {settings.highContrast ? '✅ Ativado' : '⭕ Desativado'}
              </span>
              <button
                onClick={() => toggle('highContrast')}
                className="relative rounded-full transition-all"
                style={{ width: 52, height: 28, background: settings.highContrast ? '#10B981' : '#D1D5DB', border: 'none', cursor: 'pointer', padding: 0 }}
                aria-checked={settings.highContrast}
                role="switch"
                aria-label="Alto contraste"
              >
                <motion.div
                  animate={{ x: settings.highContrast ? 26 : 2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  style={{ position: 'absolute', top: 3, width: 22, height: 22, borderRadius: '50%', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
                />
              </button>
            </div>
          </div>

          {/* Sound effects */}
          <div className="rounded-2xl p-5 shadow-sm" style={{ background: 'white' }}>
            <div className="flex items-center gap-3 mb-4">
              <Volume2 size={20} color="#10B981" />
              <p style={{ color: '#374151', fontWeight: 700 }}>Efeitos sonoros</p>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: '#374151', fontSize: '0.9rem' }}>Sons de feedback e gamificação</span>
              <button
                onClick={() => toggle('soundEffects')}
                className="relative rounded-full"
                style={{ width: 52, height: 28, background: settings.soundEffects ? '#10B981' : '#D1D5DB', border: 'none', cursor: 'pointer', padding: 0 }}
                aria-checked={settings.soundEffects}
                role="switch"
              >
                <motion.div
                  animate={{ x: settings.soundEffects ? 26 : 2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  style={{ position: 'absolute', top: 3, width: 22, height: 22, borderRadius: '50%', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
                />
              </button>
            </div>
          </div>

          {/* Focus mode */}
          <div className="rounded-2xl p-5 shadow-sm" style={{ background: 'white' }}>
            <p style={{ color: '#374151', fontWeight: 700, marginBottom: 4 }}>🎯 Modo foco</p>
            <p style={{ color: '#9CA3AF', fontSize: '0.82rem', marginBottom: 12 }}>
              Exibe apenas o conteúdo essencial, removendo distrações. Ideal para iniciantes.
            </p>
            <div className="flex items-center justify-between">
              <span style={{ color: '#374151', fontSize: '0.9rem' }}>
                {settings.focusMode ? '✅ Ativado' : '⭕ Desativado'}
              </span>
              <button
                onClick={() => toggle('focusMode')}
                className="relative rounded-full"
                style={{ width: 52, height: 28, background: settings.focusMode ? '#10B981' : '#D1D5DB', border: 'none', cursor: 'pointer', padding: 0 }}
                aria-checked={settings.focusMode}
                role="switch"
              >
                <motion.div
                  animate={{ x: settings.focusMode ? 26 : 2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  style={{ position: 'absolute', top: 3, width: 22, height: 22, borderRadius: '50%', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
                />
              </button>
            </div>
          </div>

          {/* Save indicator */}
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 rounded-full px-5 py-2.5 shadow-xl flex items-center gap-2"
                style={{ background: '#10B981', color: 'white', zIndex: 100 }}
                role="status"
                aria-live="polite"
              >
                ✅ Preferências salvas automaticamente
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <BottomNav current="settings" navigate={navigate} reduceMotion={reduceMotion} />
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col" style={{ background: '#F5F3FF' }}>
      {/* Header */}
      <div
        className="px-5 pt-5 pb-5"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', borderRadius: '0 0 24px 24px' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('dashboard')}
            style={{ color: 'white', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            aria-label="Voltar"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 style={{ color: 'white' }}>Perfil e Configurações</h2>
        </div>

        {/* Profile card (H#6 - recognition) */}
        <div className="flex items-center gap-4 rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', position: 'relative' }}>
            🧒
          </div>
          <div className="flex-1">
            <p style={{ color: 'white', fontWeight: 800, fontSize: '1rem' }}>{user?.name}</p>
            <p style={{ color: '#C4B5FD', fontSize: '0.8rem' }}>{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span style={{ color: '#FCD34D', fontSize: '0.75rem', fontWeight: 700 }}>⭐ Nível {user?.level}</span>
              <span style={{ color: '#C4B5FD', fontSize: '0.72rem' }}>•</span>
              <span style={{ color: '#C4B5FD', fontSize: '0.75rem' }}>{user?.xp} XP</span>
            </div>
          </div>
          <Mascot mood="happy" size={44} reduceMotion={reduceMotion} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {/* Settings sections */}
        {MENU_SECTIONS.map(({ id, icon, label, desc, bg }, i) => (
          <motion.button
            key={id}
            onClick={() => setSection(id)}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.06 }}
            whileHover={reduceMotion ? {} : { x: 4 }}
            whileTap={reduceMotion ? {} : { scale: 0.98 }}
            className="w-full flex items-center gap-4 rounded-2xl px-4 py-4 shadow-sm text-left"
            style={{ background: 'white', border: 'none', cursor: 'pointer' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
              {icon}
            </div>
            <div className="flex-1">
              <p style={{ color: '#1E1B4B', fontWeight: 700, fontSize: '0.92rem' }}>{label}</p>
              {desc && <p style={{ color: '#9CA3AF', fontSize: '0.78rem', marginTop: 2 }}>{desc}</p>}
            </div>
            <ChevronRight size={18} color="#D1D5DB" />
          </motion.button>
        ))}

        {/* Other actions */}
        <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: 'white' }}>
          <button
            onClick={() => navigate('help')}
            className="w-full flex items-center gap-4 px-4 py-4 text-left"
            style={{ background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #F3F4F6' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EDE9FE' }}>
              <HelpCircle size={20} color="#7C3AED" />
            </div>
            <div className="flex-1">
              <p style={{ color: '#1E1B4B', fontWeight: 700, fontSize: '0.92rem' }}>Central de ajuda</p>
            </div>
            <ChevronRight size={18} color="#D1D5DB" />
          </button>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-4 px-4 py-4 text-left"
            style={{ background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #F3F4F6' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FEF3C7' }}>
              <LogOut size={20} color="#D97706" />
            </div>
            <div className="flex-1">
              <p style={{ color: '#D97706', fontWeight: 700, fontSize: '0.92rem' }}>Sair da conta</p>
            </div>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center gap-4 px-4 py-4 text-left"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FEE2E2' }}>
              <Trash2 size={20} color="#EF4444" />
            </div>
            <div className="flex-1">
              <p style={{ color: '#EF4444', fontWeight: 700, fontSize: '0.92rem' }}>Excluir conta</p>
              <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>Esta ação não pode ser desfeita</p>
            </div>
          </button>
        </div>

        <p className="text-center" style={{ color: '#C4B5FD', fontSize: '0.75rem', paddingBottom: 8 }}>
          Estuda+ v1.0.0 • 🔒 Seus dados estão protegidos
        </p>
      </div>

      {/* Confirm dialogs (H#5 - error prevention) */}
      <ConfirmDialog
        open={showLogoutConfirm}
        title="Sair da conta?"
        description="Você terá que fazer login novamente para continuar estudando."
        confirmLabel="Sair"
        cancelLabel="Cancelar"
        onConfirm={logout}
        onCancel={() => setShowLogoutConfirm(false)}
        reduceMotion={reduceMotion}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Excluir conta?"
        description="Essa ação não pode ser desfeita. Tem certeza que deseja excluir sua conta? Todo o seu progresso será perdido."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={() => { setShowDeleteConfirm(false); logout(); }}
        onCancel={() => setShowDeleteConfirm(false)}
        destructive
        reduceMotion={reduceMotion}
      />

      <BottomNav current="settings" navigate={navigate} reduceMotion={reduceMotion} />
    </div>
  );
}
