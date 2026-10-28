import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { StandingsTable } from '../components/tournament/StandingsTable';
import { KnockoutBracket } from '../components/tournament/KnockoutBracket';
import { calculateGroupStandings } from '../lib/standingsEngine';
import {
  Trophy,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  RefreshCw,
  Share2,
  Check,
  ArrowRight,
  AlertTriangle,
  Award,
  Zap,
  Radio
} from 'lucide-react';

interface PublicLiveTournamentPageProps {
  tournamentId: string;
}

export const PublicLiveTournamentPage: React.FC<PublicLiveTournamentPageProps> = ({ tournamentId }) => {
  const { getTournamentByIdOrSlug, tournaments } = useTournament();
  const [activeTab, setActiveTab] = useState<'fixtures' | 'standings' | 'knockout' | 'scorers'>('fixtures');
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const tournament = getTournamentByIdOrSlug(tournamentId) || tournaments[0];

  // Active live match
  const liveMatch = tournament?.matches.find(m => m.status === 'LIVE') ||
                    tournament?.matches.find(m => m.status === 'UPCOMING') ||
                    tournament?.matches[0];

  const homeTeam = tournament?.teams.find(t => t.id === liveMatch?.homeTeamId);
  const awayTeam = tournament?.teams.find(t => t.id === liveMatch?.awayTeamId);

  // Check for any court relocation notices
  const relocationEvent = liveMatch?.events?.find(e => e.eventType === 'COURT_RELOCATION');

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  if (!tournament) {
    return (
      <div className="p-12 text-center text-text-muted">
        Public tournament center not found.
      </div>
    );
  }

  // Standings
  const standingsGroupA = calculateGroupStandings(tournament.teams, tournament.matches, 'Group A');
  const standingsGroupB = calculateGroupStandings(tournament.teams, tournament.matches, 'Group B');

  // Top scorers leaderboard calculation
  const allScorerEvents = tournament.matches.flatMap(m => m.events || []).filter(e => e.eventType === 'GOAL');
  const scorerMap = new Map<string, { name: string; goals: number; teamId?: string }>();
  allScorerEvents.forEach(e => {
    const key = e.playerName || 'Player';
    const curr = scorerMap.get(key) || { name: key, goals: 0, teamId: e.teamId };
    curr.goals += 1;
    scorerMap.set(key, curr);
  });
  const topScorers = Array.from(scorerMap.values()).sort((a, b) => b.goals - a.goals);

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Public Broadcast Masthead Bar */}
      <section className="w-full bg-floodlight-navy text-surface-card py-space-md shadow-md border-b border-floodlight-navy/80">
        <div className="max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card-red-surface text-card-red-danger font-mono text-xs font-extrabold uppercase tracking-widest border border-card-red-border">
              <span className="w-2 h-2 rounded-full bg-card-red-danger animate-pulse"></span>
              PUBLIC LIVE MATCH CENTER
            </span>
            <span className="text-surface-variant font-mono text-xs uppercase">
              • {tournament.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              className="text-xs font-mono text-surface-card hover:text-primary-fixed flex items-center gap-1 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Live Synced</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="btn-secondary text-xs py-1 px-3 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-status-success-emerald" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Share Stream'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Hero Live Match Center Scoreboard */}
      {liveMatch && (
        <section className="w-full bg-surface-card border-b border-border-grid py-space-xl">
          <div className="max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg flex flex-col gap-space-lg">
            {/* Relocation Notification Banner (Appears dynamically if Court changed) */}
            {relocationEvent && (
              <div className="p-space-md rounded-xl bg-info-reassign-surface border border-info-reassign-border text-info-reassign-blue flex items-start gap-3 shadow-xs animate-fade">
                <Radio className="w-5 h-5 text-info-reassign-accent shrink-0 mt-0.5 animate-pulse" />
                <div className="flex flex-col text-xs leading-relaxed">
                  <span className="font-headline font-bold text-sm">
                    OFFICIAL VENUE REASSIGNMENT NOTICE • Court {relocationEvent.details?.fromCourt || 1} → Court {relocationEvent.details?.toCourt || 5}
                  </span>
                  <p>
                    {relocationEvent.details?.note || 'Match transferred to Court 5 (FIFA Pro Turf Arena) due to pitch schedule management.'}
                  </p>
                </div>
              </div>
            )}

            {/* Scoreboard Deck */}
            <div className="p-space-xl rounded-2xl bg-canvas-alabaster border border-border-grid shadow-sm flex flex-col gap-space-lg">
              <div className="flex items-center justify-between border-b border-border-grid pb-space-sm">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-floodlight-navy text-surface-card font-mono text-xs font-bold uppercase">
                    {liveMatch.courtName}
                  </span>
                  <span className="font-eyebrow text-xs uppercase text-text-muted">
                    {liveMatch.round} • {liveMatch.groupName}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-card-red-surface text-card-red-danger font-mono text-xs font-bold uppercase border border-card-red-border">
                  <span className="w-2 h-2 rounded-full bg-card-red-danger animate-pulse"></span>
                  {liveMatch.status === 'LIVE' ? `Live Clock: ${liveMatch.currentMinute}` : liveMatch.status}
                </span>
              </div>

              {/* Head-to-Head Scoreboard */}
              <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-space-lg">
                {/* Home */}
                <div className="md:col-span-4 flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl text-surface-card font-headline text-2xl font-extrabold flex items-center justify-center shadow-md shrink-0"
                    style={{ backgroundColor: homeTeam?.kitColorPrimary || '#0D6E4F' }}
                  >
                    {homeTeam?.shortCode || 'AW'}
                  </div>
                  <div>
                    <h2 className="font-headline font-extrabold text-2xl text-floodlight-navy">
                      {homeTeam?.name || liveMatch.homeTeamName}
                    </h2>
                    <span className="font-mono text-xs text-text-muted">
                      {homeTeam?.groupName} • Seed #{homeTeam?.seed || 1}
                    </span>
                  </div>
                </div>

                {/* Score Big Mono Display */}
                <div className="md:col-span-3 flex flex-col items-center justify-center">
                  <div className="px-8 py-3 rounded-2xl bg-floodlight-navy text-surface-card flex items-center gap-4 shadow-xl border border-floodlight-navy/90">
                    <span className="font-mono text-5xl font-extrabold text-primary-fixed tabular-nums">
                      {liveMatch.homeScore}
                    </span>
                    <span className="font-mono text-3xl text-text-placeholder opacity-60">
                      –
                    </span>
                    <span className="font-mono text-5xl font-extrabold text-surface-card tabular-nums">
                      {liveMatch.awayScore}
                    </span>
                  </div>
                </div>

                {/* Away */}
                <div className="md:col-span-4 flex items-center md:justify-end gap-4">
                  <div className="text-left md:text-right">
                    <h2 className="font-headline font-extrabold text-2xl text-floodlight-navy">
                      {awayTeam?.name || liveMatch.awayTeamName}
                    </h2>
                    <span className="font-mono text-xs text-text-muted">
                      {awayTeam?.groupName} • Seed #{awayTeam?.seed || 2}
                    </span>
                  </div>
                  <div
                    className="w-16 h-16 rounded-2xl text-surface-card font-headline text-2xl font-extrabold flex items-center justify-center shadow-md shrink-0"
                    style={{ backgroundColor: awayTeam?.kitColorPrimary || '#EA580C' }}
                  >
                    {awayTeam?.shortCode || 'CT'}
                  </div>
                </div>
              </div>

              {/* Live Events Timeline / Goals Ticker */}
              {liveMatch.events && liveMatch.events.length > 0 && (
                <div className="mt-2 pt-space-md border-t border-border-grid flex flex-col gap-2">
                  <span className="font-eyebrow text-xs uppercase text-text-muted font-bold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-live-orange-active" />
                    <span>Match Event Timeline & Goalscorer Feed</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {liveMatch.events.map((evt, idx) => (
                      <div key={evt.id || idx} className="p-2.5 rounded-xl bg-surface-card border border-border-grid flex items-center gap-3 shadow-2xs">
                        <span className="w-8 h-8 rounded-lg bg-pitch-turf-surface text-status-success-emerald font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          {evt.minute}
                        </span>
                        <div className="min-w-0">
                          <span className="font-headline font-bold text-xs text-floodlight-navy block truncate">
                            {evt.eventType}: {evt.playerName || evt.details?.note}
                          </span>
                          {evt.assistPlayerName && (
                            <span className="text-[10px] font-mono text-text-muted block truncate">
                              Assist: {evt.assistPlayerName}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Segmented Public Tabs (Fixtures, Standings, Knockout, Scorers) */}
      <section className="max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg py-space-lg w-full">
        <div className="flex items-center gap-space-xs border-b border-border-grid pb-space-sm mb-space-lg overflow-x-auto tactical-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('fixtures')}
            className={`px-space-lg py-2 rounded-xl font-subheading text-sm font-bold transition-all ${
              activeTab === 'fixtures'
                ? 'bg-floodlight-navy text-surface-card shadow-sm'
                : 'bg-surface-card text-on-surface-variant hover:text-on-surface hover:bg-state-hover-gray border border-border-grid'
            }`}
          >
            Live & Upcoming Fixtures ({tournament.matches.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('standings')}
            className={`px-space-lg py-2 rounded-xl font-subheading text-sm font-bold transition-all ${
              activeTab === 'standings'
                ? 'bg-floodlight-navy text-surface-card shadow-sm'
                : 'bg-surface-card text-on-surface-variant hover:text-on-surface hover:bg-state-hover-gray border border-border-grid'
            }`}
          >
            Live Group Standings
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('knockout')}
            className={`px-space-lg py-2 rounded-xl font-subheading text-sm font-bold transition-all ${
              activeTab === 'knockout'
                ? 'bg-floodlight-navy text-surface-card shadow-sm'
                : 'bg-surface-card text-on-surface-variant hover:text-on-surface hover:bg-state-hover-gray border border-border-grid'
            }`}
          >
            Knockout Tree
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('scorers')}
            className={`px-space-lg py-2 rounded-xl font-subheading text-sm font-bold transition-all ${
              activeTab === 'scorers'
                ? 'bg-floodlight-navy text-surface-card shadow-sm'
                : 'bg-surface-card text-on-surface-variant hover:text-on-surface hover:bg-state-hover-gray border border-border-grid'
            }`}
          >
            Golden Boot Leaderboard
          </button>
        </div>

        {/* Tab 1: Fixtures */}
        {activeTab === 'fixtures' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
            {tournament.matches.map(m => (
              <div
                key={m.id}
                className="bg-surface-card rounded-2xl border border-border-grid p-space-lg shadow-xs hover:shadow-md transition-shadow flex flex-col gap-space-sm"
              >
                <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                  <span>Match #{m.matchNumber} • {m.round}</span>
                  <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                    m.status === 'LIVE'
                      ? 'bg-card-red-surface text-card-red-danger'
                      : m.status === 'COMPLETED'
                      ? 'bg-pitch-turf-surface text-status-success-emerald'
                      : 'bg-surface-container text-text-muted'
                  }`}>
                    {m.status}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="font-subheading font-bold text-base text-floodlight-navy">
                    {m.homeTeamName} vs {m.awayTeamName}
                  </span>
                  <span className="font-mono text-xl font-extrabold text-floodlight-navy">
                    {m.status === 'UPCOMING' ? 'vs' : `${m.homeScore} – ${m.awayScore}`}
                  </span>
                </div>

                <div className="pt-2 border-t border-border-grid flex items-center justify-between text-xs font-mono text-text-muted">
                  <span className="flex items-center gap-1 text-primary font-bold">
                    <MapPin className="w-3.5 h-3.5" />
                    {m.courtName}
                  </span>
                  {m.notes && <span className="text-status-warning-amber truncate max-w-[200px]">{m.notes}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Standings */}
        {activeTab === 'standings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
            <StandingsTable standings={standingsGroupA} groupName="Group A" />
            <StandingsTable standings={standingsGroupB} groupName="Group B" />
          </div>
        )}

        {/* Tab 3: Knockout */}
        {activeTab === 'knockout' && (
          <KnockoutBracket matches={tournament.matches} />
        )}

        {/* Tab 4: Scorers */}
        {activeTab === 'scorers' && (
          <div className="bg-surface-card rounded-2xl border border-border-grid p-space-lg shadow-sm max-w-xl">
            <h3 className="font-headline font-bold text-lg text-floodlight-navy mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-status-warning-amber" />
              <span>Tournament Golden Boot Leaderboard</span>
            </h3>

            <div className="divide-y divide-border-grid border border-border-grid rounded-xl overflow-hidden font-body text-sm">
              {topScorers.map((s, idx) => (
                <div key={s.name} className="p-3 px-4 flex items-center justify-between hover:bg-state-hover-gray">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-text-muted w-6">
                      #{idx + 1}
                    </span>
                    <span className="font-subheading font-bold text-floodlight-navy">
                      {s.name}
                    </span>
                  </div>
                  <span className="font-mono text-sm font-extrabold text-status-success-emerald">
                    {s.goals} Goals
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
