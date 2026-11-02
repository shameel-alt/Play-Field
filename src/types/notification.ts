export type NotificationType = 'LIVE' | 'RELOCATION' | 'WALKOVER' | 'DELEGATION' | 'SCHEDULE' | 'SYSTEM';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  createdAt: number;
  read: boolean;
  tournamentId?: string;
  linkUrl?: string;
  severity?: 'info' | 'success' | 'warning' | 'danger';
}
