export type PlayerPosition = 'Goalkeeper' | 'Defender' | 'Winger' | 'Pivot' | 'Midfielder' | 'Forward';

export interface Player {
  id: string;
  teamId: string;
  tournamentId?: string;
  name: string;
  jerseyNumber: number;
  position: PlayerPosition;
  isCaptain?: boolean;
  goalsScored?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
}

export type TeamStatus = 'ACTIVE' | 'QUALIFIED' | 'KNOCKED_OUT' | 'WALKOVER' | 'DISQUALIFIED' | 'CHAMPION' | 'RUNNER_UP';

export interface Team {
  id: string;
  tournamentId: string;
  name: string;
  shortCode: string;
  groupName: 'Group A' | 'Group B' | 'Group C' | 'Group D' | string;
  seed: number;
  kitColorPrimary: string;
  kitColorAway: string;
  status: TeamStatus;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  players: Player[];
}
