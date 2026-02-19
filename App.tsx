import React, { useCallback, useEffect, useState } from 'react';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
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
  trainerId?: string;
  game: string;
  gameId?: string;
  champion: string;
  championId?: string;
  days: string[];
  startTime: string;
  endTime: string;
  sessionType: string;
  price30: number;
  avatar: string;
}

export interface BookingRecord {
  id: string;
  sessionId?: string;
  studentId?: string;
  trainerId?: string;
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

type DbGame = {
  id: string;
  name: string;
  avatar_url: string | null;
  description: string | null;
};

type DbChampion = {
  id: string;
  game_id: string;
  name: string;
  avatar_url: string | null;
};

type DbUser = {
  id: string;
  email: string;
  nickname: string | null;
  avatar_url: string | null;
  bio: string | null;
  balance: number | null;
};

type DbApplication = {
  id: string;
  user_id: string;
  game_id: string;
  champion_id: string | null;
  status: TrainerApplication['status'];
  created_at: string;
};

type DbSession = {
  id: string;
  trainer_id: string;
  game_id: string;
  champion_id: string | null;
  session_type: string;
  price_30: number;
};

type DbSessionSlot = {
  session_id: string;
  weekday: number;
  start_time: string;
  end_time: string;
};

type DbBooking = {
  id: string;
  session_id: string;
  student_id: string;
  trainer_id: string;
  lesson_date: string;
  start_time: string;
  end_time: string;
  duration_min: number;
  total_price: number;
  status: 'upcoming' | 'completed' | 'cancelled';
};

type DbUserEvent = {
  id: string;
  type: ProfileEvent['type'];
  title: string;
  description: string | null;
  icon: string | null;
  created_at: string;
};

type DbUserGameAccount = {
  id: string;
  game_id: string;
  nickname: string;
};

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&h=200&auto=format&fit=crop';
const DAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const weekdayToLabel = (weekday: number) => DAY_LABELS[Math.max(1, Math.min(7, weekday)) - 1];
const labelToWeekday = (label: string) => Math.max(1, DAY_LABELS.indexOf(label) + 1);
const normalizeTime = (value: string) => value?.slice(0, 5) || '00:00';

const nextDateForWeekdayLabel = (label: string): string => {
  const target = labelToWeekday(label);
  const now = new Date();
  const currentWeekday = ((now.getDay() + 6) % 7) + 1;
  const diff = (target - currentWeekday + 7) % 7;
  const result = new Date(now);
  result.setDate(now.getDate() + diff);
  return result.toISOString().split('T')[0];
};

const weekdayLabelFromIsoDate = (isoDate: string): string => {
  const date = new Date(`${isoDate}T12:00:00`);
  const weekday = ((date.getDay() + 6) % 7) + 1;
  return weekdayToLabel(weekday);
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'trainers' | 'profile' | 'admin'>('home');
  const [authUser, setAuthUser] = useState<SupabaseAuthUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [applications, setApplications] = useState<TrainerApplication[]>([]);
  const [activeSessions, setActiveSessions] = useState<SessionActivity[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const addEvent = useCallback(async (event: Omit<ProfileEvent, 'id' | 'timestamp'>) => {
    if (!authUser) {
      return;
    }

    const createdAt = new Date();
    const optimistic: ProfileEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: createdAt.toLocaleString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: 'short'
      })
    };

    setUser(prev => prev ? { ...prev, events: [optimistic, ...prev.events] } : prev);

    const { data, error } = await supabase
      .from('user_events')
      .insert({
        user_id: authUser.id,
        type: event.type,
        title: event.title,
        description: event.description,
        icon: event.icon
      })
      .select('id, type, title, description, icon, created_at')
      .single();

    if (error || !data) {
      if (error) {
        console.error('Failed to save event:', error.message);
      }
      return;
    }

    const persisted = data as DbUserEvent;
    const persistedEvent: ProfileEvent = {
      id: persisted.id,
      type: persisted.type,
      title: persisted.title,
      description: persisted.description || '',
      icon: persisted.icon || 'ℹ️',
      timestamp: new Date(persisted.created_at).toLocaleString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: 'short'
      })
    };

    setUser(prev => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        events: [persistedEvent, ...prev.events.filter(item => item.id !== optimistic.id)]
      };
    });
  }, [authUser]);

  const refreshData = useCallback(async (currentAuthUser: SupabaseAuthUser | null) => {
    const { data: gameRows, error: gamesError } = await supabase
      .from('games')
      .select('id, name, avatar_url, description')
      .order('name');

    if (gamesError) {
      console.error('Failed to load games:', gamesError.message);
      setGames([]);
    }

    const resolvedGameRows = (gameRows || []) as DbGame[];
    const gameIds = resolvedGameRows.map(game => game.id);

    let championRows: DbChampion[] = [];
    if (gameIds.length > 0) {
      const { data, error } = await supabase
        .from('champions')
        .select('id, game_id, name, avatar_url')
        .in('game_id', gameIds)
        .order('name');

      if (error) {
        console.error('Failed to load champions:', error.message);
      } else {
        championRows = (data || []) as DbChampion[];
      }
    }

    const championsByGameId = championRows.reduce<Record<string, Champion[]>>((acc, champion) => {
      if (!acc[champion.game_id]) {
        acc[champion.game_id] = [];
      }
      acc[champion.game_id].push({
        id: champion.id,
        name: champion.name,
        avatar: champion.avatar_url || ''
      });
      return acc;
    }, {});

    const resolvedGames: Game[] = resolvedGameRows.map(game => ({
      id: game.id,
      name: game.name,
      avatar: game.avatar_url || '',
      description: game.description || '',
      champions: championsByGameId[game.id] || []
    }));
    setGames(resolvedGames);

    const gamesById = resolvedGames.reduce<Record<string, Game>>((acc, game) => {
      acc[game.id] = game;
      return acc;
    }, {});

    const championsById = championRows.reduce<Record<string, DbChampion>>((acc, champion) => {
      acc[champion.id] = champion;
      return acc;
    }, {});

    const { data: sessionRows, error: sessionsError } = await supabase
      .from('trainer_sessions')
      .select('id, trainer_id, game_id, champion_id, session_type, price_30')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (sessionsError) {
      console.error('Failed to load trainer sessions:', sessionsError.message);
      setActiveSessions([]);
    }

    const resolvedSessionRows = (sessionRows || []) as DbSession[];
    const sessionIds = resolvedSessionRows.map(session => session.id);

    let slotRows: DbSessionSlot[] = [];
    if (sessionIds.length > 0) {
      const { data, error } = await supabase
        .from('session_slots')
        .select('session_id, weekday, start_time, end_time')
        .in('session_id', sessionIds)
        .eq('is_active', true)
        .order('weekday');

      if (error) {
        console.error('Failed to load session slots:', error.message);
      } else {
        slotRows = (data || []) as DbSessionSlot[];
      }
    }

    const trainerIds = [...new Set(resolvedSessionRows.map(session => session.trainer_id))];
    let trainerRows: DbUser[] = [];

    if (trainerIds.length > 0) {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, nickname, avatar_url, bio, balance')
        .in('id', trainerIds);

      if (error) {
        console.error('Failed to load trainer profiles:', error.message);
      } else {
        trainerRows = (data || []) as DbUser[];
      }
    }

    const trainersById = trainerRows.reduce<Record<string, DbUser>>((acc, trainer) => {
      acc[trainer.id] = trainer;
      return acc;
    }, {});

    const slotsBySession = slotRows.reduce<Record<string, DbSessionSlot[]>>((acc, slot) => {
      if (!acc[slot.session_id]) {
        acc[slot.session_id] = [];
      }
      acc[slot.session_id].push(slot);
      return acc;
    }, {});

    const resolvedSessions: SessionActivity[] = resolvedSessionRows.map(session => {
      const sessionSlots = slotsBySession[session.id] || [];
      const game = gamesById[session.game_id];
      const champion = session.champion_id ? championsById[session.champion_id] : null;
      const trainer = trainersById[session.trainer_id];

      return {
        id: session.id,
        trainerId: session.trainer_id,
        trainerName: trainer?.nickname || 'Trainer',
        avatar: trainer?.avatar_url || DEFAULT_AVATAR,
        gameId: session.game_id,
        game: game?.name || 'Unknown game',
        championId: session.champion_id || undefined,
        champion: champion?.name || 'Any',
        sessionType: session.session_type,
        price30: Number(session.price_30),
        days: sessionSlots.map(slot => weekdayToLabel(slot.weekday)),
        startTime: normalizeTime(sessionSlots[0]?.start_time || '10:00'),
        endTime: normalizeTime(sessionSlots[0]?.end_time || '18:00')
      };
    });
    setActiveSessions(resolvedSessions);

    if (!currentAuthUser) {
      setUser(null);
      setApplications([]);
      setBookings([]);
      return;
    }

    const { data: profileRow, error: profileError } = await supabase
      .from('users')
      .select('id, email, nickname, avatar_url, bio, balance')
      .eq('id', currentAuthUser.id)
      .maybeSingle();

    if (profileError) {
      console.error('Failed to load user profile:', profileError.message);
    }

    if (!profileRow) {
      await supabase.from('users').upsert({
        id: currentAuthUser.id,
        email: currentAuthUser.email,
        nickname: (currentAuthUser.user_metadata?.nickname as string) || (currentAuthUser.email?.split('@')[0] ?? 'User')
      });
    }

    const { data: accountRows, error: accountsError } = await supabase
      .from('user_game_accounts')
      .select('id, game_id, nickname')
      .eq('user_id', currentAuthUser.id)
      .order('created_at', { ascending: false });

    if (accountsError) {
      console.error('Failed to load user game accounts:', accountsError.message);
    }

    const { data: eventRows, error: eventsError } = await supabase
      .from('user_events')
      .select('id, type, title, description, icon, created_at')
      .eq('user_id', currentAuthUser.id)
      .order('created_at', { ascending: false });

    if (eventsError) {
      console.error('Failed to load user events:', eventsError.message);
    }

    const resolvedAccounts: GameAccount[] = ((accountRows || []) as DbUserGameAccount[]).map(account => ({
      id: account.id,
      gameId: account.game_id,
      game: gamesById[account.game_id]?.name || 'Unknown game',
      nickname: account.nickname,
      champions: []
    }));

    const resolvedEvents: ProfileEvent[] = ((eventRows || []) as DbUserEvent[]).map(event => ({
      id: event.id,
      type: event.type,
      title: event.title,
      description: event.description || '',
      icon: event.icon || 'ℹ️',
      timestamp: new Date(event.created_at).toLocaleString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: 'short'
      })
    }));

    const resolvedProfile = profileRow as DbUser | null;
    const resolvedUser: User = {
      id: currentAuthUser.id,
      email: resolvedProfile?.email || currentAuthUser.email || '',
      nickname: resolvedProfile?.nickname || (currentAuthUser.user_metadata?.nickname as string) || (currentAuthUser.email?.split('@')[0] ?? 'User'),
      avatar: resolvedProfile?.avatar_url || DEFAULT_AVATAR,
      bio: resolvedProfile?.bio || '',
      balance: Number(resolvedProfile?.balance ?? 0),
      accounts: resolvedAccounts,
      events: resolvedEvents
    };

    setUser(prev => {
      if (!prev) {
        return resolvedUser;
      }
      return {
        ...resolvedUser,
        events: prev.events.length > 0 ? prev.events : resolvedUser.events
      };
    });

    const { data: appRows, error: appError } = await supabase
      .from('trainer_applications')
      .select('id, user_id, game_id, champion_id, status, created_at')
      .order('created_at', { ascending: false });

    if (appError) {
      console.error('Failed to load trainer applications:', appError.message);
      setApplications([]);
    } else {
      const resolvedAppRows = (appRows || []) as DbApplication[];
      const appUserIds = [...new Set(resolvedAppRows.map(app => app.user_id))];
      let appUsersMap: Record<string, DbUser> = {};

      if (appUserIds.length > 0) {
        const { data: appUsers, error: appUsersError } = await supabase
          .from('users')
          .select('id, email, nickname, avatar_url, bio, balance')
          .in('id', appUserIds);

        if (appUsersError) {
          console.error('Failed to load application users:', appUsersError.message);
        } else {
          appUsersMap = ((appUsers || []) as DbUser[]).reduce<Record<string, DbUser>>((acc, item) => {
            acc[item.id] = item;
            return acc;
          }, {});
        }
      }

      const resolvedApplications: TrainerApplication[] = resolvedAppRows.map(app => ({
        id: app.id,
        nickname: appUsersMap[app.user_id]?.nickname || 'User',
        game: gamesById[app.game_id]?.name || 'Unknown game',
        champion: app.champion_id ? (championsById[app.champion_id]?.name || 'Any') : 'Any',
        status: app.status,
        date: app.created_at.split('T')[0]
      }));

      setApplications(resolvedApplications);
    }

    const { data: bookingRows, error: bookingError } = await supabase
      .from('bookings')
      .select('id, session_id, student_id, trainer_id, lesson_date, start_time, end_time, duration_min, total_price, status')
      .order('created_at', { ascending: false });

    if (bookingError) {
      console.error('Failed to load bookings:', bookingError.message);
      setBookings([]);
      return;
    }

    const resolvedBookingRows = (bookingRows || []) as DbBooking[];
    const bookingUserIds = [...new Set(resolvedBookingRows.flatMap(booking => [booking.student_id, booking.trainer_id]))];
    let bookingUsers: Record<string, DbUser> = {};

    if (bookingUserIds.length > 0) {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, nickname, avatar_url, bio, balance')
        .in('id', bookingUserIds);

      if (error) {
        console.error('Failed to load booking users:', error.message);
      } else {
        bookingUsers = ((data || []) as DbUser[]).reduce<Record<string, DbUser>>((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {});
      }
    }

    const sessionById = resolvedSessions.reduce<Record<string, SessionActivity>>((acc, session) => {
      acc[session.id] = session;
      return acc;
    }, {});

    const resolvedBookings: BookingRecord[] = resolvedBookingRows.map(booking => {
      const session = sessionById[booking.session_id];
      return {
        id: booking.id,
        sessionId: booking.session_id,
        studentId: booking.student_id,
        trainerId: booking.trainer_id,
        studentName: bookingUsers[booking.student_id]?.nickname || 'Student',
        trainerName: bookingUsers[booking.trainer_id]?.nickname || session?.trainerName || 'Trainer',
        game: session?.game || 'Unknown game',
        champion: session?.champion || 'Any',
        date: weekdayLabelFromIsoDate(booking.lesson_date),
        timeSlot: `${normalizeTime(booking.start_time)} - ${normalizeTime(booking.end_time)}`,
        duration: booking.duration_min,
        totalPrice: Number(booking.total_price),
        status: booking.status === 'upcoming' ? 'upcoming' : 'completed'
      };
    });

    setBookings(resolvedBookings);
  }, []);

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : '';
  }, [theme]);

  useEffect(() => {
    let mounted = true;

    const bootstrapAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) {
        setAuthUser(data.session?.user ?? null);
      }
    };

    bootstrapAuth();

    const { data: authSubscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
      if (!session?.user) {
        setCurrentView('home');
      }
    });

    return () => {
      mounted = false;
      authSubscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    refreshData(authUser);
  }, [authUser, refreshData]);

  useEffect(() => {
    if (!user && currentView === 'profile') {
      setCurrentView('home');
    }
  }, [user, currentView]);

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

  const handleAuthSuccess = ({ id, nickname, email }: { id: string; nickname: string; email: string }) => {
    setUser(prev => ({
      id,
      email,
      nickname,
      balance: prev?.balance ?? 0,
      avatar: prev?.avatar ?? DEFAULT_AVATAR,
      accounts: prev?.accounts ?? [],
      events: prev?.events ?? [],
      bio: prev?.bio
    }));
    setIsAuthModalOpen(false);
  };

  const handleUpdateUser = async (updatedFields: Partial<User>) => {
    if (!user || !authUser) {
      return;
    }

    const optimisticUser = { ...user, ...updatedFields };
    setUser(optimisticUser);

    const payload: Record<string, unknown> = {};
    if (typeof updatedFields.nickname !== 'undefined') payload.nickname = updatedFields.nickname;
    if (typeof updatedFields.bio !== 'undefined') payload.bio = updatedFields.bio;
    if (typeof updatedFields.avatar !== 'undefined') payload.avatar_url = updatedFields.avatar;

    if (Object.keys(payload).length > 0) {
      const { error } = await supabase
        .from('users')
        .update(payload)
        .eq('id', authUser.id);

      if (error) {
        console.error('Failed to update user profile:', error.message);
      }
    }

    if (updatedFields.nickname && updatedFields.nickname !== user.nickname) {
      const { error } = await supabase.auth.updateUser({ data: { nickname: updatedFields.nickname } });
      if (error) {
        console.error('Failed to update auth metadata:', error.message);
      }
    }
  };

  const handlePlayClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    }
  };

  const handleAddApplication = async (app: Omit<TrainerApplication, 'id' | 'status' | 'date'>) => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const game = games.find(item => item.name === app.game);
    const champion = game?.champions.find(item => item.name === app.champion);

    if (!game) {
      console.error('Game not found for application');
      return;
    }

    const { error } = await supabase
      .from('trainer_applications')
      .insert({
        user_id: authUser.id,
        game_id: game.id,
        champion_id: champion?.id || null,
        status: 'pending'
      });

    if (error) {
      console.error('Failed to create trainer application:', error.message);
      return;
    }

    await refreshData(authUser);

    await addEvent({
      type: 'application',
      title: 'Заявка отправлена',
      description: `Вы подали заявку на роль тренера в игре ${app.game}.`,
      icon: '📨'
    });
  };

  const handleUpdateApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('trainer_applications')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Failed to update application status:', error.message);
      return;
    }

    await refreshData(authUser);
  };

  const handleCreateSession = async (session: Omit<SessionActivity, 'id' | 'trainerName' | 'avatar'>) => {
    if (!authUser || !user) {
      setIsAuthModalOpen(true);
      return;
    }

    const game = games.find(item => item.name === session.game);
    const champion = game?.champions.find(item => item.name === session.champion);

    if (!game) {
      console.error('Game not found for session');
      return;
    }

    const { data: createdSession, error: sessionError } = await supabase
      .from('trainer_sessions')
      .insert({
        trainer_id: authUser.id,
        game_id: game.id,
        champion_id: champion?.id || null,
        session_type: session.sessionType,
        price_30: session.price30,
        is_active: true
      })
      .select('id')
      .single();

    if (sessionError || !createdSession) {
      console.error('Failed to create trainer session:', sessionError?.message);
      return;
    }

    if (session.days.length > 0) {
      const slots = session.days.map(day => ({
        session_id: createdSession.id,
        weekday: labelToWeekday(day),
        start_time: session.startTime,
        end_time: session.endTime,
        timezone: 'UTC',
        is_active: true
      }));

      const { error: slotsError } = await supabase.from('session_slots').insert(slots);
      if (slotsError) {
        console.error('Failed to create session slots:', slotsError.message);
      }
    }

    await refreshData(authUser);

    await addEvent({
      type: 'session_created',
      title: 'Сессия опубликована',
      description: `Ваше предложение по обучению (${session.game}, ${session.champion}) теперь доступно в общем списке.`,
      icon: '🎮'
    });
  };

  const handleCreateBooking = async (booking: Omit<BookingRecord, 'id' | 'studentName' | 'status'>) => {
    if (!authUser || !booking.sessionId || !booking.trainerId) {
      setIsAuthModalOpen(true);
      return;
    }

    const [startRaw, endRaw] = booking.timeSlot.split(' - ');
    const lessonDate = nextDateForWeekdayLabel(booking.date);

    const { error } = await supabase
      .from('bookings')
      .insert({
        session_id: booking.sessionId,
        student_id: authUser.id,
        trainer_id: booking.trainerId,
        lesson_date: lessonDate,
        start_time: startRaw,
        end_time: endRaw,
        duration_min: booking.duration,
        total_price: booking.totalPrice,
        status: 'upcoming'
      });

    if (error) {
      console.error('Failed to create booking:', error.message);
      return;
    }

    await refreshData(authUser);

    await addEvent({
      type: 'booking_out',
      title: 'Запись к тренеру',
      description: `Вы записались на занятие к ${booking.trainerName} (${booking.game}).`,
      icon: '📅'
    });
  };

  const handleAddGame = async (game: Omit<Game, 'id' | 'champions'>) => {
    const { error } = await supabase
      .from('games')
      .insert({
        name: game.name,
        avatar_url: game.avatar || null,
        description: game.description || null,
        is_active: true
      });

    if (error) {
      console.error('Failed to add game:', error.message);
      return;
    }

    await refreshData(authUser);
  };

  const handleAddChampion = async (gameId: string, champion: Omit<Champion, 'id'>) => {
    const { error } = await supabase
      .from('champions')
      .insert({
        game_id: gameId,
        name: champion.name,
        avatar_url: champion.avatar || null
      });

    if (error) {
      console.error('Failed to add champion:', error.message);
      return;
    }

    await refreshData(authUser);
  };

  return (
    <div className={'min-h-screen flex flex-col relative transition-colors duration-500'}>
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
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
};

export default App;
