
import React, { useState, useEffect } from 'react';
import { Trainer } from './TrainersGallery';
import { BookingRecord } from '../App';

interface BookingFormProps {
  trainer: Trainer;
  onBook: (booking: Omit<BookingRecord, 'id' | 'studentName' | 'status'>) => void;
  bookings: BookingRecord[];
  onClose: () => void;
}

const DURATIONS = [
  { value: 30, label: '30 мин' },
  { value: 60, label: '1 час' },
  { value: 90, label: '1.5 часа' },
  { value: 120, label: '2 часа' },
  { value: 150, label: '2.5 часа' },
  { value: 180, label: '3 часа' },
];

export const BookingForm: React.FC<BookingFormProps> = ({ trainer, onBook, bookings, onClose }) => {
  const [duration, setDuration] = useState(60);
  const [selectedDay, setSelectedDay] = useState(trainer.availability?.days[0] || 'Пн');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [timeSlots, setTimeSlots] = useState<{ slot: string; isTaken: boolean }[]>([]);

  useEffect(() => {
    const start = trainer.availability?.startTime || '09:00';
    const end = trainer.availability?.endTime || '21:00';
    const slots: { slot: string; isTaken: boolean }[] = [];
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    let currentTotalMinutes = startH * 60 + startM;
    const endTotalMinutes = endH * 60 + endM;

    // Фильтруем записи только для этого тренера и выбранного дня
    const trainerBookings = bookings.filter(b => b.trainerName === trainer.name && b.date === selectedDay);

    while (currentTotalMinutes + duration <= endTotalMinutes) {
      const h = Math.floor(currentTotalMinutes / 60).toString().padStart(2, '0');
      const m = (currentTotalMinutes % 60).toString().padStart(2, '0');
      const blockEnd = currentTotalMinutes + duration;
      const eh = Math.floor(blockEnd / 60).toString().padStart(2, '0');
      const em = (blockEnd % 60).toString().padStart(2, '0');
      
      const slotString = `${h}:${m} - ${eh}:${em}`;
      
      // Проверяем пересечение с существующими записями
      const isTaken = trainerBookings.some(b => {
        const [bStart, bEnd] = b.timeSlot.split(' - ');
        const [bStartH, bStartM] = bStart.split(':').map(Number);
        const [bEndH, bEndM] = bEnd.split(':').map(Number);
        const bStartMin = bStartH * 60 + bStartM;
        const bEndMin = bEndH * 60 + bEndM;

        const sStartMin = currentTotalMinutes;
        const sEndMin = blockEnd;

        // Пересечение: начало или конец слота попадает в интервал существующей записи
        return (sStartMin < bEndMin && sEndMin > bStartMin);
      });

      slots.push({ slot: slotString, isTaken });
      currentTotalMinutes += 30; // Шаг выбора начала слота 30 мин
    }
    setTimeSlots(slots);
    if (slots.find(s => s.slot === selectedSlot && s.isTaken)) setSelectedSlot('');
  }, [trainer.availability, duration, selectedDay, bookings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalPrice = (duration / 30) * (trainer.prices?.price30 || 750);
    onBook({
      sessionId: trainer.sessionId || (trainer.isDynamic ? String(trainer.id) : undefined),
      trainerId: trainer.trainerId,
      trainerName: trainer.name,
      game: trainer.game || 'Wild Rift',
      champion: trainer.champion || 'Unknown',
      date: selectedDay,
      timeSlot: selectedSlot,
      duration,
      totalPrice
    });
    alert(`Запись подтверждена! \n\nТренер: ${trainer.name}\nДень: ${selectedDay}\nВремя: ${selectedSlot}\nК оплате: ${totalPrice} ₽`);
    onClose();
  };

  const pricePer30 = trainer.prices?.price30 || 750;
  const totalPrice = (duration / 30) * pricePer30;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 dark:bg-black/80 light:bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-2xl rounded-[3rem] p-8 md:p-12 relative border-emerald-500/30 shadow-2xl overflow-y-auto max-h-[95vh]">
        <button onClick={onClose} className="absolute top-10 right-10 text-slate-500 hover:text-emerald-500 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
        <div className="text-center mb-10"><h2 className="font-orbitron text-3xl font-black mb-3 dark:text-white light:text-slate-900 glow-text uppercase tracking-tighter">Запись на обучение</h2><div className="flex items-center justify-center space-x-3 text-emerald-500 font-black text-[10px] uppercase tracking-[0.3em]"><span>{trainer.game}</span><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span><span>{trainer.champion}</span></div></div>
        <div className="flex items-center space-x-5 mb-10 p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl"><img src={trainer.avatar} className="w-16 h-16 rounded-2xl object-cover border border-emerald-500/20" alt={trainer.name} /><div><p className="text-slate-500 text-[9px] uppercase font-black tracking-widest mb-1">Ваш наставник</p><p className="text-xl font-orbitron font-bold dark:text-white light:text-slate-900 leading-none">{trainer.name}</p></div></div>
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Выберите день недели</label><div className="flex flex-wrap gap-2.5">{trainer.availability?.days.map(day => (<button key={day} type="button" onClick={() => setSelectedDay(day)} className={`w-11 h-11 rounded-2xl text-[11px] font-black transition-all border ${selectedDay === day ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg' : 'bg-white/5 dark:bg-white/5 light:bg-slate-200/50 border-white/10 dark:border-white/10 light:border-slate-300 text-slate-500 hover:border-emerald-500/40'}`}>{day}</button>))}</div></div>
            <div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Длительность тренировки</label><div className="grid grid-cols-3 gap-2">{DURATIONS.map(dur => (<button key={dur.value} type="button" onClick={() => setDuration(dur.value)} className={`py-3.5 rounded-2xl border text-[10px] font-black uppercase transition-all num-font ${duration === dur.value ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg' : 'bg-white/5 dark:bg-white/5 light:bg-slate-200/50 border-white/10 dark:border-white/10 light:border-slate-300 text-slate-500 hover:border-emerald-500/20'}`}>{dur.label}</button>))}</div></div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Доступные окна ({selectedDay}, по {duration} мин)</label>
            {timeSlots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {timeSlots.map((item) => (
                  <button 
                    key={item.slot} 
                    type="button" 
                    disabled={item.isTaken}
                    onClick={() => setSelectedSlot(item.slot)} 
                    className={`py-4 px-4 rounded-2xl border text-[12px] font-bold num-font transition-all ${
                      selectedSlot === item.slot 
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-500 dark:text-emerald-400 shadow-md' 
                        : item.isTaken 
                          ? 'bg-red-500/5 border-red-500/20 text-red-500/30 line-through cursor-not-allowed' 
                          : 'bg-slate-900/20 dark:bg-slate-900/20 light:bg-white border-slate-500/10 dark:border-white/5 light:border-slate-200 text-slate-500 hover:border-emerald-500/30'
                    }`}
                  >
                    {item.slot}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-10 border-2 border-dashed border-emerald-500/10 rounded-3xl text-center">
                <p className="text-xs text-red-400/70 font-bold uppercase tracking-widest italic">Нет окон для выбранной длительности</p>
              </div>
            )}
          </div>
          <div className="pt-10 border-t border-slate-500/10 flex flex-col sm:flex-row items-center justify-between gap-8"><div className="text-center sm:text-left"><span className="block text-[10px] uppercase font-black tracking-[0.3em] text-slate-500 mb-1">Итого к оплате</span><span className="text-4xl font-black num-font dark:text-white light:text-slate-900 tracking-tighter">{totalPrice.toLocaleString()} ₽</span></div><button type="submit" disabled={!selectedSlot} className="w-full sm:w-auto px-16 py-6 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl text-white font-orbitron font-black tracking-[0.4em] uppercase hover:scale-[1.05] active:scale-[0.95] transition-all shadow-xl disabled:opacity-30">Записаться</button></div>
        </form>
      </div>
    </div>
  );
};
