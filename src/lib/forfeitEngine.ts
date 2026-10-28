import { Match, MatchEvent } from '../types/match';
import { Team } from '../types/team';

export interface ForfeitResult {
  updatedMatch: Match;
  updatedTeams: Team[];
  auditEvent: MatchEvent;
}

/**
 * Executes official Walkover (W/O):
 * Automatically awards a 3-0 default win/points to the opponent,
 * logs immutable event telemetry, and updates team standings eligibility.
 */
export function issueWalkover(
  match: Match,
  forfeitingTeamId: string,
  teams: Team[],
  reason: string = 'Team failed to report to pitch within official grace period (15 mins).'
): ForfeitResult {
  const isHomeForfeit = match.homeTeamId === forfeitingTeamId;
  const winningTeamId = isHomeForfeit ? match.awayTeamId : match.homeTeamId;

  // 3-0 default scoreline per FIFA/AMF futsal tournament regulations
  const updatedMatch: Match = {
    ...match,
    status: 'WALKOVER',
    walkoverTeamId: forfeitingTeamId,
    homeScore: isHomeForfeit ? 0 : 3,
    awayScore: isHomeForfeit ? 3 : 0,
    currentHalf: 'FULL_TIME',
    currentMinute: 'FT (W/O)',
    notes: `WALKOVER issued to ${isHomeForfeit ? match.homeTeamName : match.awayTeamName}. Default 3-0 win awarded to opponent.`
  };

  const auditEvent: MatchEvent = {
    id: `event-wo-${Date.now()}`,
    matchId: match.id,
    tournamentId: match.tournamentId,
    eventType: 'WALKOVER',
    minute: match.currentMinute || "0'",
    teamId: forfeitingTeamId,
    details: {
      note: reason,
      awardedTeamId: winningTeamId,
      forfeitedTeamId: forfeitingTeamId,
      scoreSnap: `${updatedMatch.homeScore} - ${updatedMatch.awayScore}`
    },
    createdAt: new Date().toISOString()
  };

  updatedMatch.events = [...(updatedMatch.events || []), auditEvent];

  // Update team status in roster
  const updatedTeams = teams.map(t => {
    if (t.id === forfeitingTeamId) {
      return { ...t, status: 'WALKOVER' as const };
    }
    return t;
  });

  return { updatedMatch, updatedTeams, auditEvent };
}

/**
 * Issues Disqualification (DQ) to a team for serious fair-play infractions
 */
export function issueDisqualification(
  teamId: string,
  teams: Team[],
  matches: Match[],
  reason: string = 'Severe regulatory fair-play infraction / ineligible athlete fielding.'
): { updatedTeams: Team[]; updatedMatches: Match[]; auditEvent: MatchEvent } {
  const updatedTeams = teams.map(t => {
    if (t.id === teamId) {
      return { ...t, status: 'DISQUALIFIED' as const };
    }
    return t;
  });

  const auditEvent: MatchEvent = {
    id: `event-dq-${Date.now()}`,
    matchId: 'global',
    tournamentId: teams[0]?.tournamentId || '',
    eventType: 'DISQUALIFICATION',
    minute: 'OFFICIAL',
    teamId,
    details: { note: reason },
    createdAt: new Date().toISOString()
  };

  // Tag ongoing or future matches involving the DQ'd team
  const updatedMatches = matches.map(m => {
    if (m.homeTeamId === teamId || m.awayTeamId === teamId) {
      if (m.status !== 'COMPLETED') {
        const isHomeDQ = m.homeTeamId === teamId;
        return {
          ...m,
          status: 'WALKOVER' as const,
          disqualifiedTeamId: teamId,
          homeScore: isHomeDQ ? 0 : 3,
          awayScore: isHomeDQ ? 3 : 0,
          currentHalf: 'FULL_TIME' as const,
          notes: `Match awarded 3-0 forfeit due to disqualification of ${isHomeDQ ? m.homeTeamName : m.awayTeamName}.`
        };
      }
    }
    return m;
  });

  return { updatedTeams, updatedMatches, auditEvent };
}
