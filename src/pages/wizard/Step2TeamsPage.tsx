import React, { useState } from 'react';
import { Team, Player, PlayerPosition } from '../../types/team';
import { generateTournamentFixtures } from '../../lib/tournamentEngine';
import { Plus, Trash2, ArrowRight, ArrowLeft, ShieldCheck, UserPlus, Trophy, Check } from 'lucide-react';

interface Step2TeamsPageProps {
  onNavigate: (path: string) => void;
  draftData: any;
  setDraftData: (data: any) => void;
}

const DEFAULT_TEAMS_SEED: Team[] = [
  {
    id: 'team-new-1',
    tournamentId: 'draft',
    name: 'Apex Warriors',
    shortCode: 'AW',
    groupName: 'Group A',
    seed: 1,
    kitColorPrimary: '#0D6E4F',
    kitColorAway: '#0B192C',
    status: 'ACTIVE',
    points: 0,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    players: [
      { id: 'p1', teamId: 'team-new-1', name: 'Tariq Al-Hassan', jerseyNumber: 9, position: 'Pivot', isCaptain: true },
      { id: 'p2', teamId: 'team-new-1', name: 'Kamil Rizvi', jerseyNumber: 10, position: 'Winger' },
      { id: 'p3', teamId: 'team-new-1', name: 'Sanjaya Silva', jerseyNumber: 4, position: 'Defender' },
      { id: 'p4', teamId: 'team-new-1', name: 'Roshan Senanayake', jerseyNumber: 1, position: 'Goalkeeper' },
      { id: 'p5', teamId: 'team-new-1', name: 'Mahela Jay', jerseyNumber: 3, position: 'Winger' }
    ]
  },
  {
    id: 'team-new-2',
    tournamentId: 'draft',
    name: 'Colombo Thunder FC',
    shortCode: 'CT',
    groupName: 'Group A',
    seed: 2,
    kitColorPrimary: '#EA580C',
    kitColorAway: '#1E3A8A',
    status: 'ACTIVE',
    points: 0,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    players: [
      { id: 'p6', teamId: 'team-new-2', name: 'Dimuth Perera', jerseyNumber: 7, position: 'Winger', isCaptain: true },
      { id: 'p7', teamId: 'team-new-2', name: 'Navin Fernando', jerseyNumber: 11, position: 'Pivot' },
      { id: 'p8', teamId: 'team-new-2', name: 'Ruwan Kumara', jerseyNumber: 8, position: 'Defender' },
      { id: 'p9', teamId: 'team-new-2', name: 'Asanka De Silva', jerseyNumber: 12, position: 'Goalkeeper' },
      { id: 'p10', teamId: 'team-new-2', name: 'Dinesh Wick', jerseyNumber: 5, position: 'Winger' }
    ]
  },
  {
    id: 'team-new-3',
    tournamentId: 'draft',
    name: 'Island Titans',
    shortCode: 'IT',
    groupName: 'Group B',
    seed: 1,
    kitColorPrimary: '#0284C7',
    kitColorAway: '#0F172A',
    status: 'ACTIVE',
    points: 0,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    players: [
      { id: 'p11', teamId: 'team-new-3', name: 'Farhan Zaidi', jerseyNumber: 10, position: 'Pivot', isCaptain: true },
      { id: 'p12', teamId: 'team-new-3', name: 'Pradeep Silva', jerseyNumber: 7, position: 'Winger' },
      { id: 'p13', teamId: 'team-new-3', name: 'Isuru Udana', jerseyNumber: 3, position: 'Defender' },
      { id: 'p14', teamId: 'team-new-3', name: 'Nuwan Kulasekara', jerseyNumber: 1, position: 'Goalkeeper' },
      { id: 'p15', teamId: 'team-new-3', name: 'Kusal Mendis', jerseyNumber: 9, position: 'Winger' }
    ]
  },
  {
    id: 'team-new-4',
    tournamentId: 'draft',
    name: 'Havelock United',
    shortCode: 'HU',
    groupName: 'Group B',
    seed: 2,
    kitColorPrimary: '#7C3AED',
    kitColorAway: '#FFFFFF',
    status: 'ACTIVE',
    points: 0,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    players: [
      { id: 'p16', teamId: 'team-new-4', name: 'Sadeera Samarawickrama', jerseyNumber: 9, position: 'Pivot', isCaptain: true },
      { id: 'p17', teamId: 'team-new-4', name: 'Dasun Shanaka', jerseyNumber: 8, position: 'Defender' },
      { id: 'p18', teamId: 'team-new-4', name: 'Wanindu Hasaranga', jerseyNumber: 4, position: 'Winger' },
      { id: 'p19', teamId: 'team-new-4', name: 'Dushmantha Chameera', jerseyNumber: 1, position: 'Goalkeeper' },
      { id: 'p20', teamId: 'team-new-4', name: 'Charith Asalanka', jerseyNumber: 7, position: 'Winger' }
    ]
  }
];

export const Step2TeamsPage: React.FC<Step2TeamsPageProps> = ({
  onNavigate,
  draftData,
  setDraftData
}) => {
  const [teams, setTeams] = useState<Team[]>(draftData?.teams || DEFAULT_TEAMS_SEED);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || 'team-new-1');

  // Player input sub-state
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newJerseyNumber, setNewJerseyNumber] = useState<number>(10);
  const [newPosition, setNewPosition] = useState<PlayerPosition>('Pivot');

  const selectedTeam = teams.find(t => t.id === selectedTeamId) || teams[0];

  const handleAddTeam = () => {
    const newId = `team-new-${Date.now()}`;
    const count = teams.length + 1;
    const group = count % 2 === 1 ? 'Group A' : 'Group B';

    const newTeam: Team = {
      id: newId,
      tournamentId: 'draft',
      name: `Squad ${count} FC`,
      shortCode: `S${count}`,
      groupName: group,
      seed: 0,
      kitColorPrimary: '#0D6E4F',
      kitColorAway: '#0B192C',
      status: 'ACTIVE',
      points: 0,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      players: [
        { id: `p-${newId}-1`, teamId: newId, name: 'Team Captain', jerseyNumber: 10, position: 'Pivot', isCaptain: true },
        { id: `p-${newId}-2`, teamId: newId, name: 'Goal Keeper', jerseyNumber: 1, position: 'Goalkeeper' },
        { id: `p-${newId}-3`, teamId: newId, name: 'Anchor Defender', jerseyNumber: 4, position: 'Defender' },
        { id: `p-${newId}-4`, teamId: newId, name: 'Left Winger', jerseyNumber: 7, position: 'Winger' },
        { id: `p-${newId}-5`, teamId: newId, name: 'Right Winger', jerseyNumber: 11, position: 'Winger' }
      ]
    };

    setTeams(prev => [...prev, newTeam]);
    setSelectedTeamId(newId);
  };

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    const newPlayer: Player = {
      id: `p-${Date.now()}`,
      teamId: selectedTeam.id,
      name: newPlayerName.trim(),
      jerseyNumber: newJerseyNumber,
      position: newPosition
    };

    setTeams(prev => prev.map(t => {
      if (t.id !== selectedTeam.id) return t;
      return {
        ...t,
        players: [...t.players, newPlayer]
      };
    }));

    setNewPlayerName('');
    setNewJerseyNumber(prev => prev + 1);
  };

  const handleDeletePlayer = (playerId: string) => {
    setTeams(prev => prev.map(t => {
      if (t.id !== selectedTeam.id) return t;
      return {
        ...t,
        players: t.players.filter(p => p.id !== playerId)
      };
    }));
  };

  const handleNext = () => {
    if (teams.length < 2) {
      alert('Please configure at least 2 teams to generate fixtures.');
      return;
    }

    // Automatically generate tournament fixtures via Algorithmic Berger engine
    const selectedCourts = draftData?.selectedCourtNumbers || [1, 2, 5];
    const generatedMatches = generateTournamentFixtures(
      draftData?.id || 'tournament-draft',
      teams,
      selectedCourts,
      draftData?.startDate || '2026-11-15',
      draftData?.startTime || '08:00'
    );

    const updated = {
      ...draftData,
      teams,
      matches: generatedMatches
    };

    setDraftData(updated);
    onNavigate('/tournaments/new/confirm');
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Wizard Stepper Bar */}
      <section className="w-full bg-surface-card border-b border-border-grid py-space-md shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm">
            <div className="flex items-center gap-space-sm p-space-sm rounded-xl bg-surface-container-low text-status-success-emerald">
              <Check className="w-5 h-5 text-status-success-emerald" />
              <div className="flex flex-col min-w-0">
                <span className="font-eyebrow text-[10px] uppercase font-bold tracking-wider">Step 01 • Passed</span>
                <span className="font-subheading text-xs truncate font-semibold text-on-surface">Event & Venue</span>
              </div>
            </div>
            <div className="flex items-center gap-space-sm p-space-sm rounded-xl bg-pitch-turf-surface text-primary border border-primary-container/20">
              <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-mono text-xs font-bold">2</div>
              <div className="flex flex-col min-w-0">
                <span className="font-eyebrow text-[10px] uppercase font-bold text-primary tracking-wider">Step 02 • Active</span>
                <span className="font-subheading text-xs truncate font-bold text-pitch-turf-active">Teams & Rosters</span>
              </div>
            </div>
            <div className="flex items-center gap-space-sm p-space-sm rounded-xl bg-surface-container-low text-text-muted">
              <div className="w-6 h-6 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-mono text-xs font-bold">3</div>
              <div className="flex flex-col min-w-0">
                <span className="font-eyebrow text-[10px] uppercase font-bold text-text-muted">Draw & Brackets</span>
                <span className="font-subheading text-xs truncate font-semibold">Structure Confirmation</span>
              </div>
            </div>
            <div className="flex items-center gap-space-sm p-space-sm rounded-xl bg-surface-container-low text-text-muted">
              <div className="w-6 h-6 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-mono text-xs font-bold">4</div>
              <div className="flex flex-col min-w-0">
                <span className="font-eyebrow text-[10px] uppercase font-bold text-text-muted">Fiscal Lock</span>
                <span className="font-subheading text-xs truncate font-semibold">Payment & Publish</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Split Builder Workspace */}
      <div className="max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg py-space-xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
          {/* Left Panel: Teams & Groups Registry (5 cols) */}
          <section className="lg:col-span-5 flex flex-col gap-space-md bg-surface-card rounded-2xl border border-border-grid p-space-lg shadow-sm">
            <div className="flex items-center justify-between pb-space-sm border-b border-border-grid">
              <div>
                <span className="font-eyebrow text-xs uppercase text-text-muted">Registry Roster</span>
                <h2 className="font-headline font-bold text-lg text-floodlight-navy flex items-center gap-2">
                  <span>Participating Squads</span>
                  <span className="px-2 py-0.5 rounded-full bg-floodlight-navy text-surface-card font-mono text-xs">
                    {teams.length} Squads
                  </span>
                </h2>
              </div>
              <button
                type="button"
                onClick={handleAddTeam}
                className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Team</span>
              </button>
            </div>

            {/* Team Stack List */}
            <div className="flex flex-col gap-space-sm max-h-[540px] overflow-y-auto tactical-scrollbar pr-1">
              {teams.map((team) => {
                const isSelected = team.id === selectedTeamId;
                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => setSelectedTeamId(team.id)}
                    className={`p-space-md rounded-xl text-left border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-pitch-turf-surface border-primary-container ring-1 ring-primary-container shadow-xs'
                        : 'bg-canvas-alabaster border-border-grid hover:bg-state-hover-gray'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg text-surface-card font-headline font-bold flex items-center justify-center shadow-xs"
                        style={{ backgroundColor: team.kitColorPrimary || '#0D6E4F' }}
                      >
                        {team.shortCode}
                      </div>
                      <div>
                        <div className="font-subheading font-bold text-floodlight-navy text-sm">
                          {team.name}
                        </div>
                        <div className="flex items-center gap-2 text-text-muted font-mono text-[11px] mt-0.5">
                          <span className="px-1.5 py-0.2 rounded bg-surface-container font-bold text-floodlight-navy">
                            {team.groupName}
                          </span>
                          <span>•</span>
                          <span>{team.players.length} Players</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border border-border-grid shadow-inner" style={{ backgroundColor: team.kitColorPrimary }} />
                      <span className="w-3.5 h-3.5 rounded-full border border-border-grid shadow-inner" style={{ backgroundColor: team.kitColorAway }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Right Panel: Selected Team Active Roster Builder (7 cols) */}
          <section className="lg:col-span-7 flex flex-col gap-space-lg">
            {selectedTeam && (
              <div className="bg-surface-card rounded-2xl border border-border-grid p-space-lg shadow-sm flex flex-col gap-space-md">
                {/* Team Profile Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-md border-b border-border-grid">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-xl text-surface-card font-headline text-2xl font-extrabold flex items-center justify-center shadow-md"
                      style={{ backgroundColor: selectedTeam.kitColorPrimary }}
                    >
                      {selectedTeam.shortCode}
                    </div>
                    <div>
                      <input
                        type="text"
                        value={selectedTeam.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTeams(prev => prev.map(t => t.id === selectedTeam.id ? { ...t, name: val } : t));
                        }}
                        className="font-headline font-bold text-xl text-floodlight-navy bg-transparent border-b border-border-grid focus:border-primary focus:outline-none"
                      />
                      <div className="flex items-center gap-2 text-text-muted font-mono text-xs mt-1">
                        <select
                          value={selectedTeam.groupName}
                          onChange={(e) => {
                            const grp = e.target.value;
                            setTeams(prev => prev.map(t => t.id === selectedTeam.id ? { ...t, groupName: grp } : t));
                          }}
                          className="bg-surface-container px-2 py-0.5 rounded font-bold text-floodlight-navy focus:outline-none"
                        >
                          <option value="Group A">Group A</option>
                          <option value="Group B">Group B</option>
                          <option value="Group C">Group C</option>
                          <option value="Group D">Group D</option>
                        </select>
                        <span>•</span>
                        <span>Seed #{selectedTeam.seed || 1}</span>
                      </div>
                    </div>
                  </div>

                  {/* Eligibility check badge */}
                  <div className="flex items-center gap-2 text-xs font-mono">
                    {selectedTeam.players.length >= 5 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pitch-turf-surface text-status-success-emerald font-bold border border-status-success-emerald/30">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Eligible (Min 5)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-status-warning-amber font-bold border border-amber-200">
                        Incomplete ({selectedTeam.players.length}/5)
                      </span>
                    )}
                  </div>
                </div>

                {/* Player Roster Table */}
                <div className="flex flex-col gap-2">
                  <h4 className="font-eyebrow text-xs uppercase text-text-muted font-bold">
                    Official Squad Athletes ({selectedTeam.players.length})
                  </h4>

                  <div className="divide-y divide-border-grid border border-border-grid rounded-xl overflow-hidden font-body text-sm bg-canvas-alabaster">
                    {selectedTeam.players.map((p) => (
                      <div key={p.id} className="p-space-sm px-space-md flex items-center justify-between bg-surface-card hover:bg-state-hover-gray">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-surface-container font-mono text-xs font-bold text-floodlight-navy flex items-center justify-center">
                            #{p.jerseyNumber}
                          </span>
                          <span className="font-subheading font-bold text-floodlight-navy">
                            {p.name} {p.isCaptain && <span className="text-status-warning-amber text-xs font-mono font-bold">(C)</span>}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-text-muted bg-surface-container-low px-2 py-0.5 rounded">
                            {p.position}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeletePlayer(p.id)}
                            className="text-card-red-danger hover:text-card-red-hover p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Athlete Inline Form */}
                <form onSubmit={handleAddPlayer} className="p-space-md bg-canvas-alabaster rounded-xl border border-border-grid flex flex-col sm:flex-row sm:items-end gap-3">
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="font-eyebrow text-xs uppercase text-text-muted">Player Full Name</label>
                    <input
                      type="text"
                      required
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      placeholder="e.g. Tariq Al-Hassan"
                      className="h-10 px-3 bg-surface-card rounded-lg border border-border-control font-body text-sm focus:outline-none"
                    />
                  </div>

                  <div className="w-24 flex flex-col gap-1">
                    <label className="font-eyebrow text-xs uppercase text-text-muted">Jersey #</label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={newJerseyNumber}
                      onChange={(e) => setNewJerseyNumber(parseInt(e.target.value) || 1)}
                      className="h-10 px-2 bg-surface-card rounded-lg border border-border-control font-mono text-sm text-center focus:outline-none"
                    />
                  </div>

                  <div className="w-32 flex flex-col gap-1">
                    <label className="font-eyebrow text-xs uppercase text-text-muted">Position</label>
                    <select
                      value={newPosition}
                      onChange={(e) => setNewPosition(e.target.value as PlayerPosition)}
                      className="h-10 px-2 bg-surface-card rounded-lg border border-border-control font-body text-xs focus:outline-none"
                    >
                      <option value="Pivot">Pivot</option>
                      <option value="Winger">Winger</option>
                      <option value="Defender">Defender</option>
                      <option value="Goalkeeper">Goalkeeper</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary h-10 px-4 text-xs font-bold"
                  >
                    + Add
                  </button>
                </form>
              </div>
            )}

            {/* Bottom Navigation Deck */}
            <div className="flex items-center justify-between pt-space-xs">
              <button
                type="button"
                onClick={() => onNavigate('/tournaments/new/details')}
                className="btn-secondary text-sm py-2.5 px-5 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Venue & Details</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="btn-primary text-sm py-3 px-6 shadow-md flex items-center gap-2"
              >
                <span>Generate Draw & Fixtures (Step 3)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
