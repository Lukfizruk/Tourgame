
import React, { useState, useEffect } from 'react';
import { SessionActivity, Game, Champion } from '../App';

interface CreateSessionModalProps {
  onClose: () => void;
  initialData?: { game: string; champion: string };
  onSubmit: (data: Omit<SessionActivity, 'id' | 'trainerName' | 'avatar'>) => void;
  games: Game[];
}

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const SESSION_TYPES = [
  { id: 'theory', label: 'Теоретическое занятие' },
  { id: 'spectator', label: 'Режим наблюдателя' },
  { id: 'coop', label: 'Совместная игра' }
];

export const CreateSessionModal: React.FC<CreateSessionModalProps> = ({ onClose, initialData, onSubmit, games }) => {
  const [selectedGameId, setSelectedGameId] = useState<string>(
    games.find(g => g.name === initialData?.game)?.id || games[0]?.id || ''
  );
  const [selectedChampionId, setSelectedChampionId] = useState<string>('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('18:00');
  const [sessionType, setSessionType] = useState('theory');
  const [price30, setPrice30] = useState('750');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedGame = games.find(g => g.id === selectedGameId);
  
  useEffect(() => {
    if (selectedGame && selectedGame.champions.length > 0) {
      const initialChamp = selectedGame.champions.find(c => c.name === initialData?.champion);
      setSelectedChampionId(initialChamp?.id || selectedGame.champions[0].id);
    } else {
      setSelectedChampionId('');
    }
  }, [selectedGameId, games]);

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGame || !selectedChampionId) return;
    
    const champ = selectedGame.champions.find(c => c.id === selectedChampionId);
    
    onSubmit({
      game: selectedGame.name,
      champion: champ?.name || '',
      days: selectedDays,
      startTime,
      endTime,
      sessionType,
      price30: Number(price30),
    });
    setIsSubmitted(true);
    setTimeout(() => onClose(), 2000);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/90 dark:bg-black/90 light:bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-xl rounded-[2.5rem] p-10 relative border-emerald-500/30 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-400 hover:text-emerald-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isSubmitted ? (
          <div className="text-center py-10 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/40 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-orbitron text-2xl font-black dark:text-white light:text-slate-900 mb-2 uppercase tracking-tighter">Расписание готово!</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Ваши услуги теперь доступны в общем списке.</p>
          </div>
        ) : (
          <>
            <h2 className="font-orbitron text-3xl font-black mb-2 dark:text-white light:text-slate-900 glow-text uppercase tracking-tighter">
              Настройка обучения
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium">
              Выберите игру и наставника. Обучение проводится блоками по 30 минут.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Выберите игру</label>
                  <div className="grid grid-cols-2 gap-4">
                    {games.map(g => (
                      <button 
                        key={g.id}
                        type="button"
                        onClick={() => setSelectedGameId(g.id)}
                        className={`flex items-center p-3 rounded-2xl border transition-all text-left ${selectedGameId === g.id ? 'bg-emerald-500/10 border-emerald-500' : 'bg-white/5 border-slate-500/10'}`}
                      >
                        <img src={g.avatar} className="w-10 h-10 rounded-xl object-cover mr-3 border border-white/10" alt="" />
                        <span className={`text-[11px] font-black uppercase tracking-widest ${selectedGameId === g.id ? 'text-emerald-500' : 'text-slate-400'}`}>{g.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedGame && (
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Выберите чемпиона</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedGame.champions.map(c => (
                        <button 
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedChampionId(c.id)}
                          className={`flex flex-col items-center p-3 rounded-2xl border transition-all text-center ${selectedChampionId === c.id ? 'bg-emerald-500/10 border-emerald-500' : 'bg-white/5 border-slate-500/10'}`}
                        >
                          <img src={c.avatar} className="w-12 h-12 rounded-full object-cover mb-2 border-2 border-white/10" alt="" />
                          <span className={`text-[9px] font-black uppercase tracking-widest ${selectedChampionId === c.id ? 'text-emerald-500' : 'text-slate-500'}`}>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-7 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl">
                <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-3">Стоимость за 30 минут</label>
                <div className="relative">
                  <input 
                    required
                    type="number" 
                    value={price30}
                    onChange={(e) => setPrice30(e.target.value)}
                    className="w-full bg-white/5 dark:bg-white/5 light:bg-white border border-emerald-500/20 rounded-2xl p-4 dark:text-white light:text-slate-900 font-black text-2xl num-font focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-black uppercase text-[10px] tracking-widest">₽</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Ваши рабочие дни</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`w-11 h-11 rounded-2xl text-[11px] font-black transition-all border ${
                        selectedDays.includes(day)
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg'
                        : 'bg-white/5 dark:bg-white/5 light:bg-slate-200/50 border-white/10 dark:border-white/10 light:border-slate-300 text-slate-500 hover:border-emerald-500/30'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Начало смены</label>
                  <input 
                    type="time" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-white/5 dark:bg-white/5 light:bg-white border border-slate-500/10 rounded-xl p-4 dark:text-white light:text-slate-900 font-bold num-font focus:outline-none focus:border-emerald-500 transition-all [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Конец смены</label>
                  <input 
                    type="time" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-white/5 dark:bg-white/5 light:bg-white border border-slate-500/10 rounded-xl p-4 dark:text-white light:text-slate-900 font-bold num-font focus:outline-none focus:border-emerald-500 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Тип обучения</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {SESSION_TYPES.map(type => (
                    <label key={type.id} className={`flex items-center p-4 rounded-2xl border transition-all cursor-pointer ${
                      sessionType === type.id 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-300' 
                      : 'bg-white/5 dark:bg-white/5 light:bg-slate-200/20 border-white/10 dark:border-white/10 light:border-slate-200 text-slate-500 hover:border-emerald-500/20'
                    }`}>
                      <input 
                        type="radio" 
                        name="sessionType" 
                        value={type.id} 
                        checked={sessionType === type.id}
                        onChange={(e) => setSessionType(e.target.value)}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${
                        sessionType === type.id ? 'border-emerald-500 bg-emerald-500/20 shadow-sm' : 'border-slate-500/50'
                      }`}>
                        {sessionType === type.id && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                disabled={selectedDays.length === 0 || !selectedChampionId}
                className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl text-white font-orbitron font-bold tracking-[0.3em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-50"
              >
                Опубликовать
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
