import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTournament } from '../context/TournamentContext';
import { TournamentCard } from '../components/tournament/TournamentCard';
import { PlusCircle, ShieldCheck, Trophy, Activity, History, Users, Search, ArrowRight, Play } from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { getUserTournaments } = useTournament();
  const [filterText, setFilterText] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'ended'>('all');

  const { ongoing, ended } = getUserTournaments(currentUser);

  const filteredOngoing = ongoing.filter(t =>
    t.title.toLowerCase().includes(filterText.toLowerCase()) ||
    t.sport.toLowerCase().includes(filterText.toLowerCase())
  );

  const filteredEnded = ended.filter(t =>
    t.title.toLowerCase().includes(filterText.toLowerCase()) ||
    t.sport.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Sub-Header / Workspace Deck */}
      <section className="w-full bg-floodlight-navy text-surface-card py-space-md shadow-sm">
        <div className="max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md flex-wrap">
            <div className="flex items-center gap-space-xs bg-pitch-turf-active px-space-md py-1.5 rounded-lg border border-primary-container">
              <Trophy className="w-4 h-4 text-primary-fixed" />
              <span className="font-eyebrow text-eyebrow tracking-widest text-primary-fixed uppercase">
                Active Desk
              </span>
            </div>

            <div className="flex items-center gap-space-sm">
              <span className="font-headline font-bold text-headline-sm text-surface-card">
                Colombo Metro Operations Workspace
              </span>
              <span className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-pitch-turf-surface text-status-success-emerald font-mono text-[11px] uppercase tracking-wider font-bold">
                <span className="w-2 h-2 rounded-full bg-status-success-emerald animate-pulse"></span>
                Organizer Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-md">
            <span className="font-mono text-xs text-text-placeholder hidden lg:inline-flex items-center gap-1">
              SLST UTC+05:30
            </span>
            <button
              type="button"
              onClick={() => onNavigate('/tournaments/new/details')}
              className="inline-flex items-center justify-center gap-space-xs px-space-lg py-2 rounded-lg bg-primary-container text-on-primary hover:bg-pitch-turf-hover active:bg-pitch-turf-active font-subheading text-subheading shadow-sm transition-all whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Start Tournament</span>
            </button>
          </div>
        </div>
      </section>

      {/* Scope Notice Banner (Mandatory user-filtering verification) */}
      <section className="w-full bg-info-reassign-surface border-b border-info-reassign-border">
        <div className="max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg py-space-sm flex items-center justify-between gap-space-md text-info-reassign-blue font-body text-sm">
          <div className="flex items-center gap-space-sm min-w-0">
            <ShieldCheck className="w-5 h-5 text-info-reassign-accent shrink-0" />
            <span className="truncate">
              Viewing tournaments registered by or shared with <strong className="font-subheading">{currentUser?.fullName || 'Current Organizer'}</strong> ({currentUser?.email}). Strict user-scoped isolation enforced.
            </span>
          </div>
          <div className="flex items-center gap-space-xs shrink-0">
            <span className="font-mono text-[11px] uppercase px-2 py-0.5 rounded-full bg-surface-card text-info-reassign-blue font-bold shadow-2xs">
              Desk ID #PF-9421
            </span>
          </div>
        </div>
      </section>

      {/* Main Workspace Body */}
      <div className="max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg py-space-xl flex flex-col gap-space-xl w-full">
        {/* KPI Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter-md">
          {/* Active Tournaments KPI */}
          <div className="bg-surface-card rounded-2xl p-space-lg border border-border-grid shadow-sm flex flex-col justify-between gap-space-md">
            <div className="flex items-center justify-between">
              <span className="font-eyebrow text-xs uppercase text-text-muted font-bold tracking-wider">
                Live In Action
              </span>
              <span className="p-2 rounded-lg bg-pitch-turf-surface text-status-success-emerald">
                <Activity className="w-5 h-5" />
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-space-sm">
                <span className="font-headline font-extrabold text-3xl text-floodlight-navy">
                  {ongoing.length}
                </span>
                <span className="font-subheading text-sm text-on-surface">Active Tournaments</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs font-mono text-status-success-emerald">
                <span className="font-bold">1 In Play Right Now</span>
                <span className="text-text-muted">• Matchday Court 1</span>
              </div>
            </div>
            {/* Visual Sparkline */}
            <div className="w-full pt-1">
              <svg className="w-full h-6 text-status-success-emerald" fill="none" preserveAspectRatio="none" viewBox="0 0 180 24">
                <path d="M0 18 L30 14 L60 16 L90 8 L120 12 L150 4 L180 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Teams Roster KPI */}
          <div className="bg-surface-card rounded-2xl p-space-lg border border-border-grid shadow-sm flex flex-col justify-between gap-space-md">
            <div className="flex items-center justify-between">
              <span className="font-eyebrow text-xs uppercase text-text-muted font-bold tracking-wider">
                Registration Roster
              </span>
              <span className="p-2 rounded-lg bg-secondary-container text-on-secondary-container">
                <Users className="w-5 h-5" />
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-space-sm">
                <span className="font-headline font-extrabold text-3xl text-floodlight-navy">
                  {ongoing.reduce((acc, t) => acc + (t.teams?.length || 0), 0) || 8}
                </span>
                <span className="font-subheading text-sm text-on-surface">Competing Squads</span>
              </div>
              <p className="mt-1 text-text-muted font-body text-xs">
                Allocated across <strong className="text-on-surface">Colombo Futsal Hub</strong> Courts 1, 2, 5
              </p>
            </div>
            <div className="w-full pt-1">
              <div className="flex justify-between font-mono text-[10px] text-text-muted mb-1">
                <span>Capacity Quota</span>
                <span className="font-bold">8 / 16 Slotted</span>
              </div>
              <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary-container h-full rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>

          {/* Historical Concluded KPI */}
          <div className="bg-surface-card rounded-2xl p-space-lg border border-border-grid shadow-sm flex flex-col justify-between gap-space-md">
            <div className="flex items-center justify-between">
              <span className="font-eyebrow text-xs uppercase text-text-muted font-bold tracking-wider">
                Historical Archive
              </span>
              <span className="p-2 rounded-lg bg-surface-container text-on-surface-variant">
                <History className="w-5 h-5" />
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-space-sm">
                <span className="font-headline font-extrabold text-3xl text-floodlight-navy">
                  {ended.length}
                </span>
                <span className="font-subheading text-sm text-on-surface">Concluded Series</span>
              </div>
              <p className="mt-1 text-text-muted font-body text-xs">
                Full match sheets, goalscorers & podium export archived
              </p>
            </div>
            <div className="w-full pt-1 flex items-center justify-between text-xs font-mono">
              <span className="text-status-success-emerald font-bold">100% SLFA Certified</span>
              <button
                type="button"
                onClick={() => onNavigate('/tournaments/ended')}
                className="text-primary hover:underline"
              >
                View Archive →
              </button>
            </div>
          </div>
        </section>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-card p-space-sm rounded-xl border border-border-grid shadow-xs">
          <div className="flex items-center gap-space-xs overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-subheading text-sm font-semibold transition-colors ${
                activeTab === 'all'
                  ? 'bg-floodlight-navy text-surface-card shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-state-hover-gray'
              }`}
            >
              All Events ({ongoing.length + ended.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ongoing')}
              className={`px-4 py-2 rounded-lg font-subheading text-sm font-semibold transition-colors ${
                activeTab === 'ongoing'
                  ? 'bg-floodlight-navy text-surface-card shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-state-hover-gray'
              }`}
            >
              Current Ongoing ({ongoing.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ended')}
              className={`px-4 py-2 rounded-lg font-subheading text-sm font-semibold transition-colors ${
                activeTab === 'ended'
                  ? 'bg-floodlight-navy text-surface-card shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-state-hover-gray'
              }`}
            >
              Concluded ({ended.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-text-placeholder absolute left-3 top-2.5" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search tournament title..."
              className="w-full h-9 pl-9 pr-3 bg-canvas-alabaster rounded-lg border border-border-control font-body text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Section 1: Current Ongoing Tournaments */}
        {(activeTab === 'all' || activeTab === 'ongoing') && (
          <section className="flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-border-grid">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-status-success-emerald animate-pulse"></span>
                <h2 className="font-headline font-bold text-xl text-floodlight-navy">
                  Current Ongoing Tournaments
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/tournaments/ongoing')}
                className="text-primary font-subheading text-sm font-semibold hover:underline flex items-center gap-1"
              >
                <span>View Full Ongoing List ({ongoing.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {filteredOngoing.length === 0 ? (
              <div className="p-8 text-center bg-surface-card rounded-xl border border-border-grid text-text-muted">
                No active ongoing tournaments matching filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-lg">
                {filteredOngoing.map(tournament => (
                  <TournamentCard
                    key={tournament.id}
                    tournament={tournament}
                    onManage={(id) => onNavigate(`/tournaments/${id}/manage`)}
                    onViewPublic={(id) => onNavigate(`/public/tournament/${id}`)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Section 2: Concluded Tournaments */}
        {(activeTab === 'all' || activeTab === 'ended') && (
          <section className="flex flex-col gap-space-md pt-space-lg">
            <div className="flex items-center justify-between pb-space-xs border-b border-border-grid">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-status-warning-amber" />
                <h2 className="font-headline font-bold text-xl text-floodlight-navy">
                  Tournaments That Ended (Historical Archive)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/tournaments/ended')}
                className="text-primary font-subheading text-sm font-semibold hover:underline flex items-center gap-1"
              >
                <span>View Full Concluded Archive ({ended.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {filteredEnded.length === 0 ? (
              <div className="p-8 text-center bg-surface-card rounded-xl border border-border-grid text-text-muted">
                No completed tournaments found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-lg">
                {filteredEnded.map(tournament => (
                  <TournamentCard
                    key={tournament.id}
                    tournament={tournament}
                    onViewSummary={(id) => onNavigate(`/tournaments/${id}/summary`)}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};
