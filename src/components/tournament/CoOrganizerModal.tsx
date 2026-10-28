import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { CoOrganizer } from '../../types/user';
import { X, UserPlus, Copy, Check, ShieldCheck, Mail } from 'lucide-react';

interface CoOrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentId: string;
}

export const CoOrganizerModal: React.FC<CoOrganizerModalProps> = ({
  isOpen,
  onClose,
  tournamentId
}) => {
  const { addCoOrganizer } = useTournament();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'CO_ORGANIZER' | 'SCORER' | 'TIMEKEEPER'>('SCORER');
  const [copied, setCopied] = useState(false);
  const [invited, setInvited] = useState(false);

  if (!isOpen) return null;

  const generatedToken = `INV-${tournamentId.slice(-6)}-${Date.now().toString().slice(-4)}`;
  const inviteUrl = `${window.location.origin}/#/signup?inviteToken=${generatedToken}&tournamentId=${tournamentId}`;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const newOrganizer: CoOrganizer = {
      email,
      name: email.split('@')[0],
      role
    };

    await addCoOrganizer(tournamentId, newOrganizer);
    setInvited(true);
    setTimeout(() => {
      setInvited(false);
      setEmail('');
      onClose();
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-surface-card rounded-2xl shadow-2xl border border-border-grid overflow-hidden animate-fade">
        <div className="px-space-lg py-space-md bg-floodlight-navy text-surface-card flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary-fixed" />
            <h3 className="font-headline font-bold text-headline-sm text-surface-card">
              Add Organizing Member
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-text-placeholder hover:text-surface-card hover:bg-surface-card/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleInvite} className="p-space-lg flex flex-col gap-space-lg">
          {/* Security Notice Pill */}
          <div className="p-space-sm rounded-xl bg-status-warning-amber/15 border border-status-warning-amber/30 flex items-start gap-2.5 text-xs text-amber-900 leading-snug">
            <ShieldCheck className="w-4 h-4 text-status-warning-amber shrink-0 mt-0.5" />
            <span>
              <strong>Security Protocol:</strong> Invited organizers will be required to Sign In or Sign Up before receiving live scoring permissions.
            </span>
          </div>

          {/* Email input */}
          <div className="flex flex-col gap-space-xs">
            <label className="font-eyebrow text-xs uppercase text-on-surface-variant font-bold">
              Organizing Member Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-text-placeholder absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="scorer@arena.lk"
                className="w-full h-10 pl-9 pr-3 bg-canvas-alabaster rounded-lg border border-border-control font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Role selector */}
          <div className="flex flex-col gap-space-xs">
            <label className="font-eyebrow text-xs uppercase text-on-surface-variant font-bold">
              Operational Role Authority
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full h-10 px-3 bg-canvas-alabaster rounded-lg border border-border-control font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="SCORER">Match Scorer (Score Stepper & Events)</option>
              <option value="TIMEKEEPER">Tournament Timekeeper</option>
              <option value="CO_ORGANIZER">Full Co-Organizer (Court Reassignment & DQ)</option>
            </select>
          </div>

          {/* Invite URL Copy Widget */}
          <div className="flex flex-col gap-space-xs">
            <label className="font-eyebrow text-xs uppercase text-text-muted">
              Or Share Invitation Deep-Link
            </label>
            <div className="p-space-xs bg-canvas-alabaster rounded-lg border border-border-grid flex items-center justify-between gap-2">
              <input
                type="text"
                readOnly
                value={inviteUrl}
                className="bg-transparent text-xs font-mono text-text-muted truncate w-full focus:outline-none px-2 select-all"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-status-success-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {invited && (
            <div className="p-2.5 rounded-lg bg-pitch-turf-surface text-status-success-emerald font-bold text-xs text-center">
              Organizing Member Attached Successfully!
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-end gap-space-sm pt-space-xs border-t border-border-grid">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs py-2 px-4"
            >
              Close
            </button>
            <button
              type="submit"
              className="btn-primary text-xs py-2 px-4"
            >
              + Send Delegation Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
