import React, { useState } from 'react';
import { BookingForm } from './BookingForm';
import { BecomeTrainerForm } from './BecomeTrainerForm';
import { CreateSessionModal } from './CreateSessionModal';
import { User, SessionActivity, BookingRecord, Game } from '../App';
import { TrainerApplication } from './AdminPanel';

export interface Trainer {
  id: string | number;
  sessionId?: string;
  trainerId?: string;
  name: string;
  specialization: string;
  game?: string;
  champion?: string;
  rating: number;
  reviews: number;
  price: string;
  avatar: string;
  availability?: { startTime: string; endTime: string; days: string[] };
  isDynamic?: boolean;
  prices?: { price30: number };
}

interface TrainersGalleryProps {
  onBack: () => void;
  onApply: (app: { nickname: string; game: string; champion: string; interviewTime: string }) => void;
  onCreateSession: (session: Omit<SessionActivity, 'id' | 'trainerName' | 'avatar'>) => void;
  onBook: (booking: Omit<BookingRecord, 'id' | 'studentName' | 'status'>) => void;
  onSelectTrainer: (id: string | number) => void;
  currentUser: User | null;
  applications: TrainerApplication[];
  activeSessions: SessionActivity[];
  bookings: BookingRecord[];
  games: Game[];
}

export const TrainersGallery: React.FC<TrainersGalleryProps> = ({
  onBack,
  onApply,
  onCreateSession,
  onBook,
  onSelectTrainer,
  currentUser,
  applications,
  activeSessions,
  bookings,
  games,
}) => {
  const [quickBookTrainer, setQuickBookTrainer] = useState<Trainer | null>(null);
  const [isBecomeTrainerOpen, setIsBecomeTrainerOpen] = useState(false);
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);

  const userApp = currentUser ? applications.find(app => app.nickname === currentUser.nickname) : null;

  const dynamicTrainers: Trainer[] = activeSessions.map(session => ({
    id: session.id,
    sessionId: session.id,
    trainerId: session.trainerId,
    name: session.trainerName,
    specialization: `${session.game} • ${session.champion}`,
    game: session.game,
    champion: session.champion,
    rating: 5,
    reviews: 0,
    price: `${session.price30} ₽ / 30 мин`,
    avatar: session.avatar,
    availability: { startTime: session.startTime, endTime: session.endTime, days: session.days },
    isDynamic: true,
    prices: { price30: session.price30 },
  }));

  const allTrainers = dynamicTrainers;

  const findGameAvatar = (gameName?: string) => {
    return games.find(game => game.name === gameName)?.avatar || 'https://via.placeholder.com/64';
  };

  const findChampionAvatar = (gameName?: string, championName?: string) => {
    const game = games.find(item => item.name === gameName);
    return game?.champions.find(champion => champion.name === championName)?.avatar || 'https://via.placeholder.com/64';
  };

  const renderTrainerAction = () => {
    if (!currentUser) {
      return null;
    }

    if (!userApp || userApp.status === 'rejected') {
      return (
        <button
          onClick={() => setIsBecomeTrainerOpen(true)}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg"
        >
          Стать тренером
        </button>
      );
    }

    if (userApp.status === 'pending') {
      return (
        <div className="px-8 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] cursor-default">
          Заявка на рассмотрении
        </div>
      );
    }

    if (userApp.status === 'approved') {
      return (
        <button
          onClick={() => setIsCreateSessionOpen(true)}
          className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-105 active:scale-95 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg border border-emerald-400/30"
        >
          Создать сессию
        </button>
      );
    }

    return null;
  };

  return (
    <section className="px-6 md:px-12 py-12 animate-in fade-in duration-700 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6">
          <button
            onClick={onBack}
            className="flex items-center text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 transition-colors font-bold uppercase tracking-widest text-[10px] group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Вернуться назад
          </button>
          {renderTrainerAction()}
        </div>

        <div className="text-center mb-16">
          <h2 className="font-orbitron text-4xl md:text-5xl font-black mb-6 glow-text tracking-tighter uppercase dark:text-white light:text-slate-900">Наставники</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm font-medium leading-relaxed">
            Выбери профессионала, который поможет тебе поднять ранг и освоить новые механики Wild Rift и Dota 2.
          </p>
        </div>

        {allTrainers.length === 0 ? (
          <div className="glass-card rounded-[2.5rem] border border-emerald-500/10 p-12 text-center">
            <p className="text-slate-400 text-sm">Пока нет опубликованных сессий. После одобрения заявки тренер может создать свою первую сессию.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allTrainers.map(trainer => (
              <div
                key={trainer.id}
                onClick={() => onSelectTrainer(trainer.id)}
                className={`glass-card p-7 rounded-[2.5rem] hover:translate-y-[-8px] transition-all duration-500 group flex flex-col items-center text-center cursor-pointer border-white/5 hover:border-emerald-500/40 ${
                  trainer.isDynamic ? 'ring-2 ring-emerald-500/30' : ''
                }`}
              >
                <div className="relative mb-6">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-emerald-500/20 group-hover:border-emerald-500/50 transition-all duration-500 p-1 shadow-sm">
                    <img src={trainer.avatar} alt={trainer.name} className="w-full h-full object-cover rounded-full transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center shadow-lg">
                    <span className="text-amber-500 text-[10px] mr-1.5 font-bold">★</span>
                    <span className="text-[11px] font-black num-font text-white">{trainer.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="mb-6 flex-grow w-full">
                  <h4 className="text-base font-bold font-orbitron dark:text-white light:text-slate-900 group-hover:text-emerald-500 transition-colors leading-tight mb-6">
                    {trainer.name}
                  </h4>

                  <div className="flex items-start justify-center space-x-8">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 transition-all p-0.5 bg-black/40 shadow-inner mb-2">
                        <img src={findGameAvatar(trainer.game)} alt={trainer.game} className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest text-center max-w-[72px] truncate">
                        {trainer.game}
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 transition-all p-0.5 bg-black/40 shadow-inner mb-2">
                        <img src={findChampionAvatar(trainer.game, trainer.champion)} alt={trainer.champion} className="w-full h-full object-cover rounded-full" />
                      </div>
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest text-center max-w-[72px] truncate">
                        {trainer.champion}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full pt-5 mt-2 border-t border-slate-500/10 space-y-4">
                  <div className="flex items-center justify-center text-slate-500 text-[10px] font-black uppercase tracking-widest num-font">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-2 text-emerald-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    {trainer.reviews} отзывов
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-col">
                      <span className="text-slate-500 text-[9px] uppercase font-black tracking-widest mb-1">Тариф</span>
                      <span className="text-xl font-black num-font dark:text-white light:text-slate-900 tracking-tight">{trainer.price}</span>
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setQuickBookTrainer(trainer);
                      }}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95"
                    >
                      Записаться
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {quickBookTrainer && <BookingForm trainer={quickBookTrainer} onBook={onBook} bookings={bookings} onClose={() => setQuickBookTrainer(null)} />}

      {isBecomeTrainerOpen && (
        <BecomeTrainerForm
          onClose={() => setIsBecomeTrainerOpen(false)}
          onSubmit={app => onApply({ ...app, nickname: currentUser?.nickname || 'Гость' })}
          games={games}
        />
      )}

      {isCreateSessionOpen && (
        <CreateSessionModal
          onClose={() => setIsCreateSessionOpen(false)}
          initialData={userApp ? { game: userApp.game, champion: userApp.champion } : undefined}
          onSubmit={data => onCreateSession(data)}
          games={games}
        />
      )}
    </section>
  );
};
