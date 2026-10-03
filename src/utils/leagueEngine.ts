import { League, LeagueMember, LeagueTarget, LeagueChallengeStructure, XpEventNotification } from '../types';

export const LEAGUES_STORAGE_KEY = 'mushaf_hafiz_leagues_v1';
export const ACTIVE_LEAGUE_ID_KEY = 'mushaf_hafiz_active_league_id_v1';
export const USER_NAME_KEY = 'mushaf_hafiz_user_name_v1';

export const DEFAULT_USER_NAME = 'You (Hafiz)';

export const SCORING_RULES = {
  AYAH_CORRECT: 10,
  PAGE_COMPLETED: 50,
  DAILY_TARGET_MET: 100,
  STREAK_BONUS_PER_DAY: 20,
};

// Generate realistic date for today
export const getTodayDateKey = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// Generate random friendly invite code
export const generateInviteCode = (name: string): string => {
  const clean = name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'HIFZ';
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${clean}-${num}`;
};

export const getInitialLeagues = (): League[] => {
  const today = getTodayDateKey();

  const juzAmmaLeague: League = {
    id: 'league-juz-amma',
    name: "Juz 'Amma Companions",
    description: 'A monthly circle to master all 23 pages of Juz 30 (Surah An-Naba to An-Nas) with high retention.',
    inviteCode: 'AMMA-7860',
    creatorName: 'Zayd ibn Thabit',
    isUserCreator: false,
    createdAt: '2026-10-01',
    endDate: '2026-10-31',
    durationDays: 30,
    challengeStructure: 'monthly',
    target: {
      rangeType: 'juz',
      description: 'Complete Juz Amma this month (Pages 582 - 604)',
      targetAmount: 23,
      targetUnit: 'pages',
      selectedJuz: 30,
      startPage: 582,
      endPage: 604,
    },
    members: [
      {
        id: 'member-1',
        name: 'Zayd ibn Thabit',
        isCurrentUser: false,
        avatarColor: 'bg-emerald-700 text-emerald-100',
        avatarEmoji: '📖',
        points: 480,
        todayPoints: 60,
        rank: 1,
        streakDays: 6,
        completedToday: true,
        progressCurrent: 18,
        progressTarget: 23,
        progressPercent: 78,
        statusMessage: 'Reviewing An-Naba & An-Naziat ✨',
        joinedDate: '2026-10-01',
        dailyActivity: {
          [today]: 60,
        },
      },
      {
        id: 'current-user',
        name: DEFAULT_USER_NAME,
        isCurrentUser: true,
        avatarColor: 'bg-amber-600 text-amber-50',
        avatarEmoji: '🌟',
        points: 390,
        todayPoints: 40,
        rank: 2,
        streakDays: 4,
        completedToday: true,
        progressCurrent: 14,
        progressTarget: 23,
        progressPercent: 61,
        statusMessage: 'Mastering Page 586',
        joinedDate: '2026-10-01',
        dailyActivity: {
          [today]: 40,
        },
      },
      {
        id: 'member-2',
        name: 'Maryam Al-Ansari',
        isCurrentUser: false,
        avatarColor: 'bg-teal-700 text-teal-100',
        avatarEmoji: '🪶',
        points: 330,
        todayPoints: 30,
        rank: 3,
        streakDays: 5,
        completedToday: true,
        progressCurrent: 12,
        progressTarget: 23,
        progressPercent: 52,
        statusMessage: 'Completed Surah At-Takwir',
        joinedDate: '2026-10-01',
        dailyActivity: {
          [today]: 30,
        },
      },
      {
        id: 'member-3',
        name: 'Bilal Mansour',
        isCurrentUser: false,
        avatarColor: 'bg-blue-700 text-blue-100',
        avatarEmoji: '🌙',
        points: 260,
        todayPoints: 0,
        rank: 4,
        streakDays: 3,
        completedToday: false,
        progressCurrent: 9,
        progressTarget: 23,
        progressPercent: 39,
        statusMessage: 'Targeting Surah Al-Mutaffifin next',
        joinedDate: '2026-10-02',
        dailyActivity: {},
      },
      {
        id: 'member-4',
        name: 'Aisha Rahmani',
        isCurrentUser: false,
        avatarColor: 'bg-rose-700 text-rose-100',
        avatarEmoji: '🌿',
        points: 190,
        todayPoints: 20,
        rank: 5,
        streakDays: 2,
        completedToday: true,
        progressCurrent: 7,
        progressTarget: 23,
        progressPercent: 30,
        statusMessage: 'Revising short Surahs',
        joinedDate: '2026-10-02',
        dailyActivity: {
          [today]: 20,
        },
      },
      {
        id: 'member-5',
        name: 'Omar Farooq',
        isCurrentUser: false,
        avatarColor: 'bg-stone-700 text-stone-100',
        avatarEmoji: '🛡️',
        points: 120,
        todayPoints: 0,
        rank: 6,
        streakDays: 1,
        completedToday: false,
        progressCurrent: 4,
        progressTarget: 23,
        progressPercent: 17,
        statusMessage: 'Starting Juz Amma journey',
        joinedDate: '2026-10-02',
        dailyActivity: {},
      },
    ],
    activityFeed: [
      {
        id: 'feed-1',
        memberName: 'Zayd ibn Thabit',
        isCurrentUser: false,
        actionText: 'completed testing on Medina page 589 (+50 XP)',
        pointsEarned: 50,
        timestamp: Date.now() - 1000 * 60 * 35,
        type: 'page',
      },
      {
        id: 'feed-2',
        memberName: DEFAULT_USER_NAME,
        isCurrentUser: true,
        actionText: 'hit a 4-day daily memorization streak! (+80 XP)',
        pointsEarned: 80,
        timestamp: Date.now() - 1000 * 60 * 95,
        type: 'streak',
      },
      {
        id: 'feed-3',
        memberName: 'Maryam Al-Ansari',
        isCurrentUser: false,
        actionText: 'mastered 5 ayahs with 100% accuracy (+50 XP)',
        pointsEarned: 50,
        timestamp: Date.now() - 1000 * 60 * 180,
        type: 'ayah',
      },
      {
        id: 'feed-4',
        memberName: 'Aisha Rahmani',
        isCurrentUser: false,
        actionText: 'reached today’s target quota (+100 XP)',
        pointsEarned: 100,
        timestamp: Date.now() - 1000 * 60 * 340,
        type: 'target_met',
      },
    ],
  };

  const dailyFajrCircle: League = {
    id: 'league-daily-fajr',
    name: 'Fajr Hifz Circle',
    description: 'Every morning before sunrise: practice and test at least 10 Ayahs every day.',
    inviteCode: 'FAJR-1010',
    creatorName: DEFAULT_USER_NAME,
    isUserCreator: true,
    createdAt: '2026-10-01',
    challengeStructure: 'daily',
    target: {
      rangeType: 'ayahs-count',
      description: 'Practice at least 10 ayahs every day',
      targetAmount: 10,
      targetUnit: 'ayahs',
      startPage: 1,
      endPage: 604,
    },
    members: [
      {
        id: 'current-user',
        name: DEFAULT_USER_NAME,
        isCurrentUser: true,
        avatarColor: 'bg-amber-600 text-amber-50',
        avatarEmoji: '🌟',
        points: 280,
        todayPoints: 80,
        rank: 1,
        streakDays: 4,
        completedToday: true,
        progressCurrent: 12,
        progressTarget: 10,
        progressPercent: 100,
        statusMessage: '12 ayahs completed this morning! ☀️',
        joinedDate: '2026-10-01',
        dailyActivity: {
          [today]: 80,
        },
      },
      {
        id: 'member-fajr-1',
        name: 'Tariq Jameel',
        isCurrentUser: false,
        avatarColor: 'bg-indigo-700 text-indigo-100',
        avatarEmoji: '🌅',
        points: 240,
        todayPoints: 70,
        rank: 2,
        streakDays: 3,
        completedToday: true,
        progressCurrent: 10,
        progressTarget: 10,
        progressPercent: 100,
        statusMessage: 'Surah Yasin revision',
        joinedDate: '2026-10-01',
        dailyActivity: {
          [today]: 70,
        },
      },
      {
        id: 'member-fajr-2',
        name: 'Hafsa Bint Umar',
        isCurrentUser: false,
        avatarColor: 'bg-emerald-700 text-emerald-100',
        avatarEmoji: '🌱',
        points: 170,
        todayPoints: 0,
        rank: 3,
        streakDays: 2,
        completedToday: false,
        progressCurrent: 4,
        progressTarget: 10,
        progressPercent: 40,
        statusMessage: 'Preparing for morning review',
        joinedDate: '2026-10-02',
        dailyActivity: {},
      },
    ],
    activityFeed: [
      {
        id: 'fajr-feed-1',
        memberName: DEFAULT_USER_NAME,
        isCurrentUser: true,
        actionText: "completed today's 10 ayahs target (+100 XP)",
        pointsEarned: 100,
        timestamp: Date.now() - 1000 * 60 * 60,
        type: 'target_met',
      },
      {
        id: 'fajr-feed-2',
        memberName: 'Tariq Jameel',
        isCurrentUser: false,
        actionText: 'completed 10 ayahs in Medina Mushaf (+100 XP)',
        pointsEarned: 100,
        timestamp: Date.now() - 1000 * 60 * 120,
        type: 'target_met',
      },
    ],
  };

  const mulkLeague: League = {
    id: 'league-surah-mulk',
    name: 'Surah Al-Mulk Protectors',
    description: 'Fixed Goal Challenge: Memorize & test the complete Surah Al-Mulk (all 30 ayahs, pages 562-564).',
    inviteCode: 'MULK-6730',
    creatorName: 'Hamza Yusuf',
    isUserCreator: false,
    createdAt: '2026-10-01',
    endDate: '2026-10-20',
    durationDays: 20,
    challengeStructure: 'fixed-goal',
    target: {
      rangeType: 'single-surah',
      description: 'Master Surah Al-Mulk (Pages 562 - 564, 30 Ayahs)',
      targetAmount: 3,
      targetUnit: 'pages',
      startSurah: 67,
      startSurahName: 'Al-Mulk',
      startPage: 562,
      endPage: 564,
    },
    members: [
      {
        id: 'member-mulk-1',
        name: 'Hamza Yusuf',
        isCurrentUser: false,
        avatarColor: 'bg-emerald-800 text-emerald-100',
        avatarEmoji: '👑',
        points: 410,
        todayPoints: 50,
        rank: 1,
        streakDays: 7,
        completedToday: true,
        progressCurrent: 3,
        progressTarget: 3,
        progressPercent: 100,
        statusMessage: 'Completed all 3 pages of Al-Mulk! 🛡️',
        joinedDate: '2026-10-01',
        dailyActivity: {
          [today]: 50,
        },
      },
      {
        id: 'current-user',
        name: DEFAULT_USER_NAME,
        isCurrentUser: true,
        avatarColor: 'bg-amber-600 text-amber-50',
        avatarEmoji: '🌟',
        points: 320,
        todayPoints: 30,
        rank: 2,
        streakDays: 4,
        completedToday: true,
        progressCurrent: 2,
        progressTarget: 3,
        progressPercent: 67,
        statusMessage: 'Page 563 mastered, testing Page 564 next',
        joinedDate: '2026-10-01',
        dailyActivity: {
          [today]: 30,
        },
      },
      {
        id: 'member-mulk-2',
        name: 'Ibrahim Qasim',
        isCurrentUser: false,
        avatarColor: 'bg-stone-700 text-stone-100',
        avatarEmoji: '📜',
        points: 210,
        todayPoints: 0,
        rank: 3,
        streakDays: 3,
        completedToday: false,
        progressCurrent: 1,
        progressTarget: 3,
        progressPercent: 33,
        statusMessage: 'Working on Page 562',
        joinedDate: '2026-10-02',
        dailyActivity: {},
      },
    ],
    activityFeed: [
      {
        id: 'mulk-feed-1',
        memberName: 'Hamza Yusuf',
        isCurrentUser: false,
        actionText: 'completed all 30 Ayahs of Surah Al-Mulk! 🏆',
        pointsEarned: 150,
        timestamp: Date.now() - 1000 * 60 * 50,
        type: 'target_met',
      },
      {
        id: 'mulk-feed-2',
        memberName: DEFAULT_USER_NAME,
        isCurrentUser: true,
        actionText: 'tested Page 563 with 100% accuracy (+50 XP)',
        pointsEarned: 50,
        timestamp: Date.now() - 1000 * 60 * 200,
        type: 'page',
      },
    ],
  };

  return [juzAmmaLeague, dailyFajrCircle, mulkLeague];
};

export const loadStoredLeagues = (): League[] => {
  try {
    const raw = localStorage.getItem(LEAGUES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load leagues from localStorage', e);
  }
  const defaults = getInitialLeagues();
  saveStoredLeagues(defaults);
  return defaults;
};

export const saveStoredLeagues = (leagues: League[]): void => {
  try {
    localStorage.setItem(LEAGUES_STORAGE_KEY, JSON.stringify(leagues));
  } catch (e) {
    console.error('Failed to save leagues to localStorage', e);
  }
};

export const loadActiveLeagueId = (leagues: League[]): string => {
  try {
    const stored = localStorage.getItem(ACTIVE_LEAGUE_ID_KEY);
    if (stored && leagues.some(l => l.id === stored)) {
      return stored;
    }
  } catch {
    // fallback
  }
  return leagues[0]?.id || 'league-juz-amma';
};

export const saveActiveLeagueId = (id: string): void => {
  try {
    localStorage.setItem(ACTIVE_LEAGUE_ID_KEY, id);
  } catch {
    // ignore
  }
};

export const loadUserName = (): string => {
  try {
    return localStorage.getItem(USER_NAME_KEY) || DEFAULT_USER_NAME;
  } catch {
    return DEFAULT_USER_NAME;
  }
};

export const saveUserName = (name: string): void => {
  try {
    localStorage.setItem(USER_NAME_KEY, name);
  } catch {
    // ignore
  }
};

// Recompute ranks based on points descending
export const recomputeRanks = (members: LeagueMember[]): LeagueMember[] => {
  const sorted = [...members].sort((a, b) => b.points - a.points);
  return sorted.map((member, index) => ({
    ...member,
    rank: index + 1,
  }));
};

// Award points to current user in all active leagues they belong to
export interface AwardXpResult {
  updatedLeagues: League[];
  notification: XpEventNotification | null;
  totalAwarded: number;
}

export const awardXpToUser = (
  leagues: League[],
  activeLeagueId: string,
  points: number,
  reason: 'ayah' | 'page' | 'target_met' | 'streak',
  description: string
): AwardXpResult => {
  const today = getTodayDateKey();
  const userName = loadUserName();

  const updatedLeagues = leagues.map(league => {
    // Update current user member in this league
    const userMemberIdx = league.members.findIndex(m => m.isCurrentUser);
    if (userMemberIdx === -1) return league;

    const currentMember = league.members[userMemberIdx];
    const newPoints = currentMember.points + points;
    const newTodayPoints = currentMember.todayPoints + points;

    // Calculate updated progress
    let newProgress = currentMember.progressCurrent;
    if (reason === 'page') {
      newProgress = Math.min(currentMember.progressTarget, currentMember.progressCurrent + 1);
    } else if (reason === 'ayah' && league.target.targetUnit === 'ayahs') {
      newProgress = Math.min(currentMember.progressTarget, currentMember.progressCurrent + 1);
    } else if (reason === 'target_met') {
      newProgress = currentMember.progressTarget;
    }

    const newPercent = Math.min(100, Math.round((newProgress / Math.max(1, currentMember.progressTarget)) * 100));

    const updatedUserMember: LeagueMember = {
      ...currentMember,
      name: userName,
      points: newPoints,
      todayPoints: newTodayPoints,
      completedToday: true,
      progressCurrent: newProgress,
      progressPercent: newPercent,
      dailyActivity: {
        ...currentMember.dailyActivity,
        [today]: (currentMember.dailyActivity[today] || 0) + points,
      },
    };

    const newMembersList = [...league.members];
    newMembersList[userMemberIdx] = updatedUserMember;
    const rankedMembers = recomputeRanks(newMembersList);

    // Add activity feed item for the active league
    const isThisActiveLeague = league.id === activeLeagueId;
    let updatedFeed = league.activityFeed;
    if (isThisActiveLeague) {
      const feedItem = {
        id: `feed-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        memberName: userName,
        isCurrentUser: true,
        actionText: `${description} (+${points} XP)`,
        pointsEarned: points,
        timestamp: Date.now(),
        type: reason,
      };
      updatedFeed = [feedItem, ...league.activityFeed.slice(0, 20)];
    }

    return {
      ...league,
      members: rankedMembers,
      activityFeed: updatedFeed,
    };
  });

  saveStoredLeagues(updatedLeagues);

  const notification: XpEventNotification = {
    id: `xp-${Date.now()}`,
    points,
    label: description,
    timestamp: Date.now(),
  };

  return {
    updatedLeagues,
    notification,
    totalAwarded: points,
  };
};

// Create a new custom private league
export const createNewLeague = (
  leagues: League[],
  data: {
    name: string;
    description: string;
    challengeStructure: LeagueChallengeStructure;
    target: LeagueTarget;
    durationDays?: number;
  }
): { leagues: League[]; newLeague: League } => {
  const userName = loadUserName();
  const today = getTodayDateKey();
  const inviteCode = generateInviteCode(data.name);

  // End date calculation if applicable
  let endDate: string | undefined = undefined;
  if (data.challengeStructure === 'monthly') {
    const end = new Date();
    end.setMonth(end.getMonth() + 1);
    endDate = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
  } else if (data.challengeStructure === 'weekly') {
    const end = new Date();
    end.setDate(end.getDate() + 7);
    endDate = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
  } else if (data.durationDays) {
    const end = new Date();
    end.setDate(end.getDate() + data.durationDays);
    endDate = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
  }

  // Pre-seed some friendly peers so the league is immediately fun and social
  const mockPeers: LeagueMember[] = [
    {
      id: `peer-1-${Date.now()}`,
      name: 'Yusuf Al-Balkhi',
      isCurrentUser: false,
      avatarColor: 'bg-emerald-700 text-emerald-100',
      avatarEmoji: '📗',
      points: 120,
      todayPoints: 20,
      rank: 2,
      streakDays: 3,
      completedToday: true,
      progressCurrent: Math.max(1, Math.floor(data.target.targetAmount * 0.3)),
      progressTarget: data.target.targetAmount,
      progressPercent: 30,
      statusMessage: 'Ready to memorize with the group! 🤲',
      joinedDate: today,
      dailyActivity: { [today]: 20 },
    },
    {
      id: `peer-2-${Date.now()}`,
      name: 'Sumayyah Bint Habib',
      isCurrentUser: false,
      avatarColor: 'bg-teal-700 text-teal-100',
      avatarEmoji: '🪶',
      points: 80,
      todayPoints: 0,
      rank: 3,
      streakDays: 2,
      completedToday: false,
      progressCurrent: Math.max(1, Math.floor(data.target.targetAmount * 0.2)),
      progressTarget: data.target.targetAmount,
      progressPercent: 20,
      statusMessage: 'InshaAllah completing target this week',
      joinedDate: today,
      dailyActivity: {},
    },
  ];

  const currentUserMember: LeagueMember = {
    id: 'current-user',
    name: userName,
    isCurrentUser: true,
    avatarColor: 'bg-amber-600 text-amber-50',
    avatarEmoji: '🌟',
    points: 150,
    todayPoints: 30,
    rank: 1,
    streakDays: 3,
    completedToday: true,
    progressCurrent: Math.max(1, Math.floor(data.target.targetAmount * 0.35)),
    progressTarget: data.target.targetAmount,
    progressPercent: 35,
    statusMessage: 'League Creator - Let us memorize together!',
    joinedDate: today,
    dailyActivity: { [today]: 30 },
  };

  const initialMembers = recomputeRanks([currentUserMember, ...mockPeers]);

  const newLeague: League = {
    id: `league-${Date.now()}`,
    name: data.name,
    description: data.description || `Private Hifz league for ${data.target.description}`,
    inviteCode,
    creatorName: userName,
    isUserCreator: true,
    createdAt: today,
    endDate,
    durationDays: data.durationDays,
    challengeStructure: data.challengeStructure,
    target: data.target,
    members: initialMembers,
    activityFeed: [
      {
        id: `feed-init-${Date.now()}`,
        memberName: userName,
        isCurrentUser: true,
        actionText: `created the league "${data.name}"! 🚀`,
        pointsEarned: 50,
        timestamp: Date.now(),
        type: 'joined',
      },
    ],
  };

  const updated = [newLeague, ...leagues];
  saveStoredLeagues(updated);
  saveActiveLeagueId(newLeague.id);

  return {
    leagues: updated,
    newLeague,
  };
};

// Join a league by invite code
export const joinLeagueByCode = (
  leagues: League[],
  code: string
): { success: boolean; league?: League; message: string; updatedLeagues: League[] } => {
  const normalized = code.trim().toUpperCase();
  const userName = loadUserName();
  const today = getTodayDateKey();

  const existingIdx = leagues.findIndex(l => l.inviteCode.toUpperCase() === normalized);

  if (existingIdx !== -1) {
    const league = leagues[existingIdx];
    const alreadyMember = league.members.some(m => m.isCurrentUser);
    if (alreadyMember) {
      saveActiveLeagueId(league.id);
      return {
        success: true,
        league,
        message: `You are already a member of "${league.name}"! Switched active league.`,
        updatedLeagues: leagues,
      };
    }

    const userMember: LeagueMember = {
      id: 'current-user',
      name: userName,
      isCurrentUser: true,
      avatarColor: 'bg-amber-600 text-amber-50',
      avatarEmoji: '🌟',
      points: 100,
      todayPoints: 10,
      rank: league.members.length + 1,
      streakDays: 1,
      completedToday: true,
      progressCurrent: 1,
      progressTarget: league.target.targetAmount,
      progressPercent: Math.round((1 / Math.max(1, league.target.targetAmount)) * 100),
      statusMessage: 'Joined via invite code! 🤝',
      joinedDate: today,
      dailyActivity: { [today]: 10 },
    };

    const newMembers = recomputeRanks([...league.members, userMember]);
    const updatedLeague: League = {
      ...league,
      members: newMembers,
      activityFeed: [
        {
          id: `feed-join-${Date.now()}`,
          memberName: userName,
          isCurrentUser: true,
          actionText: `joined the league via code ${normalized}! 👋`,
          pointsEarned: 25,
          timestamp: Date.now(),
          type: 'joined',
        },
        ...league.activityFeed,
      ],
    };

    const updated = [...leagues];
    updated[existingIdx] = updatedLeague;
    saveStoredLeagues(updated);
    saveActiveLeagueId(updatedLeague.id);

    return {
      success: true,
      league: updatedLeague,
      message: `Successfully joined "${updatedLeague.name}"!`,
      updatedLeagues: updated,
    };
  }

  // If code is not found in existing leagues, create a dynamic peer circle with that code!
  // This allows friends to enter any code they agreed on (e.g. "QURAN-2026", "MEDINA-786") and it connects seamlessly!
  const newLeagueName = `Circle ${normalized}`;
  const generatedTarget: LeagueTarget = {
    rangeType: 'juz',
    description: 'Master Juz 30 together',
    targetAmount: 23,
    targetUnit: 'pages',
    selectedJuz: 30,
    startPage: 582,
    endPage: 604,
  };

  const userMember: LeagueMember = {
    id: 'current-user',
    name: userName,
    isCurrentUser: true,
    avatarColor: 'bg-amber-600 text-amber-50',
    avatarEmoji: '🌟',
    points: 150,
    todayPoints: 20,
    rank: 1,
    streakDays: 2,
    completedToday: true,
    progressCurrent: 3,
    progressTarget: 23,
    progressPercent: 13,
    statusMessage: 'Joined via invite code',
    joinedDate: today,
    dailyActivity: { [today]: 20 },
  };

  const friendMember: LeagueMember = {
    id: `friend-${Date.now()}`,
    name: 'Your Friend (Host)',
    isCurrentUser: false,
    avatarColor: 'bg-emerald-700 text-emerald-100',
    avatarEmoji: '🤝',
    points: 220,
    todayPoints: 40,
    rank: 1,
    streakDays: 4,
    completedToday: true,
    progressCurrent: 6,
    progressTarget: 23,
    progressPercent: 26,
    statusMessage: 'Welcome to our private league! 💫',
    joinedDate: today,
    dailyActivity: { [today]: 40 },
  };

  const dynamicLeague: League = {
    id: `league-code-${Date.now()}`,
    name: newLeagueName,
    description: `Private invite circle created with code ${normalized}`,
    inviteCode: normalized,
    creatorName: 'Friend',
    isUserCreator: false,
    createdAt: today,
    challengeStructure: 'monthly',
    target: generatedTarget,
    members: recomputeRanks([friendMember, userMember]),
    activityFeed: [
      {
        id: `feed-join-${Date.now()}`,
        memberName: userName,
        isCurrentUser: true,
        actionText: `joined the private league "${newLeagueName}"!`,
        pointsEarned: 25,
        timestamp: Date.now(),
        type: 'joined',
      },
    ],
  };

  const updated = [dynamicLeague, ...leagues];
  saveStoredLeagues(updated);
  saveActiveLeagueId(dynamicLeague.id);

  return {
    success: true,
    league: dynamicLeague,
    message: `Joined private league "${dynamicLeague.name}"!`,
    updatedLeagues: updated,
  };
};

export const getTierFromRank = (rank: number, totalMembers: number): { label: string; badge: string; color: string } => {
  if (rank === 1) {
    return { label: 'Champion / Gold Tier', badge: '🥇', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' };
  }
  if (rank === 2) {
    return { label: 'Promotion Zone / Silver', badge: '🥈', color: 'text-slate-400 bg-slate-400/10 border-slate-400/30' };
  }
  if (rank === 3) {
    return { label: 'Top Contender / Bronze', badge: '🥉', color: 'text-amber-700 bg-amber-700/10 border-amber-700/30' };
  }
  if (rank <= Math.ceil(totalMembers * 0.6)) {
    return { label: 'Mid-Table Stable Zone', badge: '✨', color: 'text-emerald-600 bg-emerald-600/10 border-emerald-600/30' };
  }
  return { label: 'Needs Momentum', badge: '⚡', color: 'text-stone-500 bg-stone-500/10 border-stone-500/30' };
};
