export type UserRole = 'director' | 'organizer' | 'scorer' | 'timekeeper' | 'referee';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  preferredSports: string[];
  avatarUrl?: string;
}

export interface OrganizerInvite {
  id: string;
  tournamentId: string;
  inviterEmail: string;
  inviteeEmail: string;
  role: 'CO_ORGANIZER' | 'SCORER' | 'TIMEKEEPER';
  inviteToken: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
  createdAt: string;
  acceptedAt?: string;
}

export interface CoOrganizer {
  id?: string;
  email: string;
  name: string;
  role: 'LEAD' | 'CO_ORGANIZER' | 'SCORER' | 'TIMEKEEPER';
  avatarUrl?: string;
}
