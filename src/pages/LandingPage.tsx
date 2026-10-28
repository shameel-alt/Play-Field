import React from 'react';
import { ArrowRight, Trophy, ShieldCheck, Zap, Calendar, MapPin, Users, Share2, Play } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col w-full pb-16">
      {/* Sub-Header Context Bar */}
      <section className="w-full bg-surface-card border-b border-border-grid shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg py-space-sm flex flex-wrap items-center justify-between gap-gutter">
          <div className="flex items-center gap-space-md">
            <span className="inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded-full bg-card-red-surface text-card-red-danger font-mono text-[11px] font-bold uppercase">
              <span className="w-2 h-2 rounded-full bg-card-red-danger animate-ping"></span>
              Live Matchday Ops
            </span>
            <span className="font-eyebrow text-xs uppercase text-text-muted hidden sm:inline">
              Colombo Premier Futsal Cup • Matchday 1 Active
            </span>
          </div>

          <div className="flex items-center gap-space-lg text-sm font-subheading">
            <a
              href="#/public/tournament/colombo-premier-futsal-2026"
              onClick={(e) => { e.preventDefault(); onNavigate('/public/tournament/colombo-premier-futsal-2026'); }}
              className="text-info-reassign-blue font-semibold hover:underline flex items-center gap-1"
            >
              <span>Official Public Broadcast Link</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Hero Section with Tactical Editorial Identity */}
      <section className="relative w-full py-space-xl lg:py-16 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 flex flex-col gap-space-lg">
              <div className="inline-flex items-center gap-2 self-start px-space-md py-1 rounded-full bg-pitch-turf-surface text-primary font-mono text-xs font-bold uppercase tracking-wider border border-primary-container/20">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Tactical Tournament Management & Multi-Court Booking</span>
              </div>

              <h1 className="font-headline text-3xl sm:text-4xl lg:text-[48px] lg:leading-[54px] text-floodlight-navy font-extrabold tracking-tight">
                Book the Turf. Run the Bracket.<br />
                <span className="text-primary-container">Broadcast Every Goal Live.</span>
              </h1>

              <p className="font-body text-body-lg text-on-surface-variant max-w-[620px] leading-relaxed">
                The authoritative tournament operating system engineered for multi-pitch arenas. Zero court scheduling clashes, automated FIFA-spec tiebreakers, and instant public broadcast desks that update spectators without a single refresh.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                <button
                  type="button"
                  onClick={() => onNavigate('/tournaments/new/details')}
                  className="btn-primary py-3.5 px-6 text-base shadow-md group"
                >
                  <span>Start a Tournament</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/public/tournament/colombo-premier-futsal-2026')}
                  className="btn-secondary py-3.5 px-6 text-base"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-card-red-danger"></span>
                  <span>View Live Match Center</span>
                </button>
              </div>

              {/* Trust Proof Metrics */}
              <div className="pt-space-md grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="p-space-md rounded-xl bg-surface-card border border-border-grid shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-pitch-turf-surface text-primary-container flex items-center justify-center font-bold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-headline font-bold text-base text-floodlight-navy">45+ Premier Venues</div>
                    <div className="font-body text-xs text-text-muted">Live across Colombo & Western Province</div>
                  </div>
                </div>

                <div className="p-space-md rounded-xl bg-surface-card border border-border-grid shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high text-floodlight-navy flex items-center justify-center font-bold">
                    <Zap className="w-5 h-5 text-status-warning-amber" />
                  </div>
                  <div>
                    <div className="font-headline font-bold text-base text-primary-container">0 Court Clashes</div>
                    <div className="font-body text-xs text-text-muted">Multi-court two-tier mutex locking</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Tactical Live Broadcast Deck (Screen Preview) */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="w-full rounded-2xl bg-floodlight-navy text-surface-card shadow-2xl border border-floodlight-navy/50 overflow-hidden">
                {/* Masthead Status Bar */}
                <div className="px-space-lg py-space-sm bg-[#071322] flex items-center justify-between border-b border-surface-card/10">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-card-red-danger text-surface-card font-mono text-[10px] uppercase font-bold tracking-wider animate-pulse">
                      LIVE • 24' 1ST HALF
                    </span>
                    <span className="font-eyebrow text-xs text-text-placeholder uppercase">
                      COLOMBO CUP SERIES
                    </span>
                  </div>
                  <span className="text-pitch-turf-surface font-mono text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-success-emerald"></span>
                    60 FPS SYNC
                  </span>
                </div>

                {/* Live Scoreboard Core */}
                <div className="p-space-lg flex flex-col gap-space-lg">
                  {/* Team A */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-primary-container text-on-primary font-mono text-base font-bold flex items-center justify-center shadow">
                        AW
                      </div>
                      <div>
                        <div className="font-headline text-base font-bold text-surface-card">
                          Apex Warriors
                        </div>
                        <div className="font-mono text-xs text-text-placeholder">Group A • Seed #1</div>
                      </div>
                    </div>
                    <span className="font-mono text-3xl font-extrabold text-primary-fixed tabular-nums">
                      2
                    </span>
                  </div>

                  {/* Team B */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-live-orange-active text-surface-card font-mono text-base font-bold flex items-center justify-center shadow">
                        CT
                      </div>
                      <div>
                        <div className="font-headline text-base font-bold text-surface-card">
                          Colombo Thunder FC
                        </div>
                        <div className="font-mono text-xs text-text-placeholder">Group A • Seed #2</div>
                      </div>
                    </div>
                    <span className="font-mono text-3xl font-extrabold text-surface-card tabular-nums">
                      1
                    </span>
                  </div>

                  {/* Court indicator */}
                  <div className="p-space-sm rounded-lg bg-surface-card/5 flex items-center justify-between text-xs text-text-placeholder font-mono">
                    <div className="flex items-center gap-2 text-surface-card">
                      <span className="w-2 h-2 rounded-full bg-status-success-emerald"></span>
                      <span>Court 1 (Hardcourt A) → Court 5 (FIFA Arena)</span>
                    </div>
                    <span>Referee: S. Perera</span>
                  </div>

                  {/* Shareable Link preview */}
                  <div className="p-space-sm px-space-md rounded-lg bg-surface-card/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-primary-fixed truncate">
                      playfield.live/public/tournament/colombo-premier-futsal-2026
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate('/public/tournament/colombo-premier-futsal-2026')}
                      className="text-surface-card hover:text-primary-fixed font-bold flex items-center gap-1 shrink-0 ml-2"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Open</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Specification Matrix */}
      <section className="max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg py-space-xl w-full">
        <div className="text-center max-w-2xl mx-auto mb-space-xl">
          <span className="font-eyebrow text-xs uppercase text-primary tracking-widest font-bold">
            The Pitchside Engine
          </span>
          <h2 className="font-headline text-3xl font-extrabold text-floodlight-navy mt-1">
            Engineered for Multi-Pitch Sports Complexes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-lg">
          <div className="p-space-lg rounded-xl bg-surface-card border border-border-grid shadow-sm flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-pitch-turf-surface text-primary-container flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-lg font-bold text-floodlight-navy">
              Integrated Venue & Court Booking
            </h3>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              Reserve Court 1 through Court 5 seamlessly with hourly or day packages. Check real-time availability and lock schedule blocks instantly with advance deposits.
            </p>
          </div>

          <div className="p-space-lg rounded-xl bg-surface-card border border-border-grid shadow-sm flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high text-floodlight-navy flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-headline text-lg font-bold text-floodlight-navy">
              Two-Tier Court Conflict Mutex
            </h3>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              Never double-book a pitch again. Intra-tournament overlap detection and venue-wide lock guards prevent timetable collisions and suggest free alternate courts.
            </p>
          </div>

          <div className="p-space-lg rounded-xl bg-surface-card border border-border-grid shadow-sm flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-status-warning-amber flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-lg font-bold text-floodlight-navy">
              Live Scoring & Instant Public Links
            </h3>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              Log goals, assists, and disciplinary walkovers directly from the sideline. Standings recalculate automatically and synchronize to public view links with zero delay.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
