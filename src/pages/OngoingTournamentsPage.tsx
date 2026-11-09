import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTournament } from '../context/TournamentContext';
import { useLanguage } from '../context/LanguageContext';
import { TournamentCard } from '../components/tournament/TournamentCard';
import { MatchPeriod } from '../types/match';
import {
  PlusCircle,
  Trophy,
  Play,
  CheckCircle,
  Clock,
  Radio,
  ChevronRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface OngoingTournamentsPageProps {
  onNavigate: (path: string) => void;
}

export const OngoingTournamentsPage: React.FC<OngoingTournamentsPageProps> = ({ onNavigate }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const {
    getUserTournaments,
    updateMatchPeriod,
    endMatch,
    reinstateMatch,
    endedMatchGraceMap,
    concludeTournament
  } = useTournament();

  const { ongoing } = getUserTournaments(currentUser);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>(
    ongoing[0]?.id || 'tournament-colombo-premier-2026'
  );
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Live timer tick for real-time grace countdown (only runs when active grace periods exist)
  const hasActiveGracePeriods = Object.keys(endedMatchGraceMap).length > 0;
  const [now, setNow] = useState(Date.now());
  React.useEffect(() => {
    if (!hasActiveGracePeriods) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [hasActiveGracePeriods]);

  const activeTournament = ongoing.find(t => t.id === selectedTournamentId) || ongoing[0];

  const handlePeriodChange = async (matchId: string, period: MatchPeriod) => {
    if (!activeTournament) return;
    await updateMatchPeriod(activeTournament.id, matchId, period);
    setActionFeedback(`Match period updated to ${period.replace('_', ' ')}`);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleEndMatch = async (matchId: string, homeTeam: string, awayTeam: string, score: string) => {
    if (!activeTournament) return;
    const ok = window.confirm(
      `Conclude and End Match?\n\n${homeTeam} vs ${awayTeam} (Final Score: ${score})\n\nThis will mark the match as COMPLETED (Full Time), finalize group standings, and advance qualified teams to the next round.`
    );
    if (ok) {
      const res = await endMatch(activeTournament.id, matchId);
      setActionFeedback(`${res.message} (Accidental reinstate available for 60s)`);
      setTimeout(() => setActionFeedback(null), 5000);
    }
  };

  const handleAccidentalReinstate = async (matchId: string, matchNumber: number) => {
    if (!activeTournament) return;
    const ok = window.confirm(
      `Reinstate Match #${matchNumber}?\n\nUse this ONLY if the final whistle was logged by accident.\n\nLive scoring, clock, and period controls will be restored immediately and group standings updated.`
    );
    if (ok) {
      const res = await reinstateMatch(activeTournament.id, matchId);
      setActionFeedback(res.message);
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  const handleConcludeTournament = async (tournamentId: string) => {
    const ok = window.confirm(
      'All matches including the Championship Grand Final are concluded!\n\nMove this tournament to the Ended Tournaments archive and generate final summary report?'
    );
    if (ok) {
      await concludeTournament(tournamentId);
      onNavigate(`/tournaments/${tournamentId}/summary`);
    }
  };

  const finalMatch = activeTournament?.matches.find(m => m.round === 'FINAL');
  const isFinalCompleted = finalMatch && (finalMatch.status === 'COMPLETED' || finalMatch.status === 'WALKOVER');

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Masthead */}
      <section className="w-full bg-floodlight-navy text-surface-card py-space-xl px-margin md:px-margin-md lg:px-margin-lg shadow-sm">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pitch-turf-surface text-status-success-emerald font-badge-label text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-status-success-emerald animate-pulse"></span>
                {t('ongoing.badge')}
              </span>
              <span className="font-badge-label text-xs text-text-placeholder">
                • {ongoing.length} {t('ongoing.activeEvents')}
              </span>
            </div>
            <h1 className="font-headline font-extrabold text-2xl md:text-3xl text-surface-card tracking-tight">
              {t('ongoing.title')}
            </h1>
            <p className="font-body text-sm text-text-placeholder mt-1 max-w-2xl">
              {t('ongoing.desc')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate(isAuthenticated ? '/tournaments/new/details' : '/login')}
            className="btn-primary py-2.5 px-5 text-sm font-bold shadow-md flex items-center gap-2 self-start md:self-auto font-button"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('ongoing.startTournament')}</span>
          </button>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg py-space-xl w-full flex flex-col gap-space-xl">
        {actionFeedback && (
          <div className="p-4 rounded-xl bg-pitch-turf-surface border border-status-success-emerald/30 text-status-success-emerald font-headline font-semibold text-sm flex items-center justify-between shadow-xs animate-fade">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>{actionFeedback}</span>
            </div>
          </div>
        )}

        {/* Operational Match Periods & Progression Desk */}
        {activeTournament && (
          <section className="bg-surface-card rounded-2xl border border-border-grid shadow-sm p-space-lg flex flex-col gap-space-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-space-sm border-b border-border-grid">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-live-orange animate-pulse"></span>
                  <h2 className="font-headline font-bold text-lg text-floodlight-navy">
                    {t('ongoing.periodsDeskTitle')}
                  </h2>
                </div>
                <p className="font-body text-xs text-text-muted mt-0.5">
                  {t('ongoing.periodsDeskDesc')}
                </p>
              </div>

              {/* Tournament Switcher if multiple ongoing */}
              {ongoing.length > 1 && (
                <div className="flex items-center gap-2">
                  <span className="font-badge-label text-xs text-text-muted">{t('ongoing.eventLabel')}</span>
                  <select
                    value={selectedTournamentId}
                    onChange={(e) => setSelectedTournamentId(e.target.value)}
                    className="h-8 px-2.5 rounded-lg border border-border-control font-button text-xs bg-canvas-alabaster"
                  >
                    {ongoing.map(t => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Grand Final Complete Banner */}
            {isFinalCompleted && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-surface-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-amber-300 shrink-0" />
                  <div>
                    <h3 className="font-headline font-bold text-base">
                      Championship Grand Final Concluded!
                    </h3>
                    <p className="font-body text-xs opacity-90">
                      All tournament matches are complete. Final champion and podium results are ready for archival.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleConcludeTournament(activeTournament.id)}
                  className="px-4 py-2 rounded-lg bg-surface-card text-floodlight-navy font-button text-xs font-bold hover:bg-slate-100 shadow-sm shrink-0 transition-colors"
                >
                  Conclude & View Summary Report →
                </button>
              </div>
            )}

            {/* Fixture Rows with Period State Controls */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-grid font-badge-label text-[11px] uppercase text-text-muted tracking-wider bg-canvas-alabaster">
                    <th className="py-2.5 px-3">{t('ongoing.thMatchNum')}</th>
                    <th className="py-2.5 px-3">{t('ongoing.thRoundCourt')}</th>
                    <th className="py-2.5 px-3">{t('ongoing.thTeams')}</th>
                    <th className="py-2.5 px-3">{t('ongoing.thScore')}</th>
                    <th className="py-2.5 px-3">{t('ongoing.thPeriod')}</th>
                    <th className="py-2.5 px-3 text-right">{t('ongoing.thActions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-grid font-body text-xs">
                  {activeTournament.matches.map((match) => {
                    const isLive = match.status === 'LIVE';
                    const isCompleted = match.status === 'COMPLETED' || match.currentHalf === 'FULL_TIME';
                    const isWalkover = match.status === 'WALKOVER';

                    return (
                      <tr key={match.id} className="hover:bg-canvas-alabaster/60 transition-colors">
                        <td className="py-3 px-3 font-badge-label font-bold text-text-muted">
                          #{match.matchNumber}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-headline font-semibold text-floodlight-navy">
                            {match.round.replace('_', ' ')}
                          </div>
                          <div className="font-body text-[11px] text-text-muted">
                            {match.courtName}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5 font-headline font-semibold text-floodlight-navy">
                            <span className={match.homeScore > match.awayScore && isCompleted ? 'text-primary font-bold' : ''}>
                              {match.homeTeamName || 'Team A'}
                            </span>
                            <span className="text-text-muted font-body font-normal">vs</span>
                            <span className={match.awayScore > match.homeScore && isCompleted ? 'text-primary font-bold' : ''}>
                              {match.awayTeamName || 'Team B'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          {isLive || isCompleted ? (
                            <span className="font-badge-label text-sm font-bold text-floodlight-navy px-2 py-0.5 rounded bg-surface-container">
                              {match.homeScore} – {match.awayScore}
                            </span>
                          ) : (
                            <span className="font-badge-label text-text-muted">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pitch-turf-surface text-status-success-emerald font-badge-label text-[11px] font-bold uppercase">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>{t('periods.endedFT')}</span>
                            </span>
                          ) : isWalkover ? (
                            <span className="px-2.5 py-1 rounded-full bg-red-100 text-card-red-danger font-badge-label text-[11px] font-bold uppercase">
                              Walkover (3-0)
                            </span>
                          ) : match.currentHalf === 'HALF_TIME' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-status-warning-amber font-badge-label text-[11px] font-bold uppercase border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-status-warning-amber animate-pulse"></span>
                              <span>{t('periods.halfTime')}</span>
                            </span>
                          ) : match.currentHalf === '2ND_HALF' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-live-orange font-badge-label text-[11px] font-bold uppercase border border-orange-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-live-orange animate-ping"></span>
                              <span>{t('periods.secondHalf')} ({match.currentMinute || "25'"})</span>
                            </span>
                          ) : match.currentHalf === 'EXTRA_TIME' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 font-badge-label text-[11px] font-bold uppercase border border-purple-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse"></span>
                              <span>{t('periods.extraTime')} ({match.currentMinute || "51'"})</span>
                            </span>
                          ) : match.status === 'LIVE' || match.currentHalf === '1ST_HALF' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-live-orange font-badge-label text-[11px] font-bold uppercase border border-orange-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-live-orange animate-pulse"></span>
                              <span>{t('periods.firstHalf')} ({match.currentMinute || "12'"})</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-surface-container font-badge-label text-[11px] text-text-muted font-bold uppercase">
                              {t('periods.upcoming')}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {/* Period Switcher Buttons */}
                            <div className="inline-flex rounded-lg border border-border-grid bg-canvas-alabaster p-0.5">
                              <button
                                type="button"
                                disabled={isCompleted || isWalkover}
                                onClick={() => handlePeriodChange(match.id, '1ST_HALF')}
                                className={`px-2 py-1 text-[11px] font-button font-bold rounded transition-colors ${
                                  isCompleted || isWalkover
                                    ? 'opacity-40 cursor-not-allowed text-text-muted'
                                    : match.currentHalf === '1ST_HALF' && !isCompleted
                                    ? 'bg-live-orange text-white shadow-xs'
                                    : 'text-floodlight-navy hover:bg-state-hover-gray'
                                }`}
                                title={isCompleted ? t('periods.endedFT') : t('ongoing.set1stHalf')}
                              >
                                {t('ongoing.set1stHalf')}
                              </button>
                              <button
                                type="button"
                                disabled={isCompleted || isWalkover}
                                onClick={() => handlePeriodChange(match.id, 'HALF_TIME')}
                                className={`px-2 py-1 text-[11px] font-button font-bold rounded transition-colors ${
                                  isCompleted || isWalkover
                                    ? 'opacity-40 cursor-not-allowed text-text-muted'
                                    : match.currentHalf === 'HALF_TIME'
                                    ? 'bg-status-warning-amber text-white shadow-xs'
                                    : 'text-floodlight-navy hover:bg-state-hover-gray'
                                }`}
                                title={isCompleted ? t('periods.endedFT') : t('ongoing.setHalfTime')}
                              >
                                {t('ongoing.setHalfTime')}
                              </button>
                              <button
                                type="button"
                                disabled={isCompleted || isWalkover}
                                onClick={() => handlePeriodChange(match.id, '2ND_HALF')}
                                className={`px-2 py-1 text-[11px] font-button font-bold rounded transition-colors ${
                                  isCompleted || isWalkover
                                    ? 'opacity-40 cursor-not-allowed text-text-muted'
                                    : match.currentHalf === '2ND_HALF' && !isCompleted
                                    ? 'bg-live-orange text-white shadow-xs'
                                    : 'text-floodlight-navy hover:bg-state-hover-gray'
                                }`}
                                title={isCompleted ? t('periods.endedFT') : t('ongoing.set2ndHalf')}
                              >
                                {t('ongoing.set2ndHalf')}
                              </button>
                              <button
                                type="button"
                                disabled={isCompleted || isWalkover}
                                onClick={() => handlePeriodChange(match.id, 'EXTRA_TIME')}
                                className={`px-2 py-1 text-[11px] font-button font-bold rounded transition-colors ${
                                  isCompleted || isWalkover
                                    ? 'opacity-40 cursor-not-allowed text-text-muted'
                                    : match.currentHalf === 'EXTRA_TIME' && !isCompleted
                                    ? 'bg-purple-600 text-white shadow-xs'
                                    : 'text-floodlight-navy hover:bg-state-hover-gray'
                                }`}
                                title={isCompleted ? t('periods.endedFT') : t('ongoing.setExtraTime')}
                              >
                                {t('ongoing.setExtraTime')}
                              </button>
                            </div>

                            {/* End Match / Accidental Reinstate Action */}
                            {!isCompleted && !isWalkover ? (
                              <button
                                type="button"
                                onClick={() => handleEndMatch(
                                  match.id,
                                  match.homeTeamName || 'Home',
                                  match.awayTeamName || 'Away',
                                  `${match.homeScore}-${match.awayScore}`
                                )}
                                className="px-2.5 py-1 rounded-lg bg-card-red-surface hover:bg-card-red-danger text-card-red-danger hover:text-surface-card border border-card-red-border font-button text-[11px] font-bold transition-all"
                              >
                                {t('ongoing.endMatchFT')}
                              </button>
                            ) : isCompleted ? (
                              (() => {
                                const graceEndTime = endedMatchGraceMap[match.id] || 0;
                                const secondsLeft = Math.max(0, Math.ceil((graceEndTime - now) / 1000));

                                if (secondsLeft > 0) {
                                  return (
                                    <button
                                      type="button"
                                      onClick={() => handleAccidentalReinstate(match.id, match.matchNumber)}
                                      className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-button text-[11px] font-bold flex items-center gap-1 animate-pulse shadow-xs"
                                      title={t('ongoing.reinstatePrompt')}
                                    >
                                      <AlertTriangle className="w-3 h-3 text-status-warning-amber" />
                                      <span>Reinstate ({secondsLeft}s)</span>
                                    </button>
                                  );
                                }

                                return (
                                  <span className="px-2 py-1 rounded bg-surface-container font-badge-label text-[11px] font-bold text-status-success-emerald">
                                    Sealed FT
                                  </span>
                                );
                              })()
                            ) : (
                              <span className="px-2 py-1 rounded bg-red-100 font-badge-label text-[11px] font-bold text-card-red-danger">
                                Walkover
                              </span>
                            )}

                            {/* Live Console Jump */}
                            <button
                              type="button"
                              onClick={() => onNavigate(`/tournaments/${activeTournament.id}/manage`)}
                              className="p-1.5 rounded-lg bg-surface-card text-primary hover:bg-pitch-turf-surface border border-border-grid transition-colors"
                              title="Open in Management Console"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Tournaments Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline font-bold text-xl text-floodlight-navy">
              {t('ongoing.cardsTitle')}
            </h2>
            <span className="font-badge-label text-xs text-text-muted">
              {ongoing.length} {t('ongoing.competitionsManaged')}
            </span>
          </div>

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
    </div>
  );
};
