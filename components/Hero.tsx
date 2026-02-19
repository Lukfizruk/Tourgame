
import React from 'react';

interface HeroProps {
  onPlayClick: () => void;
  isLoggedIn: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onPlayClick, isLoggedIn }) => {
  return (
    <section className="relative pt-40 pb-16 md:pt-56 md:pb-24 px-6 flex flex-col items-center text-center overflow-hidden">
      {/* Animated Glow behind title */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-900/10 blur-[180px] pointer-events-none rounded-[100%]"></div>
      
      <h1 className="font-orbitron text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter mb-8 glow-text px-4 max-w-full">
        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-emerald-100 to-emerald-800">
          TOURGAME
        </span>
      </h1>
      
      {!isLoggedIn && (
        <div className="relative group mt-4">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-900 to-emerald-800 rounded-full blur-sm opacity-40 group-hover:opacity-60 transition duration-500"></div>
          <button 
            onClick={onPlayClick}
            className="relative px-12 py-4 bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-full text-xl font-orbitron font-bold tracking-[0.2em] text-white hover:scale-[1.03] active:scale-95 transition-all duration-300 shadow-[0_0_15px_rgba(6,78,59,0.3)] border border-emerald-700/20"
          >
            PLAY
          </button>
        </div>
      )}

      <p className="mt-14 text-slate-400 max-w-2xl text-base md:text-lg font-light leading-relaxed tracking-wide px-4">
        Ваш путь к профессиональному киберспорту. <span className="text-emerald-600 font-medium">Тренируйся</span>, побеждай в <span className="text-emerald-700 font-medium">турнирах</span> и доминируй в <span className="text-emerald-800 font-medium">дуэлях</span> на самой современной платформе для геймеров.
      </p>
    </section>
  );
};
