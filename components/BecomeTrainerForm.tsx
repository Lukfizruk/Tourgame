
import React, { useState } from 'react';
import { Game } from '../App';

interface BecomeTrainerFormProps {
  onClose: () => void;
  onSubmit: (app: { game: string; champion: string }) => void;
  games: Game[];
}

export const BecomeTrainerForm: React.FC<BecomeTrainerFormProps> = ({ onClose, onSubmit, games }) => {
  const [selectedGameId, setSelectedGameId] = useState<string>(games[0]?.id || '');
  const [selectedChampionId, setSelectedChampionId] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedGame = games.find(g => g.id === selectedGameId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGame || !selectedChampionId) return;
    
    const champ = selectedGame.champions.find(c => c.id === selectedChampionId);
    
    onSubmit({ game: selectedGame.name, champion: champ?.name || '' });
    setIsSubmitted(true);
    
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-lg rounded-[2.5rem] p-10 relative border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)] overflow-y-auto max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isSubmitted ? (
          <div className="text-center py-10 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/40">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-orbitron text-2xl font-black text-white mb-2 uppercase tracking-tighter">Заявка принята!</h2>
            <p className="text-slate-400 text-sm">Мы свяжемся с вами в ближайшее время для подтверждения квалификации.</p>
          </div>
        ) : (
          <>
            <h2 className="font-orbitron text-3xl font-black mb-2 text-white glow-text uppercase tracking-tighter">
              Стать тренером
            </h2>
            <p className="text-slate-400 text-sm mb-8">
              Поделитесь своим опытом и начните зарабатывать на своих навыках.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Выберите игру</label>
                <div className="grid grid-cols-2 gap-4">
                  {games.map(g => (
                    <button 
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setSelectedGameId(g.id);
                        setSelectedChampionId('');
                      }}
                      className={`flex items-center p-3 rounded-2xl border transition-all text-left ${selectedGameId === g.id ? 'bg-emerald-500/10 border-emerald-500' : 'bg-slate-900 border-white/5'}`}
                    >
                      <img src={g.avatar} className="w-10 h-10 rounded-xl object-cover mr-3 border border-white/10" alt="" />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${selectedGameId === g.id ? 'text-emerald-500' : 'text-slate-400'}`}>{g.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedGame && (
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Выберите основного чемпиона</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedGame.champions.map(c => (
                      <button 
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedChampionId(c.id)}
                        className={`flex flex-col items-center p-3 rounded-2xl border transition-all text-center ${selectedChampionId === c.id ? 'bg-emerald-500/10 border-emerald-500' : 'bg-slate-900 border-white/5'}`}
                      >
                        <img src={c.avatar} className="w-12 h-12 rounded-full object-cover mb-2 border-2 border-white/10" alt="" />
                        <span className={`text-[9px] font-black uppercase tracking-widest ${selectedChampionId === c.id ? 'text-emerald-500' : 'text-slate-500'}`}>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 text-[11px] text-slate-400 leading-relaxed italic">
                * Ваша заявка будет рассмотрена администрацией. Мы проверим ваш игровой рейтинг и историю матчей.
              </div>

              <button 
                type="submit"
                disabled={!selectedChampionId}
                className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl text-white font-orbitron font-bold tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] disabled:opacity-30"
              >
                Подать заявку
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
