
import React from 'react';
import { User } from '../App';

interface NavbarProps {
  onHomeClick: () => void;
  onProfileClick: () => void;
  onAdminClick: () => void;
  onTournamentsClick: () => void;
  onTrainingsClick: () => void;
  onLoginClick: () => void;
  user: User | null;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onHomeClick, 
  onProfileClick, 
  onAdminClick, 
  onTournamentsClick,
  onTrainingsClick,
  onLoginClick, 
  user 
}) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center space-x-3 cursor-pointer group" onClick={onHomeClick}>
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(6,78,59,0.2)] group-hover:scale-105 transition-transform duration-300">
          <span className="text-white font-bold text-sm tracking-tighter">TG</span>
        </div>
        <span className="hidden sm:block text-xl font-orbitron font-semibold tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-50 to-emerald-700">
          TOURGAME
        </span>
      </div>
      
      <div className="hidden lg:flex items-center space-x-12 text-[13px] font-medium tracking-[0.15em] uppercase text-slate-100">
        <button onClick={onHomeClick} className="hover:text-emerald-500 transition-colors duration-300">Главная</button>
        <button onClick={onTournamentsClick} className="hover:text-emerald-500 transition-colors duration-300">Турниры</button>
        <button onClick={onTrainingsClick} className="hover:text-emerald-500 transition-colors duration-300">Тренинги</button>
        <button onClick={onAdminClick} className="hover:text-emerald-500 transition-colors duration-300">Админ</button>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <div className="flex items-center space-x-4 bg-white/5 p-1 pr-4 rounded-full border border-white/10 hover:border-emerald-800/40 transition-all shadow-sm">
            <div 
              onClick={onProfileClick}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-800 cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <img src={user.avatar} alt={user.nickname} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mb-1">{user.nickname}</span>
              <span className="text-sm font-bold num-font text-emerald-500">
                {user.balance.toLocaleString()} ₽
              </span>
            </div>
          </div>
        ) : (
          <button 
            onClick={onLoginClick}
            className="px-8 py-2.5 rounded-full border border-emerald-800/30 hover:border-emerald-700 bg-emerald-800/10 hover:bg-emerald-800/20 transition-all duration-300 text-[11px] font-semibold uppercase tracking-[0.1em] shadow-sm text-emerald-500"
          >
            Войти
          </button>
        )}
      </div>
    </nav>
  );
};
