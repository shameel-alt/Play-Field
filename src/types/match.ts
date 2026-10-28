export type MatchRound = 'GROUP_STAGE' | 'QUARTER_FINAL' | 'SEMI_FINAL' | 'FINAL' | 'THIRD_PLACE';
export type MatchStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'WALKOVER' | 'CANCELLED';

export type MatchEventType = 
  | 'GOAL' 
  | 'ASSIST' 
  | 'YELLOW_CARD' 
  | 'RED_CARD' 
  | 'WALKOVER' 
  | 'DISQUALIFICATION' 
  | 'COURT_RELOCATION' 
  | 'TIMEOUT'
  | 'HALF_TIME';

export interface MatchEvent {
  id: string;
  matchId: string;
  tournamentId: string;
  eventType: MatchEventType;
  minute: string;
  teamId?: string;
  playerId?: string;
  playerName?: string;
  assistPlayerId?: string;
  assistPlayerName?: string;
  details?: {
    note?: string;
    fromCourt?: number;
    toCourt?: number;
    awardedTeamId?: string;
    forfeitedTeamId?: string;
    scoreSnap?: string;
  };
  createdAt: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  matchNumber: number;
  round: MatchRound;
  groupName?: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName?: string;
  awayTeamName?: string;
  homeTeamCode?: string;
  awayTeamCode?: string;
  courtNumber: number;
  courtName: string;
  scheduledStart: string; // ISO
  scheduledEnd: string;   // ISO
  status: MatchStatus;
  homeScore: number;
  awayScore: number;
  currentMinute: string;
  currentHalf: '1ST_HALF' | 'HALF_TIME' | '2ND_HALF' | 'EXTRA_TIME' | 'FULL_TIME';
  walkoverTeamId?: string;
  disqualifiedTeamId?: string;
  events: MatchEvent[];
  notes?: string;
}
