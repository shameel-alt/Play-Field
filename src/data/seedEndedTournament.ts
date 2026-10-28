import { Tournament } from '../types/tournament';
import { SEED_VENUES } from './venuesSeed';

export const SEED_ENDED_TOURNAMENT: Tournament = {
  id: 'tournament-western-province-2026',
  slug: 'western-province-inter-club-2026',
  title: 'Western Province Inter-Club Championship 2026',
  sport: 'futsal',
  tournamentStyle: 'GROUP_KNOCKOUT',
  status: 'ENDED',
  venueId: 'venue-colombo-futsal-hub',
  venue: SEED_VENUES[0],
  selectedCourtNumbers: [1, 2, 5],
  startDate: '2026-01-10',
  endDate: '2026-01-12',
  startTime: '08:00',
  endTime: '20:00',
  daysCount: 3,
  createdBy: 'user-demo-organizer',
  coOrganizers: [
    {
      id: 'user-tariq-scorer',
      email: 'tariq.scorer@playfield.lk',
      name: 'Tariq R.',
      role: 'SCORER'
    }
  ],
  advancePaymentStatus: 'FULL',
  advancePaymentAmount: 140000,
  totalCost: 140000,
  paymentMethod: 'CARD',
  paymentReference: '#TX-SLFA-2026-0112',
  winnerTeamId: 'team-ended-aw',
  runnerUpTeamId: 'team-ended-ct',
  goldenBootPlayer: {
    name: 'Tariq Al-Hassan',
    team: 'Apex Warriors',
    goals: 9
  },
  goldenGlovePlayer: {
    name: 'Roshan Senanayake',
    team: 'Apex Warriors',
    savePercentage: 84
  },
  totalGoals: 114,
  createdAt: '2026-01-05T08:00:00Z',
  updatedAt: '2026-01-12T21:00:00Z',
  teams: [
    {
      id: 'team-ended-aw',
      tournamentId: 'tournament-western-province-2026',
      name: 'Apex Warriors',
      shortCode: 'AW',
      groupName: 'Group A',
      seed: 1,
      kitColorPrimary: '#0D6E4F',
      kitColorAway: '#0B192C',
      status: 'CHAMPION',
      points: 9,
      played: 6,
      won: 6,
      drawn: 0,
      lost: 0,
      goalsFor: 23,
      goalsAgainst: 9,
      goalDifference: 14,
      players: [
        { id: 'pe-aw-1', teamId: 'team-ended-aw', name: 'Tariq Al-Hassan', jerseyNumber: 9, position: 'Pivot', isCaptain: true, goalsScored: 9, assists: 3 },
        { id: 'pe-aw-2', teamId: 'team-ended-aw', name: 'Kamil Rizvi', jerseyNumber: 10, position: 'Winger', goalsScored: 5, assists: 6 },
        { id: 'pe-aw-3', teamId: 'team-ended-aw', name: 'Sanjaya Silva', jerseyNumber: 4, position: 'Defender', goalsScored: 2, assists: 1 },
        { id: 'pe-aw-4', teamId: 'team-ended-aw', name: 'Roshan Senanayake', jerseyNumber: 1, position: 'Goalkeeper', goalsScored: 0, assists: 0 },
        { id: 'pe-aw-5', teamId: 'team-ended-aw', name: 'Mahela Jay', jerseyNumber: 3, position: 'Winger', goalsScored: 3, assists: 4 }
      ]
    },
    {
      id: 'team-ended-ct',
      tournamentId: 'tournament-western-province-2026',
      name: 'Colombo Thunder FC',
      shortCode: 'CT',
      groupName: 'Group A',
      seed: 2,
      kitColorPrimary: '#EA580C',
      kitColorAway: '#1E3A8A',
      status: 'RUNNER_UP',
      points: 6,
      played: 6,
      won: 4,
      drawn: 0,
      lost: 2,
      goalsFor: 18,
      goalsAgainst: 12,
      goalDifference: 6,
      players: [
        { id: 'pe-ct-1', teamId: 'team-ended-ct', name: 'Dimuth Perera', jerseyNumber: 7, position: 'Winger', isCaptain: true, goalsScored: 6, assists: 3 },
        { id: 'pe-ct-2', teamId: 'team-ended-ct', name: 'Navin Fernando', jerseyNumber: 11, position: 'Pivot', goalsScored: 4, assists: 2 },
        { id: 'pe-ct-3', teamId: 'team-ended-ct', name: 'Ruwan Kumara', jerseyNumber: 8, position: 'Defender', goalsScored: 3, assists: 2 },
        { id: 'pe-ct-4', teamId: 'team-ended-ct', name: 'Asanka De Silva', jerseyNumber: 12, position: 'Goalkeeper', goalsScored: 0, assists: 0 },
        { id: 'pe-ct-5', teamId: 'team-ended-ct', name: 'Dinesh Wick', jerseyNumber: 5, position: 'Winger', goalsScored: 2, assists: 1 }
      ]
    }
  ],
  matches: [
    {
      id: 'match-ended-sf1',
      tournamentId: 'tournament-western-province-2026',
      matchNumber: 30,
      round: 'SEMI_FINAL',
      groupName: 'Knockout',
      homeTeamId: 'team-ended-aw',
      awayTeamId: 'team-ended-it',
      homeTeamName: 'Apex Warriors',
      awayTeamName: 'Island Titans',
      homeTeamCode: 'AW',
      awayTeamCode: 'IT',
      courtNumber: 5,
      courtName: 'Court 5 (FIFA Pro Turf Arena)',
      scheduledStart: '2026-01-12T16:00:00Z',
      scheduledEnd: '2026-01-12T16:45:00Z',
      status: 'COMPLETED',
      homeScore: 3,
      awayScore: 1,
      currentMinute: 'FT',
      currentHalf: 'FULL_TIME',
      events: [
        { id: 'ee-1', matchId: 'match-ended-sf1', tournamentId: 'tournament-western-province-2026', eventType: 'GOAL', minute: "14'", playerName: 'Tariq Al-Hassan', assistPlayerName: 'Kamil Rizvi', createdAt: '2026-01-12T16:14:00Z' },
        { id: 'ee-2', matchId: 'match-ended-sf1', tournamentId: 'tournament-western-province-2026', eventType: 'GOAL', minute: "28'", playerName: 'Kamil Rizvi', createdAt: '2026-01-12T16:28:00Z' },
        { id: 'ee-3', matchId: 'match-ended-sf1', tournamentId: 'tournament-western-province-2026', eventType: 'GOAL', minute: "34'", playerName: 'Tariq Al-Hassan', createdAt: '2026-01-12T16:34:00Z' }
      ]
    },
    {
      id: 'match-ended-final',
      tournamentId: 'tournament-western-province-2026',
      matchNumber: 32,
      round: 'FINAL',
      groupName: 'Grand Final Series',
      homeTeamId: 'team-ended-aw',
      awayTeamId: 'team-ended-ct',
      homeTeamName: 'Apex Warriors',
      awayTeamName: 'Colombo Thunder FC',
      homeTeamCode: 'AW',
      awayTeamCode: 'CT',
      courtNumber: 5,
      courtName: 'Court 5 (FIFA Pro Turf Arena)',
      scheduledStart: '2026-01-12T18:30:00Z',
      scheduledEnd: '2026-01-12T19:25:00Z',
      status: 'COMPLETED',
      homeScore: 4,
      awayScore: 2,
      currentMinute: 'FT',
      currentHalf: 'FULL_TIME',
      events: [
        { id: 'fe-1', matchId: 'match-ended-final', tournamentId: 'tournament-western-province-2026', eventType: 'GOAL', minute: "9'", playerName: 'Tariq Al-Hassan', assistPlayerName: 'Mahela Jay', createdAt: '2026-01-12T18:39:00Z' },
        { id: 'fe-2', matchId: 'match-ended-final', tournamentId: 'tournament-western-province-2026', eventType: 'GOAL', minute: "16'", playerName: 'Dimuth Perera', createdAt: '2026-01-12T18:46:00Z' },
        { id: 'fe-3', matchId: 'match-ended-final', tournamentId: 'tournament-western-province-2026', eventType: 'GOAL', minute: "23'", playerName: 'Kamil Rizvi', assistPlayerName: 'Tariq Al-Hassan', createdAt: '2026-01-12T18:53:00Z' },
        { id: 'fe-4', matchId: 'match-ended-final', tournamentId: 'tournament-western-province-2026', eventType: 'GOAL', minute: "31'", playerName: 'Tariq Al-Hassan', createdAt: '2026-01-12T19:01:00Z' },
        { id: 'fe-5', matchId: 'match-ended-final', tournamentId: 'tournament-western-province-2026', eventType: 'GOAL', minute: "37'", playerName: 'Mahela Jay', createdAt: '2026-01-12T19:07:00Z' }
      ]
    }
  ]
};
