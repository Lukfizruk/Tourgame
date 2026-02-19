
import React, { useState, useRef } from 'react';
import { User, GameAccount, ChampionRecord, ProfileEvent, BookingRecord } from '../App';
import { TrainerApplication } from './AdminPanel';

interface ProfilePageProps {
  user: User;
  onUpdate: (fields: Partial<User>) => void;
  onBack: () => void;
  applications: TrainerApplication[];
  bookings: BookingRecord[];
}

type ProfileTab = 'feed' | 'training' | 'tournaments' | 'duels' | 'settings';

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdate, onBack, applications, bookings }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('feed');
  const [nickname, setNickname] = useState(user.nickname);
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const [isSaved, setIsSaved] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  
  const [newGame, setNewGame] = useState('Wild Rift');
  const [newNickname, setNewNickname] = useState('');
  const [newId, setNewId] = useState('');

  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [newChampName, setNewChampName] = useState('');
  const [newChampRank, setNewChampRank] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Фильтрация записей для текущего пользователя
  const myAsStudentBookings = bookings.filter(b => b.studentName === user.nickname);
  const myAsTrainerBookings = bookings.filter(b => b.trainerName === user.nickname);
  const isTrainer = applications.some(app => app.nickname === user.nickname && app.status === 'approved');

  const handleSave = () => {
    onUpdate({ nickname, bio, avatar });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Файл слишком большой. Максимальный размер 2МБ.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs: { id: ProfileTab; label: string; icon: string }[] = [
    { id: 'feed', label: 'События', icon: '🔔' },
    { id: 'training', label: 'Тренинги', icon: '🎮' },
    { id: 'tournaments', label: 'Турниры', icon: '🏆' },
    { id: 'duels', label: 'Дуэли', icon: '⚔️' },
    { id: 'settings', label: 'Настройки', icon: '⚙️' },
  ];

  const getEventStyle = (type: ProfileEvent['type']) => {
    switch (type) {
      case 'approval': return 'border-emerald-500/30 bg-emerald-500/5';
      case 'rejection': return 'border-red-500/30 bg-red-500/5';
      case 'booking_in': return 'border-teal-500/30 bg-teal-500/5';
      case 'session_created': return 'border-blue-500/30 bg-blue-500/5';
      default: return 'border-slate-500/20 bg-slate-500/5';
    }
  };

  return (
    <section className="px-6 md:px-12 py-12 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-10 flex items-center text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 transition-colors font-black uppercase tracking-widest text-[10px] group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          На главную
        </button>

        <div className="flex overflow-x-auto pb-4 mb-10 gap-3 no-scrollbar border-b border-slate-500/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-3 px-7 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
                activeTab === tab.id
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'bg-white/5 dark:bg-white/5 light:bg-slate-200/50 border-transparent text-slate-500 hover:bg-emerald-500/5'
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="space-y-8">
            <div className="glass-card p-10 rounded-[2.5rem] border-emerald-500/10 text-center relative overflow-hidden shadow-lg">
              <div className="relative inline-block mb-7 group">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <div onClick={handleAvatarClick} className="w-36 h-36 rounded-[2rem] overflow-hidden border-4 border-emerald-500/30 shadow-2xl cursor-pointer relative">
                  <img src={avatar} alt={user.nickname} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-emerald-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">Обновить</span>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-orbitron font-black dark:text-white light:text-slate-900 mb-1 leading-none">{user.nickname}</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8">{user.email}</p>
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-7 text-left mb-4">
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2">Баланс</p>
                <p className="text-4xl font-black num-font dark:text-white light:text-slate-900 tracking-tighter">{user.balance.toLocaleString()} ₽</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {activeTab === 'feed' && (
              <div className="glass-card p-10 rounded-[3rem] border-emerald-500/10 min-h-[500px] shadow-lg">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-500/10">
                  <h3 className="text-xl font-orbitron font-bold dark:text-white light:text-slate-900 uppercase tracking-tighter">Лента событий</h3>
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] bg-emerald-500/10 px-4 py-1.5 rounded-full">{user.events.length} записей</span>
                </div>
                
                <div className="relative space-y-6 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-500/10">
                  {user.events.length > 0 ? (
                    user.events.map((event) => (
                      <div key={event.id} className={`relative pl-12 transition-all hover:translate-x-1 duration-300 group`}>
                        <div className={`absolute left-0 top-0 w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm z-10 transition-transform group-hover:scale-110 ${getEventStyle(event.type)}`}>
                          <span className="text-lg">{event.icon}</span>
                        </div>
                        <div className="p-5 glass-card rounded-2xl border-slate-500/10 group-hover:border-emerald-500/30 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-black dark:text-white light:text-slate-900 uppercase tracking-wide">{event.title}</h4>
                            <span className="text-[10px] font-bold num-font text-slate-500 bg-black/5 px-2 py-1 rounded-lg">{event.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{event.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                      <div className="text-5xl mb-6">📭</div>
                      <p className="text-sm font-black uppercase tracking-widest text-slate-500">Ваша лента пока пуста</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'training' && (
              <div className="space-y-10">
                {/* Расписание как ученика */}
                <div className="glass-card p-10 rounded-[3rem] border-emerald-500/10 shadow-lg">
                  <h3 className="text-xl font-orbitron font-bold dark:text-white light:text-slate-900 uppercase tracking-tighter mb-8 pb-4 border-b border-white/5">
                    Мои занятия (Ученик)
                  </h3>
                  {myAsStudentBookings.length > 0 ? (
                    <div className="space-y-4">
                      {myAsStudentBookings.map(b => (
                        <div key={b.id} className="p-5 bg-slate-500/5 border border-slate-500/10 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-emerald-500/10 rounded-xl">
                              <span className="text-xl">🎓</span>
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">{b.game} • {b.champion}</p>
                              <p className="text-sm font-bold dark:text-white leading-none">Тренер: {b.trainerName}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black num-font dark:text-white">{b.date}</p>
                            <p className="text-[10px] font-bold text-slate-500 num-font uppercase tracking-widest">{b.timeSlot}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center opacity-40">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">Вы еще не записывались на занятия</p>
                    </div>
                  )}
                </div>

                {/* Расписание как тренера */}
                {isTrainer && (
                  <div className="glass-card p-10 rounded-[3rem] border-teal-500/10 shadow-lg">
                    <h3 className="text-xl font-orbitron font-bold dark:text-white light:text-slate-900 uppercase tracking-tighter mb-8 pb-4 border-b border-white/5">
                      Мои ученики (Учитель)
                    </h3>
                    {myAsTrainerBookings.length > 0 ? (
                      <div className="space-y-4">
                        {myAsTrainerBookings.map(b => (
                          <div key={b.id} className="p-5 bg-teal-500/5 border border-teal-500/10 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="p-3 bg-teal-500/10 rounded-xl">
                                <span className="text-xl">👨‍🏫</span>
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest mb-1">{b.game} • {b.champion}</p>
                                <p className="text-sm font-bold dark:text-white leading-none">Ученик: {b.studentName}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black num-font dark:text-white">{b.date}</p>
                              <p className="text-[10px] font-bold text-slate-500 num-font uppercase tracking-widest">{b.timeSlot}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center opacity-40">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Учеников пока нет</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="glass-card p-10 rounded-[3rem] border-emerald-500/10 shadow-lg">
                <h3 className="text-xl font-orbitron font-bold dark:text-white light:text-slate-900 mb-10 pb-6 border-b border-slate-500/10 uppercase tracking-tighter">Настройки</h3>
                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Никнейм</label>
                    <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full bg-slate-500/5 dark:bg-slate-900 border border-slate-500/10 rounded-2xl p-5 dark:text-white focus:outline-none focus:border-emerald-500 font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">О себе</label>
                    <textarea rows={5} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-slate-500/5 dark:bg-slate-900 border border-slate-500/10 rounded-2xl p-5 dark:text-white focus:outline-none focus:border-emerald-500 resize-none" />
                  </div>
                  <div className="pt-6"><button onClick={handleSave} className="px-12 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl text-white font-orbitron font-bold tracking-[0.3em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl">Сохранить</button></div>
                </div>
              </div>
            )}

            {['tournaments', 'duels'].includes(activeTab) && (
              <div className="glass-card p-12 rounded-[3rem] border-emerald-500/10 min-h-[450px] flex flex-col items-center justify-center text-center shadow-lg">
                <div className="w-24 h-24 bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mb-6"><span className="text-4xl opacity-30">📅</span></div>
                <h3 className="text-sm font-black dark:text-white light:text-slate-900 uppercase tracking-[0.4em] mb-3">Здесь пока пусто</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
