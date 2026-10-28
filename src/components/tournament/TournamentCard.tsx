import React from 'react';
import { Tournament } from '../../types/tournament';
import { Calendar, MapPin, Trophy, ArrowRight, Play, CheckCircle } from 'lucide-react';

interface TournamentCardProps {
  tournament: Tournament;
  onManage?: (id: string) => void;
  onViewPublic?: (id: string) => void;
  onViewSummary?: (id: string) => void;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  onManage,
  onViewPublic,
  onViewSummary
}) => {
  const isEnded = tournament.status === 'ENDED';
  const isOngoing = tournament.status === 'PUBLISHED_ONGOING';
  const isDraft = tournament.status === 'DRAFT';

  // Find next upcoming or live match
  const nextMatch = tournament.matches.find(m => m.status === 'LIVE') ||
                    tournament.matches.find(m => m.status === 'UPCOMING');

  return (
    <div className="bg-surface-card rounded-xl border border-border-grid shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      {/* Top Banner & Status Strip */}
      <div className="p-space-lg flex flex-col gap-space-md">
        <div className="flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-2">
            <span className="font-eyebrow text-xs uppercase px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-bold">
              {tournament.sport.toUpperCase()} 5v5
            </span>
            <span className="font-mono text-xs text-text-muted">
              {tournament.teams?.length || 8} Teams
            </span>
          </div>

          {isOngoing && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pitch-turf-surface text-status-success-emerald font-mono text-xs font-bold uppercase">
              <span className="w-2 h-2 rounded-full bg-status-success-emerald animate-pulse"></span>
              Live Ongoing
            </span>
          )}
          {isEnded && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-mono text-xs font-bold uppercase">
              <CheckCircle className="w-3.5 h-3.5 text-status-success-emerald" />
              Concluded
            </span>
          )}
          {isDraft && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-status-warning-amber font-mono text-xs font-bold uppercase border border-amber-200">
              Draft Staged
            </span>
          )}
        </div>

        {/* Title */}
        <div>
          <h3 className="font-headline font-bold text-headline-sm text-floodlight-navy group-hover:text-primary transition-colors">
            {tournament.title}
          </h3>
          <div className="flex items-center gap-2 text-text-muted font-body text-xs mt-1">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="truncate">{tournament.venue?.name || 'Colombo Futsal Hub'}</span>
            <span>•</span>
            <span className="font-mono">Courts {tournament.selectedCourtNumbers?.join(', ') || '1, 2, 5'}</span>
          </div>
        </div>

        {/* Next Match Telemetry Strip (Mandatory dynamic calculation) */}
        {!isEnded && nextMatch && (
          <div className="p-space-sm rounded-lg bg-canvas-alabaster border border-border-grid flex flex-col gap-1">
            <span className="font-eyebrow text-[11px] uppercase text-text-muted tracking-wider flex items-center justify-between">
              <span>Next Match Action</span>
              <span className="font-mono text-primary font-bold">{nextMatch.courtName}</span>
            </span>
            <div className="flex items-center justify-between font-subheading text-sm text-floodlight-navy font-bold">
              <span className="truncate">{nextMatch.homeTeamName || 'Team A'} vs {nextMatch.awayTeamName || 'Team B'}</span>
              <span className="font-mono text-xs text-live-orange-active">
                {nextMatch.status === 'LIVE' ? "LIVE NOW (24')" : '17:30 PM'}
              </span>
            </div>
          </div>
        )}

        {isEnded && (
          <div className="p-space-sm rounded-lg bg-pitch-turf-surface/60 border border-status-success-emerald/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-status-warning-amber" />
              <div className="flex flex-col">
                <span className="font-eyebrow text-[10px] uppercase text-status-success-emerald font-bold">Champion</span>
                <span className="font-headline text-xs font-bold text-pitch-turf-active">Apex Warriors (6-0-0)</span>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-pitch-turf-active">LKR 250,000</span>
          </div>
        )}
      </div>

      {/* Card Action Row */}
      <div className="px-space-lg py-space-sm bg-surface-container-low border-t border-border-grid flex items-center justify-between gap-2">
        {isEnded ? (
          <>
            <button
              type="button"
              onClick={() => onViewSummary?.(tournament.id)}
              className="text-xs font-body font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View Report & Export PNG</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] text-text-muted">SLFA Certified</span>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onManage?.(tournament.id)}
              className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Live Console</span>
            </button>
            <button
              type="button"
              onClick={() => onViewPublic?.(tournament.id)}
              className="text-xs font-body font-semibold text-on-surface-variant hover:text-primary transition-colors"
            >
              Public Link →
            </button>
          </>
        )}
      </div>
    </div>
  );
};
