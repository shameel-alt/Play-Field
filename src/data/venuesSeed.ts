import { Venue } from '../types/venue';

export const SEED_VENUES: Venue[] = [
  // =========================================================================
  // 1. FUTSAL VENUES
  // =========================================================================
  {
    id: 'venue-colombo-futsal-hub',
    name: 'Colombo Futsal Hub',
    location: 'Torrington Avenue, Colombo 07',
    city: 'Colombo',
    hourlyRate: 7500,
    dayPackageRate: 63000,
    supportedSports: ['futsal'],
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
    id: 'venue-cr-fc-futsal',
    name: 'CR & FC Indoor Futsal Arena',
    location: 'Longdon Place, Colombo 07',
    city: 'Colombo',
    hourlyRate: 8800,
    dayPackageRate: 74000,
    supportedSports: ['futsal'],
    totalCourts: 3,
    imageUrl: 'https://images.unsplash.com/photo-1529900245534-47fbfb57835a?auto=format&fit=crop&w=800&q=80',
    courts: [
      { id: 'cr-1', venueId: 'venue-cr-fc-futsal', courtNumber: 1, name: 'Main Pitch 1', surfaceType: 'DecoTurf Indoor', isActive: true },
      { id: 'cr-2', venueId: 'venue-cr-fc-futsal', courtNumber: 2, name: 'Side Pitch 2', surfaceType: 'DecoTurf Indoor', isActive: true },
      { id: 'cr-3', venueId: 'venue-cr-fc-futsal', courtNumber: 3, name: 'VIP Match Court 3', surfaceType: 'Taraflex Pro', isActive: true },
    ]
  },
  {
    id: 'venue-excel-dome-futsal',
    name: 'Excel World Sports Arena',
    location: 'T.B. Jayah Mawatha, Colombo 10',
    city: 'Colombo',
    hourlyRate: 6200,
    dayPackageRate: 51000,
    supportedSports: ['futsal'],
    totalCourts: 4,
    imageUrl: 'https://images.unsplash.com/photo-1518604667503-4658599ca82d?auto=format&fit=crop&w=800&q=80',
    courts: [
      { id: 'ew-1', venueId: 'venue-excel-dome-futsal', courtNumber: 1, name: 'Arena Cage A', surfaceType: 'AstroTurf Pro', isActive: true },
      { id: 'ew-2', venueId: 'venue-excel-dome-futsal', courtNumber: 2, name: 'Arena Cage B', surfaceType: 'AstroTurf Pro', isActive: true },
      { id: 'ew-3', venueId: 'venue-excel-dome-futsal', courtNumber: 3, name: 'Court C', surfaceType: 'Hardcourt Synthetic', isActive: true },
      { id: 'ew-4', venueId: 'venue-excel-dome-futsal', courtNumber: 4, name: 'Court D', surfaceType: 'Hardcourt Synthetic', isActive: true },
    ]
  },

  // =========================================================================
  // 2. 7-A-SIDE FOOTBALL VENUES
  // =========================================================================
  {
    id: 'venue-havelock-sports-arena',
    name: 'Havelock Sports Arena',
    location: 'Havelock Town, Colombo 05',
    city: 'Colombo',
    hourlyRate: 12500,
    dayPackageRate: 98000,
    supportedSports: ['football7'],
    totalCourts: 4,
    imageUrl: 'https://images.unsplash.com/photo-1529900245534-47fbfb57835a?auto=format&fit=crop&w=800&q=80',
    courts: [
      { id: 'h-1', venueId: 'venue-havelock-sports-arena', courtNumber: 1, name: 'Pitch 1 (North Turf)', surfaceType: 'FIFA Pro 3G Turf', isActive: true },
      { id: 'h-2', venueId: 'venue-havelock-sports-arena', courtNumber: 2, name: 'Pitch 2 (South Turf)', surfaceType: 'FIFA Pro 3G Turf', isActive: true },
      { id: 'h-3', venueId: 'venue-havelock-sports-arena', courtNumber: 3, name: 'Pitch 3 (Club Grass)', surfaceType: 'Hybrid Bermudagrass', isActive: true },
      { id: 'h-4', venueId: 'venue-havelock-sports-arena', courtNumber: 4, name: 'Pitch 4 (Training Arena)', surfaceType: 'FIFA Pro 3G Turf', isActive: true },
    ]
  },
  {
    id: 'venue-racecourse-grounds',
    name: 'Colombo Racecourse Mini Turf Grounds',
    location: 'Reid Avenue, Colombo 07',
    city: 'Colombo',
    hourlyRate: 15500,
    dayPackageRate: 125000,
    supportedSports: ['football7'],
    totalCourts: 3,
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    courts: [
      { id: 'rc-1', venueId: 'venue-racecourse-grounds', courtNumber: 1, name: 'Grandstand Turf 1', surfaceType: '4G AstroTurf', isActive: true },
      { id: 'rc-2', venueId: 'venue-racecourse-grounds', courtNumber: 2, name: 'East Wing Pitch 2', surfaceType: '4G AstroTurf', isActive: true },
      { id: 'rc-3', venueId: 'venue-racecourse-grounds', courtNumber: 3, name: 'Center Exhibition Pitch', surfaceType: '4G AstroTurf', isActive: true },
    ]
  },
  {
    id: 'venue-sugathadasa-football',
    name: 'Sugathadasa Mini Outdoor Arena',
    location: 'Prince of Wales Avenue, Colombo 14',
    city: 'Colombo',
    hourlyRate: 18000,
    dayPackageRate: 145000,
    supportedSports: ['football7'],
    totalCourts: 2,
    imageUrl: 'https://images.unsplash.com/photo-1518604667503-4658599ca82d?auto=format&fit=crop&w=800&q=80',
    courts: [
      { id: 'sg-1', venueId: 'venue-sugathadasa-football', courtNumber: 1, name: 'National Pitch A', surfaceType: 'FIFA Recommended Pro Grass', isActive: true },
      { id: 'sg-2', venueId: 'venue-sugathadasa-football', courtNumber: 2, name: 'National Pitch B', surfaceType: 'FIFA Recommended Pro Grass', isActive: true },
    ]
  },

  // =========================================================================
  // 3. INDOOR CRICKET VENUES
  // =========================================================================
  {
    id: 'venue-mca-cricket-dome',
    name: 'MCA Indoor Cricket Complex',
    location: 'Wijerama Mawatha, Colombo 07',
    city: 'Colombo',
    hourlyRate: 5500,
    dayPackageRate: 45000,
    supportedSports: ['cricket'],
    totalCourts: 4,
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
    courts: [
      { id: 'mca-1', venueId: 'venue-mca-cricket-dome', courtNumber: 1, name: 'Pitch Lane 1 (Polymer Shock)', surfaceType: 'Polymer Shock-Pad Turf', isActive: true },
      { id: 'mca-2', venueId: 'venue-mca-cricket-dome', courtNumber: 2, name: 'Pitch Lane 2 (Spin/Pace)', surfaceType: 'Polymer Shock-Pad Turf', isActive: true },
      { id: 'mca-3', venueId: 'venue-mca-cricket-dome', courtNumber: 3, name: 'Pitch Lane 3 (Center Match Arena)', surfaceType: 'Pro Tension Matting', isActive: true },
      { id: 'mca-4', venueId: 'venue-mca-cricket-dome', courtNumber: 4, name: 'Pitch Lane 4 (Net Practice)', surfaceType: 'Heavy-Duty Synthetic', isActive: true },
    ]
  },
  {
    id: 'venue-austasia-cricket',
    name: 'Austasia Sports Complex Cricket Arena',
    location: 'Thalawathugoda, Colombo',
    city: 'Colombo',
    hourlyRate: 6800,
    dayPackageRate: 56000,
    supportedSports: ['cricket'],
    totalCourts: 4,
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
    courts: [
      { id: 'aus-1', venueId: 'venue-austasia-cricket', courtNumber: 1, name: 'Court A (B-Machine Equipped)', surfaceType: 'Synthetic PolyTurf', isActive: true },
      { id: 'aus-2', venueId: 'venue-austasia-cricket', courtNumber: 2, name: 'Court B (Full Tension Cage)', surfaceType: 'Synthetic PolyTurf', isActive: true },
      { id: 'aus-3', venueId: 'venue-austasia-cricket', courtNumber: 3, name: 'Court C (Indoor Arena)', surfaceType: 'Synthetic PolyTurf', isActive: true },
      { id: 'aus-4', venueId: 'venue-austasia-cricket', courtNumber: 4, name: 'Court D (Tournament Pitch)', surfaceType: 'Synthetic PolyTurf', isActive: true },
    ]
  },
  {
    id: 'venue-ncc-indoor-cricket',
    name: 'NCC Cricket Center',
    location: 'Maitland Place, Colombo 07',
    city: 'Colombo',
    hourlyRate: 5000,
    dayPackageRate: 40000,
    supportedSports: ['cricket'],
    totalCourts: 3,
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
    courts: [
      { id: 'ncc-1', venueId: 'venue-ncc-indoor-cricket', courtNumber: 1, name: 'Lane 1 First-Class Pitch', surfaceType: 'International Coir Matting', isActive: true },
      { id: 'ncc-2', venueId: 'venue-ncc-indoor-cricket', courtNumber: 2, name: 'Lane 2 Match Pitch', surfaceType: 'International Coir Matting', isActive: true },
      { id: 'ncc-3', venueId: 'venue-ncc-indoor-cricket', courtNumber: 3, name: 'Lane 3 Speed Cage', surfaceType: 'Synthetic Shock-Absorbent', isActive: true },
    ]
  },

  // =========================================================================
  // 4. BADMINTON VENUES
  // =========================================================================
  {
    id: 'venue-st-josephs-badminton',
    name: "St. Joseph's Sports Complex",
    location: 'Darley Road, Colombo 10',
    city: 'Colombo',
    hourlyRate: 3500,
    dayPackageRate: 28000,
    supportedSports: ['badminton'],
    totalCourts: 6,
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    courts: [
      { id: 'sj-1', venueId: 'venue-st-josephs-badminton', courtNumber: 1, name: 'Court 1 (BWF Pro)', surfaceType: 'BWF Certified Taraflex Matting', isActive: true },
      { id: 'sj-2', venueId: 'venue-st-josephs-badminton', courtNumber: 2, name: 'Court 2 (BWF Pro)', surfaceType: 'BWF Certified Taraflex Matting', isActive: true },
      { id: 'sj-3', venueId: 'venue-st-josephs-badminton', courtNumber: 3, name: 'Court 3 (Parquet Wood)', surfaceType: 'Spring Wooden Floor', isActive: true },
      { id: 'sj-4', venueId: 'venue-st-josephs-badminton', courtNumber: 4, name: 'Court 4 (Parquet Wood)', surfaceType: 'Spring Wooden Floor', isActive: true },
      { id: 'sj-5', venueId: 'venue-st-josephs-badminton', courtNumber: 5, name: 'Court 5 (Taraflex Mat)', surfaceType: 'BWF Certified Taraflex Matting', isActive: true },
      { id: 'sj-6', venueId: 'venue-st-josephs-badminton', courtNumber: 6, name: 'Court 6 (Taraflex Mat)', surfaceType: 'BWF Certified Taraflex Matting', isActive: true },
    ]
  },
  {
    id: 'venue-wpba-headquarters',
    name: 'Western Province Badminton Stadium',
    location: 'Torrington Square, Colombo 07',
    city: 'Colombo',
    hourlyRate: 4500,
    dayPackageRate: 36000,
    supportedSports: ['badminton'],
    totalCourts: 5,
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    courts: [
      { id: 'wp-1', venueId: 'venue-wpba-headquarters', courtNumber: 1, name: 'Center Court 1', surfaceType: 'BWF Olympic Class Taraflex', isActive: true },
      { id: 'wp-2', venueId: 'venue-wpba-headquarters', courtNumber: 2, name: 'Court 2', surfaceType: 'BWF Olympic Class Taraflex', isActive: true },
      { id: 'wp-3', venueId: 'venue-wpba-headquarters', courtNumber: 3, name: 'Court 3', surfaceType: 'Spring Timber Wood', isActive: true },
      { id: 'wp-4', venueId: 'venue-wpba-headquarters', courtNumber: 4, name: 'Court 4', surfaceType: 'Spring Timber Wood', isActive: true },
      { id: 'wp-5', venueId: 'venue-wpba-headquarters', courtNumber: 5, name: 'Court 5', surfaceType: 'BWF Olympic Class Taraflex', isActive: true },
    ]
  },
  {
    id: 'venue-otter-badminton-club',
    name: 'Otter Aquatic Club Badminton Hall',
    location: 'Bauddhaloka Mawatha, Colombo 07',
    city: 'Colombo',
    hourlyRate: 3800,
    dayPackageRate: 30000,
    supportedSports: ['badminton'],
    totalCourts: 4,
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    courts: [
      { id: 'ot-1', venueId: 'venue-otter-badminton-club', courtNumber: 1, name: 'Hall Court 1', surfaceType: 'Taraflex Cushion Mat', isActive: true },
      { id: 'ot-2', venueId: 'venue-otter-badminton-club', courtNumber: 2, name: 'Hall Court 2', surfaceType: 'Taraflex Cushion Mat', isActive: true },
      { id: 'ot-3', venueId: 'venue-otter-badminton-club', courtNumber: 3, name: 'Hall Court 3', surfaceType: 'Polished Teak Wood', isActive: true },
      { id: 'ot-4', venueId: 'venue-otter-badminton-club', courtNumber: 4, name: 'Hall Court 4', surfaceType: 'Polished Teak Wood', isActive: true },
    ]
  }
];
