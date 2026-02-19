
import React, { useState } from 'react';
import { Game, Champion, SessionActivity, BookingRecord, User } from '../App';

export interface TrainerApplication {
  id: string;
  nickname: string;
  game: string;
  champion: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

interface AdminPanelProps {
  applications: TrainerApplication[];
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => void;
  games: Game[];
  activeSessions: SessionActivity[];
  bookings: BookingRecord[];
  users: User[];
  onAddGame: (game: { name: string; description: string; avatarFile: File }) => Promise<void> | void;
  onAddChampion: (gameId: string, champion: Omit<Champion, 'id'>) => void;
  onBack: () => void;
}

type AdminTab = 'apps' | 'games' | 'offers' | 'bookings' | 'users';

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  applications, 
  onUpdateStatus, 
  games,
  activeSessions,
  bookings,
  users,
  onAddGame,
  onAddChampion,
  onBack 
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('apps');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [newGameName, setNewGameName] = useState('');
  const [newGameAvatarFile, setNewGameAvatarFile] = useState<File | null>(null);
  const [newGameDesc, setNewGameDesc] = useState('');

  const [isAddingChampion, setIsAddingChampion] = useState(false);
  const [newChampName, setNewChampName] = useState('');
  const [newChampAvatar, setNewChampAvatar] = useState('');

  const selectedGame = games.find(g => g.id === selectedGameId);

  const handleAddGameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGameAvatarFile) {
      return;
    }
    await onAddGame({ name: newGameName, description: newGameDesc, avatarFile: newGameAvatarFile });
    setIsAddingGame(false);
    setNewGameName('');
    setNewGameAvatarFile(null);
    setNewGameDesc('');
  };

  const handleAddChampSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGameId) {
      onAddChampion(selectedGameId, { name: newChampName, avatar: newChampAvatar });
      setIsAddingChampion(false);
      setNewChampName('');
      setNewChampAvatar('');
    }
  };

  const tabs = [
    { id: 'apps' as const, label: 'Заявки' },
    { id: 'games' as const, label: 'Игры' },
    { id: 'offers' as const, label: 'Предложения' },
    { id: 'bookings' as const, label: 'Записи' },
    { id: 'users' as const, label: 'Пользователи' },
  ];

  return (
    <section className="px-6 md:px-12 py-12 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-6">
          <button 
            onClick={selectedGameId ? () => setSelectedGameId(null) : onBack}
            className="flex items-center text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 transition-colors font-black uppercase tracking-widest text-[10px] group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            {selectedGameId ? 'Назад к списку игр' : 'На главную'}
          </button>

          <h2 className="font-orbitron text-2xl font-black dark:text-white light:text-slate-900 glow-text uppercase tracking-tighter">
            Панель Администратора
          </h2>
        </div>

        {!selectedGameId ? (
          <>
            <div className="flex flex-wrap gap-2 mb-10 p-1.5 bg-slate-500/5 dark:bg-slate-900/50 light:bg-slate-100 border border-slate-500/10 rounded-2xl w-fit">
              {tabs.map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.id 
                    ? 'bg-emerald-500 text-white shadow-lg' 
                    : 'text-slate-500 hover:text-emerald-500'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB: Applications */}
            {activeTab === 'apps' && (
              <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-lg border-emerald-500/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-500/10 bg-slate-500/5">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Никнейм</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Игра</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Дата</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Статус</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-500/5">
                      {applications.length === 0 ? (
                        <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-500 italic">Заявок пока нет.</td></tr>
                      ) : (
                        applications.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-500/5 transition-colors">
                            <td className="px-8 py-6 font-bold dark:text-white light:text-slate-900 text-sm">{app.nickname}</td>
                            <td className="px-8 py-6 text-emerald-500 text-xs font-black uppercase tracking-wider">{app.game}</td>
                            <td className="px-8 py-6 text-slate-500 text-xs num-font">{app.date}</td>
                            <td className="px-8 py-6">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                app.status === 'pending' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
                                app.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
                                'bg-red-500/10 border-red-500/30 text-red-500'
                              }`}>
                                {app.status === 'pending' ? 'Ожидание' : app.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              {app.status === 'pending' && (
                                <div className="flex items-center justify-end space-x-3">
                                  <button onClick={() => onUpdateStatus(app.id, 'rejected')} className="w-8 h-8 rounded-lg border border-red-500/30 flex items-center justify-center text-red-500 hover:bg-red-500/20 transition-all">✕</button>
                                  <button onClick={() => onUpdateStatus(app.id, 'approved')} className="w-8 h-8 rounded-lg border border-emerald-500/30 flex items-center justify-center text-emerald-500 hover:bg-emerald-500/20 transition-all">✓</button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: Users */}
            {activeTab === 'users' && (
              <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-lg border-emerald-500/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-500/10 bg-slate-500/5">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Пользователь</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Баланс</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Аккаунты</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-500/5">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-8 py-20 text-center text-slate-500 italic">
                            Пользователей пока нет.
                          </td>
                        </tr>
                      ) : (
                        users.map((accountUser) => (
                          <tr key={accountUser.id} className="hover:bg-slate-500/5 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={accountUser.avatar}
                                  className="w-9 h-9 rounded-full object-cover border border-emerald-500/20"
                                  alt={accountUser.nickname}
                                />
                                <span className="font-bold text-sm dark:text-white light:text-slate-900">{accountUser.nickname}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-slate-500 text-xs font-medium">{accountUser.email}</td>
                            <td className="px-8 py-6 font-black num-font dark:text-emerald-400 light:text-emerald-600">
                              {accountUser.balance.toLocaleString()} ₽
                            </td>
                            <td className="px-8 py-6">
                              <span className="px-2 py-0.5 bg-slate-500/10 rounded text-[10px] font-black uppercase tracking-widest">
                                {accountUser.accounts.length} акк.
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right font-mono text-[10px] text-slate-600">{accountUser.id}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: Games Management */}
            {activeTab === 'games' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black dark:text-white light:text-slate-900 uppercase tracking-[0.3em]">Каталог игр</h3>
                  <button onClick={() => setIsAddingGame(true)} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all">+ Добавить игру</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {games.map(game => (
                    <div key={game.id} onClick={() => setSelectedGameId(game.id)} className="glass-card p-6 rounded-[2.5rem] hover:translate-y-[-5px] transition-all cursor-pointer group border-emerald-500/5 hover:border-emerald-500/20">
                      <div className="flex items-center space-x-5 mb-5">
                        <img src={game.avatar} className="w-16 h-16 rounded-2xl object-cover border border-slate-500/20" alt={game.name} />
                        <div>
                          <h4 className="font-orbitron font-bold dark:text-white light:text-slate-900 leading-none mb-1 group-hover:text-emerald-500 transition-colors">{game.name}</h4>
                          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest num-font">{game.champions.length} чемпионов</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">{game.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Trainer Offers */}
            {activeTab === 'offers' && (
              <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-lg border-emerald-500/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-500/10 bg-slate-500/5">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Тренер</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Игра / Герой</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">График</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Цена (30 мин)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-500/5">
                      {activeSessions.length === 0 ? (
                        <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-500 italic">Предложений пока нет.</td></tr>
                      ) : (
                        activeSessions.map((session) => (
                          <tr key={session.id} className="hover:bg-slate-500/5 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center space-x-3">
                                <img src={session.avatar} className="w-8 h-8 rounded-full object-cover border border-emerald-500/20" alt="" />
                                <span className="font-bold text-sm dark:text-white light:text-slate-900">{session.trainerName}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="text-xs font-black uppercase tracking-wider text-emerald-500">{session.game}</span>
                              <span className="text-slate-500 ml-2">({session.champion})</span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex flex-wrap gap-1">
                                {session.days.map(d => <span key={d} className="text-[9px] px-1.5 py-0.5 bg-slate-500/10 rounded font-black">{d}</span>)}
                                <span className="text-[10px] ml-2 num-font text-slate-400">{session.startTime}-{session.endTime}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-right font-black num-font dark:text-emerald-400 light:text-emerald-600">{session.price30} ₽</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: Student Bookings */}
            {activeTab === 'bookings' && (
              <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-lg border-emerald-500/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-500/10 bg-slate-500/5">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ученик</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Тренер / Игра</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Время / Слот</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Стоимость</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Статус</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-500/5">
                      {bookings.length === 0 ? (
                        <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-500 italic">Записей пока нет.</td></tr>
                      ) : (
                        bookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-slate-500/5 transition-colors">
                            <td className="px-8 py-6 font-bold text-sm dark:text-white light:text-slate-900">{booking.studentName}</td>
                            <td className="px-8 py-6">
                              <p className="text-xs font-black dark:text-slate-200 light:text-slate-700 leading-none mb-1">{booking.trainerName}</p>
                              <p className="text-[10px] text-emerald-500 uppercase font-black tracking-widest">{booking.game}</p>
                            </td>
                            <td className="px-8 py-6">
                              <p className="text-[11px] font-bold num-font leading-none mb-1">{booking.date}</p>
                              <p className="text-[10px] text-slate-500 num-font">{booking.timeSlot} ({booking.duration} мин)</p>
                            </td>
                            <td className="px-8 py-6 font-black num-font text-sm">{booking.totalPrice} ₽</td>
                            <td className="px-8 py-6 text-right">
                              <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                booking.status === 'upcoming' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400'
                              }`}>
                                {booking.status === 'upcoming' ? 'Предстоит' : 'Завершено'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          /* SINGLE GAME DETAIL VIEW (Keep original logic) */
          <div className="animate-in slide-in-from-right duration-500">
             <div className="glass-card p-10 rounded-[3rem] border-emerald-500/20 shadow-xl">
              <div className="flex flex-col md:flex-row gap-10">
                <div className="md:w-1/3">
                  <img src={selectedGame?.avatar} className="w-full aspect-square rounded-[2rem] object-cover border-4 border-emerald-500/20 shadow-2xl mb-6" alt={selectedGame?.name} />
                  <h3 className="text-3xl font-orbitron text-2xl font-black dark:text-white light:text-slate-900 uppercase tracking-tighter mb-4">{selectedGame?.name}</h3>
                  <div className="p-5 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Описание</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{selectedGame?.description}</p>
                  </div>
                </div>
                <div className="md:w-2/3 space-y-8">
                  <div className="flex items-center justify-between border-b border-slate-500/10 pb-6">
                    <h4 className="text-[10px] font-black dark:text-white light:text-slate-900 uppercase tracking-[0.4em]">Управление чемпионами</h4>
                    <button onClick={() => setIsAddingChampion(true)} className="px-5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-emerald-500/20">+ Добавить персонажа</button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedGame?.champions.map(champ => (
                      <div key={champ.id} className="p-4 bg-slate-500/5 border border-slate-500/10 rounded-[1.5rem] flex flex-col items-center text-center group/champ transition-all hover:bg-emerald-500/5">
                        <img src={champ.avatar} className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-slate-500/10 group-hover/champ:border-emerald-500/40 transition-all" alt={champ.name} />
                        <span className="text-[11px] font-black dark:text-white light:text-slate-900 uppercase tracking-widest">{champ.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals for Games/Champs */}
      {isAddingGame && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in zoom-in duration-300">
          <div className="glass-card w-full max-w-lg rounded-[2.5rem] p-10 border-emerald-500/30 relative shadow-2xl">
            <button onClick={() => setIsAddingGame(false)} className="absolute top-10 right-10 text-slate-500 hover:text-emerald-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            <h3 className="font-orbitron text-2xl font-black dark:text-white light:text-slate-900 mb-8 uppercase tracking-tighter">Новая игра</h3>
            <form onSubmit={handleAddGameSubmit} className="space-y-6">
              <input required type="text" value={newGameName} onChange={(e) => setNewGameName(e.target.value)} className="w-full bg-white/5 dark:bg-slate-900 light:bg-white border border-slate-500/10 rounded-xl p-4 dark:text-white focus:outline-none focus:border-emerald-500 font-bold" placeholder="Название игры" />
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Обложка игры</label>
                <input
                  required
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewGameAvatarFile(e.target.files?.[0] || null)}
                  className="w-full bg-white/5 dark:bg-slate-900 light:bg-white border border-slate-500/10 rounded-xl p-4 dark:text-white focus:outline-none focus:border-emerald-500 font-medium file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-xs file:font-black file:uppercase file:tracking-widest file:text-white hover:file:bg-emerald-500"
                />
                {newGameAvatarFile && (
                  <p className="text-xs text-emerald-500 font-bold">{newGameAvatarFile.name}</p>
                )}
              </div>
              <textarea required rows={4} value={newGameDesc} onChange={(e) => setNewGameDesc(e.target.value)} className="w-full bg-white/5 dark:bg-slate-900 light:bg-white border border-slate-500/10 rounded-xl p-4 dark:text-white focus:outline-none focus:border-emerald-500 font-medium resize-none" placeholder="Описание" />
              <button type="submit" className="w-full py-5 bg-emerald-600 rounded-xl text-white font-orbitron font-bold tracking-[0.3em] uppercase hover:scale-105 transition-all shadow-xl">Создать</button>
            </form>
          </div>
        </div>
      )}

      {isAddingChampion && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in zoom-in duration-300">
          <div className="glass-card w-full max-w-md rounded-[2.5rem] p-10 border-emerald-500/30 relative shadow-2xl">
            <button onClick={() => setIsAddingChampion(false)} className="absolute top-10 right-10 text-slate-500 hover:text-emerald-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            <h3 className="font-orbitron text-2xl font-black dark:text-white light:text-slate-900 mb-8 uppercase tracking-tighter">Новый чемпион</h3>
            <form onSubmit={handleAddChampSubmit} className="space-y-6">
              <input required type="text" value={newChampName} onChange={(e) => setNewChampName(e.target.value)} className="w-full bg-white/5 dark:bg-slate-900 light:bg-white border border-slate-500/10 rounded-xl p-4 dark:text-white focus:outline-none focus:border-emerald-500 font-bold" placeholder="Имя персонажа" />
              <input required type="text" value={newChampAvatar} onChange={(e) => setNewChampAvatar(e.target.value)} className="w-full bg-white/5 dark:bg-slate-900 light:bg-white border border-slate-500/10 rounded-xl p-4 dark:text-white focus:outline-none focus:border-emerald-500 font-medium" placeholder="Ссылка на аватар" />
              <button type="submit" className="w-full py-5 bg-emerald-600 rounded-xl text-white font-orbitron font-bold tracking-[0.3em] uppercase hover:scale-105 transition-all shadow-xl">Добавить</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
