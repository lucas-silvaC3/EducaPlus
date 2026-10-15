import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { Mascot } from './Mascot';
import { ConfirmDialog } from './ConfirmDialog';
import type { CommonProps } from '../App';

interface LoginScreenProps extends CommonProps {
  onLogin: (asTeacher?: boolean) => void;
}

function validateEmail(email: string): string {
  if (!email) return 'O e-mail é obrigatório';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Formato de e-mail inválido';
  return '';
}

function validatePassword(pw: string): string {
  if (!pw) return 'A senha é obrigatória';
  if (pw.length < 6) return 'A senha deve ter pelo menos 6 caracteres';
  return '';
}

export function LoginScreen({ onLogin, reduceMotion }: LoginScreenProps) {
  const [email, setEmail] = useState('lucas.silva@email.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [capsLock, setCapsLock] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => setCapsLock(e.getModifierState('CapsLock'));
    window.addEventListener('keydown', handler);
    window.addEventListener('keyup', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('keyup', handler);
    };
  }, []);

  const handleEmailChange = (v: string) => {
    setEmail(v);
    if (attempted) setEmailError(validateEmail(v));
    setLoginError('');
  };

  const handlePasswordChange = (v: string) => {
    setPassword(v);
    if (attempted) setPasswordError(validatePassword(v));
    setLoginError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (eErr || pErr) return;

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);

    if (password !== '123456') {
      setLoginError('E-mail ou senha incorretos. Verifique suas informações e tente novamente.');
      return;
    }
    onLogin(false);
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === 'google' || provider === 'apple' || provider === 'microsoft') {
      onLogin(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email || validateEmail(email)) {
      setShowResetConfirm(true);
    } else {
      setShowResetConfirm(true);
    }
  };

  const handleResetConfirm = () => {
    setShowResetConfirm(false);
    setResetSent(true);
    setTimeout(() => setResetSent(false), 5000);
  };

  const shakeVariants = {
    shake: reduceMotion
      ? { x: 0 }
      : { x: [0, -8, 8, -6, 6, -4, 4, 0], transition: { duration: 0.5 } },
  };

  return (
    <div
      className="size-full flex flex-col items-center justify-center overflow-y-auto"
      style={{ background: 'linear-gradient(160deg, #EDE9FE 0%, #F5F3FF 40%, #E0E7FF 100%)', padding: '24px 20px' }}
    >
      {/* Logo and mascot */}
      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0.1 : 0.5 }}
        className="flex flex-col items-center mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <Mascot mood="waving" size={60} reduceMotion={reduceMotion} />
          <div>
            <h1 style={{ color: '#7C3AED', fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>
              Estuda+
            </h1>
            <p style={{ color: '#6D28D9', fontSize: '0.8rem', fontWeight: 600 }}>
              Aprender é chegar mais longe!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0.1 : 0.45, delay: 0.1 }}
        className="w-full rounded-3xl shadow-xl"
        style={{ background: 'white', maxWidth: 420, padding: '32px 28px' }}
      >
        <div className="mb-6">
          <h2 style={{ color: '#1E1B4B' }}>Bem-vindo de volta! 👋</h2>
          <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: 4 }}>
            Faça login para continuar estudando.
          </p>
        </div>

        {/* Reset sent feedback */}
        <AnimatePresence>
          {resetSent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 flex items-start gap-2 rounded-xl p-3"
              style={{ background: '#ECFDF5', border: '1px solid #6EE7B7' }}
              role="status"
              aria-live="polite"
            >
              <CheckCircle size={18} color="#10B981" className="mt-0.5 shrink-0" />
              <p style={{ color: '#065F46', fontSize: '0.85rem' }}>
                Link de redefinição enviado para <strong>{email || 'seu e-mail'}</strong>. Verifique sua caixa de entrada.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login error (H#9) */}
        <AnimatePresence>
          {loginError && (
            <motion.div
              variants={shakeVariants}
              animate="shake"
              initial={{ opacity: 0, height: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 rounded-xl p-3"
              style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}
              role="alert"
              aria-live="assertive"
            >
              <div className="flex items-start gap-2">
                <AlertCircle size={18} color="#EF4444" className="mt-0.5 shrink-0" />
                <div>
                  <p style={{ color: '#991B1B', fontWeight: 700, fontSize: '0.85rem' }}>
                    E-mail ou senha incorretos.
                  </p>
                  <p style={{ color: '#7F1D1D', fontSize: '0.8rem', marginTop: 2 }}>
                    Verifique suas informações e tente novamente.
                  </p>
                  <ul style={{ color: '#7F1D1D', fontSize: '0.78rem', marginTop: 6, paddingLeft: 16 }}>
                    <li>A senha pode estar incorreta</li>
                    <li>O Caps Lock pode estar ativado</li>
                    <li>
                      <button
                        onClick={handleForgotPassword}
                        style={{ color: '#7C3AED', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem', padding: 0 }}
                      >
                        Redefina sua senha
                      </button>{' '}
                      se tiver esquecido
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email field */}
          <div className="mb-4">
            <label htmlFor="email" style={{ color: '#374151', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              E-mail
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Mail size={18} color={emailError ? '#EF4444' : '#9CA3AF'} />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                autoComplete="email"
                placeholder="seu@email.com"
                aria-invalid={!!emailError}
                aria-describedby={emailError ? 'email-error' : undefined}
                className="w-full rounded-xl transition-all outline-none"
                style={{
                  padding: '12px 12px 12px 42px',
                  border: `2px solid ${emailError ? '#EF4444' : '#E5E7EB'}`,
                  background: emailError ? '#FEF2F2' : '#F9FAFB',
                  color: '#1E1B4B',
                  fontSize: '0.95rem',
                  boxShadow: emailError ? 'none' : undefined,
                }}
              />
              {email && !emailError && (
                <CheckCircle size={18} color="#10B981" className="absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>
            <AnimatePresence>
              {emailError && (
                <motion.p
                  id="email-error"
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: 4 }}
                >
                  {emailError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Password field */}
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="password" style={{ color: '#374151', fontWeight: 600 }}>
                Senha
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                style={{ color: '#7C3AED', fontSize: '0.82rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
                Esqueci minha senha
              </button>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Lock size={18} color={passwordError ? '#EF4444' : '#9CA3AF'} />
              </div>
              <input
                id="password"
                ref={passwordRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? 'pw-error' : capsLock ? 'caps-warning' : undefined}
                className="w-full rounded-xl transition-all outline-none"
                style={{
                  padding: '12px 44px 12px 42px',
                  border: `2px solid ${passwordError ? '#EF4444' : '#E5E7EB'}`,
                  background: passwordError ? '#FEF2F2' : '#F9FAFB',
                  color: '#1E1B4B',
                  fontSize: '0.95rem',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                {showPassword ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
              </button>
            </div>

            {/* CapsLock warning (H#9) */}
            <AnimatePresence>
              {capsLock && (
                <motion.p
                  id="caps-warning"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  role="status"
                  aria-live="polite"
                  style={{ color: '#D97706', fontSize: '0.8rem', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <AlertCircle size={14} /> Caps Lock ativado — verifique a capitalização da senha
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {passwordError && (
                <motion.p
                  id="pw-error"
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: 4 }}
                >
                  {passwordError}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Password strength (H#5) */}
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {['Fraca', 'Média', 'Forte'].map((label, i) => {
                    const strength = password.length < 4 ? 0 : password.length < 8 ? 1 : 2;
                    const colors = ['#EF4444', '#F59E0B', '#10B981'];
                    return (
                      <div
                        key={label}
                        className="h-1 flex-1 rounded-full transition-all"
                        style={{ background: i <= strength ? colors[strength] : '#E5E7EB' }}
                      />
                    );
                  })}
                </div>
                <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                  Segurança:{' '}
                  <strong style={{ color: password.length < 4 ? '#EF4444' : password.length < 8 ? '#F59E0B' : '#10B981' }}>
                    {password.length < 4 ? 'Fraca' : password.length < 8 ? 'Média' : 'Forte'}
                  </strong>
                </p>
              </div>
            )}
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2 mb-5 mt-3">
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ accentColor: '#7C3AED', width: 16, height: 16, cursor: 'pointer' }}
            />
            <label htmlFor="remember" style={{ color: '#374151', fontSize: '0.9rem', cursor: 'pointer' }}>
              Lembrar meu acesso
            </label>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={reduceMotion ? {} : { scale: 1.02 }}
            whileTap={reduceMotion ? {} : { scale: 0.97 }}
            className="w-full rounded-xl flex items-center justify-center gap-2"
            style={{
              background: isLoading ? '#A78BFA' : 'linear-gradient(135deg, #7C3AED, #4F46E5)',
              color: 'white',
              padding: '14px',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: 800,
              fontSize: '1rem',
              boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
            }}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                style={{ width: 20, height: 20, border: '3px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}
              />
            ) : (
              <>
                Entrar <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: '#E5E7EB' }} />
          <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>ou continue com</span>
          <div className="flex-1 h-px" style={{ background: '#E5E7EB' }} />
        </div>

        {/* Social login */}
        <div className="flex gap-3">
          {[
            { id: 'google', label: 'Google', color: '#EA4335', icon: '🔴' },
            { id: 'apple', label: 'Apple', color: '#000000', icon: '🍎' },
            { id: 'microsoft', label: 'Microsoft', color: '#0078D4', icon: '🪟' },
          ].map(({ id, label, color, icon }) => (
            <motion.button
              key={id}
              onClick={() => handleSocialLogin(id)}
              whileHover={reduceMotion ? {} : { scale: 1.04 }}
              whileTap={reduceMotion ? {} : { scale: 0.97 }}
              className="flex-1 rounded-xl flex items-center justify-center gap-2"
              style={{
                padding: '10px',
                border: '2px solid #E5E7EB',
                background: '#F9FAFB',
                cursor: 'pointer',
                color: '#374151',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
              aria-label={`Entrar com ${label}`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </motion.button>
          ))}
        </div>

        {/* Sign up link */}
        <p className="text-center mt-5" style={{ color: '#6B7280', fontSize: '0.9rem' }}>
          Não tem uma conta?{' '}
          <button
            onClick={() => onLogin(false)}
            style={{ color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
          >
            Criar conta
          </button>
        </p>

        {/* Teacher login link */}
        <p className="text-center mt-2">
          <button
            onClick={() => onLogin(true)}
            style={{ color: '#9CA3AF', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Acesso do professor →
          </button>
        </p>
      </motion.div>

      {/* Security note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 text-center"
        style={{ color: '#A78BFA', fontSize: '0.78rem' }}
      >
        🔒 Seus dados estão protegidos
      </motion.p>

      <ConfirmDialog
        open={showResetConfirm}
        title="Redefinir senha"
        description={email ? `Enviaremos um link de redefinição para ${email}` : 'Informe seu e-mail e enviaremos um link de redefinição.'}
        confirmLabel="Enviar link"
        cancelLabel="Cancelar"
        onConfirm={handleResetConfirm}
        onCancel={() => setShowResetConfirm(false)}
        reduceMotion={reduceMotion}
      />
    </div>
  );
}
