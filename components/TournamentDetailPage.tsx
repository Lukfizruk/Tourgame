
import React, { useState } from 'react';
import { Tournament } from '../App';

interface TournamentDetailPageProps {
  tournament?: Tournament;
  onBack: () => void;
}

type TournamentTab = 'info' | 'participants' | 'bracket';

export const TournamentDetailPage: React.FC<TournamentDetailPageProps> = ({ tournament, onBack }) => {
  const [activeTab, setActiveTab] = useState<TournamentTab>('info');

  if (!tournament) return null;

  // Mock participants data
  const participants = Array.from({ length: tournament.participants }).map((_, i) => ({
    id: i,
    name: `Player_${Math.floor(Math.random() * 9000) + 1000}`,
    avatar: `https://i.pravatar.cc/150?u=${i + 100}`,
    rank: ['Platinum', 'Emerald', 'Diamond', 'Master'][Math.floor(Math.random() * 4)]
  }));

  const tabs = [
    { id: 'info' as const, label: 'Инфо', icon: '📝' },
    { id: 'participants' as const, label: 'Участники', icon: '👥' },
    { id: 'bracket' as const, label: 'Сетка', icon: '📊' },
  ];

  return (
    <section className="animate-in fade-in duration-700">
      {/* 1. Tournament Banner */}
      <div className="relative h-[450px] w-full overflow-hidden">
        <img 
          src={tournament.image} 
          alt={tournament.title} 
          className="w-full h-full object-cover scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent"></div>
        
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 pb-12 max-w-7xl mx-auto w-full">
          <button 
            onClick={onBack}
            className="absolute top-10 left-0 flex items-center text-emerald-500 hover:text-emerald-400 transition-colors font-bold uppercase tracking-widest text-[10px] group mb-8"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Назад к списку
          </button>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                tournament.status === 'active' ? 'bg-emerald-800 border-emerald-500 text-white' :
                tournament.status === 'upcoming' ? 'bg-amber-500/80 border-amber-400 text-white' :
                'bg-slate-800/80 border-slate-600 text-slate-300'
              }`}>
                {tournament.status === 'active' ? 'В эфире' : tournament.status === 'upcoming' ? 'Скоро начнется' : 'Завершено'}
              </span>
              <span className="text-emerald-500 font-orbitron font-bold text-xs uppercase tracking-[0.3em]">{tournament.game}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-orbitron font-black text-white glow-text uppercase tracking-tighter max-w-3xl">
              {tournament.title}
            </h1>
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Призовой фонд</span>
                <span className="text-2xl font-black num-font text-emerald-500">{tournament.prizePool}</span>
              </div>
              <div className="flex flex-col border-l border-white/10 pl-8">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Участники</span>
                <span className="text-2xl font-black num-font text-white">{tournament.participants} / {tournament.maxParticipants}</span>
              </div>
              <div className="flex flex-col border-l border-white/10 pl-8">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Взнос</span>
                <span className="text-2xl font-black num-font text-slate-300">{tournament.entryFee}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Tournament Navigation Menu */}
      <div className="bg-slate-950/50 backdrop-blur-md sticky top-20 z-40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex space-x-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${
                activeTab === tab.id 
                ? 'text-emerald-500' 
                : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-in slide-in-from-left duration-300"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Content Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-2 space-y-12">
              <div className="glass-card p-10 rounded-[2.5rem] border-white/5">
                <h3 className="font-orbitron text-xl font-bold dark:text-white mb-6 uppercase tracking-widest">Описание турнира</h3>
                <div className="prose prose-invert max-w-none text-slate-400 text-sm leading-loose space-y-4">
                  <p>Добро пожаловать на крупнейшее событие сезона! Этот турнир объединяет лучших игроков со всего региона в битве за звание чемпиона и весомый призовой фонд.</p>
                  <p>Формат проведения: Single Elimination (на выбывание). Все матчи до полуфинала проводятся в формате Bo1 (до одной победы), финал — Bo3.</p>
                  <ul className="list-disc pl-5 space-y-2 text-emerald-500/80">
                    <li>Честная игра и использование античита — обязательное условие.</li>
                    <li>Стриминг матчей разрешен с задержкой 5 минут.</li>
                    <li>Подтверждение участия за 30 минут до старта.</li>
                  </ul>
                </div>
              </div>

              <div className="glass-card p-10 rounded-[2.5rem] border-white/5">
                <h3 className="font-orbitron text-xl font-bold dark:text-white mb-8 uppercase tracking-widest">Распределение призов</h3>
                <div className="space-y-4">
                  {[
                    { place: '1 Место', prize: '60%', amount: '30 000 ₽', icon: '🥇', color: 'text-amber-400' },
                    { place: '2 Место', prize: '30%', amount: '15 000 ₽', icon: '🥈', color: 'text-slate-300' },
                    { place: '3 Место', prize: '10%', amount: '5 000 ₽', icon: '🥉', color: 'text-orange-400' },
                  ].map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all">
                      <div className="flex items-center space-x-5">
                        <span className="text-3xl">{p.icon}</span>
                        <div>
                          <p className={`font-black uppercase tracking-widest text-[10px] ${p.color}`}>{p.place}</p>
                          <p className="text-lg font-bold text-white">{p.prize} от пула</p>
                        </div>
                      </div>
                      <span className="text-2xl font-black num-font text-emerald-500">{p.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass-card p-8 rounded-[2.5rem] border-emerald-500/20 bg-emerald-500/5">
                <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-6">Важные даты</h4>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">📅</div>
                    <div>
                      <p className="text-white font-bold text-sm leading-none mb-1">Регистрация до</p>
                      <p className="text-slate-500 text-xs">24 мая, 23:59</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">⚡</div>
                    <div>
                      <p className="text-white font-bold text-sm leading-none mb-1">Старт турнира</p>
                      <p className="text-slate-500 text-xs">{tournament.date}</p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-orbitron font-bold tracking-[0.2em] text-[10px] uppercase transition-all shadow-lg active:scale-95">
                  Зарегистрироваться
                </button>
              </div>

              <div className="glass-card p-8 rounded-[2.5rem] border-white/5">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Тех. поддержка</h4>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">Возникли вопросы по правилам или зачислению взносов? Наши судьи онлайн 24/7.</p>
                <button className="w-full py-4 border border-white/10 hover:bg-white/5 rounded-xl text-slate-300 font-black tracking-widest text-[9px] uppercase transition-all">Чат с поддержкой</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'participants' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/5">
              <h3 className="font-orbitron text-xl font-bold dark:text-white uppercase tracking-widest">Список участников</h3>
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest num-font">
                Всего: <span className="text-emerald-500">{tournament.participants}</span>
              </div>
            </div>
            <div className="space-y-3">
              {participants.map((p, idx) => (
                <div key={p.id} className="glass-card px-6 py-4 rounded-2xl border-white/5 flex items-center justify-between group hover:border-emerald-500/30 transition-all hover:bg-emerald-500/5">
                  <div className="flex items-center space-x-6">
                    <span className="text-slate-600 font-black num-font text-xs w-6">{idx + 1}.</span>
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 group-hover:border-emerald-500/40 transition-all p-0.5">
                      <img src={p.avatar} alt="" className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div>
                      <p className="font-bold text-sm dark:text-white mb-0.5 group-hover:text-emerald-400 transition-colors">{p.name}</p>
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Зарегистрирован</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">{p.rank}</p>
                  </div>
                </div>
              ))}
              {participants.length === 0 && (
                <div className="py-20 text-center text-slate-500 uppercase tracking-widest text-xs font-black opacity-30">
                  Пока нет зарегистрированных участников
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bracket' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-x-auto pb-8 no-scrollbar">
            <div className="min-w-[800px] flex items-center justify-between py-10 px-4">
              {/* Simple Mock Bracket Visualization */}
              <div className="flex-1 space-y-20">
                <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-10 text-center">1/4 Финала</h4>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="relative">
                    <div className="w-48 p-3 bg-white/5 border border-white/10 rounded-xl space-y-2">
                      <div className="flex items-center justify-between"><span className="text-[10px] font-bold text-slate-400">Player_{i}A</span><span className="text-[10px] font-black text-emerald-500">2</span></div>
                      <div className="border-t border-white/5 pt-2 flex items-center justify-between opacity-40"><span className="text-[10px] font-bold text-slate-400">Player_{i}B</span><span className="text-[10px] font-black">1</span></div>
                    </div>
                    <div className="absolute top-1/2 -right-10 w-10 h-[2px] bg-emerald-500/30"></div>
                  </div>
                ))}
              </div>

              <div className="flex-1 space-y-40">
                <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-10 text-center">Полуфинал</h4>
                {[1, 2].map(i => (
                  <div key={i} className="relative ml-20">
                    <div className="w-48 p-3 bg-white/5 border border-white/10 rounded-xl space-y-2 ring-1 ring-emerald-500/20">
                      <div className="flex items-center justify-between"><span className="text-[10px] font-bold text-white">Winner_{i}A</span><span className="text-[10px] font-black text-emerald-500">TBD</span></div>
                      <div className="border-t border-white/5 pt-2 flex items-center justify-between"><span className="text-[10px] font-bold text-slate-500">Winner_{i}B</span><span className="text-[10px] font-black">TBD</span></div>
                    </div>
                    <div className="absolute top-1/2 -right-10 w-10 h-[2px] bg-emerald-500/30"></div>
                  </div>
                ))}
              </div>

              <div className="flex-1 space-y-60">
                <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-10 text-center">Финал</h4>
                <div className="relative ml-20">
                  <div className="w-56 p-6 bg-emerald-950/20 border border-emerald-500/40 rounded-[2rem] space-y-4 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                    <div className="text-center pb-4 border-b border-emerald-500/10">
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Главный матч</span>
                    </div>
                    <div className="flex items-center justify-between"><span className="text-xs font-black text-white">TBD</span><span className="text-xs font-black text-emerald-500">VS</span><span className="text-xs font-black text-white">TBD</span></div>
                  </div>
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-4xl">👑</div>
                </div>
              </div>
            </div>
            
            <div className="text-center pt-10">
               <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.5em]">Обновлено в режиме реального времени</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
