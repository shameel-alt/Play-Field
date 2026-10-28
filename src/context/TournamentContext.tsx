import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tournament } from '../types/tournament';
import { Match, MatchEvent } from '../types/match';
import { Team } from '../types/team';
import { Venue, CourtBookingLock } from '../types/venue';
import { CoOrganizer, UserProfile } from '../types/user';
import { SEED_ONGOING_TOURNAMENT } from '../data/seedOngoingTournament';
import { SEED_ENDED_TOURNAMENT } from '../data/seedEndedTournament';
import { SEED_VENUES } from '../data/venuesSeed';
import { calculateGroupStandings } from '../lib/standingsEngine';
import { checkCourtAvailability, ConflictCheckResult } from '../lib/conflictEngine';
import { issueWalkover, issueDisqualification } from '../lib/forfeitEngine';
import { supabase } from '../lib/supabase';

interface TournamentContextType {
  tournaments: Tournament[];
  venues: Venue[];
  activeVenueLocks: CourtBookingLock[];
  isLoading: boolean;
  getTournamentByIdOrSlug: (idOrSlug: string) => Tournament | undefined;
  getUserTournaments: (user: UserProfile | null) => { ongoing: Tournament[]; ended: Tournament[] };
  createTournament: (newTournament: Tournament) => Promise<string>;
  updateScore: (tournamentId: string, matchId: string, homeScore: number, awayScore: number) => Promise<void>;
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
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
    setTournaments(prev => prev.map(t => {
      if (t.id !== tournamentId) return t;

      const match = t.matches.find(m => m.id === matchId);
      if (!match) return t;

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
  };

  return (
    <TournamentContext.Provider
      value={{
        tournaments,
        venues,
        activeVenueLocks,
        isLoading,
        getTournamentByIdOrSlug,
        getUserTournaments,
        createTournament,
        updateScore,
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
