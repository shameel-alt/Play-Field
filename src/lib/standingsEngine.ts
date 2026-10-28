import { Team, TeamStatus } from '../types/team';
import { Match } from '../types/match';

export interface TeamStanding extends Team {
  rank: number;
  form: Array<'W' | 'D' | 'L'>;
}

/**
 * Calculates Group Standings based on FIFA / AMF Futsal Rules:
 * 1. Points (3 for win, 1 for draw, 0 for loss)
 * 2. Head-to-head points
 * 3. Head-to-head goal difference
 * 4. Overall Goal Difference (GD)
 * 5. Goals For (GF)
 */
export function calculateGroupStandings(teams: Team[], matches: Match[], groupName: string): TeamStanding[] {
  // Filter teams for this group
  const groupTeams = teams.filter(t => t.groupName === groupName);
  
  // Initialize tally
  const statsMap = new Map<string, {
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
    form: Array<'W' | 'D' | 'L'>;
    status: TeamStatus;
  }>();

  groupTeams.forEach(team => {
    statsMap.set(team.id, {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      form: [],
      status: team.status
    });
  });

  // Calculate results from completed or walkover matches in this group
  const relevantMatches = matches.filter(
    m => m.groupName === groupName && (m.status === 'COMPLETED' || m.status === 'WALKOVER')
  );

  relevantMatches.forEach(m => {
    const homeStats = statsMap.get(m.homeTeamId);
    const awayStats = statsMap.get(m.awayTeamId);

    if (homeStats && awayStats) {
      homeStats.played += 1;
      awayStats.played += 1;

      homeStats.goalsFor += m.homeScore;
      homeStats.goalsAgainst += m.awayScore;
      awayStats.goalsFor += m.awayScore;
      awayStats.goalsAgainst += m.homeScore;

      if (m.homeScore > m.awayScore) {
        homeStats.won += 1;
        homeStats.points += 3;
        homeStats.form.push('W');

        awayStats.lost += 1;
        awayStats.form.push('L');
      } else if (m.homeScore < m.awayScore) {
        awayStats.won += 1;
        awayStats.points += 3;
        awayStats.form.push('W');

        homeStats.lost += 1;
        homeStats.form.push('L');
      } else {
        homeStats.drawn += 1;
        awayStats.drawn += 1;
        homeStats.points += 1;
        awayStats.points += 1;
        homeStats.form.push('D');
        awayStats.form.push('D');
      }

      homeStats.goalDifference = homeStats.goalsFor - homeStats.goalsAgainst;
      awayStats.goalDifference = awayStats.goalsFor - awayStats.goalsAgainst;
    }
  });

  // Sort according to tie-breaker rules
  const ranked = [...groupTeams].map(team => {
    const s = statsMap.get(team.id)!;
    return {
      ...team,
      ...s,
      rank: 0,
      form: s.form.slice(-5) // last 5 matches
    };
  });

  ranked.sort((a, b) => {
    // 1. Points
    if (b.points !== a.points) return b.points - a.points;

    // 2. Head-to-Head
    const h2h = relevantMatches.find(
      m => (m.homeTeamId === a.id && m.awayTeamId === b.id) || (m.homeTeamId === b.id && m.awayTeamId === a.id)
    );
    if (h2h) {
      const aScore = h2h.homeTeamId === a.id ? h2h.homeScore : h2h.awayScore;
      const bScore = h2h.homeTeamId === b.id ? h2h.homeScore : h2h.awayScore;
      if (aScore !== bScore) return bScore - aScore;
    }

    // 3. Goal Difference
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;

    // 4. Goals For
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;

    // 5. Seed rank fallback
    return (a.seed || 99) - (b.seed || 99);
  });

  // Assign ranks & qualification statuses
  ranked.forEach((team, index) => {
    team.rank = index + 1;
    if (team.status === 'WALKOVER' || team.status === 'DISQUALIFIED') {
      // Preserve explicit disciplinary status
    } else if (index < 2) {
      team.status = 'QUALIFIED';
    } else {
      team.status = 'ACTIVE';
    }
  });

  return ranked;
}
