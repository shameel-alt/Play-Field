import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTournament } from '../context/TournamentContext';
import { ShieldCheck, UserCheck, ArrowRight, Trophy } from 'lucide-react';

interface InviteAcceptPageProps {
  token: string;
  onNavigate: (path: string) => void;
}

export const InviteAcceptPage: React.FC<InviteAcceptPageProps> = ({ token, onNavigate }) => {
  const { currentUser, isAuthenticated, setPendingInvite } = useAuth();
  const { tournaments, addCoOrganizer } = useTournament();
  const [isAccepting, setIsAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  // Parse tournament ID from token or take default ongoing tournament
  const targetTournament = tournaments.find(t => token.includes(t.id.slice(-6))) || tournaments[0];

  useEffect(() => {
    if (!isAuthenticated) {
      setPendingInvite({ token, tournamentId: targetTournament.id });
    }
  }, [isAuthenticated, token, targetTournament, setPendingInvite]);

  const handleAccept = async () => {
    if (!currentUser) {
      onNavigate(`/login?inviteToken=${token}&tournamentId=${targetTournament.id}`);
      return;
    }

    setIsAccepting(true);
    await addCoOrganizer(targetTournament.id, {
      email: currentUser.email,
      name: currentUser.fullName,
      role: 'CO_ORGANIZER'
    });
    setIsAccepting(false);
    setAccepted(true);

    setTimeout(() => {
      onNavigate(`/tournaments/${targetTournament.id}/manage`);
    }, 1200);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface-card p-space-xl rounded-2xl border border-border-grid shadow-xl text-center flex flex-col items-center gap-space-lg animate-fade">
        <div className="w-16 h-16 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center shadow-md">
          <Trophy className="w-8 h-8 text-primary-fixed" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-pitch-turf-surface text-status-success-emerald font-mono text-xs font-bold uppercase tracking-wider">
            Delegation Invitation
          </span>
          <h2 className="font-headline font-extrabold text-2xl text-floodlight-navy mt-2">
            Join Tournament Organizing Desk
          </h2>
          <p className="font-body text-sm text-text-muted mt-1">
            You have been invited to co-manage: <strong>{targetTournament.title}</strong>.
          </p>
        </div>

        <div className="p-space-md rounded-xl bg-canvas-alabaster border border-border-grid text-xs text-text-muted text-left w-full space-y-1 font-mono">
          <div>Venue: Colombo Futsal Hub (Courts 1–5)</div>
          <div>Role: Co-Organizer & Match Scorer</div>
          <div>Status: Sanctioned SLFA Tier-1</div>
        </div>

        {accepted ? (
          <div className="p-space-md rounded-xl bg-pitch-turf-surface text-status-success-emerald font-headline font-bold text-sm w-full flex items-center justify-center gap-2">
            <UserCheck className="w-5 h-5" />
            <span>Delegation Accepted! Launching console...</span>
          </div>
        ) : (
          <button
            type="button"
            disabled={isAccepting}
            onClick={handleAccept}
            className="btn-primary w-full py-3.5 text-sm font-bold shadow-md flex items-center justify-center gap-2"
          >
            <span>{isAccepting ? 'Binding Permissions...' : isAuthenticated ? 'Accept Delegation & Enter Console' : 'Sign In to Accept Invitation'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
