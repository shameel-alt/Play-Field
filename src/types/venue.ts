export interface Court {
  id: string;
  venueId: string;
  courtNumber: number;
  name: string;
  surfaceType: string;
  isActive: boolean;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  city: string;
  hourlyRate: number;
  dayPackageRate: number;
  supportedSports: string[];
  imageUrl?: string;
  totalCourts: number;
  courts: Court[];
}

export interface CourtBookingLock {
  id: string;
  venueId: string;
  courtNumber: number;
  startTime: string; // ISO
  endTime: string;   // ISO
  tournamentId: string;
  matchId?: string;
  lockType: 'CONFIRMED_MATCH' | 'PROVISIONAL_HOLD' | 'MAINTENANCE';
}
