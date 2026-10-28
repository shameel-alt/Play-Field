import React from 'react';
import { Trophy, ArrowRight } from 'lucide-react';
import { Match } from '../../types/match';

interface KnockoutBracketProps {
  matches: Match[];
}

export const KnockoutBracket: React.FC<KnockoutBracketProps> = ({ matches }) => {
  const sf1 = matches.find(m => m.round === 'SEMI_FINAL' && m.matchNumber % 2 !== 0);
  const sf2 = matches.find(m => m.round === 'SEMI_FINAL' && m.matchNumber % 2 === 0) || matches.filter(m => m.round === 'SEMI_FINAL')[1];
  const finalMatch = matches.find(m => m.round === 'FINAL');

  return (
    <div className="w-full bg-surface-card rounded-xl border border-border-grid p-space-lg shadow-sm">
      <div className="flex items-center justify-between pb-space-sm border-b border-border-grid mb-space-md">
        <div className="flex items-center gap-2">
          <span className="font-eyebrow text-eyebrow text-primary uppercase">Tournament Tree</span>
          <h3 className="font-headline text-headline-sm font-bold text-floodlight-navy">
            Championship Knockout Progression
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-floodlight-navy text-surface-card font-mono text-xs uppercase font-bold">
          Single Elimination
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg items-center">
        {/* Semi-Finals Column */}
        <div className="flex flex-col gap-space-md">
          <span className="font-eyebrow text-xs uppercase text-text-muted tracking-wider">
            Semi-Final Series
          </span>

          {/* SF 1 */}
          <div className="p-space-md rounded-xl bg-canvas-alabaster border border-border-grid shadow-xs flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono text-text-muted border-b border-border-grid pb-1">
              <span>SF 1 • {sf1?.courtName || 'Court 5'}</span>
              <span className="text-primary font-bold">{sf1?.status || 'SCHEDULED'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-subheading font-bold text-floodlight-navy">
                {sf1?.homeTeamName || 'Winner Group A (Apex Warriors)'}
              </span>
              <span className="font-mono font-bold text-primary-container text-base">
                {sf1?.status === 'COMPLETED' || sf1?.status === 'LIVE' ? sf1.homeScore : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-subheading font-semibold text-on-surface">
                {sf1?.awayTeamName || 'Runner-Up Group B (Island Titans)'}
              </span>
              <span className="font-mono font-bold text-on-surface text-base">
                {sf1?.status === 'COMPLETED' || sf1?.status === 'LIVE' ? sf1.awayScore : '—'}
              </span>
            </div>
          </div>

          {/* SF 2 */}
          <div className="p-space-md rounded-xl bg-canvas-alabaster border border-border-grid shadow-xs flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono text-text-muted border-b border-border-grid pb-1">
              <span>SF 2 • {sf2?.courtName || 'Court 1'}</span>
              <span className="text-primary font-bold">{sf2?.status || 'SCHEDULED'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-subheading font-bold text-floodlight-navy">
                {sf2?.homeTeamName || 'Winner Group B (Havelock United)'}
              </span>
              <span className="font-mono font-bold text-primary-container text-base">
                {sf2?.status === 'COMPLETED' || sf2?.status === 'LIVE' ? sf2.homeScore : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-subheading font-semibold text-on-surface">
                {sf2?.awayTeamName || 'Runner-Up Group A (Colombo Thunder FC)'}
              </span>
              <span className="font-mono font-bold text-on-surface text-base">
                {sf2?.status === 'COMPLETED' || sf2?.status === 'LIVE' ? sf2.awayScore : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Grand Final Column */}
        <div className="flex flex-col gap-space-md">
          <span className="font-eyebrow text-xs uppercase text-text-muted tracking-wider flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-status-warning-amber" />
            <span>Championship Grand Final</span>
          </span>

          <div className="p-space-lg rounded-xl bg-gradient-to-br from-pitch-turf-surface via-surface-card to-canvas-alabaster border-2 border-primary-container shadow-md flex flex-col gap-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-mono text-text-muted border-b border-primary-container/20 pb-2">
              <span className="font-bold text-primary-container flex items-center gap-1">
                <Trophy className="w-4 h-4 text-status-warning-amber" />
                Grand Trophy Showcase
              </span>
              <span className="bg-primary-container text-on-primary px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold">
                Gold Medal Match
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-primary-container text-on-primary font-bold font-mono text-sm flex items-center justify-center">
                  AW
                </span>
                <span className="font-headline font-extrabold text-floodlight-navy text-base">
                  {finalMatch?.homeTeamName || 'Apex Warriors'}
                </span>
              </div>
              <span className="font-mono text-2xl font-extrabold text-primary-container">
                {finalMatch?.status === 'COMPLETED' ? finalMatch.homeScore : '—'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-live-orange-active text-surface-card font-bold font-mono text-sm flex items-center justify-center">
                  CT
                </span>
                <span className="font-headline font-bold text-on-surface text-base">
                  {finalMatch?.awayTeamName || 'Colombo Thunder FC'}
                </span>
              </div>
              <span className="font-mono text-2xl font-extrabold text-floodlight-navy">
                {finalMatch?.status === 'COMPLETED' ? finalMatch.awayScore : '—'}
              </span>
            </div>

            <div className="mt-2 pt-2 border-t border-border-grid flex items-center justify-between text-xs font-mono text-text-muted">
              <span>Main Showcase: Court 5</span>
              <span className="text-status-success-emerald font-bold">Prize: LKR 250,000 + Trophy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
