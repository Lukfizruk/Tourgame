
import React from 'react';
import { User } from '../App';

interface NavbarProps {
  onHomeClick: () => void;
  onProfileClick: () => void;
  onAdminClick: () => void;
  onLoginClick: () => void;
  onThemeToggle: () => void;
  theme: 'dark' | 'light';
  user: User | null;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onHomeClick, 
  onProfileClick, 
  onAdminClick, 
  onLoginClick, 
  onThemeToggle,
  theme,
  user 
}) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-50/80 backdrop-blur-xl border-b border-white/5 dark:border-white/5 light:border-slate-200">
      <div className="flex items-center space-x-2 cursor-pointer group" onClick={onHomeClick}>
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform">
          <span className="text-white font-bold text-sm">TG</span>
        </div>
        <span className="hidden sm:block text-xl font-orbitron font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-200 to-slate-400 dark:from-white light:from-slate-900">
          TOURGAME
        </span>
      </div>
      
      <div className="hidden lg:flex items-center space-x-10 text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 dark:text-slate-300 light:text-slate-600">
        <button onClick={onHomeClick} className="hover:text-emerald-500 transition-colors">Главная</button>
        <a href="#" className="hover:text-emerald-500 transition-colors">Турниры</a>
        <a href="#" className="hover:text-emerald-500 transition-colors">Тренинги</a>
        <button onClick={onAdminClick} className="hover:text-emerald-500 transition-colors">Админ</button>
      </div>

      <div className="flex items-center space-x-3">
        {/* Theme Toggle */}
        <button 
          onClick={onThemeToggle}
          className="p-2.5 rounded-full bg-white/5 dark:bg-white/5 light:bg-slate-200/50 border border-white/10 dark:border-white/10 light:border-slate-300 text-slate-400 hover:text-emerald-500 transition-all shadow-sm"
          title={theme === 'dark' ? 'Включить светлую тему' : 'Включить темную тему'}
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707.707M24 12a12 12 0 11-24 0 12 12 0 0124 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {user ? (
          <div className="flex items-center space-x-4 bg-white/5 dark:bg-white/5 light:bg-slate-100 p-1 pr-4 rounded-full border border-white/10 dark:border-white/10 light:border-slate-300 hover:border-emerald-500/30 transition-all shadow-sm">
            <div 
              onClick={onProfileClick}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-500 cursor-pointer hover:scale-105 transition-transform"
            >
              <img src={user.avatar} alt={user.nickname} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{user.nickname}</span>
              <span className="text-sm font-bold num-font text-emerald-500 dark:text-emerald-400">
                {user.balance.toLocaleString()} ₽
              </span>
            </div>
          </div>
        ) : (
          <button 
            onClick={onLoginClick}
            className="px-6 py-2 rounded-full border border-emerald-500/30 hover:border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all text-[10px] font-black uppercase tracking-widest shadow-sm"
          >
            Войти
          </button>
        )}
      </div>
    </nav>
  );
};
