import React from 'react';
import { TeamStanding } from '../../lib/standingsEngine';
import { Trophy, AlertCircle, Ban } from 'lucide-react';

interface StandingsTableProps {
  standings: TeamStanding[];
  groupName: string;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({ standings, groupName }) => {
  return (
    <div className="w-full bg-surface-card rounded-xl border border-border-grid shadow-sm overflow-hidden">
      {/* Table Header Strip */}
      <div className="px-space-lg py-space-md bg-surface-container-low border-b border-border-grid flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <span className="font-eyebrow text-eyebrow text-primary uppercase tracking-wider">
            Automated Standings
          </span>
          <span className="font-headline text-headline-sm text-floodlight-navy font-bold">
            {groupName} Radar
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-pitch-turf-surface text-status-success-emerald font-mono text-xs font-bold uppercase">
          FIFA Rules
        </span>
      </div>

      <div className="overflow-x-auto tactical-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-canvas-alabaster border-b border-border-grid font-eyebrow text-xs uppercase text-text-muted tracking-wider">
              <th className="py-3 px-4 w-12 text-center">Pos</th>
              <th className="py-3 px-4 min-w-[180px]">Team Squad</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3 text-center font-mono">P</th>
              <th className="py-3 px-3 text-center font-mono">W</th>
              <th className="py-3 px-3 text-center font-mono">D</th>
              <th className="py-3 px-3 text-center font-mono">L</th>
              <th className="py-3 px-3 text-center font-mono">GF</th>
              <th className="py-3 px-3 text-center font-mono">GA</th>
              <th className="py-3 px-3 text-center font-mono">GD</th>
              <th className="py-3 px-4 text-center font-mono font-bold text-floodlight-navy bg-surface-container-low">PTS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-grid font-body text-sm">
            {standings.map((team, idx) => {
              const isQualified = idx < 2 && team.status !== 'WALKOVER' && team.status !== 'DISQUALIFIED';
              const isWalkover = team.status === 'WALKOVER';
              const isDQ = team.status === 'DISQUALIFIED';

              return (
                <tr
                  key={team.id}
                  className={`hover:bg-state-hover-gray transition-colors ${
                    isQualified ? 'bg-pitch-turf-surface/30' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-center font-mono font-bold">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                        idx === 0
                          ? 'bg-status-warning-amber text-surface-card'
                          : idx === 1
                          ? 'bg-primary-container text-on-primary'
                          : 'bg-surface-container text-text-muted'
                      }`}
                    >
                      {team.rank || idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-space-sm">
                      <span
                        className="w-7 h-7 rounded-md text-surface-card font-mono text-xs font-bold flex items-center justify-center shadow-xs"
                        style={{ backgroundColor: team.kitColorPrimary || '#0D6E4F' }}
                      >
                        {team.shortCode}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-subheading font-bold text-floodlight-navy truncate">
                          {team.name}
                        </span>
                        {team.seed > 0 && (
                          <span className="font-mono text-[11px] text-text-muted">
                            Seed #{team.seed}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {isDQ ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-card-red-surface text-card-red-danger font-mono text-[10px] font-bold uppercase">
                        <Ban className="w-3 h-3" /> DQ
                      </span>
                    ) : isWalkover ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-50 text-status-warning-amber font-mono text-[10px] font-bold uppercase border border-yellow-200">
                        <AlertCircle className="w-3 h-3" /> W/O
                      </span>
                    ) : isQualified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pitch-turf-surface text-status-success-emerald font-mono text-[10px] font-bold uppercase border border-status-success-emerald/30">
                        <Trophy className="w-3 h-3" /> Qualified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-text-muted font-mono text-[10px] uppercase font-bold">
                        Playing
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-on-surface">{team.played}</td>
                  <td className="py-3 px-3 text-center font-mono text-status-success-emerald font-semibold">{team.won}</td>
                  <td className="py-3 px-3 text-center font-mono text-text-muted">{team.drawn}</td>
                  <td className="py-3 px-3 text-center font-mono text-card-red-danger">{team.lost}</td>
                  <td className="py-3 px-3 text-center font-mono text-on-surface">{team.goalsFor}</td>
                  <td className="py-3 px-3 text-center font-mono text-on-surface">{team.goalsAgainst}</td>
                  <td className="py-3 px-3 text-center font-mono font-semibold">
                    <span className={team.goalDifference > 0 ? 'text-status-success-emerald' : team.goalDifference < 0 ? 'text-card-red-danger' : 'text-text-muted'}>
                      {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-extrabold text-floodlight-navy text-base bg-surface-container-low/70">
                    {team.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-space-md py-2 bg-canvas-alabaster border-t border-border-grid flex items-center justify-between text-xs text-text-muted font-mono">
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-status-success-emerald inline-block"></span>
          Top 2 Advance to Knockout Semifinals
        </span>
        <span>Tiebreaker: Pts &gt; H2H &gt; GD &gt; GF</span>
      </div>
    </div>
  );
};
