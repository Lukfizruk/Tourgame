
import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { TrainersGallery } from './components/TrainersGallery';
import { AuthModal } from './components/AuthModal';
import { ProfilePage } from './components/ProfilePage';
import { AdminPanel, TrainerApplication } from './components/AdminPanel';
import { supabase } from './lib/supabase';

export interface Champion {
  id: string;
  name: string;
  avatar: string;
}

export interface Game {
  id: string;
  name: string;
  avatar: string;
  description: string;
  champions: Champion[];
}

export interface ChampionRecord {
  id: string;
  name: string;
  rank: string;
}

export interface GameAccount {
  id: string;
  game: string;
  nickname: string;
  gameId: string;
  champions: ChampionRecord[];
}

export interface ProfileEvent {
  id: string;
  type: 'application' | 'approval' | 'rejection' | 'booking_in' | 'booking_out' | 'session_created';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export interface User {
  email: string;
  nickname: string;
  balance: number;
  avatar: string;
  bio?: string;
  id: string;
  accounts: GameAccount[];
  events: ProfileEvent[];
}

export interface SessionActivity {
  id: string;
  trainerName: string;
  game: string;
  champion: string;
  days: string[];
  startTime: string;
  endTime: string;
  sessionType: string;
  price30: number; 
  avatar: string;
}

export interface BookingRecord {
  id: string;
  studentName: string;
  trainerName: string;
  game: string;
  champion: string;
  date: string;
  timeSlot: string;
  duration: number;
  totalPrice: number;
  status: 'upcoming' | 'completed';
}

type SupabaseApplicationRow = {
  id: number | string;
  nickname: string;
  game: string;
  champion: string;
  status: TrainerApplication['status'];
  created_at: string;
};

const INITIAL_APPS: TrainerApplication[] = [];

const INITIAL_GAMES: Game[] = [
  {
    id: 'g1',
    name: 'Wild Rift',
    avatar: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&h=400&auto=format&fit=crop',
    description: 'Мобильная версия легендарной League of Legends. Быстрые матчи, знакомые герои и высокий уровень соревновательности.',
    champions: [
      { id: 'c1', name: 'Ahri', avatar: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=200&h=200&auto=format&fit=crop' },
      { id: 'c2', name: 'Yasuo', avatar: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&h=200&auto=format&fit=crop' }
    ]
  },
  {
    id: 'g2',
    name: 'Dota 2',
    avatar: 'https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?q=80&w=400&h=400&auto=format&fit=crop',
    description: 'Хардкорная MOBA от Valve. Бесконечная глубина стратегии и огромный выбор уникальных героев.',
    champions: [
      { id: 'c3', name: 'Pudge', avatar: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=200&h=200&auto=format&fit=crop' }
    ]
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'trainers' | 'profile' | 'admin'>('home');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [applications, setApplications] = useState<TrainerApplication[]>(INITIAL_APPS);
  const [activeSessions, setActiveSessions] = useState<SessionActivity[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [games, setGames] = useState<Game[]>(INITIAL_GAMES);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const mapApplicationRow = (row: SupabaseApplicationRow): TrainerApplication => ({
    id: String(row.id),
    nickname: row.nickname,
    game: row.game,
    champion: row.champion,
    status: row.status,
    date: row.created_at.split('T')[0]
  });

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : '';
  }, [theme]);

  useEffect(() => {
    let isMounted = true;

    const loadApplications = async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('id, nickname, game, champion, status, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load applications:', error.message);
        return;
      }

      if (!isMounted || !data) {
        return;
      }

      setApplications((data as SupabaseApplicationRow[]).map(mapApplicationRow));
    };

    loadApplications();

    return () => {
      isMounted = false;
    };
  }, []);

  const addEvent = (event: Omit<ProfileEvent, 'id' | 'timestamp'>) => {
    if (!user) return;
    const newEvent: ProfileEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })
    };
    setUser(prev => prev ? { ...prev, events: [newEvent, ...prev.events] } : null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleNavigateToTrainers = () => {
    setCurrentView('trainers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToProfile = () => {
    if (user) {
      setCurrentView('profile');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleNavigateToAdmin = () => {
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegister = (nickname: string, email: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      nickname,
      balance: 1000,
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&h=200&auto=format&fit=crop',
      accounts: [],
      events: []
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const handleUpdateUser = (updatedFields: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedFields });
    }
  };

  const handlePlayClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    }
  };

  const handleAddApplication = async (app: Omit<TrainerApplication, 'id' | 'status' | 'date'>) => {
    const tempId = Math.random().toString(36).substr(2, 9);
    const newApp: TrainerApplication = {
      ...app,
      id: tempId,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    setApplications(prev => [newApp, ...prev]);

    const { data, error } = await supabase
      .from('applications')
      .insert({
        nickname: app.nickname,
        game: app.game,
        champion: app.champion,
        status: 'pending'
      })
      .select('id, nickname, game, champion, status, created_at')
      .single();

    if (error) {
      console.error('Failed to create application:', error.message);
      setApplications(prev => prev.filter(item => item.id !== tempId));
      return;
    }

    if (data) {
      const savedApp = mapApplicationRow(data as SupabaseApplicationRow);
      setApplications(prev => prev.map(item => item.id === tempId ? savedApp : item));
    }

    addEvent({
      type: 'application',
      title: 'Заявка отправлена',
      description: `Вы подали заявку на роль тренера в игре ${app.game}.`,
      icon: '📨'
    });
  };

  const handleUpdateApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
    let previousStatus: TrainerApplication['status'] | undefined;
    setApplications(prev => prev.map(app => {
      if (app.id !== id) {
        return app;
      }
      previousStatus = app.status;
      return { ...app, status };
    }));

    const idFilter = /^\d+$/.test(id) ? Number(id) : id;
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', idFilter);

    if (error) {
      console.error('Failed to update application status:', error.message);
      if (previousStatus) {
        setApplications(prev => prev.map(app => app.id === id ? { ...app, status: previousStatus! } : app));
      }
      return;
    }

    const targetApp = applications.find(a => a.id === id);
    if (targetApp && user && targetApp.nickname === user.nickname) {
      addEvent({
        type: status === 'approved' ? 'approval' : 'rejection',
        title: status === 'approved' ? 'Заявка одобрена!' : 'Заявка отклонена',
        description: status === 'approved' 
          ? `Теперь вы официально тренер в ${targetApp.game}. Пора создавать сессии!` 
          : `К сожалению, ваша заявка на роль тренера в ${targetApp.game} была отклонена.`,
        icon: status === 'approved' ? '✅' : '❌'
      });
    }
  };

  const handleCreateSession = (session: Omit<SessionActivity, 'id' | 'trainerName' | 'avatar'>) => {
    if (!user) return;
    const newSession: SessionActivity = {
      ...session,
      id: Math.random().toString(36).substr(2, 9),
      trainerName: user.nickname,
      avatar: user.avatar
    };
    setActiveSessions(prev => [newSession, ...prev]);
    
    addEvent({
      type: 'session_created',
      title: 'Сессия опубликована',
      description: `Ваше предложение по обучению (${session.game}, ${session.champion}) теперь доступно в общем списке.`,
      icon: '🎮'
    });
  };

  const handleCreateBooking = (booking: Omit<BookingRecord, 'id' | 'studentName' | 'status'>) => {
    const newBooking: BookingRecord = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9),
      studentName: user?.nickname || 'Гость',
      status: 'upcoming'
    };
    setBookings(prev => [newBooking, ...prev]);
    
    addEvent({
      type: 'booking_out',
      title: 'Запись к тренеру',
      description: `Вы записались на занятие к ${booking.trainerName} (${booking.game}).`,
      icon: '📅'
    });

    if (user && booking.trainerName === user.nickname) {
      addEvent({
        type: 'booking_in',
        title: 'Новый ученик!',
        description: `Ученик записался к вам на занятие по ${booking.game} (${booking.timeSlot}).`,
        icon: '👤'
      });
    }
  };

  const handleAddGame = (game: Omit<Game, 'id' | 'champions'>) => {
    const newGame: Game = {
      ...game,
      id: Math.random().toString(36).substr(2, 9),
      champions: []
    };
    setGames(prev => [...prev, newGame]);
  };

  const handleAddChampion = (gameId: string, champion: Omit<Champion, 'id'>) => {
    setGames(prev => prev.map(g => {
      if (g.id === gameId) {
        return {
          ...g,
          champions: [...g.champions, { ...champion, id: Math.random().toString(36).substr(2, 9) }]
        };
      }
      return g;
    }));
  };

  return (
    <div className={`min-h-screen flex flex-col relative transition-colors duration-500`}>
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-teal-900/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-emerald-800/5 blur-[120px] rounded-full"></div>
      </div>

      <Navbar 
        onHomeClick={handleNavigateHome} 
        onProfileClick={handleNavigateToProfile}
        onAdminClick={handleNavigateToAdmin}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onThemeToggle={toggleTheme}
        theme={theme}
        user={user}
      />
      
      <main className="flex-grow flex flex-col z-10 pt-20">
        {currentView === 'home' ? (
          <>
            <Hero onPlayClick={handlePlayClick} isLoggedIn={!!user} />
            <Features onTrainingClick={handleNavigateToTrainers} />
            <HeroCarousel />
          </>
        ) : currentView === 'trainers' ? (
          <TrainersGallery 
            onBack={handleNavigateHome} 
            onApply={handleAddApplication} 
            onCreateSession={handleCreateSession}
            onBook={handleCreateBooking}
            currentUser={user}
            applications={applications}
            activeSessions={activeSessions}
            bookings={bookings}
            games={games}
          />
        ) : currentView === 'profile' ? (
          <ProfilePage 
            user={user!} 
            onUpdate={handleUpdateUser} 
            onBack={handleNavigateHome} 
            applications={applications}
            bookings={bookings}
          />
        ) : (
          <AdminPanel 
            applications={applications} 
            onUpdateStatus={handleUpdateApplicationStatus}
            games={games}
            activeSessions={activeSessions}
            bookings={bookings}
            onAddGame={handleAddGame}
            onAddChampion={handleAddChampion}
            onBack={handleNavigateHome}
          />
        )}
      </main>

      <footer className="py-12 text-center text-slate-500 border-t border-white/5 mt-auto z-10 bg-black/5 dark:bg-black/20">
        <p className="text-sm tracking-widest uppercase font-medium">© 2024 Tourgame. Вершина твоего мастерства.</p>
      </footer>

      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)} 
          onSuccess={handleRegister} 
        />
      )}
    </div>
  );
};

export default App;
