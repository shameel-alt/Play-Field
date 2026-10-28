import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { useAuth } from '../context/AuthContext';
import { ScoreStepper } from '../components/common/ScoreStepper';
import { StandingsTable } from '../components/tournament/StandingsTable';
import { KnockoutBracket } from '../components/tournament/KnockoutBracket';
import { CourtReassignModal } from '../components/tournament/CourtReassignModal';
import { CoOrganizerModal } from '../components/tournament/CoOrganizerModal';
import { calculateGroupStandings } from '../lib/standingsEngine';
import {
  Trophy,
  ShieldCheck,
  UserPlus,
  Copy,
  ExternalLink,
  Check,
  AlertTriangle,
  Gavel,
  Zap,
  ArrowRight,
  Clock,
  MapPin,
  AlertCircle
} from 'lucide-react';

interface TournamentManagementPageProps {
  tournamentId: string;
  onNavigate: (path: string) => void;
}

export const TournamentManagementPage: React.FC<TournamentManagementPageProps> = ({
  tournamentId,
  onNavigate
}) => {
  const { getTournamentByIdOrSlug, updateScore, recordMatchEvent, markWalkover, markDisqualified } = useTournament();
  const { currentUser, isAuthenticated } = useAuth();

  const tournament = getTournamentByIdOrSlug(tournamentId);

  // Modals state
  const [isCourtModalOpen, setIsCourtModalOpen] = useState(false);
  const [isCoOrganizerModalOpen, setIsCoOrganizerModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<string>('match-6-live');

  // Event logger state
  const [selectedScorerId, setSelectedScorerId] = useState<string>('');
  const [selectedAssistId, setSelectedAssistId] = useState<string>('none');
  const [eventMinute, setEventMinute] = useState<string>("24'");
  const [logFeedback, setLogFeedback] = useState<string | null>(null);

  // Authentication guard: check if user is signed in
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface-card p-8 rounded-2xl border border-border-grid shadow-xl text-center flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-card-red-surface text-card-red-danger flex items-center justify-center">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="font-headline font-bold text-xl text-floodlight-navy">
            Organizer Authentication Guard Active
          </h2>
          <p className="font-body text-sm text-text-muted">
            You must be logged in as an authorized organizer or invited co-organizer to access pitchside scoring controls.
          </p>
          <button
            type="button"
            onClick={() => onNavigate(`/login?tournamentId=${tournamentId}`)}
            className="btn-primary w-full py-2.5 text-sm font-bold mt-2"
          >
            Sign In to Unlock Console
          </button>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="p-12 text-center text-text-muted">
        Tournament not found. Please verify ID or slug.
      </div>
    );
  }

  // Active match for live controller
  const activeMatch = tournament.matches.find(m => m.id === selectedMatchId) ||
                      tournament.matches.find(m => m.status === 'LIVE') ||
                      tournament.matches[0];

  const homeTeam = tournament.teams.find(t => t.id === activeMatch?.homeTeamId);
  const awayTeam = tournament.teams.find(t => t.id === activeMatch?.awayTeamId);

  // Eligible players roster for scorer dropdown
  const participatingPlayers = [
    ...(homeTeam?.players.map(p => ({ ...p, teamName: homeTeam.name, teamId: homeTeam.id })) || []),
    ...(awayTeam?.players.map(p => ({ ...p, teamName: awayTeam.name, teamId: awayTeam.id })) || [])
  ];

  const handleScoreAChange = async (newVal: number) => {
    if (!activeMatch) return;
    await updateScore(tournament.id, activeMatch.id, newVal, activeMatch.awayScore);
  };

  const handleScoreBChange = async (newVal: number) => {
    if (!activeMatch) return;
    await updateScore(tournament.id, activeMatch.id, activeMatch.homeScore, newVal);
  };

  const handleRecordGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMatch) return;

    const scorer = participatingPlayers.find(p => p.id === (selectedScorerId || participatingPlayers[0]?.id));
    if (!scorer) return;

    const assistPlayer = participatingPlayers.find(p => p.id === selectedAssistId);

    await recordMatchEvent(tournament.id, activeMatch.id, {
      matchId: activeMatch.id,
      tournamentId: tournament.id,
      eventType: 'GOAL',
      minute: eventMinute,
      teamId: scorer.teamId,
      playerId: scorer.id,
      playerName: scorer.name,
      assistPlayerId: assistPlayer?.id,
      assistPlayerName: assistPlayer?.name
    });

    setLogFeedback(`Goal Recorded for ${scorer.name} (${eventMinute}) • Standings Updated!`);
    setTimeout(() => setLogFeedback(null), 3000);
  };

  const handleWalkover = async (teamId: string, teamName: string) => {
    if (!activeMatch) return;
    const ok = window.confirm(
      `Issue official WALKOVER (W/O) to ${teamName}?\n\nThis will immediately award a 3-0 forfeit loss to ${teamName} and award 3 points (+3 GD) to the opposing team per FIFA futsal rules.`
    );
    if (ok) {
      await markWalkover(tournament.id, activeMatch.id, teamId);
    }
  };

  const handleDisqualify = async (teamId: string, teamName: string) => {
    const ok = window.confirm(
      `Issue DISQUALIFICATION (DQ) to ${teamName}?\n\nThis will permanently freeze team roster eligibility and forfeit all ongoing matches.`
    );
    if (ok) {
      await markDisqualified(tournament.id, teamId);
    }
  };

  const publicLink = `${window.location.origin}/#/public/tournament/${tournament.slug || tournament.id}`;

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Standings for Group A and Group B
  const standingsGroupA = calculateGroupStandings(tournament.teams, tournament.matches, 'Group A');
  const standingsGroupB = calculateGroupStandings(tournament.teams, tournament.matches, 'Group B');

  return (
    <div className="flex flex-col w-full pb-16">
      {/* TOURNAMENT OPERATIONS MASTHEAD */}
      <section className="w-full bg-floodlight-navy text-surface-card py-space-lg px-margin md:px-margin-md lg:px-margin-lg shadow-md border-b border-floodlight-navy/80">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-space-lg">
          {/* Top Meta & Title Breadcrumb */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pitch-turf-active text-primary-fixed font-mono text-[11px] uppercase tracking-widest shadow-2xs border border-primary-container">
                  <span className="w-2 h-2 rounded-full bg-primary-fixed animate-ping"></span>
                  Live Operations Feed
                </span>
                <span className="text-surface-variant font-mono text-xs uppercase tracking-wider">
                  • ID: #{tournament.slug.toUpperCase()}
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-variant/20 text-surface-card font-mono text-[11px] uppercase font-bold">
                  Phase: Group Stage Matchday
                </span>
              </div>
              <h1 className="font-headline font-extrabold text-2xl md:text-3xl text-surface-card tracking-tight flex items-center gap-2">
                <span>{tournament.title}</span>
                <ShieldCheck className="w-6 h-6 text-primary-fixed" />
              </h1>
            </div>

            {/* Public Link Share Widget */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-xs bg-surface-card/10 backdrop-blur-md p-space-xs rounded-xl border border-surface-card/20 shadow-inner">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-card/15 rounded-lg text-surface-card flex-1 min-w-[260px] font-mono text-xs">
                <span className="text-primary-fixed font-bold">Public URL:</span>
                <span className="truncate">{publicLink}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={copyPublicLink}
                  className="px-3 py-1.5 rounded-lg bg-surface-card text-floodlight-navy font-subheading text-xs font-bold hover:bg-state-hover-gray flex items-center gap-1 transition-all"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-status-success-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
                <a
                  href={`#/public/tournament/${tournament.slug || tournament.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-subheading text-xs font-bold hover:bg-pitch-turf-hover flex items-center gap-1 shadow-xs transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Public Center</span>
                </a>
              </div>
            </div>
          </div>

          {/* Co-Organizer Access Deck & Security Banner */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pt-space-md border-t border-surface-card/10">
            {/* Delegated Officials */}
            <div className="flex flex-wrap items-center gap-space-md text-xs font-body">
              <span className="font-eyebrow uppercase text-surface-variant font-bold">
                Tournament Delegation:
              </span>
              <div className="flex items-center gap-2 font-mono">
                <span className="bg-primary-container px-2 py-0.5 rounded text-on-primary font-bold">
                  Muhammed S. (Lead)
                </span>
                {tournament.coOrganizers?.map(co => (
                  <span key={co.email} className="bg-surface-card/20 px-2 py-0.5 rounded text-surface-card">
                    {co.name} ({co.role})
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsCoOrganizerModalOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-surface-card/15 hover:bg-surface-card/25 text-surface-card font-subheading text-xs transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add Organizing Member</span>
              </button>
            </div>

            {/* Mandatory Security Guard Pill */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-status-warning-amber/20 text-amber-200 font-mono text-[11px] tracking-wide border border-status-warning-amber/30">
              <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Security Guard: Invited members must Sign In / Sign Up to log match telemetry.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3-ZONE MAIN WORKSPACE */}
      <main className="w-full max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg py-space-xl flex flex-col gap-space-xl">
        {/* Match Selector Strip */}
        <div className="flex items-center justify-between bg-surface-card p-space-sm rounded-xl border border-border-grid shadow-xs overflow-x-auto">
          <span className="font-eyebrow text-xs uppercase text-text-muted font-bold shrink-0 pl-2">
            Select Fixture to Control:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto tactical-scrollbar">
            {tournament.matches.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMatchId(m.id)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  activeMatch?.id === m.id
                    ? 'bg-floodlight-navy text-surface-card shadow-xs'
                    : 'bg-canvas-alabaster text-on-surface hover:bg-state-hover-gray border border-border-grid'
                }`}
              >
                <span>#{m.matchNumber} {m.homeTeamCode || 'H'} vs {m.awayTeamCode || 'A'}</span>
                {m.status === 'LIVE' && <span className="ml-1.5 text-card-red-danger font-extrabold animate-pulse">● LIVE</span>}
                {m.status === 'WALKOVER' && <span className="ml-1 text-status-warning-amber">(W/O)</span>}
              </button>
            ))}
          </div>
        </div>

        {/* TOP ROW: Zone 1 (Tactical Live Control) + Zone 2 (Exception Actions) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* ZONE 1: LIVE MATCH SCORE & PLAYER STATS CONTROLLER (8 Cols) */}
          <section className="lg:col-span-8 flex flex-col gap-space-lg">
            {activeMatch && (
              <div className="bg-surface-card rounded-2xl border border-border-grid p-space-lg shadow-sm flex flex-col gap-space-lg">
                {/* Masthead Slot Status & Reassignment trigger */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-md border-b border-border-grid">
                  <div className="flex items-center gap-space-sm">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card-red-surface text-card-red-danger font-mono text-xs font-bold uppercase border border-card-red-border">
                      <span className="w-2 h-2 rounded-full bg-card-red-danger animate-pulse"></span>
                      {activeMatch.status === 'LIVE' ? `1st Half • ${activeMatch.currentMinute}` : activeMatch.status}
                    </span>
                    <span className="font-eyebrow text-xs uppercase text-text-muted">
                      Match #{activeMatch.matchNumber} ({activeMatch.groupName || 'Group A'})
                    </span>
                  </div>

                  {/* Court Reassignment Widget with Two-Tier Collision Trigger */}
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-floodlight-navy bg-pitch-turf-surface px-2.5 py-1 rounded-lg border border-primary-container/20">
                      Allocated: {activeMatch.courtName}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCourtModalOpen(true)}
                      className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1 border-primary text-primary hover:bg-pitch-turf-surface"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Change Court Slot</span>
                    </button>
                  </div>
                </div>

                {/* Score Matrix Stepper Display */}
                <div className="bg-canvas-alabaster p-space-lg rounded-xl border border-border-grid flex flex-col gap-space-md">
                  <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-space-md">
                    {/* Team A */}
                    <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-8 h-8 rounded-lg text-surface-card font-mono text-sm font-bold flex items-center justify-center shadow-xs"
                          style={{ backgroundColor: homeTeam?.kitColorPrimary || '#0D6E4F' }}
                        >
                          {homeTeam?.shortCode || 'AW'}
                        </span>
                        <div>
                          <h2 className="font-headline font-bold text-lg text-floodlight-navy">
                            {homeTeam?.name || activeMatch.homeTeamName}
                          </h2>
                          <span className="font-eyebrow text-[11px] text-text-muted uppercase">Home Squad</span>
                        </div>
                      </div>
                    </div>

                    {/* Central Stepper */}
                    <div className="md:col-span-3">
                      <ScoreStepper
                        scoreA={activeMatch.homeScore}
                        scoreB={activeMatch.awayScore}
                        onScoreAChange={handleScoreAChange}
                        onScoreBChange={handleScoreBChange}
                        teamAName={homeTeam?.name || 'Home'}
                        teamBName={awayTeam?.name || 'Away'}
                        disabled={activeMatch.status === 'WALKOVER'}
                      />
                    </div>

                    {/* Team B */}
                    <div className="md:col-span-4 flex flex-col items-center md:items-end text-center md:text-right">
                      <div className="flex items-center gap-2 md:flex-row-reverse">
                        <span
                          className="w-8 h-8 rounded-lg text-surface-card font-mono text-sm font-bold flex items-center justify-center shadow-xs"
                          style={{ backgroundColor: awayTeam?.kitColorPrimary || '#EA580C' }}
                        >
                          {awayTeam?.shortCode || 'CT'}
                        </span>
                        <div>
                          <h2 className="font-headline font-bold text-lg text-floodlight-navy">
                            {awayTeam?.name || activeMatch.awayTeamName}
                          </h2>
                          <span className="font-eyebrow text-[11px] text-text-muted uppercase">Away Squad</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Player Event Logger Form */}
                <form onSubmit={handleRecordGoal} className="p-space-lg bg-surface-container-low rounded-xl border border-border-grid flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <span className="font-subheading font-bold text-sm text-floodlight-navy flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-live-orange-active" />
                      <span>Instant Match Event & Player Logger</span>
                    </span>
                    {logFeedback && (
                      <span className="text-xs font-mono font-bold text-status-success-emerald bg-pitch-turf-surface px-2.5 py-0.5 rounded-full border border-status-success-emerald/30 animate-fade">
                        {logFeedback}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    {/* Goal Scorer */}
                    <div className="sm:col-span-5 flex flex-col gap-1">
                      <label className="font-eyebrow text-xs uppercase text-on-surface-variant font-bold">
                        Goal Scorer
                      </label>
                      <select
                        value={selectedScorerId || participatingPlayers[0]?.id}
                        onChange={(e) => setSelectedScorerId(e.target.value)}
                        className="h-10 px-3 bg-surface-card rounded-lg border border-border-control font-body text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        {participatingPlayers.map(p => (
                          <option key={p.id} value={p.id}>
                            #{p.jerseyNumber} {p.name} ({p.teamName})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Primary Assist */}
                    <div className="sm:col-span-4 flex flex-col gap-1">
                      <label className="font-eyebrow text-xs uppercase text-on-surface-variant font-bold">
                        Primary Assist
                      </label>
                      <select
                        value={selectedAssistId}
                        onChange={(e) => setSelectedAssistId(e.target.value)}
                        className="h-10 px-3 bg-surface-card rounded-lg border border-border-control font-body text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="none">No Assist (Solo / Direct Kick)</option>
                        {participatingPlayers.map(p => (
                          <option key={p.id} value={p.id}>
                            #{p.jerseyNumber} {p.name} ({p.teamName})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Minute */}
                    <div className="sm:col-span-1 flex flex-col gap-1">
                      <label className="font-eyebrow text-xs uppercase text-on-surface-variant font-bold">
                        Min
                      </label>
                      <input
                        type="text"
                        value={eventMinute}
                        onChange={(e) => setEventMinute(e.target.value)}
                        className="h-10 px-2 bg-surface-card rounded-lg border border-border-control font-mono text-xs text-center focus:outline-none"
                      />
                    </div>

                    {/* Record CTA */}
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="btn-live w-full h-10 text-xs font-bold shadow-sm"
                      >
                        + Log Goal
                      </button>
                    </div>
                  </div>

                  {/* Recent Match Events Ticker */}
                  {activeMatch.events && activeMatch.events.length > 0 && (
                    <div className="pt-2 border-t border-border-grid flex flex-wrap gap-2 text-xs font-mono">
                      <span className="text-text-muted font-bold self-center">Logged Events:</span>
                      {activeMatch.events.map((evt, idx) => (
                        <span key={evt.id || idx} className="bg-surface-card px-2 py-0.5 rounded border border-border-grid flex items-center gap-1">
                          <span className="text-primary font-bold">{evt.minute}</span>
                          <span>{evt.eventType}: {evt.playerName || evt.details?.note}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </form>
              </div>
            )}
          </section>

          {/* ZONE 2: TEAM EXCEPTION & DISCIPLINARY MANAGER (4 Cols) */}
          <section className="lg:col-span-4 flex flex-col gap-space-lg">
            <div className="bg-surface-card rounded-2xl border border-border-grid p-space-lg shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-sm border-b border-border-grid">
                <div className="flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-card-red-danger" />
                  <h3 className="font-headline font-bold text-base text-floodlight-navy">
                    Disciplinary Exceptions Desk
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-container font-mono text-[10px] uppercase font-bold text-text-muted">
                  FIFA Directive
                </span>
              </div>

              {/* Warning Notice */}
              <div className="p-space-md rounded-xl bg-card-red-surface border border-card-red-border text-card-red-danger flex items-start gap-2.5 text-xs leading-snug">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  Declaring a <strong>Walked Over (W/O)</strong> immediately registers an official 3-0 default win/loss, updates tiebreakers, and awards 3 points to opponent.
                </p>
              </div>

              {/* Home Team Control Card */}
              {homeTeam && (
                <div className="p-space-md rounded-xl bg-canvas-alabaster border border-border-grid flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-subheading font-bold text-floodlight-navy text-sm">
                      {homeTeam.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${
                      homeTeam.status === 'WALKOVER' ? 'bg-yellow-100 text-status-warning-amber' : 'bg-pitch-turf-surface text-status-success-emerald'
                    }`}>
                      {homeTeam.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => handleWalkover(homeTeam.id, homeTeam.name)}
                      className="h-8 px-2 rounded-lg bg-surface-card hover:bg-yellow-50 text-status-warning-amber font-mono text-xs font-bold border border-yellow-200 shadow-2xs"
                    >
                      Issue W/O (3-0)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDisqualify(homeTeam.id, homeTeam.name)}
                      className="h-8 px-2 rounded-lg bg-card-red-surface hover:bg-card-red-danger hover:text-surface-card text-card-red-danger font-mono text-xs font-bold border border-card-red-border shadow-2xs transition-colors"
                    >
                      Disqualify (DQ)
                    </button>
                  </div>
                </div>
              )}

              {/* Away Team Control Card */}
              {awayTeam && (
                <div className="p-space-md rounded-xl bg-canvas-alabaster border border-border-grid flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-subheading font-bold text-floodlight-navy text-sm">
                      {awayTeam.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${
                      awayTeam.status === 'WALKOVER' ? 'bg-yellow-100 text-status-warning-amber' : 'bg-pitch-turf-surface text-status-success-emerald'
                    }`}>
                      {awayTeam.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => handleWalkover(awayTeam.id, awayTeam.name)}
                      className="h-8 px-2 rounded-lg bg-surface-card hover:bg-yellow-50 text-status-warning-amber font-mono text-xs font-bold border border-yellow-200 shadow-2xs"
                    >
                      Issue W/O (3-0)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDisqualify(awayTeam.id, awayTeam.name)}
                      className="h-8 px-2 rounded-lg bg-card-red-surface hover:bg-card-red-danger hover:text-surface-card text-card-red-danger font-mono text-xs font-bold border border-card-red-border shadow-2xs transition-colors"
                    >
                      Disqualify (DQ)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ZONE 3: AUTOMATED GROUP STANDINGS & KNOCKOUT RADAR */}
        <section className="flex flex-col gap-space-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
            <StandingsTable standings={standingsGroupA} groupName="Group A" />
            <StandingsTable standings={standingsGroupB} groupName="Group B" />
          </div>

          {/* Knockout Progression Radar */}
          <KnockoutBracket matches={tournament.matches} />
        </section>
      </main>

      {/* Two-Tier Court Reassignment Modal */}
      {activeMatch && (
        <CourtReassignModal
          isOpen={isCourtModalOpen}
          onClose={() => setIsCourtModalOpen(false)}
          tournamentId={tournament.id}
          match={activeMatch}
        />
      )}

      {/* Co-Organizer Invitation Modal */}
      <CoOrganizerModal
        isOpen={isCoOrganizerModalOpen}
        onClose={() => setIsCoOrganizerModalOpen(false)}
        tournamentId={tournament.id}
      />
    </div>
  );
};
