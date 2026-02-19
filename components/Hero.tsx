
import React from 'react';

interface HeroProps {
  onPlayClick: () => void;
  isLoggedIn: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onPlayClick, isLoggedIn }) => {
  return (
    <section className="relative pt-40 pb-16 md:pt-56 md:pb-24 px-6 flex flex-col items-center text-center overflow-hidden">
      {/* Animated Glow behind title */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-600/10 blur-[180px] pointer-events-none rounded-[100%]"></div>
      
      <h1 className="font-orbitron text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter mb-8 glow-text px-4 max-w-full">
        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-emerald-50 to-emerald-500">
          TOURGAME
        </span>
      </h1>
      
      {!isLoggedIn && (
        <div className="relative group mt-4">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full blur-md opacity-60 group-hover:opacity-100 transition duration-500"></div>
          <button 
            onClick={onPlayClick}
            className="relative px-10 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full text-xl font-orbitron font-black tracking-[0.2em] text-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_25px_rgba(16,185,129,0.4)]"
          >
            PLAY
          </button>
        </div>
      )}

      <p className="mt-14 text-slate-400 max-w-2xl text-base md:text-lg font-light leading-relaxed tracking-wide px-4">
        Ваш путь к профессиональному киберспорту. <span className="text-emerald-400 font-medium">Тренируйся</span>, побеждай в <span className="text-emerald-500 font-medium">турнирах</span> и доминируй в <span className="text-teal-500 font-medium">дуэлях</span> на самой современной платформе для геймеров.
      </p>
    </section>
  );
};
