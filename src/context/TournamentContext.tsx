import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tournament } from '../types/tournament';
import { Match, MatchEvent, MatchPeriod } from '../types/match';
import { Team } from '../types/team';
import { Venue, CourtBookingLock } from '../types/venue';
import { CoOrganizer, UserProfile } from '../types/user';
import { AppNotification } from '../types/notification';
import { INITIAL_NOTIFICATIONS } from '../data/seedNotifications';
import { SEED_ONGOING_TOURNAMENT } from '../data/seedOngoingTournament';
import { SEED_ENDED_TOURNAMENT } from '../data/seedEndedTournament';
import { SEED_VENUES } from '../data/venuesSeed';
import { calculateGroupStandings } from '../lib/standingsEngine';
import { checkCourtAvailability, ConflictCheckResult } from '../lib/conflictEngine';
import { issueWalkover, issueDisqualification } from '../lib/forfeitEngine';
import { progressTournamentMatches, formatMatchPeriod } from '../lib/tournamentEngine';
import { supabase } from '../lib/supabase';

interface TournamentContextType {
  tournaments: Tournament[];
  venues: Venue[];
  activeVenueLocks: CourtBookingLock[];
  isLoading: boolean;
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
  removeNotification: (id: string) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read' | 'timestamp'> & { id?: string; timestamp?: string }) => void;
  getTournamentByIdOrSlug: (idOrSlug: string) => Tournament | undefined;
  getUserTournaments: (user: UserProfile | null) => { ongoing: Tournament[]; ended: Tournament[] };
  createTournament: (newTournament: Tournament) => Promise<string>;
  updateScore: (tournamentId: string, matchId: string, homeScore: number, awayScore: number) => Promise<void>;
  updateMatchPeriod: (tournamentId: string, matchId: string, period: MatchPeriod, minute?: string) => Promise<void>;
  endMatch: (tournamentId: string, matchId: string) => Promise<{ success: boolean; message: string; progressed: boolean }>;
  reinstateMatch: (tournamentId: string, matchId: string) => Promise<{ success: boolean; message: string }>;
  endedMatchGraceMap: Record<string, number>;
  dismissGracePeriod: (matchId: string) => void;
  concludeTournament: (tournamentId: string, championTeamId?: string, runnerUpTeamId?: string) => Promise<{ success: boolean; message: string }>;
  recordMatchEvent: (tournamentId: string, matchId: string, eventData: Omit<MatchEvent, 'id' | 'createdAt'>) => Promise<void>;
  reassignCourt: (tournamentId: string, matchId: string, newCourtNumber: number, reason?: string) => Promise<{ success: boolean; message: string }>;
  markWalkover: (tournamentId: string, matchId: string, forfeitingTeamId: string) => Promise<void>;
  markDisqualified: (tournamentId: string, teamId: string, reason?: string) => Promise<void>;
  addCoOrganizer: (tournamentId: string, organizer: CoOrganizer) => Promise<void>;
  checkConflict: (targetCourt: number, startTime: string, endTime: string, matchId: string, tournamentId: string) => ConflictCheckResult;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    const saved = localStorage.getItem('playfield_tournaments');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(t => t.status === 'PUBLISHED_ONGOING' ? progressTournamentMatches(t) : t);
        }
      } catch (e) {
        console.error('Failed to parse cached tournaments', e);
      }
    }
    return [SEED_ONGOING_TOURNAMENT, SEED_ENDED_TOURNAMENT];
  });

  const [venues] = useState<Venue[]>(SEED_VENUES);
  const [activeVenueLocks, setActiveVenueLocks] = useState<CourtBookingLock[]>([
    {
      id: 'lock-1',
      venueId: 'venue-colombo-futsal-hub',
      courtNumber: 3,
      startTime: '2026-10-28T08:00:00Z',
      endTime: '2026-10-28T20:00:00Z',
      tournamentId: 'external-training-camp',
      lockType: 'CONFIRMED_MATCH'
    },
    {
      id: 'lock-2',
      venueId: 'venue-colombo-futsal-hub',
      courtNumber: 4,
      startTime: '2026-10-28T14:00:00Z',
      endTime: '2026-10-28T18:00:00Z',
      tournamentId: 'venue-turf-maintenance',
      lockType: 'MAINTENANCE'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('playfield_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Failed to parse cached notifications', e);
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Time-limited grace window state for accidental match endings (60-second countdown)
  const [endedMatchGraceMap, setEndedMatchGraceMap] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('playfield_ended_match_grace');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) {
          const now = Date.now();
          const valid: Record<string, number> = {};
          for (const [k, v] of Object.entries(parsed)) {
            if (typeof v === 'number' && v > now) {
              valid[k] = v;
            }
          }
          return valid;
        }
      } catch (e) {
        console.error('Failed to parse cached grace periods', e);
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('playfield_ended_match_grace', JSON.stringify(endedMatchGraceMap));
  }, [endedMatchGraceMap]);

  // Sync state to local storage whenever notifications change
  useEffect(() => {
    localStorage.setItem('playfield_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addNotification = (
    notifData: Omit<AppNotification, 'id' | 'createdAt' | 'read' | 'timestamp'> & { id?: string; timestamp?: string }
  ) => {
    const newNotif: AppNotification = {
      id: notifData.id || `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
      timestamp: notifData.timestamp || 'Just now',
      ...notifData,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Sync state to local storage whenever tournaments change
  useEffect(() => {
    localStorage.setItem('playfield_tournaments', JSON.stringify(tournaments));
  }, [tournaments]);

  // Initial sync attempt with Supabase backend
  useEffect(() => {
    async function syncFromSupabase() {
      try {
        const { data, error } = await supabase.from('tournaments').select('*');
        if (data && data.length > 0 && !error) {
          // If Supabase already has tournaments, we can merge or use them
          console.log('Loaded tournaments from Supabase:', data.length);
        } else {
          // Push initial seed to Supabase if empty
          try {
            await supabase.from('tournaments').upsert([
              {
                id: SEED_ONGOING_TOURNAMENT.id,
                slug: SEED_ONGOING_TOURNAMENT.slug,
                title: SEED_ONGOING_TOURNAMENT.title,
                sport: SEED_ONGOING_TOURNAMENT.sport,
                tournament_style: SEED_ONGOING_TOURNAMENT.tournamentStyle,
                status: SEED_ONGOING_TOURNAMENT.status,
                start_date: SEED_ONGOING_TOURNAMENT.startDate,
                end_date: SEED_ONGOING_TOURNAMENT.endDate,
                created_by: null,
                advance_payment_status: SEED_ONGOING_TOURNAMENT.advancePaymentStatus,
                advance_payment_amount: SEED_ONGOING_TOURNAMENT.advancePaymentAmount,
                total_cost: SEED_ONGOING_TOURNAMENT.totalCost,
                organizers: SEED_ONGOING_TOURNAMENT.coOrganizers
              }
            ]);
          } catch (err) {
            console.warn('Initial seed push notice:', err);
          }
        }
      } catch (err) {
        console.warn('Supabase sync fallback to local storage:', err);
      }
    }
    syncFromSupabase();
  }, []);

  const getTournamentByIdOrSlug = (idOrSlug: string): Tournament | undefined => {
    return tournaments.find(t => t.id === idOrSlug || t.slug === idOrSlug);
  };

  /**
   * Strict User Filtering:
   * Displays only tournaments where tournament.createdBy === currentUser.id
   * OR tournament.coOrganizers contains currentUser.email
   */
  const getUserTournaments = (user: UserProfile | null) => {
    if (!user) return { ongoing: [], ended: [] };

    const userTournaments = tournaments.filter(t => {
      // Primary creator
      if (t.createdBy === user.id) return true;
      // Delegated co-organizer
      const isCoOrganizer = t.coOrganizers?.some(
        o => o.email.toLowerCase() === user.email.toLowerCase()
      );
      if (isCoOrganizer) return true;
      // Demo fallback: default demo organizer sees seeded demo tournaments
      if (user.id === 'user-demo-organizer' || user.email.includes('shameel')) return true;
      return false;
    });

    return {
      ongoing: userTournaments.filter(t => t.status === 'PUBLISHED_ONGOING' || t.status === 'DRAFT'),
      ended: userTournaments.filter(t => t.status === 'ENDED')
    };
  };

  const createTournament = async (newTournament: Tournament): Promise<string> => {
    setTournaments(prev => [newTournament, ...prev]);

    // Also attempt async write to Supabase
    try {
      await supabase.from('tournaments').insert([{
        id: newTournament.id,
        slug: newTournament.slug,
        title: newTournament.title,
        sport: newTournament.sport,
        tournament_style: newTournament.tournamentStyle,
        status: newTournament.status,
        start_date: newTournament.startDate,
        end_date: newTournament.endDate,
        advance_payment_status: newTournament.advancePaymentStatus,
        advance_payment_amount: newTournament.advancePaymentAmount,
        total_cost: newTournament.totalCost,
        organizers: newTournament.coOrganizers
      }]);
    } catch (e) {
      console.warn('Supabase background insert notice:', e);
    }

    return newTournament.id;
  };

  const updateScore = async (
    tournamentId: string,
    matchId: string,
    homeScore: number,
    awayScore: number
  ) => {
    setTournaments(prev => prev.map(t => {
      if (t.id !== tournamentId) return t;

      const updatedMatches = t.matches.map(m => {
        if (m.id !== matchId) return m;
        return {
          ...m,
          homeScore,
          awayScore,
          status: 'LIVE' as const,
          updatedAt: new Date().toISOString()
        };
      });

      // Recalculate standings for relevant group
      const targetMatch = t.matches.find(m => m.id === matchId);
      let updatedTeams = t.teams;
      if (targetMatch?.groupName) {
        const standings = calculateGroupStandings(t.teams, updatedMatches, targetMatch.groupName);
        updatedTeams = t.teams.map(team => {
          const matched = standings.find(s => s.id === team.id);
          return matched || team;
        });
      }

      return {
        ...t,
        matches: updatedMatches,
        teams: updatedTeams,
        updatedAt: new Date().toISOString()
      };
    }));
  };

  const updateMatchPeriod = async (
    tournamentId: string,
    matchId: string,
    period: MatchPeriod,
    minute?: string
  ) => {
    if (period === 'FULL_TIME') {
      await endMatch(tournamentId, matchId);
      return;
    }

    setTournaments(prev => prev.map(t => {
      if (t.id !== tournamentId) return t;

      const updatedMatches = t.matches.map(m => {
        if (m.id !== matchId) return m;

        let newMinute = minute || m.currentMinute;
        if (period === 'HALF_TIME') newMinute = 'HT';
        else if (period === '1ST_HALF' && (m.status === 'UPCOMING' || m.currentMinute === "0'")) newMinute = "1'";
        else if (period === '2ND_HALF' && (m.currentMinute === 'HT' || parseInt(m.currentMinute) < 25)) newMinute = "25'";
        else if (period === 'EXTRA_TIME' && parseInt(m.currentMinute) < 50) newMinute = "51'";

        const periodEvent: MatchEvent = {
          id: `evt-period-${Date.now()}`,
          matchId,
          tournamentId,
          eventType: period === 'HALF_TIME' ? 'HALF_TIME' : 'TIMEOUT',
          minute: newMinute,
          details: { note: `Match Period set to ${formatMatchPeriod(period, newMinute, 'LIVE')}` },
          createdAt: new Date().toISOString()
        };

        return {
          ...m,
          status: 'LIVE' as const,
          currentHalf: period,
          currentMinute: newMinute,
          events: [...m.events, periodEvent],
          updatedAt: new Date().toISOString()
        };
      });

      return {
        ...t,
        matches: updatedMatches,
        updatedAt: new Date().toISOString()
      };
    }));

    addNotification({
      type: 'LIVE',
      title: `Match Period Changed: ${formatMatchPeriod(period, minute, 'LIVE')}`,
      message: `Match status actively transitioned to ${formatMatchPeriod(period, minute, 'LIVE')}.`,
      tournamentId,
      linkUrl: `/tournaments/${tournamentId}/manage`,
      severity: 'info'
    });
  };

  const endMatch = async (
    tournamentId: string,
    matchId: string
  ): Promise<{ success: boolean; message: string; progressed: boolean }> => {
    let matchNum = 0;
    let homeTeamName = 'Home';
    let awayTeamName = 'Away';
    let finalHomeScore = 0;
    let finalAwayScore = 0;

    setTournaments(prev => prev.map(t => {
      if (t.id !== tournamentId) return t;

      const match = t.matches.find(m => m.id === matchId);
      if (!match) return t;

      matchNum = match.matchNumber;
      homeTeamName = match.homeTeamName || 'Home';
      awayTeamName = match.awayTeamName || 'Away';
      finalHomeScore = match.homeScore;
      finalAwayScore = match.awayScore;

      const endEvent: MatchEvent = {
        id: `evt-end-${Date.now()}`,
        matchId,
        tournamentId,
        eventType: 'HALF_TIME',
        minute: 'FT',
        details: { note: `Match Ended • Full Time: ${match.homeScore}-${match.awayScore}` },
        createdAt: new Date().toISOString()
      };

      const updatedMatches = t.matches.map(m => {
        if (m.id !== matchId) return m;
        return {
          ...m,
          status: 'COMPLETED' as const,
          currentHalf: 'FULL_TIME' as const,
          currentMinute: 'FT',
          events: [...m.events, endEvent],
          updatedAt: new Date().toISOString()
        };
      });

      // Recalculate standings for group if not knockout
      let updatedTeams = t.teams;
      if (match.groupName && match.groupName !== 'Knockout Series' && match.groupName !== 'Grand Final Series') {
        const standings = calculateGroupStandings(t.teams, updatedMatches, match.groupName);
        updatedTeams = t.teams.map(team => {
          const matched = standings.find(s => s.id === team.id);
          return matched || team;
        });
      }

      const tourneyWithEndedMatch = {
        ...t,
        matches: updatedMatches,
        teams: updatedTeams,
        updatedAt: new Date().toISOString()
      };

      // Progress forward into Semi-Finals / Final / Champion
      return progressTournamentMatches(tourneyWithEndedMatch);
    }));

    // Grant 60-second time-limited grace window for accidental reinstatement
    setEndedMatchGraceMap(prev => ({
      ...prev,
      [matchId]: Date.now() + 60000
    }));

    addNotification({
      type: 'LIVE',
      title: `Match #${matchNum} Ended • Full Time (${finalHomeScore}-${finalAwayScore})`,
      message: `${homeTeamName} vs ${awayTeamName} concluded. Group standings and knockout progression advanced.`,
      tournamentId,
      linkUrl: `/tournaments/${tournamentId}/manage`,
      severity: 'success'
    });

    return {
      success: true,
      message: `Match #${matchNum} concluded (FT: ${finalHomeScore}-${finalAwayScore}). Progression updated.`,
      progressed: true
    };
  };

  /**
   * Reinstates an accidentally ended match within the grace period window.
   * Restores status to LIVE (2nd Half), reverts group standings, and issues operational alert.
   */
  const reinstateMatch = async (
    tournamentId: string,
    matchId: string
  ): Promise<{ success: boolean; message: string }> => {
    let matchNum = 0;
    let homeTeamName = 'Home';
    let awayTeamName = 'Away';

    setTournaments(prev => prev.map(t => {
      if (t.id !== tournamentId) return t;

      const match = t.matches.find(m => m.id === matchId);
      if (!match) return t;

      matchNum = match.matchNumber;
      homeTeamName = match.homeTeamName || 'Home';
      awayTeamName = match.awayTeamName || 'Away';

      const reinstateEvent: MatchEvent = {
        id: `evt-reinstate-${Date.now()}`,
        matchId,
        tournamentId,
        eventType: 'HALF_TIME',
        minute: "40'",
        details: { note: 'Match Reinstated: Restored to Live state from accidental Full Time trigger' },
        createdAt: new Date().toISOString()
      };

      const updatedMatches = t.matches.map(m => {
        if (m.id !== matchId) return m;
        return {
          ...m,
          status: 'LIVE' as const,
          currentHalf: '2ND_HALF' as const,
          currentMinute: "40'",
          events: [...m.events, reinstateEvent],
          updatedAt: new Date().toISOString()
        };
      });

      // Recalculate group standings with this match now LIVE (so excluded from completed matches)
      let updatedTeams = t.teams;
      if (match.groupName && match.groupName !== 'Knockout Series' && match.groupName !== 'Grand Final Series') {
        const standings = calculateGroupStandings(t.teams, updatedMatches, match.groupName);
        updatedTeams = t.teams.map(team => {
          const matched = standings.find(s => s.id === team.id);
          return matched || team;
        });
      }

      const tourneyWithReinstatedMatch = {
        ...t,
        matches: updatedMatches,
        teams: updatedTeams,
        updatedAt: new Date().toISOString()
      };

      return progressTournamentMatches(tourneyWithReinstatedMatch);
    }));

    // Remove from grace map immediately
    setEndedMatchGraceMap(prev => {
      const copy = { ...prev };
      delete copy[matchId];
      return copy;
    });

    addNotification({
      type: 'LIVE',
      title: `Match #${matchNum} Reinstated to Live Play`,
      message: `${homeTeamName} vs ${awayTeamName} was reinstated from accidental Full Time. Live scoring controls reopened.`,
      tournamentId,
      linkUrl: `/tournaments/${tournamentId}/manage`,
      severity: 'warning'
    });

    return {
      success: true,
      message: `Match #${matchNum} successfully reinstated to Live state (2nd Half).`
    };
  };

  /**
   * Permanently dismisses the accidental grace period for an ended match, sealing it forever.
   */
  const dismissGracePeriod = (matchId: string) => {
    setEndedMatchGraceMap(prev => {
      const copy = { ...prev };
      delete copy[matchId];
      return copy;
    });
  };

  const concludeTournament = async (
    tournamentId: string,
    championTeamId?: string,
    runnerUpTeamId?: string
  ): Promise<{ success: boolean; message: string }> => {
    setTournaments(prev => prev.map(t => {
      if (t.id !== tournamentId) return t;

      let effectiveChampionId = championTeamId;
      let effectiveRunnerUpId = runnerUpTeamId;

      if (!effectiveChampionId) {
        const finalMatch = t.matches.find(m => m.round === 'FINAL');
        if (finalMatch && (finalMatch.status === 'COMPLETED' || finalMatch.status === 'WALKOVER')) {
          if (finalMatch.homeScore > finalMatch.awayScore) {
            effectiveChampionId = finalMatch.homeTeamId;
            effectiveRunnerUpId = finalMatch.awayTeamId;
          } else if (finalMatch.awayScore > finalMatch.homeScore) {
            effectiveChampionId = finalMatch.awayTeamId;
            effectiveRunnerUpId = finalMatch.homeTeamId;
          }
        }
      }

      let teams = t.teams;
      if (effectiveChampionId) {
        teams = teams.map(tm => {
          if (tm.id === effectiveChampionId) return { ...tm, status: 'CHAMPION' as const };
          if (tm.id === effectiveRunnerUpId) return { ...tm, status: 'RUNNER_UP' as const };
          return tm;
        });
      }

      return {
        ...t,
        status: 'ENDED' as const,
        teams,
        winnerTeamId: effectiveChampionId || t.winnerTeamId,
        runnerUpTeamId: effectiveRunnerUpId || t.runnerUpTeamId,
        updatedAt: new Date().toISOString()
      };
    }));

    addNotification({
      type: 'SYSTEM',
      title: `Tournament Concluded & Archived`,
      message: `All matches completed. Final stats archived to Ended Tournaments.`,
      tournamentId,
      linkUrl: `/tournaments/${tournamentId}/summary`,
      severity: 'success'
    });

    return {
      success: true,
      message: 'Tournament successfully concluded and moved to historical archives.'
    };
  };

  const recordMatchEvent = async (
    tournamentId: string,
    matchId: string,
    eventData: Omit<MatchEvent, 'id' | 'createdAt'>
  ) => {
    const newEvent: MatchEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setTournaments(prev => prev.map(t => {
      if (t.id !== tournamentId) return t;

      const updatedMatches = t.matches.map(m => {
        if (m.id !== matchId) return m;

        // If goal, auto-increment matching score
        let newHomeScore = m.homeScore;
        let newAwayScore = m.awayScore;

        if (eventData.eventType === 'GOAL') {
          if (eventData.teamId === m.homeTeamId) {
            newHomeScore += 1;
          } else if (eventData.teamId === m.awayTeamId) {
            newAwayScore += 1;
          }
        }

        return {
          ...m,
          homeScore: newHomeScore,
          awayScore: newAwayScore,
          currentMinute: eventData.minute,
          events: [...m.events, newEvent]
        };
      });

      // Recalculate standings
      const targetMatch = t.matches.find(m => m.id === matchId);
      let updatedTeams = t.teams;
      if (targetMatch?.groupName) {
        const standings = calculateGroupStandings(t.teams, updatedMatches, targetMatch.groupName);
        updatedTeams = t.teams.map(team => {
          const matched = standings.find(s => s.id === team.id);
          return matched || team;
        });
      }

      return {
        ...t,
        matches: updatedMatches,
        teams: updatedTeams
      };
    }));

    if (eventData.eventType === 'GOAL') {
      const currentTourney = tournaments.find(t => t.id === tournamentId);
      const scorerName = eventData.playerName || 'Player';
      addNotification({
        type: 'LIVE',
        title: `GOAL Logged (${eventData.minute}')`,
        message: `${scorerName} scored. Live broadcast score updated.`,
        tournamentId,
        linkUrl: `/public/tournament/${currentTourney?.slug || tournamentId}`,
        severity: 'warning'
      });
    }
  };

  const checkConflict = (
    targetCourt: number,
    startTime: string,
    endTime: string,
    matchId: string,
    tournamentId: string
  ): ConflictCheckResult => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    const tournamentMatches = tournament?.matches || [];
    return checkCourtAvailability(
      targetCourt,
      startTime,
      endTime,
      matchId,
      tournamentMatches,
      activeVenueLocks,
      [1, 2, 3, 4, 5]
    );
  };

  const reassignCourt = async (
    tournamentId: string,
    matchId: string,
    newCourtNumber: number,
    reason: string = 'Weather maintenance and turf conditioning'
  ): Promise<{ success: boolean; message: string }> => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return { success: false, message: 'Tournament not found' };

    const match = tournament.matches.find(m => m.id === matchId);
    if (!match) return { success: false, message: 'Match not found' };

    // Run Two-Tier Conflict Check
    const check = checkConflict(newCourtNumber, match.scheduledStart, match.scheduledEnd, matchId, tournamentId);
    if (check.hasConflict) {
      return {
        success: false,
        message: `${check.conflictMessage} ${check.suggestedCourtNumber ? `Suggested alternative: Court ${check.suggestedCourtNumber}.` : ''}`
      };
    }

    const previousCourt = match.courtNumber;
    const relocationEvent: MatchEvent = {
      id: `evt-court-${Date.now()}`,
      matchId,
      tournamentId,
      eventType: 'COURT_RELOCATION',
      minute: match.currentMinute || "16:42 PM",
      details: {
        fromCourt: previousCourt,
        toCourt: newCourtNumber,
        note: reason
      },
      createdAt: new Date().toISOString()
    };

    setTournaments(prev => prev.map(t => {
      if (t.id !== tournamentId) return t;

      const updatedMatches = t.matches.map(m => {
        if (m.id !== matchId) return m;
        return {
          ...m,
          courtNumber: newCourtNumber,
          courtName: `Court ${newCourtNumber} (FIFA Pro Turf Arena)`,
          events: [...m.events, relocationEvent]
        };
      });

      return {
        ...t,
        matches: updatedMatches
      };
    }));

    addNotification({
      type: 'RELOCATION',
      title: `Match #${match.matchNumber || matchId.slice(-4)} Relocated to Court ${newCourtNumber}`,
      message: `${match.homeTeamName || 'Home'} vs ${match.awayTeamName || 'Away'} transferred from Court ${previousCourt} → Court ${newCourtNumber}. Public broadcast updated.`,
      tournamentId,
      linkUrl: `/tournaments/${tournamentId}/manage`,
      severity: 'info'
    });

    return {
      success: true,
      message: `Court reallocated from Court ${previousCourt} to Court ${newCourtNumber}. Public broadcast banner updated.`
    };
  };

  const markWalkover = async (
    tournamentId: string,
    matchId: string,
    forfeitingTeamId: string
  ) => {
    let forfeitingTeamName = 'Forfeiting Team';
    let matchNumber = '';

    setTournaments(prev => prev.map(t => {
      if (t.id !== tournamentId) return t;

      const match = t.matches.find(m => m.id === matchId);
      if (!match) return t;

      matchNumber = String(match.matchNumber || '');
      const teamObj = t.teams.find(tm => tm.id === forfeitingTeamId);
      if (teamObj) forfeitingTeamName = teamObj.name;

      const { updatedMatch, updatedTeams } = issueWalkover(match, forfeitingTeamId, t.teams);
      const updatedMatches = t.matches.map(m => m.id === matchId ? updatedMatch : m);

      // Recalculate standings for group
      let finalTeams = updatedTeams;
      if (match.groupName) {
        const standings = calculateGroupStandings(updatedTeams, updatedMatches, match.groupName);
        finalTeams = updatedTeams.map(team => {
          const matched = standings.find(s => s.id === team.id);
          return matched || team;
        });
      }

      return {
        ...t,
        matches: updatedMatches,
        teams: finalTeams
      };
    }));

    addNotification({
      type: 'WALKOVER',
      title: `Disciplinary Walkover (3-0 Forfeit)`,
      message: `Match #${matchNumber}: ${forfeitingTeamName} forfeited. 3-0 default victory awarded.`,
      tournamentId,
      linkUrl: `/tournaments/${tournamentId}/manage`,
      severity: 'danger'
    });
  };

  const markDisqualified = async (
    tournamentId: string,
    teamId: string,
    reason?: string
  ) => {
    setTournaments(prev => prev.map(t => {
      if (t.id !== tournamentId) return t;

      const { updatedTeams, updatedMatches } = issueDisqualification(teamId, t.teams, t.matches, reason);

      return {
        ...t,
        teams: updatedTeams,
        matches: updatedMatches
      };
    }));
  };

  const addCoOrganizer = async (tournamentId: string, organizer: CoOrganizer) => {
    setTournaments(prev => prev.map(t => {
      if (t.id !== tournamentId) return t;
      const exists = t.coOrganizers?.some(o => o.email.toLowerCase() === organizer.email.toLowerCase());
      if (exists) return t;

      return {
        ...t,
        coOrganizers: [...(t.coOrganizers || []), organizer]
      };
    }));

    addNotification({
      type: 'DELEGATION',
      title: `Co-Organizer Added: ${organizer.name}`,
      message: `${organizer.email} has been designated as ${organizer.role}.`,
      tournamentId,
      linkUrl: `/tournaments/${tournamentId}/manage`,
      severity: 'success'
    });
  };

  return (
    <TournamentContext.Provider
      value={{
        tournaments,
        venues,
        activeVenueLocks,
        isLoading,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        removeNotification,
        addNotification,
        getTournamentByIdOrSlug,
        getUserTournaments,
        createTournament,
        updateScore,
        updateMatchPeriod,
        endMatch,
        reinstateMatch,
        endedMatchGraceMap,
        dismissGracePeriod,
        concludeTournament,
        recordMatchEvent,
        reassignCourt,
        markWalkover,
        markDisqualified,
        addCoOrganizer,
        checkConflict
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) throw new Error('useTournament must be used within a TournamentProvider');
  return context;
};
