import { Venue } from '../types/venue';

export const SEED_VENUES: Venue[] = [
  {
    id: 'venue-colombo-futsal-hub',
    name: 'Colombo Futsal Hub',
    location: 'Torrington Avenue, Colombo 07',
    city: 'Colombo',
    hourlyRate: 7500,
    dayPackageRate: 63000,
    supportedSports: ['futsal', 'cricket', 'badminton'],
    totalCourts: 5,
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    courts: [
      { id: 'c-1', venueId: 'venue-colombo-futsal-hub', courtNumber: 1, name: 'Court 1 (Hardcourt A)', surfaceType: 'Synthetic Taraflex', isActive: true },
      { id: 'c-2', venueId: 'venue-colombo-futsal-hub', courtNumber: 2, name: 'Court 2 (North Hall)', surfaceType: 'Wood Parquet', isActive: true },
      { id: 'c-3', venueId: 'venue-colombo-futsal-hub', courtNumber: 3, name: 'Court 3 (Center Court)', surfaceType: 'FIFA Pro Turf', isActive: true },
      { id: 'c-4', venueId: 'venue-colombo-futsal-hub', courtNumber: 4, name: 'Court 4 (Training Cage)', surfaceType: 'Synthetic AstroTurf', isActive: true },
      { id: 'c-5', venueId: 'venue-colombo-futsal-hub', courtNumber: 5, name: 'Court 5 (FIFA Pro Turf Arena)', surfaceType: 'FIFA Pro Turf', isActive: true },
    ]
  },
  {
    id: 'venue-havelock-sports-arena',
    name: 'Havelock Sports Arena',
    location: 'Havelock Town, Colombo 05',
    city: 'Colombo',
    hourlyRate: 8500,
    dayPackageRate: 72000,
    supportedSports: ['futsal', 'football7', 'badminton'],
    totalCourts: 4,
    imageUrl: 'https://images.unsplash.com/photo-1529900245534-47fbfb57835a?auto=format&fit=crop&w=800&q=80',
    courts: [
      { id: 'h-1', venueId: 'venue-havelock-sports-arena', courtNumber: 1, name: 'Arena Pitch 1', surfaceType: 'FIFA Pro Turf', isActive: true },
      { id: 'h-2', venueId: 'venue-havelock-sports-arena', courtNumber: 2, name: 'Arena Pitch 2', surfaceType: 'FIFA Pro Turf', isActive: true },
      { id: 'h-3', venueId: 'venue-havelock-sports-arena', courtNumber: 3, name: 'Arena Court 3', surfaceType: 'Taraflex', isActive: true },
      { id: 'h-4', venueId: 'venue-havelock-sports-arena', courtNumber: 4, name: 'Arena Court 4', surfaceType: 'Wood Parquet', isActive: true },
    ]
  }
];
