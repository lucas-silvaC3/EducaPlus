import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, User, ArrowRight, Sparkles } from 'lucide-react';
import { Mascot } from './Mascot';

interface ImprovedLoginScreenProps {
  onLogin: (asTeacher?: boolean) => void;
  reduceMotion: boolean;
}

type Mode = 'login' | 'signup' | 'forgot';

export function ImprovedLoginScreen({ onLogin, reduceMotion }: ImprovedLoginScreenProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setCapsLockOn(e.getModifierState('CapsLock'));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyDown);
    };
  }, []);

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Email inválido');
    } else {
      setEmailError('');
    }
  };

  const getPasswordStrength = (pwd: string): { strength: number; label: string; color: string } => {
    if (!pwd) return { strength: 0, label: '', color: '#E5E7EB' };

    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

    if (strength <= 1) return { strength: 25, label: 'Fraca', color: '#EF4444' };
    if (strength === 2) return { strength: 50, label: 'Média', color: '#F59E0B' };
    if (strength === 3) return { strength: 75, label: 'Boa', color: '#3B82F6' };
    return { strength: 100, label: 'Excelente', color: '#10B981' };
  };

  const passwordStrength = mode === 'signup' ? getPasswordStrength(password) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'forgot') {
      setResetSent(true);
      setTimeout(() => {
        setResetSent(false);
        setMode('login');
      }, 3000);
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }

    onLogin(false);
  };

  if (resetSent) {
    return (
      <div className="size-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EDE9FE, #F5F3FF)' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-3xl p-8 max-w-md mx-4 text-center"
          style={{ background: 'white', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
        >
          <motion.div
            animate={reduceMotion ? {} : { scale: [1, 1.1, 1], transition: { duration: 1, repeat: Infinity } }}
          >
            <CheckCircle size={64} color="#10B981" className="mx-auto mb-4" />
          </motion.div>
          <h2 style={{ color: '#1E1B4B', marginBottom: 12 }}>Email Enviado! 📧</h2>
          <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
            Enviamos um link de recuperação para seu email. Verifique sua caixa de entrada!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="size-full flex items-center justify-center overflow-auto" style={{ background: 'linear-gradient(135deg, #EDE9FE, #F5F3FF)' }}>
      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-4 my-8"
      >
        <div className="rounded-3xl p-8" style={{ background: 'white', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
          <div className="text-center mb-8">
            <motion.div
              animate={reduceMotion ? {} : { y: [0, -8, 0], transition: { duration: 2, repeat: Infinity } }}
              className="mx-auto mb-4"
            >
              <Mascot mood="waving" size={80} reduceMotion={reduceMotion} />
            </motion.div>

            <h1 style={{ color: '#1E1B4B', marginBottom: 8 }}>
              {mode === 'login' ? 'Bem-vindo de volta! 👋' : mode === 'signup' ? 'Criar conta 🎉' : 'Recuperar senha 🔑'}
            </h1>
            <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>
              {mode === 'login'
                ? 'Entre e continue sua jornada de aprendizado!'
                : mode === 'signup'
                ? 'Comece sua aventura educacional agora!'
                : 'Não se preocupe, vamos te ajudar!'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label style={{ color: '#374151', fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: 8 }}>
                  Nome completo
                </label>
                <div className="relative">
                  <User size={20} color="#9CA3AF" className="absolute left-4 top-1/2 -translate-y-1/2" />
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    required
                    className="w-full rounded-xl py-3 pl-12 pr-4"
                    style={{
                      border: '2px solid #E5E7EB',
                      fontSize: '1rem',
                      transition: 'all 0.2s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#7C3AED')}
                    onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ color: '#374151', fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: 8 }}>
                Email
              </label>
              <div className="relative">
                <Mail size={20} color="#9CA3AF" className="absolute left-4 top-1/2 -translate-y-1/2" />
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  placeholder="seu@email.com"
                  required
                  className="w-full rounded-xl py-3 pl-12 pr-4"
                  style={{
                    border: `2px solid ${emailError ? '#EF4444' : '#E5E7EB'}`,
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = emailError ? '#EF4444' : '#7C3AED')}
                  onBlur={(e) => (e.target.style.borderColor = emailError ? '#EF4444' : '#E5E7EB')}
                />
                {emailError && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1 mt-2"
                  >
                    <AlertCircle size={14} color="#EF4444" />
                    <span style={{ color: '#EF4444', fontSize: '0.8rem' }}>{emailError}</span>
                  </motion.div>
                )}
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <label style={{ color: '#374151', fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: 8 }}>
                  Senha
                </label>
                <div className="relative">
                  <Lock size={20} color="#9CA3AF" className="absolute left-4 top-1/2 -translate-y-1/2" />
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl py-3 pl-12 pr-12"
                    style={{
                      border: '2px solid #E5E7EB',
                      fontSize: '1rem',
                      transition: 'all 0.2s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#7C3AED')}
                    onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                  </button>
                </div>

                <AnimatePresence>
                  {capsLockOn && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-1 mt-2"
                    >
                      <AlertCircle size={14} color="#F59E0B" />
                      <span style={{ color: '#F59E0B', fontSize: '0.8rem' }}>Caps Lock está ativado</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {mode === 'signup' && passwordStrength && password && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3">
                    <div className="flex justify-between mb-1">
                      <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>Força da senha:</span>
                      <span style={{ color: passwordStrength.color, fontSize: '0.8rem', fontWeight: 700 }}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: '#E5E7EB' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${passwordStrength.strength}%` }}
                        transition={{ duration: 0.3 }}
                        style={{ height: '100%', background: passwordStrength.color }}
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label style={{ color: '#374151', fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: 8 }}>
                  Confirmar senha
                </label>
                <div className="relative">
                  <Lock size={20} color="#9CA3AF" className="absolute left-4 top-1/2 -translate-y-1/2" />
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl py-3 pl-12 pr-4"
                    style={{
                      border: `2px solid ${passwordError ? '#EF4444' : '#E5E7EB'}`,
                      fontSize: '1rem',
                      transition: 'all 0.2s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = passwordError ? '#EF4444' : '#7C3AED')}
                    onBlur={(e) => (e.target.style.borderColor = passwordError ? '#EF4444' : '#E5E7EB')}
                  />
                </div>
                {passwordError && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1 mt-2"
                  >
                    <AlertCircle size={14} color="#EF4444" />
                    <span style={{ color: '#EF4444', fontSize: '0.8rem' }}>{passwordError}</span>
                  </motion.div>
                )}
              </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  style={{ background: 'none', border: 'none', color: '#7C3AED', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}

            <motion.button
              whileHover={reduceMotion ? {} : { scale: 1.02 }}
              whileTap={reduceMotion ? {} : { scale: 0.98 }}
              type="submit"
              className="w-full rounded-xl py-3 flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              {mode === 'login' ? 'Entrar' : mode === 'signup' ? 'Criar conta' : 'Enviar link'}
              <ArrowRight size={20} />
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: '#6B7280', fontSize: '0.85rem' }}>
              {mode === 'login' ? 'Não tem uma conta?' : mode === 'signup' ? 'Já tem uma conta?' : 'Lembrou a senha?'}{' '}
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#7C3AED',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {mode === 'login' ? 'Criar conta' : mode === 'signup' ? 'Fazer login' : 'Voltar ao login'}
              </button>
            </p>
          </div>

          {mode !== 'forgot' && (
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-4">
                <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
                <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>ou</span>
                <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
              </div>

              <button
                type="button"
                onClick={() => onLogin(false)}
                className="w-full rounded-xl py-3 flex items-center justify-center gap-2"
                style={{
                  background: 'white',
                  border: '2px solid #E5E7EB',
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                <Sparkles size={20} color="#7C3AED" />
                Continuar como visitante
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
