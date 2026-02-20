
import React, { useState } from 'react';
import { Tournament } from '../App';

interface TournamentsPageProps {
  tournaments: Tournament[];
  onBack: () => void;
  onSelectTournament: (id: string) => void;
}

export const TournamentsPage: React.FC<TournamentsPageProps> = ({ tournaments, onBack, onSelectTournament }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'upcoming'>('all');

  const filteredTournaments = tournaments.filter(t => filter === 'all' || t.status === filter);

  return (
    <section className="px-6 md:px-12 py-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6">
          <button 
            onClick={onBack}
            className="flex items-center text-emerald-500 hover:text-emerald-400 transition-colors font-bold uppercase tracking-widest text-[10px] group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Вернуться назад
          </button>

          <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
            {['all', 'active', 'upcoming', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f 
                    ? 'bg-emerald-800 text-white shadow-lg' 
                    : 'text-slate-500 hover:text-emerald-500'
                }`}
              >
                {f === 'all' ? 'Все' : f === 'active' ? 'Активные' : f === 'upcoming' ? 'Скоро' : 'Завершенные'}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="font-orbitron text-4xl md:text-5xl font-black mb-6 glow-text tracking-tighter uppercase dark:text-white light:text-slate-900">
            Турниры
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm font-medium leading-relaxed">
            Участвуйте в регулярных соревнованиях, повышайте свой рейтинг и выигрывайте ценные призы. 
            Самое время показать, на что вы способны!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTournaments.map((t) => (
            <div 
              key={t.id} 
              onClick={() => onSelectTournament(t.id)}
              className="glass-card rounded-[2.5rem] overflow-hidden group cursor-pointer hover:translate-y-[-8px] transition-all duration-500 border-white/5 hover:border-emerald-700/30 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={t.image} alt={t.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60"></div>
                <div className="absolute top-5 left-5">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    t.status === 'active' ? 'bg-emerald-800/80 border-emerald-500 text-white' :
                    t.status === 'upcoming' ? 'bg-amber-500/80 border-amber-400 text-white' :
                    'bg-slate-800/80 border-slate-600 text-slate-300'
                  }`}>
                    {t.status === 'active' ? 'LIVE' : t.status === 'upcoming' ? 'СКОРО' : 'ЗАВЕРШЕНО'}
                  </span>
                </div>
              </div>

              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">{t.game}</span>
                  <span className="text-slate-500 text-[10px] font-bold num-font">{t.date}</span>
                </div>
                <h3 className="text-xl font-orbitron font-bold dark:text-white mb-8 group-hover:text-emerald-500 transition-colors leading-tight">
                  {t.title}
                </h3>
                
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 pt-6 border-t border-white/5 mt-auto">
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Призовой фонд</p>
                    <p className="text-lg font-black num-font text-emerald-500">{t.prizePool}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Участники</p>
                    <p className="text-lg font-black num-font dark:text-white">
                      {t.participants} <span className="text-slate-600 text-sm">/ {t.maxParticipants}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Взнос</p>
                    <p className="text-base font-bold num-font text-slate-300">{t.entryFee}</p>
                  </div>
                </div>

                {t.status === 'active' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTournament(t.id);
                    }}
                    className="mt-8 w-full py-4 bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-xl text-white font-orbitron font-bold tracking-[0.2em] text-[10px] uppercase hover:scale-[1.03] active:scale-95 transition-all duration-300 shadow-[0_0_15px_rgba(6,78,59,0.3)] border border-emerald-700/20"
                  >
                    Участвовать
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {filteredTournaments.length === 0 && (
          <div className="text-center py-20 opacity-40">
            <p className="text-xl font-orbitron font-bold uppercase tracking-widest">Нет турниров в данной категории</p>
          </div>
        )}
      </div>
    </section>
  );
};
