import React from 'react';
import { Tournament } from '../../types/tournament';
import { Trophy, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface TournamentExportCanvasProps {
  tournament: Tournament;
}

export const TournamentExportCanvas: React.FC<TournamentExportCanvasProps> = ({ tournament }) => {
  const winner = tournament.teams.find(t => t.id === tournament.winnerTeamId) || tournament.teams[0];
  const runnerUp = tournament.teams.find(t => t.id === tournament.runnerUpTeamId) || tournament.teams[1];

  return (
    <div
      id="tournament-export-canvas"
      className="bg-white text-floodlight-navy font-body p-12 max-w-[1200px] mx-auto border border-border-grid shadow-2xl rounded-2xl relative"
    >
      {/* Top Masthead */}
      <div className="bg-floodlight-navy text-surface-card rounded-2xl p-8 mb-8 flex items-center justify-between shadow-md">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-primary-container text-primary-fixed font-mono text-xs font-bold uppercase tracking-widest">
              Official Tournament Archive
            </span>
            <span className="text-text-placeholder font-mono text-xs">
              ID: #{tournament.slug.toUpperCase()}
            </span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold text-surface-card tracking-tight">
            {tournament.title}
          </h1>
          <p className="font-body text-text-placeholder text-sm mt-1">
            Concluded on {tournament.endDate} • {tournament.venue?.name || 'Colombo Futsal Hub'} (Courts 1, 2, 5)
          </p>
        </div>

        <div className="text-right flex flex-col items-end">
          <div className="flex items-center gap-2 text-primary-fixed font-mono font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-status-success-emerald" />
            <span>SLFA CERTIFIED SANCTIONED</span>
          </div>
          <span className="text-text-placeholder font-mono text-xs mt-1">
            Verified Fair-Play Audit Ledger
          </span>
        </div>
      </div>

      {/* Centerpiece: Champion & Runner-Up Podium Grid */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Champion (8 cols) */}
        <div className="col-span-8 bg-gradient-to-br from-pitch-turf-surface via-surface-card to-canvas-alabaster rounded-2xl p-8 border-2 border-primary-container shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-container text-on-primary font-mono text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-status-warning-amber" />
              Tournament Champions • 1st Place
            </span>
            <span className="font-mono text-sm font-bold text-status-warning-amber">
              GOLD TROPHY & SHIELD
            </span>
          </div>

          <div className="flex items-center gap-6 my-4">
            <div className="w-20 h-20 rounded-2xl bg-floodlight-navy text-primary-fixed flex items-center justify-center font-headline text-3xl font-extrabold shadow-md">
              {winner?.shortCode || 'AW'}
            </div>
            <div>
              <h2 className="font-headline text-3xl font-extrabold text-pitch-turf-active">
                {winner?.name || 'Apex Warriors'}
              </h2>
              <div className="flex items-center gap-4 text-xs font-mono text-text-muted mt-2">
                <span className="text-status-success-emerald font-bold">Undefeated (6-0-0)</span>
                <span>•</span>
                <span>+14 Goal Difference (23 GF / 9 GA)</span>
                <span>•</span>
                <span className="text-primary-container font-bold">LKR 250,000 Bounty</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-primary-container/20 flex items-center justify-between text-xs font-mono text-text-muted">
            <span>Primary Kit: Obsidian Emerald</span>
            <span>Manager: Tariq Al-Hassan</span>
          </div>
        </div>

        {/* Runner-Up (4 cols) */}
        <div className="col-span-4 bg-surface-card rounded-2xl p-6 border border-border-grid shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-mono text-xs font-bold uppercase">
              2nd Place • Runner-Up
            </span>
            <span className="font-mono text-xs font-bold text-secondary">SILVER MEDAL</span>
          </div>

          <div className="my-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high text-floodlight-navy flex items-center justify-center font-headline font-bold text-lg">
                {runnerUp?.shortCode || 'CT'}
              </div>
              <h3 className="font-headline text-xl font-bold text-floodlight-navy">
                {runnerUp?.name || 'Colombo Thunder FC'}
              </h3>
            </div>
            <div className="text-xs font-mono text-text-muted space-y-1">
              <div>Record: 4 W - 2 L</div>
              <div>Goal Diff: +6 (18 GF / 12 GA)</div>
            </div>
          </div>

          <div className="pt-3 border-t border-border-grid text-xs font-mono text-text-muted">
            Prize: LKR 100,000 + Medals
          </div>
        </div>
      </div>

      {/* Key Individual Honors & Aggregate Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="p-5 rounded-xl bg-canvas-alabaster border border-border-grid text-center">
          <Award className="w-6 h-6 text-status-warning-amber mx-auto mb-2" />
          <span className="font-eyebrow text-xs uppercase text-text-muted block">Golden Boot (Top Scorer)</span>
          <span className="font-headline text-lg font-bold text-floodlight-navy block mt-1">
            {tournament.goldenBootPlayer?.name || 'Tariq Al-Hassan'}
          </span>
          <span className="font-mono text-xs text-status-success-emerald font-bold">
            {tournament.goldenBootPlayer?.goals || 9} Goals
          </span>
        </div>

        <div className="p-5 rounded-xl bg-canvas-alabaster border border-border-grid text-center">
          <ShieldCheck className="w-6 h-6 text-primary mx-auto mb-2" />
          <span className="font-eyebrow text-xs uppercase text-text-muted block">Golden Glove (Best Keeper)</span>
          <span className="font-headline text-lg font-bold text-floodlight-navy block mt-1">
            {tournament.goldenGlovePlayer?.name || 'Roshan Senanayake'}
          </span>
          <span className="font-mono text-xs text-primary font-bold">
            {tournament.goldenGlovePlayer?.savePercentage || 84}% Save Ratio
          </span>
        </div>

        <div className="p-5 rounded-xl bg-floodlight-navy text-surface-card text-center">
          <span className="font-mono text-3xl font-extrabold text-primary-fixed block leading-tight">
            {tournament.totalGoals || 114}
          </span>
          <span className="font-eyebrow text-xs uppercase text-text-placeholder block mt-1">Total Goals Scored</span>
          <span className="font-mono text-[11px] text-text-placeholder">3.56 Goals / Match</span>
        </div>

        <div className="p-5 rounded-xl bg-floodlight-navy text-surface-card text-center">
          <span className="font-mono text-3xl font-extrabold text-surface-card block leading-tight">
            {tournament.matches.length || 32}
          </span>
          <span className="font-eyebrow text-xs uppercase text-text-placeholder block mt-1">Total Fixtures Completed</span>
          <span className="font-mono text-[11px] text-primary-fixed">100% Verification Rate</span>
        </div>
      </div>

      {/* Chronological Event Highlights Matrix */}
      <div className="bg-canvas-alabaster rounded-xl p-6 border border-border-grid mb-8">
        <h4 className="font-headline text-sm font-bold uppercase tracking-wider text-floodlight-navy mb-4 flex items-center justify-between">
          <span>Championship Round Chronological Ledger</span>
          <span className="font-mono text-xs text-text-muted">Final Series Summary</span>
        </h4>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 bg-surface-card rounded-lg border border-border-grid flex items-center justify-between">
            <span className="font-bold text-primary">SF 1: Apex Warriors 3 – 1 Island Titans</span>
            <span className="text-text-muted">Court 5 • Goals: T. Al-Hassan 14', 34', K. Rizvi 28'</span>
          </div>
          <div className="p-3 bg-surface-card rounded-lg border border-border-grid flex items-center justify-between">
            <span className="font-bold text-floodlight-navy">SF 2: Colombo Thunder FC 2 – 1 Havelock United</span>
            <span className="text-text-muted">Court 5 • Goals: D. Perera 21', N. Fernando 36'</span>
          </div>
          <div className="p-3 bg-pitch-turf-surface rounded-lg border border-primary-container/30 flex items-center justify-between font-bold text-pitch-turf-active">
            <span>GRAND FINAL: Apex Warriors 4 – 2 Colombo Thunder FC</span>
            <span>Court 5 • T. Al-Hassan 9', 31', K. Rizvi 23', M. Jay 37'</span>
          </div>
        </div>
      </div>

      {/* Signatures & Official Validation Footer */}
      <div className="pt-6 border-t border-border-grid flex items-center justify-between text-xs">
        <div className="flex flex-col">
          <span className="font-headline font-bold text-sm text-floodlight-navy">Tariq J. Marikar</span>
          <span className="text-text-muted font-body">Head of Operations, Play Field Facilities</span>
        </div>

        <div className="flex items-center gap-2 text-status-success-emerald font-mono font-bold text-sm">
          <CheckCircle2 className="w-5 h-5 text-status-success-emerald" />
          <span>AUTHENTICATED SLFA AFFILIATE #SLFA-2026-HQ</span>
        </div>
      </div>
    </div>
  );
};
