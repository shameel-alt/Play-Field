import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTournament } from '../context/TournamentContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { Trophy, ShieldCheck, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, pendingInvite, clearPendingInvite } = useAuth();
  const { addCoOrganizer } = useTournament();
  const { t } = useLanguage();
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
      <div className="max-w-md w-full bg-surface-card p-space-xl rounded-2xl border border-border-grid shadow-xl flex flex-col gap-space-lg relative">
        {/* Language Selector Top-Right */}
        <div className="flex justify-end w-full mb-[-12px]">
          <LanguageSelector variant="light" />
        </div>

        {/* Header */}
        <div className="text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold text-xl shadow-sm mb-3">
            <Trophy className="w-6 h-6 text-primary-fixed" />
          </div>
          <h2 className="font-headline font-extrabold text-2xl text-floodlight-navy">
            {t('auth.signInTitle')}
          </h2>
          <p className="font-body text-sm text-text-muted mt-1">
            {t('auth.signInSubtitle')}
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
            <label htmlFor="login-email" className="font-eyebrow text-xs uppercase text-on-surface-variant font-bold">
              {t('auth.emailLabel')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-text-placeholder absolute left-3 top-3.5" />
              <input
                id="login-email"
                name="email"
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
            <label htmlFor="login-password" className="font-eyebrow text-xs uppercase text-on-surface-variant font-bold">
              {t('auth.passwordLabel')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-text-placeholder absolute left-3 top-3.5" />
              <input
                id="login-password"
                name="password"
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
            <span>{isSubmitting ? 'Authenticating...' : t('auth.signInBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-space-sm border-t border-border-grid text-center text-xs font-body text-text-muted">
          <span>{t('auth.needAccount')}</span>
          <button
            type="button"
            onClick={() => onNavigate('/signup')}
            className="text-primary font-bold hover:underline"
          >
            {t('auth.signUpLink')}
          </button>
        </div>
      </div>
    </div>
  );
};
