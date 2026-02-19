
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (payload: { id: string; nickname: string; email: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const toReadableAuthError = (message: string) => {
    const lower = message.toLowerCase();
    if (lower.includes('email not confirmed')) {
      return 'Почта не подтверждена. Откройте письмо от Supabase и подтвердите email.';
    }
    if (lower.includes('invalid login credentials')) {
      return 'Неверный email или пароль.';
    }
    if (lower.includes('user already registered')) {
      return 'Пользователь с таким email уже зарегистрирован.';
    }
    if (lower.includes('password should be at least')) {
      return 'Пароль слишком короткий (минимум 6 символов).';
    }
    return message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          setError('Пароли не совпадают');
          return;
        }
        if (password.length < 6) {
          setError('Пароль слишком короткий (мин. 6 символов)');
          return;
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nickname
            }
          }
        });

        if (signUpError) {
          setError(toReadableAuthError(signUpError.message));
          return;
        }

        const authUser = data.user;
        if (!authUser) {
          setError('Проверьте почту и подтвердите регистрацию.');
          return;
        }

        onSuccess({
          id: authUser.id,
          email: authUser.email ?? email,
          nickname: (authUser.user_metadata?.nickname as string) || nickname
        });
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        setError(toReadableAuthError(signInError.message));
        return;
      }

      const authUser = data.user;
      if (!authUser) {
        setError('Не удалось получить данные пользователя.');
        return;
      }

      onSuccess({
        id: authUser.id,
        email: authUser.email ?? email,
        nickname: (authUser.user_metadata?.nickname as string) || (authUser.email?.split('@')[0] ?? 'User')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-md rounded-[2.5rem] p-10 relative border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="font-orbitron text-3xl font-black mb-2 text-white glow-text uppercase tracking-tighter text-center">
          {mode === 'register' ? 'Регистрация' : 'Вход'}
        </h2>
        <p className="text-slate-400 text-center text-sm mb-8">
          {mode === 'register' ? 'Создай аккаунт для доступа ко всем функциям' : 'С возвращением! Введите свои данные'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Имя пользователя / Ник</label>
              <input 
                required
                type="text" 
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Gamer1337"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Электронная почта</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="pro@gamer.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Пароль</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Повторите пароль</label>
              <input 
                required
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          )}

          {error && <p className="text-red-400 text-xs font-bold">{error}</p>}

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl text-white font-orbitron font-bold tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] mt-4"
          >
            {isSubmitting ? 'Загрузка...' : mode === 'register' ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <button 
            onClick={() => {
              setMode(mode === 'register' ? 'login' : 'register');
              setError('');
            }}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-widest"
          >
            {mode === 'register' ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
          </button>
        </div>
      </div>
    </div>
  );
};
