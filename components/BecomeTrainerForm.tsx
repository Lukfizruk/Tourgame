import React, { useState } from 'react';
import { Game } from '../App';

interface BecomeTrainerFormProps {
  onClose: () => void;
  onSubmit: (app: { game: string; champion: string; interviewTime: string }) => void;
  games: Game[];
}

const INTERVIEW_SLOTS = [
  'Пн, 12:00',
  'Пн, 15:00',
  'Вт, 10:00',
  'Вт, 17:00',
  'Ср, 14:00',
  'Чт, 11:00',
  'Пт, 16:00',
  'Сб, 13:00',
];

export const BecomeTrainerForm: React.FC<BecomeTrainerFormProps> = ({ onClose, onSubmit, games }) => {
  const [selectedGameId, setSelectedGameId] = useState<string>(games[0]?.id || '');
  const [selectedChampionId, setSelectedChampionId] = useState<string>('');
  const [selectedInterviewTime, setSelectedInterviewTime] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedGame = games.find(game => game.id === selectedGameId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGame || !selectedChampionId || !selectedInterviewTime) {
      return;
    }

    const selectedChampion = selectedGame.champions.find(champion => champion.id === selectedChampionId);
    onSubmit({
      game: selectedGame.name,
      champion: selectedChampion?.name || '',
      interviewTime: selectedInterviewTime,
    });
    setIsSubmitted(true);

    setTimeout(() => {
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-start overflow-y-auto px-4 pb-20 pt-24 md:px-10 md:pt-32 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-2xl rounded-[2.5rem] p-8 md:p-10 mb-10 relative border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors z-20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isSubmitted ? (
          <div className="text-center py-12 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/40">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-orbitron text-2xl font-black text-white mb-2 uppercase tracking-tighter">Заявка принята</h2>
            <p className="text-slate-400 text-sm">Время собеседования сохранено. Администратор свяжется с вами в личных сообщениях.</p>
          </div>
        ) : (
          <>
            <h2 className="font-orbitron text-3xl font-black mb-2 text-white glow-text uppercase tracking-tighter">
              Стать тренером
            </h2>
            <p className="text-slate-400 text-sm mb-8">
              Укажите игру, основного героя и выберите удобное время собеседования.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Выберите игру</label>
                <div className="grid grid-cols-2 gap-4">
                  {games.map(game => (
                    <button
                      key={game.id}
                      type="button"
                      onClick={() => {
                        setSelectedGameId(game.id);
                        setSelectedChampionId('');
                      }}
                      className={`flex items-center p-3 rounded-2xl border transition-all text-left ${
                        selectedGameId === game.id ? 'bg-emerald-500/10 border-emerald-500' : 'bg-slate-900 border-white/5'
                      }`}
                    >
                      <img src={game.avatar} className="w-10 h-10 rounded-xl object-cover mr-3 border border-white/10" alt="" />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${selectedGameId === game.id ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {game.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedGame && (
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Выберите основного чемпиона</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedGame.champions.map(champion => (
                      <button
                        key={champion.id}
                        type="button"
                        onClick={() => setSelectedChampionId(champion.id)}
                        className={`flex flex-col items-center p-3 rounded-2xl border transition-all text-center ${
                          selectedChampionId === champion.id ? 'bg-emerald-500/10 border-emerald-500' : 'bg-slate-900 border-white/5'
                        }`}
                      >
                        <img src={champion.avatar} className="w-12 h-12 rounded-full object-cover mb-2 border-2 border-white/10" alt="" />
                        <span className={`text-[9px] font-black uppercase tracking-widest ${selectedChampionId === champion.id ? 'text-emerald-500' : 'text-slate-500'}`}>
                          {champion.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Время собеседования</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {INTERVIEW_SLOTS.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedInterviewTime(slot)}
                      className={`py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${
                        selectedInterviewTime === slot
                          ? 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                          : 'bg-white/5 border-white/5 text-slate-500 hover:border-emerald-500/30 hover:text-slate-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 text-[11px] text-slate-400 leading-relaxed italic">
                * После подтверждения заявки администратор проведет собеседование в выбранный вами слот.
              </div>

              <button
                type="submit"
                disabled={!selectedChampionId || !selectedInterviewTime}
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
