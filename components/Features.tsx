
import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  onClick?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, color, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`glass-card p-10 rounded-[2.5rem] hover:translate-y-[-10px] transition-all duration-500 group cursor-pointer overflow-hidden relative border-emerald-500/10 hover:border-emerald-500/40`}
    >
      {/* Background Glow */}
      <div className={`absolute -right-16 -bottom-16 w-48 h-48 ${color} opacity-0 group-hover:opacity-20 blur-[80px] transition-opacity duration-700 rounded-full`}></div>
      
      <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-110 group-hover:border-emerald-500/50 transition-all duration-500">
        <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">{icon}</span>
      </div>
      
      <h3 className="text-2xl font-orbitron font-bold mb-5 group-hover:text-emerald-300 transition-colors duration-300 tracking-tight">
        {title}
      </h3>
      
      <p className="text-slate-400 text-sm leading-relaxed mb-4 group-hover:text-slate-300 transition-colors">
        {description}
      </p>
      
      <div className="mt-8 flex items-center text-[10px] font-bold tracking-[0.3em] uppercase opacity-40 group-hover:opacity-100 transition-all duration-300 text-emerald-400">
        ПЕРЕЙТИ В РАЗДЕЛ 
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-3 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
    </div>
  );
};

interface FeaturesProps {
  onTrainingClick: () => void;
}

export const Features: React.FC<FeaturesProps> = ({ onTrainingClick }) => {
  const items = [
    {
      title: "Онлайн тренинг",
      description: "Мастер-классы и тренировки в MMOBA игры за разных персонажей. Отточи свои навыки с лучшими наставниками и стань непобедимым героем арены.",
      icon: "🎮",
      color: "bg-emerald-600",
      isTraining: true
    },
    {
      title: "Турниры",
      description: "Платные и бесплатные турниры с реальными призами. Проверь себя в честной борьбе, поднимайся в рейтинге и забирай награды каждую неделю.",
      icon: "🏆",
      color: "bg-emerald-800"
    },
    {
      title: "Дуэли",
      description: "Персональные дуэли между игроками. Вызывай соперников 1 на 1, докажи свое превосходство и зарабатывай репутацию в сообществе профессионалов.",
      icon: "⚔️",
      color: "bg-teal-700"
    }
  ];

  return (
    <section className="px-6 md:px-12 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {items.map((item, idx) => (
          <FeatureCard 
            key={idx}
            title={item.title}
            description={item.description}
            icon={item.icon}
            color={item.color}
            onClick={item.isTraining ? onTrainingClick : undefined}
          />
        ))}
      </div>
    </section>
  );
};