import { Match } from '../types/match';
import { CourtBookingLock } from '../types/venue';

export interface ConflictCheckResult {
  hasConflict: boolean;
  tier: 'NONE' | 'INTRA_TOURNAMENT' | 'VENUE_WIDE_LOCK';
  conflictMessage: string;
  conflictingMatchId?: string;
  suggestedCourtNumber?: number;
}

/**
 * Two-Tier Conflict Detection Engine:
 * Tier 1: Intra-Tournament overlap on target court
 * Tier 2: Inter-Tournament / Venue maintenance lock on target court
 */
export function checkCourtAvailability(
  targetCourtNumber: number,
  startTimeISO: string,
  endTimeISO: string,
  currentMatchId: string,
  tournamentMatches: Match[],
  venueLocks: CourtBookingLock[] = [],
  availableCourts: number[] = [1, 2, 3, 4, 5]
): ConflictCheckResult {
  const targetStart = new Date(startTimeISO).getTime();
  const targetEnd = new Date(endTimeISO).getTime();

  // Tier 1 Check: Other matches in same tournament using targetCourtNumber during overlapping window
  const intraConflict = tournamentMatches.find(m => {
    if (m.id === currentMatchId) return false;
    if (m.courtNumber !== targetCourtNumber) return false;
    if (m.status === 'COMPLETED' || m.status === 'CANCELLED') return false;

    const mStart = new Date(m.scheduledStart).getTime();
    const mEnd = new Date(m.scheduledEnd).getTime();

    // Check time overlap: (StartA < EndB) and (EndA > StartB)
    return targetStart < mEnd && targetEnd > mStart;
  });

  if (intraConflict) {
    const suggested = findAlternativeFreeCourt(
      targetStart,
      targetEnd,
      currentMatchId,
      tournamentMatches,
      venueLocks,
      availableCourts,
      targetCourtNumber
    );

    return {
      hasConflict: true,
      tier: 'INTRA_TOURNAMENT',
      conflictMessage: `Court ${targetCourtNumber} is already scheduled for Match #${intraConflict.matchNumber} (${intraConflict.homeTeamName || 'Team A'} vs ${intraConflict.awayTeamName || 'Team B'}).`,
      conflictingMatchId: intraConflict.id,
      suggestedCourtNumber: suggested
    };
  }

  // Tier 2 Check: External venue booking locks (maintenance or external tournaments)
  const venueLockConflict = venueLocks.find(lock => {
    if (lock.matchId === currentMatchId) return false;
    if (lock.courtNumber !== targetCourtNumber) return false;

    const lStart = new Date(lock.startTime).getTime();
    const lEnd = new Date(lock.endTime).getTime();

    return targetStart < lEnd && targetEnd > lStart;
  });

  if (venueLockConflict) {
    const suggested = findAlternativeFreeCourt(
      targetStart,
      targetEnd,
      currentMatchId,
      tournamentMatches,
      venueLocks,
      availableCourts,
      targetCourtNumber
    );

    return {
      hasConflict: true,
      tier: 'VENUE_WIDE_LOCK',
      conflictMessage: `Court ${targetCourtNumber} is blocked by venue lock: ${venueLockConflict.lockType === 'MAINTENANCE' ? 'Routine Maintenance' : 'Reserved Slot'}.`,
      suggestedCourtNumber: suggested
    };
  }

  return {
    hasConflict: false,
    tier: 'NONE',
    conflictMessage: `Court ${targetCourtNumber} verified free and available with zero collision.`
  };
}

function findAlternativeFreeCourt(
  targetStart: number,
  targetEnd: number,
  currentMatchId: string,
  matches: Match[],
  locks: CourtBookingLock[],
  allCourts: number[],
  excludedCourt: number
): number | undefined {
  for (const court of allCourts) {
    if (court === excludedCourt) continue;

    const matchOverlap = matches.some(m => {
      if (m.id === currentMatchId || m.courtNumber !== court) return false;
      if (m.status === 'COMPLETED' || m.status === 'CANCELLED') return false;
      const s = new Date(m.scheduledStart).getTime();
      const e = new Date(m.scheduledEnd).getTime();
      return targetStart < e && targetEnd > s;
    });

    if (matchOverlap) continue;

    const lockOverlap = locks.some(l => {
      if (l.courtNumber !== court || l.matchId === currentMatchId) return false;
      const s = new Date(l.startTime).getTime();
      const e = new Date(l.endTime).getTime();
      return targetStart < e && targetEnd > s;
    });

    if (!lockOverlap) {
      return court;
    }
  }

  return undefined;
}
