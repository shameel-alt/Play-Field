import { Team } from '../types/team';
import { Match, MatchRound } from '../types/match';

/**
 * Berger Round-Robin Fixture Generation Algorithm
 * Generates fair pairings where every team in a group plays every other team once.
 */
export function generateRoundRobinPairings(teams: Team[]): Array<{ homeTeam: Team; awayTeam: Team; roundIndex: number }> {
  if (teams.length < 2) return [];

  const teamList = [...teams];
  // If odd number of teams, add a dummy bye team
  const hasDummy = teamList.length % 2 !== 0;
  if (hasDummy) {
    teamList.push({ id: '__BYE__', name: 'BYE' } as Team);
  }

  const numTeams = teamList.length;
  const numRounds = numTeams - 1;
  const half = numTeams / 2;
  const pairings: Array<{ homeTeam: Team; awayTeam: Team; roundIndex: number }> = [];

  const currentTeams = [...teamList];

  for (let round = 0; round < numRounds; round++) {
    for (let i = 0; i < half; i++) {
      const home = currentTeams[i];
      const away = currentTeams[numTeams - 1 - i];

      if (home.id !== '__BYE__' && away.id !== '__BYE__') {
        // Alternate home/away to ensure fairness
        if (round % 2 === 1) {
          pairings.push({ homeTeam: away, awayTeam: home, roundIndex: round + 1 });
        } else {
          pairings.push({ homeTeam: home, awayTeam: away, roundIndex: round + 1 });
        }
      }
    }

    // Rotate array keeping team 0 fixed (Berger rotation)
    const fixed = currentTeams[0];
    const rotating = currentTeams.slice(1);
    rotating.unshift(rotating.pop()!);
    currentTeams.splice(0, currentTeams.length, fixed, ...rotating);
  }

  return pairings;
}

/**
 * Allocates timeslots and courts to pairings without intra-tournament collision
 */
export function generateTournamentFixtures(
  tournamentId: string,
  teams: Team[],
  selectedCourts: number[],
  startDateStr: string,
  startTimeStr: string = '09:00',
  matchDurationMinutes: number = 45,
  restBufferMinutes: number = 15
): Match[] {
  const matches: Match[] = [];
  const slotMinutes = matchDurationMinutes + restBufferMinutes;
  let matchCounter = 1;

  // Group teams by their group name (e.g. Group A, Group B)
  const groupMap = new Map<string, Team[]>();
  teams.forEach(team => {
    const grp = team.groupName || 'Group A';
    if (!groupMap.has(grp)) groupMap.set(grp, []);
    groupMap.get(grp)!.push(team);
  });

  const baseDate = new Date(`${startDateStr}T${startTimeStr}:00`);
  let currentSlotOffset = 0;
  let courtIndex = 0;

  // Generate Group Stage Matches
  for (const [groupName, groupTeams] of groupMap.entries()) {
    const pairings = generateRoundRobinPairings(groupTeams);

    pairings.forEach(pair => {
      const courtNum = selectedCourts[courtIndex % selectedCourts.length] || 1;
      
      const matchStart = new Date(baseDate.getTime() + currentSlotOffset * 60000);
      const matchEnd = new Date(matchStart.getTime() + matchDurationMinutes * 60000);

      matches.push({
        id: `match-${matchCounter}`,
        tournamentId,
        matchNumber: matchCounter,
        round: 'GROUP_STAGE',
        groupName,
        homeTeamId: pair.homeTeam.id,
        awayTeamId: pair.awayTeam.id,
        homeTeamName: pair.homeTeam.name,
        awayTeamName: pair.awayTeam.name,
        homeTeamCode: pair.homeTeam.shortCode,
        awayTeamCode: pair.awayTeam.shortCode,
        courtNumber: courtNum,
        courtName: `Court ${courtNum}`,
        scheduledStart: matchStart.toISOString(),
        scheduledEnd: matchEnd.toISOString(),
        status: 'UPCOMING',
        homeScore: 0,
        awayScore: 0,
        currentMinute: "0'",
        currentHalf: '1ST_HALF',
        events: []
      });

      matchCounter++;
      courtIndex++;

      // Advance time slot when all courts are filled for this round
      if (courtIndex % selectedCourts.length === 0) {
        currentSlotOffset += slotMinutes;
      }
    });
  }

  // Knockout Stage: Semi-Finals & Final placeholders
  if (teams.length >= 4) {
    const semiFinalDate = new Date(baseDate.getTime() + (currentSlotOffset + slotMinutes) * 60000);
    
    // SF 1: Group A #1 vs Group B #2
    matches.push({
      id: `match-${matchCounter}`,
      tournamentId,
      matchNumber: matchCounter,
      round: 'SEMI_FINAL',
      groupName: 'Knockout',
      homeTeamId: 'tbd-ga1',
      awayTeamId: 'tbd-gb2',
      homeTeamName: 'Winner Group A',
      awayTeamName: 'Runner-Up Group B',
      courtNumber: selectedCourts[0] || 1,
      courtName: `Court ${selectedCourts[0] || 1}`,
      scheduledStart: semiFinalDate.toISOString(),
      scheduledEnd: new Date(semiFinalDate.getTime() + matchDurationMinutes * 60000).toISOString(),
      status: 'UPCOMING',
      homeScore: 0,
      awayScore: 0,
      currentMinute: "0'",
      currentHalf: '1ST_HALF',
      events: []
    });
    matchCounter++;

    // SF 2: Group B #1 vs Group A #2
    const sf2Date = new Date(semiFinalDate.getTime() + (selectedCourts.length > 1 ? 0 : slotMinutes * 60000));
    matches.push({
      id: `match-${matchCounter}`,
      tournamentId,
      matchNumber: matchCounter,
      round: 'SEMI_FINAL',
      groupName: 'Knockout',
      homeTeamId: 'tbd-gb1',
      awayTeamId: 'tbd-ga2',
      homeTeamName: 'Winner Group B',
      awayTeamName: 'Runner-Up Group A',
      courtNumber: selectedCourts[1] || selectedCourts[0] || 2,
      courtName: `Court ${selectedCourts[1] || selectedCourts[0] || 2}`,
      scheduledStart: sf2Date.toISOString(),
      scheduledEnd: new Date(sf2Date.getTime() + matchDurationMinutes * 60000).toISOString(),
      status: 'UPCOMING',
      homeScore: 0,
      awayScore: 0,
      currentMinute: "0'",
      currentHalf: '1ST_HALF',
      events: []
    });
    matchCounter++;

    // Grand Final
    const finalDate = new Date(sf2Date.getTime() + slotMinutes * 60000);
    matches.push({
      id: `match-${matchCounter}`,
      tournamentId,
      matchNumber: matchCounter,
      round: 'FINAL',
      groupName: 'Grand Final Series',
      homeTeamId: 'tbd-sf1',
      awayTeamId: 'tbd-sf2',
      homeTeamName: 'Finalist 1',
      awayTeamName: 'Finalist 2',
      courtNumber: selectedCourts[selectedCourts.length - 1] || 5,
      courtName: `Court ${selectedCourts[selectedCourts.length - 1] || 5} (Main Showcase)`,
      scheduledStart: finalDate.toISOString(),
      scheduledEnd: new Date(finalDate.getTime() + matchDurationMinutes * 60000).toISOString(),
      status: 'UPCOMING',
      homeScore: 0,
      awayScore: 0,
      currentMinute: "0'",
      currentHalf: '1ST_HALF',
      events: []
    });
  }

  return matches;
}
