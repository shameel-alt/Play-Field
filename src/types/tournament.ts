import { Team } from './team';
import { Match } from './match';
import { CoOrganizer } from './user';
import { Venue } from './venue';

export type SportType = 'futsal' | 'football7' | 'cricket' | 'badminton';
export type TournamentStyle = 'GROUP_KNOCKOUT' | 'ROUND_ROBIN' | 'SINGLE_ELIMINATION';
export type TournamentStatus = 'DRAFT' | 'PUBLISHED_ONGOING' | 'ENDED' | 'CANCELLED';

export interface Tournament {
  id: string;
  slug: string;
  title: string;
  sport: SportType;
  tournamentStyle: TournamentStyle;
  status: TournamentStatus;
  venueId: string;
  venue?: Venue;
  selectedCourtNumbers: number[];
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  daysCount: number;
  createdBy: string; // user ID
  coOrganizers: CoOrganizer[];
  advancePaymentStatus: 'UNPAID' | 'PARTIAL_30' | 'FULL';
  advancePaymentAmount: number;
  totalCost: number;
  paymentMethod: 'CARD' | 'BANK_TRANSFER' | 'QR_WALLET';
  paymentReference?: string;
  teams: Team[];
  matches: Match[];
  winnerTeamId?: string;
  runnerUpTeamId?: string;
  goldenBootPlayer?: {
    name: string;
    team: string;
    goals: number;
  };
  goldenGlovePlayer?: {
    name: string;
    team: string;
    savePercentage: number;
  };
  totalGoals?: number;
  createdAt: string;
  updatedAt: string;
}
