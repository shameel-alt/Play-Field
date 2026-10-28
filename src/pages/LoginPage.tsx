import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTournament } from '../context/TournamentContext';
import { Trophy, ShieldCheck, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, pendingInvite, clearPendingInvite } = useAuth();
  const { addCoOrganizer } = useTournament();
  const [email, setEmail] = useState('shameel.organizer@playfield.lk');
  const [password, setPassword] = useState('demo1234');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await login(email, password);

    // If an invite was pending, attach this user as Co-Organizer and route to management console
    if (pendingInvite) {
      await addCoOrganizer(pendingInvite.tournamentId, {
        email,
        name: email.split('@')[0],
        role: 'CO_ORGANIZER'
      });
      const targetTournament = pendingInvite.tournamentId;
      clearPendingInvite();
      setIsSubmitting(false);
      onNavigate(`/tournaments/${targetTournament}/manage`);
      return;
    }

    setIsSubmitting(false);
    onNavigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-surface-card p-space-xl rounded-2xl border border-border-grid shadow-xl flex flex-col gap-space-lg">
        {/* Header */}
        <div className="text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold text-xl shadow-sm mb-3">
            <Trophy className="w-6 h-6 text-primary-fixed" />
          </div>
          <h2 className="font-headline font-extrabold text-2xl text-floodlight-navy">
            Sign In to Play Field
          </h2>
          <p className="font-body text-sm text-text-muted mt-1">
            Tournament Management & Broadcast Control Desk
          </p>
        </div>

        {/* Co-Organizer Invitation Guard Banner */}
        {pendingInvite && (
          <div className="p-space-md rounded-xl bg-status-warning-amber/15 border border-status-warning-amber/40 flex items-start gap-3 text-amber-900 text-xs">
            <AlertCircle className="w-5 h-5 text-status-warning-amber shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-headline font-bold text-xs uppercase tracking-wide">
                Co-Organizer Invitation Active
              </span>
              <p className="mt-0.5">
                Sign in below to verify credentials and bind your account to Tournament ID: <strong>{pendingInvite.tournamentId}</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <label className="font-eyebrow text-xs uppercase text-on-surface-variant font-bold">
              Organizer Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-text-placeholder absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="organizer@playfield.lk"
                className="w-full h-11 pl-9 pr-3 bg-canvas-alabaster rounded-lg border border-border-control font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-space-xs">
            <label className="font-eyebrow text-xs uppercase text-on-surface-variant font-bold">
              Access Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-text-placeholder absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-9 pr-3 bg-canvas-alabaster rounded-lg border border-border-control font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full h-11 text-sm font-bold shadow-md mt-2 flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Operations Desk'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-space-sm border-t border-border-grid text-center text-xs font-body text-text-muted">
          <span>Need a new tournament director account? </span>
          <button
            type="button"
            onClick={() => onNavigate('/signup')}
            className="text-primary font-bold hover:underline"
          >
            Sign Up Here
          </button>
        </div>
      </div>
    </div>
  );
};
