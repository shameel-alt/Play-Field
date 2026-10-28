import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTournament } from '../context/TournamentContext';
import { TournamentExportCanvas } from '../components/tournament/TournamentExportCanvas';
import { exportTournamentSummaryAsPNG, exportMatchesToCSV } from '../lib/exportEngine';
import { Trophy, Download, FileSpreadsheet, ShieldCheck, CheckCircle2, Award, Calendar, MapPin, ArrowRight } from 'lucide-react';

interface EndedTournamentsPageProps {
  onNavigate: (path: string) => void;
  selectedTournamentId?: string;
}

export const EndedTournamentsPage: React.FC<EndedTournamentsPageProps> = ({
  onNavigate,
  selectedTournamentId
}) => {
  const { currentUser } = useAuth();
  const { getUserTournaments, tournaments } = useTournament();
  const { ended } = getUserTournaments(currentUser);

  // If a specific ID is selected, or default to first ended tournament
  const activeEndedTournament = tournaments.find(t => t.id === selectedTournamentId) ||
                               ended[0] ||
                               tournaments.find(t => t.status === 'ENDED') ||
                               tournaments[1];

  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleDownloadPNG = async () => {
    if (!activeEndedTournament) return;
    setIsExporting(true);
    setToastMessage('Compiling high-resolution graphic summary (.PNG)...');

    const success = await exportTournamentSummaryAsPNG(
      'tournament-export-canvas',
      `${activeEndedTournament.slug || 'tournament'}-summary.png`
    );

    setIsExporting(false);
    if (success) {
      setToastMessage('Summary graphic downloaded successfully as PNG!');
    } else {
      setToastMessage('Download initiated. Canvas compiled.');
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportCSV = () => {
    if (!activeEndedTournament) return;
    exportMatchesToCSV(activeEndedTournament, activeEndedTournament.matches);
    setToastMessage('CSV Audit Ledger downloaded successfully.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Command Masthead */}
      <section className="w-full bg-floodlight-navy text-surface-card py-space-xl px-margin md:px-margin-md lg:px-margin-lg shadow-sm border-b border-floodlight-navy/80">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
          <div className="flex flex-col gap-space-xs max-w-3xl">
            <div className="flex items-center gap-space-sm">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-container text-primary-fixed font-mono text-xs font-bold uppercase tracking-widest border border-primary-container">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success-emerald"></span>
                SLFA Certified Archive
              </span>
              <span className="text-text-placeholder font-mono text-xs">
                ARCHIVE ID: #{activeEndedTournament?.slug?.toUpperCase() || 'CCF-2026-ARCHIVE'}
              </span>
            </div>
            <h1 className="font-headline font-extrabold text-2xl md:text-3xl text-surface-card tracking-tight">
              Concluded Tournaments & Historical Archive
            </h1>
            <p className="font-body text-sm text-text-placeholder">
              Official verified tournament archives, podium finishes, fair-play audit logs, and exportable high-res matchday certificates.
            </p>
          </div>

          {/* Action Cluster (Download PNG & CSV) */}
          <div className="flex flex-wrap items-center gap-space-md">
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadPNG}
              className="btn-primary py-2.5 px-5 text-sm font-bold shadow-md flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating PNG...' : 'Download Stats & Events (.PNG)'}</span>
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="btn-secondary py-2.5 px-4 text-sm font-semibold flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export CSV Audit Ledger</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg py-space-xl w-full flex flex-col gap-space-xl">
        {toastMessage && (
          <div className="p-space-md rounded-xl bg-pitch-turf-surface border border-status-success-emerald/30 text-status-success-emerald font-headline font-bold text-sm flex items-center gap-2 animate-fade shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
        )}

        {activeEndedTournament ? (
          <>
            {/* Visual Screen Representation */}
            <div className="flex flex-col gap-space-lg">
              <div className="flex items-center justify-between pb-2 border-b border-border-grid">
                <div>
                  <span className="font-eyebrow text-xs uppercase text-text-muted font-bold">
                    Official Post-Tournament Report
                  </span>
                  <h2 className="font-headline font-extrabold text-xl text-floodlight-navy">
                    {activeEndedTournament.title} Podium & Summary
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-pitch-turf-surface text-status-success-emerald font-mono text-xs font-bold uppercase">
                  Confirmed Standings
                </span>
              </div>

              {/* High-Resolution Printable / Downloadable DOM Canvas (renders on page & exports via html-to-image) */}
              <div className="w-full overflow-x-auto tactical-scrollbar pb-4">
                <TournamentExportCanvas tournament={activeEndedTournament} />
              </div>
            </div>
          </>
        ) : (
          <div className="p-12 text-center text-text-muted bg-surface-card rounded-2xl border border-border-grid">
            No concluded tournaments currently archived.
          </div>
        )}
      </div>
    </div>
  );
};
