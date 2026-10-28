import { toPng } from 'html-to-image';
import { Match } from '../types/match';
import { Tournament } from '../types/tournament';

/**
 * Renders the designated DOM container (#tournament-export-canvas)
 * into a crisp, high-resolution downloadable .png file.
 */
export async function exportTournamentSummaryAsPNG(
  elementId: string,
  filename: string = 'tournament-summary.png'
): Promise<boolean> {
  const node = document.getElementById(elementId);
  if (!node) {
    console.error(`Export container #${elementId} not found in DOM.`);
    return false;
  }

  try {
    const dataUrl = await toPng(node, {
      quality: 0.95,
      pixelRatio: 2, // High-DPI output for print / sharing
      backgroundColor: '#ffffff',
      cacheBust: true,
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
    return true;
  } catch (error) {
    console.error('Failed to generate PNG from DOM node:', error);
    return false;
  }
}

/**
 * Generates and downloads a CSV audit ledger of all matches, scores, and disciplinary logs.
 */
export function exportMatchesToCSV(tournament: Tournament, matches: Match[]): void {
  const headers = [
    'Match #',
    'Round',
    'Group',
    'Home Team',
    'Away Team',
    'Court',
    'Scheduled Time',
    'Status',
    'Home Score',
    'Away Score',
    'Notes'
  ];

  const rows = matches.map(m => [
    m.matchNumber,
    `"${m.round}"`,
    `"${m.groupName || ''}"`,
    `"${m.homeTeamName || m.homeTeamId}"`,
    `"${m.awayTeamName || m.awayTeamId}"`,
    `"${m.courtName}"`,
    `"${m.scheduledStart}"`,
    `"${m.status}"`,
    m.homeScore,
    m.awayScore,
    `"${(m.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${tournament.slug || 'tournament'}-audit-ledger.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
