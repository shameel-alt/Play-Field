import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTournament } from '../context/TournamentContext';
import { TournamentCard } from '../components/tournament/TournamentCard';
import { PlusCircle, ArrowLeft, Trophy } from 'lucide-react';

interface OngoingTournamentsPageProps {
  onNavigate: (path: string) => void;
}

export const OngoingTournamentsPage: React.FC<OngoingTournamentsPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { getUserTournaments } = useTournament();

  const { ongoing } = getUserTournaments(currentUser);

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Masthead */}
      <section className="w-full bg-floodlight-navy text-surface-card py-space-xl px-margin md:px-margin-md lg:px-margin-lg shadow-sm">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pitch-turf-surface text-status-success-emerald font-mono text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-status-success-emerald animate-pulse"></span>
                Active Matchday Control
              </span>
              <span className="font-mono text-xs text-text-placeholder">
                • {ongoing.length} Active Events
              </span>
            </div>
            <h1 className="font-headline font-extrabold text-2xl md:text-3xl text-surface-card tracking-tight">
              Current Ongoing Tournaments
            </h1>
            <p className="font-body text-sm text-text-placeholder mt-1 max-w-2xl">
              Real-time operational consoles for your scheduled competitions. Update live scores, log goalscorers, reallocate courts, and enforce disciplinary directives.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/tournaments/new/details')}
            className="btn-primary py-2.5 px-5 text-sm font-bold shadow-md flex items-center gap-2 self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Start Tournament</span>
          </button>
        </div>
      </section>

      {/* Tournaments Grid */}
      <div className="max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg py-space-xl w-full">
        {ongoing.length === 0 ? (
          <div className="p-12 text-center bg-surface-card rounded-2xl border border-border-grid flex flex-col items-center gap-3">
            <Trophy className="w-10 h-10 text-text-placeholder" />
            <span className="font-headline font-bold text-lg text-floodlight-navy">
              No Active Tournaments Found
            </span>
            <p className="font-body text-sm text-text-muted">
              You do not have any ongoing competitions registered under your organizer profile yet.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/tournaments/new/details')}
              className="btn-primary mt-2 text-xs py-2 px-4"
            >
              Start New Tournament
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-lg">
            {ongoing.map(tournament => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                onManage={(id) => onNavigate(`/tournaments/${id}/manage`)}
                onViewPublic={(id) => onNavigate(`/public/tournament/${id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
