import { Team } from '../types/team';
import { Match, MatchRound, MatchPeriod, MatchStatus } from '../types/match';
import { Tournament } from '../types/tournament';
import { calculateGroupStandings } from './standingsEngine';

/**
 * Format match period and clock for intuitive UI display
 */
export function formatMatchPeriod(period?: MatchPeriod, minute?: string, status?: MatchStatus): string {
  if (status === 'COMPLETED' || period === 'FULL_TIME') return 'Match Ended (FT)';
  if (status === 'WALKOVER') return 'Walkover (W/O)';
  if (status === 'UPCOMING') return 'Upcoming';
  
  switch (period) {
    case '1ST_HALF':
      return minute && minute !== "0'" ? `1st Half (${minute})` : '1st Half';
    case 'HALF_TIME':
      return 'Half Time (HT)';
    case '2ND_HALF':
      return minute ? `2nd Half (${minute})` : '2nd Half';
    case 'EXTRA_TIME':
      return minute ? `Extra Time (${minute})` : 'Extra Time (ET)';
    default:
      return status === 'LIVE' ? (minute ? `Live (${minute})` : 'Live') : 'Scheduled';
  }
}

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

/**
 * Progression Engine:
 * Analyzes group stage standings and knockout outcomes to automatically progress
 * qualified teams into Semi-Finals and the Championship Final, and awards Championship status.
 */
export function progressTournamentMatches(tournament: Tournament): Tournament {
  // 1. Calculate Group Standings
  const standingsA = calculateGroupStandings(tournament.teams, tournament.matches, 'Group A');
  const standingsB = calculateGroupStandings(tournament.teams, tournament.matches, 'Group B');

  const winnerGA = standingsA[0];
  const runnerUpGA = standingsA[1];
  const winnerGB = standingsB[0];
  const runnerUpGB = standingsB[1];

  let matches = tournament.matches.map(m => ({ ...m }));
  let teams = tournament.teams.map(t => ({ ...t }));

  // Automatically generate Knockout matches if they do not exist yet
  const hasSemiFinals = matches.some(m => m.round === 'SEMI_FINAL');
  if (!hasSemiFinals && winnerGA && runnerUpGB && winnerGB && runnerUpGA) {
    const baseMatchNum = matches.length + 1;
    matches.push({
      id: `match-${baseMatchNum}-sf1`,
      tournamentId: tournament.id,
      matchNumber: baseMatchNum,
      round: 'SEMI_FINAL',
      groupName: 'Knockout Series',
      homeTeamId: winnerGA.id,
      homeTeamName: `Winner Group A (${winnerGA.name})`,
      homeTeamCode: winnerGA.shortCode,
      awayTeamId: runnerUpGB.id,
      awayTeamName: `Runner-Up Group B (${runnerUpGB.name})`,
      awayTeamCode: runnerUpGB.shortCode,
      courtNumber: 1,
      courtName: 'Court 1 (Hardcourt A)',
      scheduledStart: new Date(Date.now() + 60 * 60000).toISOString(),
      scheduledEnd: new Date(Date.now() + 105 * 60000).toISOString(),
      status: 'UPCOMING',
      homeScore: 0,
      awayScore: 0,
      currentMinute: "0'",
      currentHalf: '1ST_HALF',
      events: []
    });

    matches.push({
      id: `match-${baseMatchNum + 1}-sf2`,
      tournamentId: tournament.id,
      matchNumber: baseMatchNum + 1,
      round: 'SEMI_FINAL',
      groupName: 'Knockout Series',
      homeTeamId: winnerGB.id,
      homeTeamName: `Winner Group B (${winnerGB.name})`,
      homeTeamCode: winnerGB.shortCode,
      awayTeamId: runnerUpGA.id,
      awayTeamName: `Runner-Up Group A (${runnerUpGA.name})`,
      awayTeamCode: runnerUpGA.shortCode,
      courtNumber: 2,
      courtName: 'Court 2 (North Hall)',
      scheduledStart: new Date(Date.now() + 120 * 60000).toISOString(),
      scheduledEnd: new Date(Date.now() + 165 * 60000).toISOString(),
      status: 'UPCOMING',
      homeScore: 0,
      awayScore: 0,
      currentMinute: "0'",
      currentHalf: '1ST_HALF',
      events: []
    });

    matches.push({
      id: `match-${baseMatchNum + 2}-final`,
      tournamentId: tournament.id,
      matchNumber: baseMatchNum + 2,
      round: 'FINAL',
      groupName: 'Championship Grand Final',
      homeTeamId: 'tbd-sf1',
      awayTeamId: 'tbd-sf2',
      homeTeamName: 'Winner Semi-Final 1',
      awayTeamName: 'Winner Semi-Final 2',
      homeTeamCode: 'TBD',
      awayTeamCode: 'TBD',
      courtNumber: 5,
      courtName: 'Court 5 (FIFA Pro Turf Arena)',
      scheduledStart: new Date(Date.now() + 180 * 60000).toISOString(),
      scheduledEnd: new Date(Date.now() + 240 * 60000).toISOString(),
      status: 'UPCOMING',
      homeScore: 0,
      awayScore: 0,
      currentMinute: "0'",
      currentHalf: '1ST_HALF',
      events: []
    });
  }

  // Check SF1 (Match 8 or first SEMI_FINAL)
  const sf1Index = matches.findIndex(m => m.round === 'SEMI_FINAL' && (m.matchNumber === 8 || m.id.includes('sf-1') || m.id.includes('sf1')));
  if (sf1Index !== -1 && winnerGA && runnerUpGB) {
    const sf1 = matches[sf1Index];
    if (sf1.homeTeamId.startsWith('tbd') || sf1.homeTeamName?.includes('Winner Group A')) {
      matches[sf1Index] = {
        ...sf1,
        homeTeamId: winnerGA.id,
        homeTeamName: winnerGA.name,
        homeTeamCode: winnerGA.shortCode,
        awayTeamId: runnerUpGB.id,
        awayTeamName: runnerUpGB.name,
        awayTeamCode: runnerUpGB.shortCode
      };
    }
  }

  // Check SF2 (Match 9 or second SEMI_FINAL)
  const sf2Index = matches.findIndex(m => m.round === 'SEMI_FINAL' && (m.matchNumber === 9 || m.id.includes('sf-2') || m.id.includes('sf2')));
  if (sf2Index !== -1 && winnerGB && runnerUpGA) {
    const sf2 = matches[sf2Index];
    if (sf2.homeTeamId.startsWith('tbd') || sf2.homeTeamName?.includes('Winner Group B')) {
      matches[sf2Index] = {
        ...sf2,
        homeTeamId: winnerGB.id,
        homeTeamName: winnerGB.name,
        homeTeamCode: winnerGB.shortCode,
        awayTeamId: runnerUpGA.id,
        awayTeamName: runnerUpGA.name,
        awayTeamCode: runnerUpGA.shortCode
      };
    }
  }

  // Check Grand Final (Match 10 or FINAL)
  const finalIndex = matches.findIndex(m => m.round === 'FINAL');
  const sf1 = matches.find(m => m.round === 'SEMI_FINAL' && (m.matchNumber === 8 || m.id.includes('sf-1') || m.id.includes('sf1')));
  const sf2 = matches.find(m => m.round === 'SEMI_FINAL' && (m.matchNumber === 9 || m.id.includes('sf-2') || m.id.includes('sf2')));

  if (finalIndex !== -1 && sf1 && sf2) {
    const finalMatch = matches[finalIndex];
    let finalist1Team = null;
    let finalist2Team = null;

    if (sf1.status === 'COMPLETED' || sf1.status === 'WALKOVER') {
      const winnerId = sf1.homeScore >= sf1.awayScore ? sf1.homeTeamId : sf1.awayTeamId;
      finalist1Team = teams.find(t => t.id === winnerId);
    }
    if (sf2.status === 'COMPLETED' || sf2.status === 'WALKOVER') {
      const winnerId = sf2.homeScore >= sf2.awayScore ? sf2.homeTeamId : sf2.awayTeamId;
      finalist2Team = teams.find(t => t.id === winnerId);
    }

    if (finalist1Team || finalist2Team) {
      matches[finalIndex] = {
        ...finalMatch,
        ...(finalist1Team ? {
          homeTeamId: finalist1Team.id,
          homeTeamName: finalist1Team.name,
          homeTeamCode: finalist1Team.shortCode
        } : {}),
        ...(finalist2Team ? {
          awayTeamId: finalist2Team.id,
          awayTeamName: finalist2Team.name,
          awayTeamCode: finalist2Team.shortCode
        } : {})
      };
    }
  }

  // If Grand Final is COMPLETED, crown Champion and Runner-Up
  const updatedFinal = matches.find(m => m.round === 'FINAL');
  if (updatedFinal && (updatedFinal.status === 'COMPLETED' || updatedFinal.status === 'WALKOVER')) {
    const champId = updatedFinal.homeScore >= updatedFinal.awayScore ? updatedFinal.homeTeamId : updatedFinal.awayTeamId;
    const runnerId = updatedFinal.homeScore >= updatedFinal.awayScore ? updatedFinal.awayTeamId : updatedFinal.homeTeamId;

    teams = teams.map(t => {
      if (t.id === champId) return { ...t, status: 'CHAMPION' as const };
      if (t.id === runnerId) return { ...t, status: 'RUNNER_UP' as const };
      return t;
    });
  }

  return {
    ...tournament,
    matches,
    teams
  };
}
