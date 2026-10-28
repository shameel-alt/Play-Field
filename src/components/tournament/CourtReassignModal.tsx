import React, { useState } from 'react';
import { Match } from '../../types/match';
import { useTournament } from '../../context/TournamentContext';
import { CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, X } from 'lucide-react';

interface CourtReassignModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentId: string;
  match: Match;
  onReassigned?: (newCourt: number) => void;
}

export const CourtReassignModal: React.FC<CourtReassignModalProps> = ({
  isOpen,
  onClose,
  tournamentId,
  match,
  onReassigned
}) => {
  const { reassignCourt, checkConflict } = useTournament();
  const [targetCourt, setTargetCourt] = useState<number>(5);
  const [reason, setReason] = useState<string>('Turf conditioning & weather maintenance protocol');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Immediate reactive conflict calculation
  const conflictResult = checkConflict(
    targetCourt,
    match.scheduledStart,
    match.scheduledEnd,
    match.id,
    tournamentId
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await reassignCourt(tournamentId, match.id, targetCourt, reason);
    setFeedback(result);
    setIsSubmitting(false);

    if (result.success) {
      onReassigned?.(targetCourt);
      setTimeout(() => {
        onClose();
        setFeedback(null);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-surface-card rounded-2xl shadow-2xl border border-border-grid overflow-hidden animate-fade">
        {/* Header */}
        <div className="px-space-lg py-space-md bg-floodlight-navy text-surface-card flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed animate-pulse"></span>
            <h3 className="font-headline font-bold text-headline-sm text-surface-card">
              Reassign Match Court (Two-Tier Mutex Check)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-text-placeholder hover:text-surface-card hover:bg-surface-card/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-space-lg flex flex-col gap-space-lg">
          {/* Match Context strip */}
          <div className="p-space-sm rounded-xl bg-canvas-alabaster border border-border-grid flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-eyebrow text-xs uppercase text-text-muted">
                Match #{match.matchNumber} ({match.groupName || 'Group A'})
              </span>
              <span className="font-subheading font-bold text-floodlight-navy">
                {match.homeTeamName || 'Team A'} vs {match.awayTeamName || 'Team B'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-text-muted">Current:</span>
              <span className="px-2 py-0.5 rounded bg-surface-container font-mono text-xs font-bold text-floodlight-navy">
                Court {match.courtNumber}
              </span>
            </div>
          </div>

          {/* Court Picker */}
          <div className="flex flex-col gap-space-xs">
            <label className="font-eyebrow text-xs uppercase text-on-surface-variant font-bold">
              Select Target Court Slot
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 4, 5].map(courtNum => (
                <button
                  key={courtNum}
                  type="button"
                  onClick={() => setTargetCourt(courtNum)}
                  className={`py-2 px-3 rounded-lg border font-mono text-sm font-bold flex flex-col items-center justify-center transition-all ${
                    targetCourt === courtNum
                      ? 'bg-primary-container text-on-primary border-primary-container shadow-sm'
                      : 'bg-surface-card text-on-surface border-border-grid hover:bg-state-hover-gray'
                  }`}
                >
                  <span>Court {courtNum}</span>
                  <span className="text-[10px] font-normal opacity-80">
                    {courtNum === 5 ? 'FIFA Turf' : courtNum === 1 ? 'Hardcourt' : 'Arena'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Two-Tier Real-Time Collision Status Display */}
          <div className="flex flex-col gap-2">
            {conflictResult.hasConflict ? (
              <div className="p-space-md rounded-xl bg-card-red-surface border border-card-red-border flex items-start gap-3 text-card-red-danger">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="flex flex-col text-xs leading-relaxed">
                  <span className="font-headline font-bold text-sm">
                    Court Collision Detected ({conflictResult.tier})
                  </span>
                  <p>{conflictResult.conflictMessage}</p>
                  {conflictResult.suggestedCourtNumber && (
                    <button
                      type="button"
                      onClick={() => setTargetCourt(conflictResult.suggestedCourtNumber!)}
                      className="mt-1 font-bold underline text-left cursor-pointer"
                    >
                      Click here to switch to Court {conflictResult.suggestedCourtNumber} instead.
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-space-md rounded-xl bg-pitch-turf-surface border border-status-success-emerald/30 flex items-start gap-3 text-status-success-emerald">
                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="flex flex-col text-xs leading-relaxed">
                  <span className="font-headline font-bold text-sm">
                    Court {targetCourt} Available (Zero Clashes)
                  </span>
                  <p>
                    Verified with both intra-tournament fixtures and venue locks. Safe to reassign.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Operational Reason Input */}
          <div className="flex flex-col gap-space-xs">
            <label className="font-eyebrow text-xs uppercase text-on-surface-variant font-bold">
              Official Reassignment Log Remark
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-10 px-3 bg-canvas-alabaster rounded-lg border border-border-control font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Surface drying protocol / referee court relocation"
            />
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div
              className={`p-3 rounded-lg text-xs font-bold ${
                feedback.success
                  ? 'bg-pitch-turf-surface text-status-success-emerald'
                  : 'bg-card-red-surface text-card-red-danger'
              }`}
            >
              {feedback.message}
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-end gap-space-sm pt-space-xs border-t border-border-grid">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={conflictResult.hasConflict || isSubmitting}
              className="btn-primary text-xs py-2 px-4 disabled:opacity-40 disabled:pointer-events-none"
            >
              {isSubmitting ? 'Verifying...' : `Confirm Reassignment to Court ${targetCourt}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
