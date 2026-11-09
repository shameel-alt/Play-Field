import React, { useState, useEffect, useRef } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { useAuth } from '../../context/AuthContext';
import { SportType, TournamentStyle, WizardDraftData } from '../../types/tournament';
import {
  ShieldCheck,
  MapPin,
  Check,
  ArrowRight,
  Search,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Calendar,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';

interface Step1DetailsPageProps {
  onNavigate: (path: string) => void;
  draftData: WizardDraftData;
  setDraftData: (data: any) => void;
}

interface SportOption {
  id: SportType;
  label: string;
  name: string;
  desc: string;
  icon: string;
  rulesPreset: string;
}

const SPORTS_CONFIG: SportOption[] = [
  {
    id: 'futsal',
    label: 'Futsal',
    name: 'Futsal',
    desc: 'High-tempo 5v5 indoor court',
    icon: '⚽',
    rulesPreset: 'FIFA / AMF Rules Preset'
  },
  {
    id: 'football7',
    label: '7-a-side Football',
    name: '7-a-side Football',
    desc: 'Extended 7v7 turf arena',
    icon: '🏟️',
    rulesPreset: 'FIFA / Standard 7s Preset'
  },
  {
    id: 'cricket',
    label: 'Indoor Cricket',
    name: 'Indoor Cricket',
    desc: 'Tension net cricket stadium',
    icon: '🏏',
    rulesPreset: 'WICF Rules Preset'
  },
  {
    id: 'badminton',
    label: 'Badminton',
    name: 'Badminton',
    desc: 'BWF synthetic taraflex courts',
    icon: '🏸',
    rulesPreset: 'BWF International Preset'
  }
];

const STYLE_LABELS: Record<TournamentStyle, string> = {
  GROUP_KNOCKOUT: 'Group Stage + Knockout',
  ROUND_ROBIN: 'Full League Table',
  SINGLE_ELIMINATION: 'Single Elimination Knockout'
};

export const Step1DetailsPage: React.FC<Step1DetailsPageProps> = ({
  onNavigate,
  draftData,
  setDraftData
}) => {
  const { venues } = useTournament();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState(draftData?.title || 'Colombo Corporate Futsal Super Cup 2026');
  const [sport, setSport] = useState<SportType>(draftData?.sport || 'futsal');
  const [tournamentStyle, setTournamentStyle] = useState<TournamentStyle>(draftData?.tournamentStyle || 'GROUP_KNOCKOUT');

  // Filter venues supporting the selected sport
  const sportVenues = venues.filter(v => v.supportedSports.includes(sport));

  const [selectedVenueId, setSelectedVenueId] = useState<string>(() => {
    if (draftData?.venueId && venues.some(v => v.id === draftData.venueId && v.supportedSports.includes(draftData.sport || 'futsal'))) {
      return draftData.venueId;
    }
    const initialSportVenues = venues.filter(v => v.supportedSports.includes(draftData?.sport || 'futsal'));
    return initialSportVenues[0]?.id || venues[0]?.id || 'venue-colombo-futsal-hub';
  });

  const [pricingType, setPricingType] = useState<'hourly' | 'day'>(draftData?.pricingType || 'day');
  const [selectedCourts, setSelectedCourts] = useState<number[]>(draftData?.selectedCourtNumbers || [1, 2, 3]);
  const [startDate, setStartDate] = useState(draftData?.startDate || '2026-11-15');
  const [endDate, setEndDate] = useState(draftData?.endDate || '2026-11-16');
  const [startTime, setStartTime] = useState(draftData?.startTime || '08:00');
  const [endTime, setEndTime] = useState(draftData?.endTime || '20:00');
  const [daysCount, setDaysCount] = useState<number>(draftData?.daysCount || 2);

  // Search dropdown states
  const [isSportDropdownOpen, setIsSportDropdownOpen] = useState(false);
  const [sportSearchQuery, setSportSearchQuery] = useState('');
  const sportDropdownRef = useRef<HTMLDivElement>(null);

  const [isVenueDropdownOpen, setIsVenueDropdownOpen] = useState(false);
  const [venueSearchQuery, setVenueSearchQuery] = useState('');
  const venueDropdownRef = useRef<HTMLDivElement>(null);

  const selectedVenue = venues.find(v => v.id === selectedVenueId) || sportVenues[0] || venues[0];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sportDropdownRef.current && !sportDropdownRef.current.contains(e.target as Node)) {
        setIsSportDropdownOpen(false);
      }
      if (venueDropdownRef.current && !venueDropdownRef.current.contains(e.target as Node)) {
        setIsVenueDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // When sport changes, auto-switch venue to one that supports that sport
  const handleSelectSport = (newSport: SportType) => {
    setSport(newSport);
    setIsSportDropdownOpen(false);
    setSportSearchQuery('');

    const matchingVenues = venues.filter(v => v.supportedSports.includes(newSport));
    if (matchingVenues.length > 0) {
      const newVenue = matchingVenues[0];
      setSelectedVenueId(newVenue.id);
      // Auto select available courts for the new venue
      const availableCourtNumbers = newVenue.courts.map(c => c.courtNumber);
      setSelectedCourts(availableCourtNumbers.slice(0, Math.min(3, availableCourtNumbers.length)));
    }
  };

  const handleSelectVenue = (venueId: string) => {
    setSelectedVenueId(venueId);
    setIsVenueDropdownOpen(false);
    setVenueSearchQuery('');

    const targetVenue = venues.find(v => v.id === venueId);
    if (targetVenue) {
      const validNumbers = targetVenue.courts.map(c => c.courtNumber);
      const filtered = selectedCourts.filter(c => validNumbers.includes(c));
      if (filtered.length === 0) {
        setSelectedCourts(validNumbers.slice(0, Math.min(3, validNumbers.length)));
      } else {
        setSelectedCourts(filtered);
      }
    }
  };

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    if (val && endDate) {
      const start = new Date(val).getTime();
      const end = new Date(endDate).getTime();
      if (!isNaN(start) && !isNaN(end) && end >= start) {
        const diffDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
        setDaysCount(diffDays);
      }
    }
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    if (startDate && val) {
      const start = new Date(startDate).getTime();
      const end = new Date(val).getTime();
      if (!isNaN(start) && !isNaN(end) && end >= start) {
        const diffDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
        setDaysCount(diffDays);
      }
    }
  };

  const handleCourtToggle = (courtNum: number) => {
    setSelectedCourts(prev =>
      prev.includes(courtNum) ? prev.filter(c => c !== courtNum) : [...prev, courtNum].sort()
    );
  };

  // Calculate hours per day
  const calculateDailyHours = () => {
    try {
      const [startH] = startTime.split(':').map(Number);
      const [endH] = endTime.split(':').map(Number);
      return Math.max(1, endH - startH);
    } catch {
      return 12;
    }
  };

  const calculateCost = () => {
    if (!selectedVenue) return 0;
    if (pricingType === 'day') {
      return selectedVenue.dayPackageRate * daysCount;
    }
    const dailyHours = calculateDailyHours();
    return selectedVenue.hourlyRate * dailyHours * daysCount;
  };

  const currentSportConfig = SPORTS_CONFIG.find(s => s.id === sport) || SPORTS_CONFIG[0];
  const filteredSports = SPORTS_CONFIG.filter(s =>
    s.name.toLowerCase().includes(sportSearchQuery.toLowerCase()) ||
    s.desc.toLowerCase().includes(sportSearchQuery.toLowerCase())
  );

  const filteredVenues = sportVenues.filter(v =>
    v.name.toLowerCase().includes(venueSearchQuery.toLowerCase()) ||
    v.location.toLowerCase().includes(venueSearchQuery.toLowerCase()) ||
    v.city.toLowerCase().includes(venueSearchQuery.toLowerCase())
  );

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourts.length === 0) {
      alert('Please select at least one court for the tournament.');
      return;
    }

    const updated = {
      ...draftData,
      title,
      sport,
      tournamentStyle,
      venueId: selectedVenue.id,
      venue: selectedVenue,
      pricingType,
      selectedCourtNumbers: selectedCourts,
      startDate,
      endDate,
      startTime,
      endTime,
      daysCount,
      totalCost: calculateCost(),
      createdBy: currentUser?.id || 'user-demo-organizer'
    };

    setDraftData(updated);
    onNavigate('/tournaments/new/teams');
  };

  const totalCalculatedCost = calculateCost();
  const advanceCost = Math.round(totalCalculatedCost * 0.3);
  const balanceRemaining = totalCalculatedCost - advanceCost;

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Wizard Stepper Bar */}
      <section className="w-full bg-surface-card border-b border-border-grid py-space-md shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm">
            {/* Step 1 Active */}
            <div className="flex items-center gap-space-sm p-space-sm rounded-xl bg-pitch-turf-surface text-primary border border-primary-container/20">
              <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-mono text-xs font-bold">1</div>
              <div className="flex flex-col min-w-0">
                <span className="font-eyebrow text-[10px] uppercase font-bold text-primary tracking-wider">Step 01 • Active</span>
                <span className="font-subheading text-xs truncate font-bold text-pitch-turf-active">Event & Venue</span>
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex items-center gap-space-sm p-space-sm rounded-xl bg-surface-container-low text-text-muted">
              <div className="w-6 h-6 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-mono text-xs font-bold">2</div>
              <div className="flex flex-col min-w-0">
                <span className="font-eyebrow text-[10px] uppercase font-bold text-text-muted">Roster Matrix</span>
                <span className="font-subheading text-xs truncate font-semibold">Teams & Rosters</span>
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex items-center gap-space-sm p-space-sm rounded-xl bg-surface-container-low text-text-muted">
              <div className="w-6 h-6 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-mono text-xs font-bold">3</div>
              <div className="flex flex-col min-w-0">
                <span className="font-eyebrow text-[10px] uppercase font-bold text-text-muted">Draw & Brackets</span>
                <span className="font-subheading text-xs truncate font-semibold">Structure Confirmation</span>
              </div>
            </div>
            {/* Step 4 */}
            <div className="flex items-center gap-space-sm p-space-sm rounded-xl bg-surface-container-low text-text-muted">
              <div className="w-6 h-6 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-mono text-xs font-bold">4</div>
              <div className="flex flex-col min-w-0">
                <span className="font-eyebrow text-[10px] uppercase font-bold text-text-muted">Fiscal Lock</span>
                <span className="font-subheading text-xs truncate font-semibold">Payment & Publish</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workstation Header */}
      <section className="w-full py-space-lg bg-surface-container-lowest border-b border-border-grid">
        <div className="max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div>
            <div className="inline-flex items-center gap-1.5 font-mono text-xs uppercase text-primary font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-status-success-emerald animate-pulse"></span>
              Operations Engine v4.2 Active
            </div>
            <h1 className="font-headline font-extrabold text-2xl md:text-3xl text-floodlight-navy tracking-tight">
              Step 1: Event Specification & Venue Allocation
            </h1>
            <p className="font-body text-sm text-text-muted mt-1 max-w-2xl">
              Reserve tournament courts, choose competition style, and configure match day parameters with venue collision checks.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-text-muted bg-canvas-alabaster px-space-md py-2 rounded-xl border border-border-grid">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Venue Collision Shield Active</span>
          </div>
        </div>
      </section>

      {/* Form Container */}
      <form onSubmit={handleNext} className="max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg py-space-xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
          {/* Left Form Column (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-space-xl">
            {/* Block 0: Tournament Title */}
            <div className="bg-surface-card rounded-2xl border border-border-grid p-space-lg shadow-sm flex flex-col gap-space-xs">
              <label htmlFor="tournament-title" className="font-eyebrow text-xs uppercase text-primary font-bold">
                Tournament Title / Public Name
              </label>
              <input
                id="tournament-title"
                name="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Western Province Futsal Championship 2026"
                className="w-full h-11 px-3 bg-canvas-alabaster rounded-lg border border-border-control font-body font-semibold text-base text-floodlight-navy focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs"
              />
            </div>

            {/* Block 1: Searchable Sport Dropdown */}
            <div className="bg-surface-card rounded-2xl border border-border-grid p-space-lg shadow-sm flex flex-col gap-space-md" ref={sportDropdownRef}>
              <div className="flex items-center justify-between border-b border-border-grid pb-2">
                <span className="font-eyebrow text-xs uppercase text-primary font-bold">
                  01 / Sport Selection
                </span>
                <span className="font-mono text-xs text-status-success-emerald uppercase font-bold bg-pitch-turf-surface px-2 py-0.5 rounded">
                  {currentSportConfig.rulesPreset}
                </span>
              </div>

              {/* Combobox Trigger */}
              <div className="relative">
                <label className="font-eyebrow text-xs uppercase text-text-muted block mb-1.5 font-bold">
                  Select Sport (Searchable Dropdown)
                </label>
                <button
                  type="button"
                  onClick={() => setIsSportDropdownOpen(!isSportDropdownOpen)}
                  className="w-full p-3.5 bg-canvas-alabaster rounded-xl border border-border-control hover:border-primary flex items-center justify-between transition-colors shadow-2xs text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{currentSportConfig.icon}</span>
                    <div>
                      <div className="font-subheading font-bold text-base text-floodlight-navy flex items-center gap-2">
                        <span>{currentSportConfig.name}</span>
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono text-[10px] uppercase font-bold">
                          Selected
                        </span>
                      </div>
                      <span className="font-body text-xs text-text-muted block mt-0.5">
                        {currentSportConfig.desc}
                      </span>
                    </div>
                  </div>
                  {isSportDropdownOpen ? (
                    <ChevronUp className="w-5 h-5 text-text-muted" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-muted" />
                  )}
                </button>

                {/* Dropdown Menu with Search */}
                {isSportDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-surface-card rounded-2xl border border-border-grid shadow-xl z-30 p-space-sm flex flex-col gap-2 animate-fade">
                    {/* Search Input */}
                    <div className="relative p-1">
                      <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search sport (e.g. Futsal, Cricket, Badminton)..."
                        value={sportSearchQuery}
                        onChange={(e) => setSportSearchQuery(e.target.value)}
                        className="w-full h-10 pl-9 pr-3 bg-canvas-alabaster rounded-lg border border-border-control font-body text-sm text-floodlight-navy focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Sports Options List */}
                    <div className="max-h-60 overflow-y-auto tactical-scrollbar flex flex-col gap-1">
                      {filteredSports.length > 0 ? (
                        filteredSports.map(s => {
                          const isSelected = sport === s.id;
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => handleSelectSport(s.id)}
                              className={`p-3 rounded-xl text-left flex items-center justify-between transition-all ${
                                isSelected
                                  ? 'bg-pitch-turf-surface text-primary border border-primary-container/40'
                                  : 'hover:bg-state-hover-gray text-on-surface'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xl">{s.icon}</span>
                                <div>
                                  <span className="font-subheading font-bold text-sm text-floodlight-navy block">
                                    {s.name}
                                  </span>
                                  <span className="font-body text-xs text-text-muted block">
                                    {s.desc}
                                  </span>
                                </div>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                            </button>
                          );
                        })
                      ) : (
                        <div className="p-4 text-center text-xs text-text-muted">
                          No sports matching "{sportSearchQuery}"
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Block 2: Tournament Style */}
            <div className="bg-surface-card rounded-2xl border border-border-grid p-space-lg shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between border-b border-border-grid pb-2">
                <span className="font-eyebrow text-xs uppercase text-primary font-bold">
                  02 / Competition Architecture
                </span>
                <span className="font-mono text-xs text-text-muted">
                  Auto-Tiebreakers & Standings
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                {[
                  {
                    id: 'GROUP_KNOCKOUT',
                    title: 'Group Stage + Knockout',
                    desc: 'Round-robin groups (A, B) followed by Semi-Finals and Final.',
                    recommended: true
                  },
                  {
                    id: 'ROUND_ROBIN',
                    title: 'Full League Table',
                    desc: 'Every squad plays every other squad once. Crowned by points table.',
                    recommended: false
                  },
                  {
                    id: 'SINGLE_ELIMINATION',
                    title: 'Single Elimination',
                    desc: 'High-stakes knockout cup. Losers exit directly each round.',
                    recommended: false
                  }
                ].map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setTournamentStyle(style.id as TournamentStyle)}
                    className={`p-space-md rounded-xl text-left border flex flex-col justify-between transition-all ${
                      tournamentStyle === style.id
                        ? 'bg-pitch-turf-surface border-primary-container ring-1 ring-primary-container shadow-xs'
                        : 'bg-canvas-alabaster border-border-grid hover:bg-state-hover-gray'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        {style.recommended ? (
                          <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary font-mono text-[10px] font-bold uppercase">
                            Recommended
                          </span>
                        ) : <span />}
                        {tournamentStyle === style.id && <Check className="w-4 h-4 text-primary" />}
                      </div>
                      <span className="font-subheading font-bold text-floodlight-navy text-sm block">
                        {style.title}
                      </span>
                      <p className="font-body text-xs text-on-surface-variant mt-1 leading-relaxed">
                        {style.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Block 3: Searchable Venue Dropdown & Courts Allocation */}
            <div className="bg-surface-card rounded-2xl border border-border-grid p-space-lg shadow-sm flex flex-col gap-space-md" ref={venueDropdownRef}>
              <div className="flex items-center justify-between border-b border-border-grid pb-2">
                <span className="font-eyebrow text-xs uppercase text-primary font-bold">
                  03 / Participating Venue & Courts Allocation
                </span>
                <span className="font-mono text-xs text-primary font-bold">
                  {sportVenues.length} Venues Available for {currentSportConfig.name}
                </span>
              </div>

              {/* Combobox Trigger for Venue */}
              <div className="relative">
                <label className="font-eyebrow text-xs uppercase text-text-muted block mb-1.5 font-bold">
                  Select Venue (Searchable Dropdown for {currentSportConfig.name})
                </label>
                <button
                  type="button"
                  onClick={() => setIsVenueDropdownOpen(!isVenueDropdownOpen)}
                  className="w-full p-3.5 bg-canvas-alabaster rounded-xl border border-border-control hover:border-primary flex items-center justify-between transition-colors shadow-2xs text-left"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-headline font-bold text-base text-floodlight-navy truncate">
                          {selectedVenue?.name}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-surface-variant font-mono text-[10px] text-text-muted">
                          {selectedVenue?.city} • {selectedVenue?.totalCourts} Courts
                        </span>
                      </div>
                      <span className="font-body text-xs text-text-muted block mt-0.5 truncate">
                        {selectedVenue?.location}
                      </span>
                      <div className="flex items-center gap-3 mt-1.5 text-xs font-mono">
                        <span className="text-text-muted">
                          Hourly: <strong className="text-floodlight-navy font-bold">LKR {selectedVenue?.hourlyRate.toLocaleString()}</strong>
                        </span>
                        <span className="text-primary">
                          Day Package: <strong className="font-bold">LKR {selectedVenue?.dayPackageRate.toLocaleString()}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                  {isVenueDropdownOpen ? (
                    <ChevronUp className="w-5 h-5 text-text-muted shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-muted shrink-0 ml-2" />
                  )}
                </button>

                {/* Dropdown Menu with Search for Venue */}
                {isVenueDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-surface-card rounded-2xl border border-border-grid shadow-xl z-30 p-space-sm flex flex-col gap-2 animate-fade">
                    {/* Search Input */}
                    <div className="relative p-1">
                      <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search venues by name, location, or city..."
                        value={venueSearchQuery}
                        onChange={(e) => setVenueSearchQuery(e.target.value)}
                        className="w-full h-10 pl-9 pr-3 bg-canvas-alabaster rounded-lg border border-border-control font-body text-sm text-floodlight-navy focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Venue Options List */}
                    <div className="max-h-72 overflow-y-auto tactical-scrollbar flex flex-col gap-1.5">
                      {filteredVenues.length > 0 ? (
                        filteredVenues.map(v => {
                          const isSelected = selectedVenue?.id === v.id;
                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => handleSelectVenue(v.id)}
                              className={`p-3 rounded-xl text-left border flex items-start justify-between transition-all ${
                                isSelected
                                  ? 'bg-pitch-turf-surface border-primary-container text-primary shadow-2xs'
                                  : 'bg-canvas-alabaster border-border-grid hover:bg-state-hover-gray text-on-surface'
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-headline font-bold text-sm text-floodlight-navy truncate">
                                    {v.name}
                                  </span>
                                  {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                                </div>
                                <span className="font-body text-xs text-text-muted block truncate mt-0.5">
                                  {v.location}
                                </span>
                                <div className="mt-2 flex items-center gap-3 text-xs font-mono">
                                  <span className="px-2 py-0.5 rounded bg-surface-variant text-floodlight-navy font-semibold">
                                    LKR {v.hourlyRate.toLocaleString()} / hr
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                                    LKR {v.dayPackageRate.toLocaleString()} / day
                                  </span>
                                  <span className="text-[11px] text-text-muted">
                                    {v.totalCourts} Courts
                                  </span>
                                </div>
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="p-4 text-center text-xs text-text-muted">
                          No venues matching "{venueSearchQuery}" for {currentSportConfig.name}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing Package Model Selector (Day vs Hourly) */}
              <div className="p-space-md rounded-xl bg-canvas-alabaster border border-border-grid flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md mt-1">
                <div>
                  <span className="font-eyebrow text-xs uppercase text-primary font-bold block">
                    Venue Pricing Package Model
                  </span>
                  <span className="font-body text-xs text-text-muted">
                    Choose between fixed full-day access or standard hourly reservation rates.
                  </span>
                </div>
                <div className="flex items-center p-1 bg-surface-card rounded-xl border border-border-grid shadow-2xs shrink-0">
                  <button
                    type="button"
                    onClick={() => setPricingType('day')}
                    className={`px-3 py-1.5 rounded-lg font-button text-xs font-bold transition-all ${
                      pricingType === 'day'
                        ? 'bg-floodlight-navy text-surface-card shadow-xs'
                        : 'text-text-muted hover:text-on-surface'
                    }`}
                  >
                    Day Package (LKR {selectedVenue?.dayPackageRate.toLocaleString()})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPricingType('hourly')}
                    className={`px-3 py-1.5 rounded-lg font-button text-xs font-bold transition-all ${
                      pricingType === 'hourly'
                        ? 'bg-floodlight-navy text-surface-card shadow-xs'
                        : 'text-text-muted hover:text-on-surface'
                    }`}
                  >
                    Hourly Rate (LKR {selectedVenue?.hourlyRate.toLocaleString()}/hr)
                  </button>
                </div>
              </div>

              {/* Courts Checkboxes */}
              <div className="pt-space-xs flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-eyebrow text-xs uppercase text-on-surface-variant font-bold">
                    Select Specific Courts to Reserve ({selectedCourts.length} Selected)
                  </label>
                  <span className="font-mono text-[11px] text-text-muted">
                    Click court badges to toggle reservation
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {selectedVenue?.courts.map(court => {
                    const isSelected = selectedCourts.includes(court.courtNumber);
                    return (
                      <button
                        key={court.id}
                        type="button"
                        onClick={() => handleCourtToggle(court.courtNumber)}
                        className={`p-2.5 rounded-lg border text-center font-mono text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-floodlight-navy text-surface-card border-floodlight-navy shadow-xs'
                            : 'bg-canvas-alabaster text-on-surface border-border-grid hover:bg-state-hover-gray'
                        }`}
                      >
                        <span className="block font-bold">Court {court.courtNumber}</span>
                        <span className="text-[10px] font-normal opacity-80 block truncate mt-0.5">
                          {court.surfaceType}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {selectedCourts.length === 0 && (
                  <p className="text-xs text-card-red-danger font-medium mt-1">
                    ⚠️ At least one court must be selected for the tournament.
                  </p>
                )}
              </div>

              {/* Dates & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-space-md pt-space-xs">
                <div className="flex flex-col gap-1">
                  <label htmlFor="tournament-start-date" className="font-eyebrow text-xs uppercase text-text-muted">Start Date</label>
                  <input
                    id="tournament-start-date"
                    name="startDate"
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="h-10 px-3 bg-canvas-alabaster rounded-lg border border-border-control font-body text-sm focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="tournament-end-date" className="font-eyebrow text-xs uppercase text-text-muted">End Date</label>
                  <input
                    id="tournament-end-date"
                    name="endDate"
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    className="h-10 px-3 bg-canvas-alabaster rounded-lg border border-border-control font-body text-sm focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="tournament-days-count" className="font-eyebrow text-xs uppercase text-text-muted">Total Days</label>
                  <input
                    id="tournament-days-count"
                    name="daysCount"
                    type="number"
                    min="1"
                    max="14"
                    value={daysCount}
                    onChange={(e) => setDaysCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="h-10 px-3 bg-canvas-alabaster rounded-lg border border-border-control font-mono text-sm focus:outline-none text-center"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="tournament-daily-hours" className="font-eyebrow text-xs uppercase text-text-muted">Daily Schedule</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      id="tournament-start-time"
                      name="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="h-10 px-2 bg-canvas-alabaster rounded-lg border border-border-control font-mono text-xs w-full text-center"
                    />
                    <span className="text-text-muted text-xs">–</span>
                    <input
                      id="tournament-end-time"
                      name="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="h-10 px-2 bg-canvas-alabaster rounded-lg border border-border-control font-mono text-xs w-full text-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary Ledger (4 cols) - Requirement 6 dynamic update without "5v5" */}
          <div className="lg:col-span-4 flex flex-col gap-space-lg sticky top-20">
            <div className="bg-surface-card rounded-2xl border border-border-grid p-space-lg shadow-md flex flex-col gap-space-md">
              <div className="pb-2 border-b border-border-grid flex items-center justify-between">
                <h3 className="font-headline font-bold text-base text-floodlight-navy flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Provisional Schedule Ledger</span>
                </h3>
                <span className="font-mono text-[10px] uppercase font-bold text-status-success-emerald bg-pitch-turf-surface px-2 py-0.5 rounded">
                  Live Sync
                </span>
              </div>

              {/* Dynamic Option Breakdown */}
              <div className="space-y-2.5 text-xs font-body">
                {/* Clean sport name with NO "5v5" */}
                <div className="flex justify-between items-center py-1 border-b border-border-grid/50">
                  <span className="text-text-muted font-medium">Sport:</span>
                  <span className="font-bold text-floodlight-navy flex items-center gap-1.5 text-sm">
                    <span>{currentSportConfig.icon}</span>
                    <span>{currentSportConfig.name}</span>
                  </span>
                </div>

                {/* Competition Architecture */}
                <div className="flex justify-between items-center py-1 border-b border-border-grid/50">
                  <span className="text-text-muted font-medium">Architecture:</span>
                  <span className="font-semibold text-floodlight-navy">
                    {STYLE_LABELS[tournamentStyle]}
                  </span>
                </div>

                {/* Allocated Venue */}
                <div className="flex flex-col py-1 border-b border-border-grid/50 gap-0.5">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted font-medium">Allocated Venue:</span>
                    <span className="font-bold text-primary truncate max-w-[200px] text-right">
                      {selectedVenue?.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-text-muted text-right truncate">
                    {selectedVenue?.location}
                  </span>
                </div>

                {/* Selected Courts */}
                <div className="flex justify-between items-center py-1 border-b border-border-grid/50">
                  <span className="text-text-muted font-medium">Reserved Courts:</span>
                  <span className="font-mono font-bold text-floodlight-navy">
                    {selectedCourts.length > 0 ? (
                      selectedCourts.map(c => `Court ${c}`).join(', ')
                    ) : (
                      <span className="text-card-red-danger">None</span>
                    )}
                  </span>
                </div>

                {/* Duration & Package */}
                <div className="flex justify-between items-center py-1 border-b border-border-grid/50">
                  <span className="text-text-muted font-medium">Duration & Model:</span>
                  <span className="font-mono font-bold text-floodlight-navy">
                    {daysCount} Day{daysCount > 1 ? 's' : ''} ({pricingType === 'day' ? 'Day Package' : 'Hourly'})
                  </span>
                </div>

                {/* Date Window */}
                <div className="flex justify-between items-center py-1 border-b border-border-grid/50">
                  <span className="text-text-muted font-medium">Timetable Window:</span>
                  <span className="font-mono text-[11px] text-floodlight-navy">
                    {startDate} → {endDate}
                  </span>
                </div>

                {/* Daily Hours */}
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-muted font-medium">Operating Hours:</span>
                  <span className="font-mono text-[11px] text-floodlight-navy">
                    {startTime} to {endTime} ({calculateDailyHours()} hrs/day)
                  </span>
                </div>
              </div>

              {/* Dynamic Financial Calculation Strip */}
              <div className="mt-2 pt-3 border-t border-border-grid flex flex-col gap-2 bg-canvas-alabaster p-space-md rounded-xl">
                <div className="flex justify-between items-baseline">
                  <span className="font-eyebrow text-xs uppercase text-text-muted font-bold">Total Venue Quota:</span>
                  <span className="font-mono text-xl font-extrabold text-floodlight-navy">
                    LKR {totalCalculatedCost.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-1 pt-2 border-t border-border-grid/60 text-xs font-mono">
                  <div className="flex justify-between text-primary font-bold">
                    <span>30% Advance Deposit:</span>
                    <span>LKR {advanceCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-text-muted text-[11px]">
                    <span>70% Balance on Match Day:</span>
                    <span>LKR {balanceRemaining.toLocaleString()}</span>
                  </div>
                </div>

                <span className="font-body text-[11px] text-text-muted mt-1 leading-snug">
                  Secures court lock for selected dates. Advance deposit payable at Step 4.
                </span>
              </div>

              <button
                type="submit"
                disabled={selectedCourts.length === 0}
                className="btn-primary w-full py-3 text-sm font-bold shadow-md mt-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Save & Continue to Teams (Step 2)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
