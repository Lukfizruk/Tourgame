import React, { useMemo, useState } from 'react';
import { BookingForm } from './BookingForm';
import { BookingRecord, Game, SessionActivity } from '../App';
import { Trainer } from './TrainersGallery';

interface TrainerDetailPageProps {
  trainerId: string | number | null;
  onBack: () => void;
  onBook: (booking: Omit<BookingRecord, 'id' | 'studentName' | 'status'>) => void;
  bookings: BookingRecord[];
  activeSessions: SessionActivity[];
  games: Game[];
}

const MOCK_REVIEWS = [
  {
    id: 1,
    author: 'Slayer99',
    rating: 5,
    text: 'Отличный разбор. Получил конкретный план тренировок и поднял винрейт.',
    date: '2 дня назад',
  },
  {
    id: 2,
    author: 'CarryFocus',
    rating: 5,
    text: 'Хорошо объясняет макро и тайминги, материал реально применим в матчах.',
    date: '1 неделю назад',
  },
];

export const TrainerDetailPage: React.FC<TrainerDetailPageProps> = ({
  trainerId,
  onBack,
  onBook,
  bookings,
  activeSessions,
  games,
}) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const trainer = useMemo<Trainer | null>(() => {
    if (!trainerId) {
      return null;
    }

    const session = activeSessions.find(item => item.id === String(trainerId));
    if (!session) {
      return null;
    }

    return {
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
    };
  }, [activeSessions, trainerId]);

  const gameAvatar = useMemo(() => {
    if (!trainer?.game) {
      return '';
    }
    return games.find(game => game.name === trainer.game)?.avatar || '';
  }, [games, trainer]);

  const championAvatar = useMemo(() => {
    if (!trainer?.game || !trainer?.champion) {
      return '';
    }
    const game = games.find(item => item.name === trainer.game);
    return game?.champions.find(champion => champion.name === trainer.champion)?.avatar || '';
  }, [games, trainer]);

  if (!trainer) {
    return (
      <section className="px-6 md:px-12 py-12 animate-in fade-in duration-500">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="mb-8 flex items-center text-emerald-500 hover:text-emerald-600 transition-colors font-black uppercase tracking-widest text-[10px] group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            К списку наставников
          </button>
          <div className="glass-card rounded-[2.5rem] border border-emerald-500/20 p-12 text-center">
            <h2 className="font-orbitron text-2xl font-black text-white uppercase tracking-tighter mb-3">Сессия не найдена</h2>
            <p className="text-slate-400 text-sm">Вероятно, тренер удалил сессию или она была деактивирована.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="animate-in fade-in duration-700 min-h-screen">
      <div className="relative h-[320px] md:h-[420px] w-full overflow-hidden">
        <img src={trainer.avatar} alt={trainer.name} className="w-full h-full object-cover opacity-20 blur-[10px] scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 pb-12 max-w-7xl mx-auto w-full">
          <button
            onClick={onBack}
            className="flex items-center text-emerald-500 hover:text-emerald-400 transition-colors font-black uppercase tracking-widest text-[10px] group mb-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            К списку наставников
          </button>

          <div className="flex flex-col md:flex-row items-end md:items-center gap-8">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] overflow-hidden border-4 border-emerald-500/30 shadow-2xl p-1 bg-slate-900">
              <img src={trainer.avatar} className="w-full h-full object-cover rounded-[2rem]" alt={trainer.name} />
            </div>

            <div className="flex-grow space-y-4">
              <h1 className="text-4xl md:text-6xl font-orbitron font-black text-white glow-text uppercase tracking-tighter">{trainer.name}</h1>
              <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl">
                Индивидуальные тренировки по {trainer.game}. Акцент на персональные ошибки, макро-решения и стабильный рост рейтинга.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-[2.5rem] border-white/5 shadow-xl">
            <h3 className="font-orbitron text-[10px] font-black text-slate-500 mb-6 uppercase tracking-[0.4em]">Специализация</h3>
            <div className="space-y-5">
              <div className="flex items-center bg-emerald-500/5 p-3 rounded-2xl border border-emerald-500/20">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 mr-3">
                  <img src={gameAvatar || 'https://via.placeholder.com/64'} alt={trainer.game} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Игра</p>
                  <p className="text-sm font-bold text-white">{trainer.game}</p>
                </div>
              </div>

              <div className="flex items-center bg-white/5 p-3 rounded-2xl border border-white/10">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 mr-3">
                  <img src={championAvatar || 'https://via.placeholder.com/64'} alt={trainer.champion} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Герой</p>
                  <p className="text-sm font-bold text-white">{trainer.champion}</p>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2">Расписание</p>
                <p className="text-sm text-slate-300 font-bold num-font">{trainer.availability?.days.join(', ')}</p>
                <p className="text-xs text-slate-400 num-font mt-1">
                  {trainer.availability?.startTime} - {trainer.availability?.endTime}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-emerald-500/10 bg-emerald-500/5 shadow-lg">
            <h3 className="font-orbitron text-[10px] font-black text-slate-500 mb-6 uppercase tracking-[0.4em]">Стоимость</h3>
            <p className="text-4xl font-black num-font text-white tracking-tighter">{trainer.prices?.price30 || 750} ₽</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-1">за 30 минут</p>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="w-full mt-8 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-orbitron font-bold tracking-[0.2em] text-[10px] uppercase transition-all shadow-xl active:scale-95"
            >
              Записаться на занятие
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-6">
            <h3 className="font-orbitron text-xl font-bold text-white uppercase tracking-widest flex items-center">
              Форматы занятий <span className="ml-4 h-[1px] flex-grow bg-white/5"></span>
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="glass-card p-6 rounded-[2rem] border-white/5 hover:border-emerald-500/30 transition-all">
                <h4 className="text-base font-black text-white uppercase tracking-wide mb-2">Разбор реплея (VOD)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Анализ ключевых моментов игры и разбор ошибок с конкретными рекомендациями.</p>
              </div>
              <div className="glass-card p-6 rounded-[2rem] border-white/5 hover:border-emerald-500/30 transition-all">
                <h4 className="text-base font-black text-white uppercase tracking-wide mb-2">Live-коучинг</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Сопровождение в реальном времени во время матча с фокусом на принятии решений.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="font-orbitron text-xl font-bold text-white uppercase tracking-widest">Отзывы учеников</h3>
            <div className="space-y-6">
              {MOCK_REVIEWS.map(review => (
                <div key={review.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-white">{review.author}</p>
                      <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{review.date}</p>
                    </div>
                    <div className="flex text-amber-500 space-x-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span key={index} className={index < review.rating ? 'opacity-100' : 'opacity-20'}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 leading-loose italic">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isBookingOpen && <BookingForm trainer={trainer} onBook={onBook} bookings={bookings} onClose={() => setIsBookingOpen(false)} />}
    </section>
  );
};
