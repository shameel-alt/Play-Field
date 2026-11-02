import { AppNotification } from '../types/notification';

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'RELOCATION',
    title: 'Match #6 Reassigned to Court 5',
    message: 'Apex Warriors vs Colombo Thunder FC transferred from Court 1 → Court 5 (FIFA Pro Turf Arena). Turf conditioning protocol active.',
    timestamp: '12m ago',
    createdAt: Date.now() - 12 * 60 * 1000,
    read: false,
    tournamentId: 'tournament-colombo-premier-2026',
    linkUrl: '/tournaments/tournament-colombo-premier-2026/manage',
    severity: 'info'
  },
  {
    id: 'notif-2',
    type: 'LIVE',
    title: 'Match #6 is LIVE (1st Half)',
    message: 'Apex Warriors 2 – 1 Colombo Thunder FC on Court 5. Tariq Al-Hassan scored 2 goals (12\', 24\').',
    timestamp: '8m ago',
    createdAt: Date.now() - 8 * 60 * 1000,
    read: false,
    tournamentId: 'tournament-colombo-premier-2026',
    linkUrl: '/public/tournament/colombo-premier-futsal-2026',
    severity: 'warning'
  },
  {
    id: 'notif-3',
    type: 'WALKOVER',
    title: 'Disciplinary Walkover Awarded (3-0)',
    message: 'Match #3: City Lions failed to report within 15-min official grace period. 3-0 forfeit victory awarded to Metro Strikers.',
    timestamp: '25m ago',
    createdAt: Date.now() - 25 * 60 * 1000,
    read: false,
    tournamentId: 'tournament-colombo-premier-2026',
    linkUrl: '/tournaments/tournament-colombo-premier-2026/manage',
    severity: 'danger'
  },
  {
    id: 'notif-4',
    type: 'DELEGATION',
    title: 'New Official Bound to Console',
    message: 'Tariq R. verified credentials and attached as Chief Scorer for Colombo Premier Futsal Cup 2026.',
    timestamp: '42m ago',
    createdAt: Date.now() - 42 * 60 * 1000,
    read: true,
    tournamentId: 'tournament-colombo-premier-2026',
    linkUrl: '/tournaments/tournament-colombo-premier-2026/manage',
    severity: 'success'
  },
  {
    id: 'notif-5',
    type: 'SCHEDULE',
    title: 'Pre-Publish Collision Mutex Cleared',
    message: 'All 7 fixture allocations across Courts 1, 2, 5 passed collision scan with 0 clashes.',
    timestamp: '1h ago',
    createdAt: Date.now() - 60 * 60 * 1000,
    read: true,
    tournamentId: 'tournament-colombo-premier-2026',
    linkUrl: '/tournaments/ongoing',
    severity: 'success'
  }
];
