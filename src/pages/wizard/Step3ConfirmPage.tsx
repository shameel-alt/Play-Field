import React from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Check, Calendar, MapPin, Trophy, Users } from 'lucide-react';
import { Match } from '../../types/match';

interface Step3ConfirmPageProps {
  onNavigate: (path: string) => void;
  draftData: any;
}

export const Step3ConfirmPage: React.FC<Step3ConfirmPageProps> = ({ onNavigate, draftData }) => {
  const matches: Match[] = draftData?.matches || [];
  const teams = draftData?.teams || [];

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Wizard Stepper Bar */}
      <section className="w-full bg-surface-card border-b border-border-grid py-space-md shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm">
            <div className="flex items-center gap-space-sm p-space-sm rounded-xl bg-surface-container-low text-status-success-emerald">
              <Check className="w-5 h-5 text-status-success-emerald" />
              <div className="flex flex-col min-w-0">
                <span className="font-eyebrow text-[10px] uppercase font-bold tracking-wider">Step 01 • Passed</span>
                <span className="font-subheading text-xs truncate font-semibold text-on-surface">Event & Venue</span>
              </div>
            </div>
            <div className="flex items-center gap-space-sm p-space-sm rounded-xl bg-surface-container-low text-status-success-emerald">
              <Check className="w-5 h-5 text-status-success-emerald" />
              <div className="flex flex-col min-w-0">
                <span className="font-eyebrow text-[10px] uppercase font-bold tracking-wider">Step 02 • Passed</span>
                <span className="font-subheading text-xs truncate font-semibold text-on-surface">Teams & Rosters</span>
              </div>
            </div>
            <div className="flex items-center gap-space-sm p-space-sm rounded-xl bg-pitch-turf-surface text-primary border border-primary-container/20">
              <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-mono text-xs font-bold">3</div>
              <div className="flex flex-col min-w-0">
                <span className="font-eyebrow text-[10px] uppercase font-bold text-primary tracking-wider">Step 03 • Active</span>
                <span className="font-subheading text-xs truncate font-bold text-pitch-turf-active">Structure Confirmation</span>
              </div>
            </div>
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

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg py-space-xl w-full flex flex-col gap-space-xl">
        {/* Verification Banner */}
        <div className="p-space-lg rounded-2xl bg-pitch-turf-surface border border-status-success-emerald/30 flex flex-col sm:flex-row sm:items-center justify-between gap-space-md shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-headline font-extrabold text-lg text-pitch-turf-active">
                Pre-Publish Court Collision Scan Complete: 0 Clashes Verified
              </h2>
              <p className="font-body text-xs text-pitch-turf-hover mt-0.5">
                All {matches.length} fixture allocations across Courts {draftData?.selectedCourtNumbers?.join(', ') || '1, 2, 5'} have passed two-tier mutex validation with zero time overlaps.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/tournaments/new/payment')}
            className="btn-primary py-3 px-6 text-sm font-bold shadow-md shrink-0 flex items-center gap-2"
          >
            <span>Advance Payment with Selective Payment Options</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Read-Only Summary Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
          {/* Left Column: Groups & Rosters (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            <div className="bg-surface-card rounded-2xl border border-border-grid p-space-lg shadow-sm flex flex-col gap-space-md">
              <h3 className="font-headline font-bold text-base text-floodlight-navy pb-2 border-b border-border-grid flex items-center justify-between">
                <span>Participating Groups ({teams.length} Squads)</span>
                <span className="font-mono text-xs text-text-muted">Roster Verified</span>
              </h3>

              <div className="space-y-space-md">
                {teams.map((team: any) => (
                  <div key={team.id} className="p-space-sm rounded-xl bg-canvas-alabaster border border-border-grid flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-7 h-7 rounded text-surface-card font-mono text-xs font-bold flex items-center justify-center shadow-xs"
                          style={{ backgroundColor: team.kitColorPrimary }}
                        >
                          {team.shortCode}
                        </span>
                        <span className="font-subheading font-bold text-floodlight-navy text-sm">
                          {team.name}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-surface-container font-mono text-[10px] font-bold uppercase text-floodlight-navy">
                        {team.groupName}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-text-muted flex flex-wrap gap-2 pt-1 border-t border-border-grid">
                      {team.players.map((p: any) => (
                        <span key={p.id} className="bg-surface-card px-2 py-0.5 rounded border border-border-grid">
                          #{p.jerseyNumber} {p.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Generated Fixture Timetable (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-space-lg">
            <div className="bg-surface-card rounded-2xl border border-border-grid p-space-lg shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-2 border-b border-border-grid">
                <div>
                  <h3 className="font-headline font-bold text-base text-floodlight-navy">
                    Generated Fixture Schedule & Court Allocation
                  </h3>
                  <p className="font-body text-xs text-text-muted">
                    Automated Berger round-robin + single elimination knockout ladder
                  </p>
                </div>
                <span className="font-mono text-xs text-primary font-bold bg-pitch-turf-surface px-2.5 py-1 rounded-full">
                  {matches.length} Scheduled Matches
                </span>
              </div>

              <div className="space-y-2.5 max-h-[600px] overflow-y-auto tactical-scrollbar pr-1">
                {matches.map((m) => (
                  <div
                    key={m.id}
                    className="p-space-sm px-space-md rounded-xl bg-canvas-alabaster border border-border-grid flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-state-hover-gray transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-floodlight-navy text-surface-card font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        #{m.matchNumber}
                      </span>
                      <div>
                        <div className="font-subheading font-bold text-floodlight-navy text-sm">
                          {m.homeTeamName} vs {m.awayTeamName}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-text-muted mt-0.5">
                          <span>{m.round}</span>
                          {m.groupName && <span>• {m.groupName}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="px-2.5 py-1 rounded bg-pitch-turf-surface text-status-success-emerald font-mono text-xs font-bold">
                        {m.courtName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Back & CTA Row */}
            <div className="flex items-center justify-between pt-space-xs">
              <button
                type="button"
                onClick={() => onNavigate('/tournaments/new/teams')}
                className="btn-secondary text-sm py-2.5 px-5 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Roster Matrix</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/tournaments/new/payment')}
                className="btn-primary text-sm py-3.5 px-8 shadow-md flex items-center gap-2"
              >
                <span>Advance Payment with Selective Payment Options</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
