import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { useAuth } from '../../context/AuthContext';
import { SportType, TournamentStyle } from '../../types/tournament';
import { ShieldCheck, MapPin, Check, ArrowRight, Calendar, Clock, DollarSign } from 'lucide-react';

interface Step1DetailsPageProps {
  onNavigate: (path: string) => void;
  draftData: any;
  setDraftData: (data: any) => void;
}

export const Step1DetailsPage: React.FC<Step1DetailsPageProps> = ({
  onNavigate,
  draftData,
  setDraftData
}) => {
  const { venues, activeVenueLocks } = useTournament();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState(draftData?.title || 'Colombo Corporate Futsal Super Cup 2026');
  const [sport, setSport] = useState<SportType>(draftData?.sport || 'futsal');
  const [tournamentStyle, setTournamentStyle] = useState<TournamentStyle>(draftData?.tournamentStyle || 'GROUP_KNOCKOUT');
  const [selectedVenueId, setSelectedVenueId] = useState<string>(draftData?.venueId || venues[0]?.id || 'venue-colombo-futsal-hub');
  const [pricingType, setPricingType] = useState<'hourly' | 'day'>(draftData?.pricingType || 'day');
  const [selectedCourts, setSelectedCourts] = useState<number[]>(draftData?.selectedCourtNumbers || [1, 2, 5]);
  const [startDate, setStartDate] = useState(draftData?.startDate || '2026-11-15');
  const [endDate, setEndDate] = useState(draftData?.endDate || '2026-11-16');
  const [startTime, setStartTime] = useState(draftData?.startTime || '08:00');
  const [endTime, setEndTime] = useState(draftData?.endTime || '20:00');
  const [daysCount, setDaysCount] = useState<number>(draftData?.daysCount || 2);

  const selectedVenue = venues.find(v => v.id === selectedVenueId) || venues[0];

  const handleCourtToggle = (courtNum: number) => {
    setSelectedCourts(prev =>
      prev.includes(courtNum) ? prev.filter(c => c !== courtNum) : [...prev, courtNum].sort()
    );
  };

  const calculateCost = () => {
    if (pricingType === 'day') {
      return (selectedVenue?.dayPackageRate || 63000) * daysCount;
    }
    // Hourly estimate (12 hours per day * rate * courts)
    return (selectedVenue?.hourlyRate || 7500) * 12 * daysCount;
  };

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
              Reserve tournament courts, choose competition style, and configure match day timetable parameters with real-time collision checks.
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
              <label className="font-eyebrow text-xs uppercase text-primary font-bold">
                Tournament Title / Public Name
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Western Province Futsal Championship 2026"
                className="w-full h-11 px-3 bg-canvas-alabaster rounded-lg border border-border-control font-headline font-bold text-base text-floodlight-navy focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs"
              />
            </div>

            {/* Block 1: Sport Archetype */}
            <div className="bg-surface-card rounded-2xl border border-border-grid p-space-lg shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between border-b border-border-grid pb-2">
                <span className="font-eyebrow text-xs uppercase text-primary font-bold">
                  01 / Sport Specification
                </span>
                <span className="font-mono text-xs text-status-success-emerald uppercase font-bold bg-pitch-turf-surface px-2 py-0.5 rounded">
                  FIFA / AMF Rules Preset
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
                {[
                  { id: 'futsal', label: 'Futsal 5v5', desc: 'High-tempo indoor court', icon: '⚽' },
                  { id: 'football7', label: '7-a-side Football', desc: 'Extended turf arena', icon: '🏟️' },
                  { id: 'cricket', label: 'Indoor Cricket', desc: 'Tension net stadium', icon: '🏏' },
                  { id: 'badminton', label: 'Badminton', desc: 'BWF synthetic taraflex', icon: '🏸' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSport(s.id as SportType)}
                    className={`p-space-md rounded-xl text-left border flex flex-col justify-between transition-all ${
                      sport === s.id
                        ? 'bg-pitch-turf-surface border-primary-container ring-1 ring-primary-container shadow-xs'
                        : 'bg-canvas-alabaster border-border-grid hover:bg-state-hover-gray'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="text-xl">{s.icon}</span>
                      {sport === s.id && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    <div>
                      <span className="font-subheading font-bold text-floodlight-navy text-sm block">
                        {s.label}
                      </span>
                      <span className="font-body text-[11px] text-text-muted mt-0.5 block">
                        {s.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Block 2: Tournament Style */}
            <div className="bg-surface-card rounded-2xl border border-border-grid p-space-lg shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between border-b border-border-grid pb-2">
                <span className="font-eyebrow text-xs uppercase text-primary font-bold">
                  02 / Competition Architecture
                </span>
                <span className="font-mono text-xs text-text-muted">
                  Auto-Tiebreakers & GD Calculation
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

            {/* Block 3: Venue & Courts Selection */}
            <div className="bg-surface-card rounded-2xl border border-border-grid p-space-lg shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between border-b border-border-grid pb-2">
                <span className="font-eyebrow text-xs uppercase text-primary font-bold">
                  03 / Participating Venue & Courts Allocation
                </span>
                <span className="font-mono text-xs text-primary font-bold">
                  {selectedCourts.length} Courts Selected
                </span>
              </div>

              {/* Venue Selector Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {venues.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVenueId(v.id)}
                    className={`p-space-md rounded-xl text-left border flex flex-col justify-between transition-all ${
                      selectedVenueId === v.id
                        ? 'bg-pitch-turf-surface border-primary-container ring-1 ring-primary-container shadow-xs'
                        : 'bg-canvas-alabaster border-border-grid hover:bg-state-hover-gray'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-headline font-bold text-sm text-floodlight-navy">{v.name}</span>
                      </div>
                      {selectedVenueId === v.id && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    <span className="font-body text-xs text-text-muted mt-1">{v.location}</span>
                    <div className="mt-3 pt-2 border-t border-border-grid flex items-center justify-between text-xs font-mono">
                      <span>Rate: LKR {v.hourlyRate.toLocaleString()} / hr</span>
                      <span className="font-bold text-primary">Day: LKR {v.dayPackageRate.toLocaleString()}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Courts Checkboxes */}
              <div className="pt-space-xs flex flex-col gap-2">
                <label className="font-eyebrow text-xs uppercase text-on-surface-variant font-bold">
                  Select Specific Courts to Reserve
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {selectedVenue.courts.map(court => {
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
              </div>

              {/* Dates & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md pt-space-xs">
                <div className="flex flex-col gap-1">
                  <label className="font-eyebrow text-xs uppercase text-text-muted">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-10 px-3 bg-canvas-alabaster rounded-lg border border-border-control font-body text-sm focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-eyebrow text-xs uppercase text-text-muted">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-10 px-3 bg-canvas-alabaster rounded-lg border border-border-control font-body text-sm focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-eyebrow text-xs uppercase text-text-muted">Total Days</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={daysCount}
                    onChange={(e) => setDaysCount(parseInt(e.target.value) || 1)}
                    className="h-10 px-3 bg-canvas-alabaster rounded-lg border border-border-control font-mono text-sm focus:outline-none text-center"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary Ledger (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-space-lg">
            <div className="bg-surface-card rounded-2xl border border-border-grid p-space-lg shadow-sm flex flex-col gap-space-md">
              <h3 className="font-headline font-bold text-base text-floodlight-navy pb-2 border-b border-border-grid">
                Provisional Schedule Ledger
              </h3>

              <div className="space-y-2 text-xs font-body">
                <div className="flex justify-between">
                  <span className="text-text-muted">Sport:</span>
                  <span className="font-bold text-on-surface uppercase">{sport} 5v5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Architecture:</span>
                  <span className="font-semibold text-on-surface">Group Stage + Knockout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Allocated Venue:</span>
                  <span className="font-bold text-primary">{selectedVenue.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Selected Courts:</span>
                  <span className="font-mono font-bold text-floodlight-navy">
                    {selectedCourts.map(c => `Court ${c}`).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Duration:</span>
                  <span className="font-mono">{daysCount} Day Package</span>
                </div>
              </div>

              {/* Cost Calculation Strip */}
              <div className="mt-2 pt-3 border-t border-border-grid flex flex-col gap-1">
                <div className="flex justify-between items-baseline">
                  <span className="font-eyebrow text-xs uppercase text-text-muted">Total Venue Quota:</span>
                  <span className="font-mono text-xl font-extrabold text-floodlight-navy">
                    LKR {calculateCost().toLocaleString()}
                  </span>
                </div>
                <span className="font-body text-[11px] text-text-muted">
                  30% advance deposit will be payable at Step 4 to commit reservation.
                </span>
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3 text-sm font-bold shadow-md mt-2 flex items-center justify-center gap-2"
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
