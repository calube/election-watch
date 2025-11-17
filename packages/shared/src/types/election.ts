export type ElectionType = 'local' | 'state' | 'national';
export type ElectionSubtype = 'primary' | 'general' | 'special' | 'runoff';
export type ElectionStatus = 'upcoming' | 'active' | 'completed';

export interface Election {
  id: string;
  type: ElectionType;
  subtype: ElectionSubtype;
  name: string;
  date: Date;
  registrationDeadline: Date | null;
  earlyVotingStart: Date | null;
  earlyVotingEnd: Date | null;
  jurisdiction: string;
  jurisdictionId: string;
  status: ElectionStatus;
  dataSources: string[];
  lastUpdated: Date;
  createdAt: Date;
}

export interface ElectionListItem extends Omit<Election, 'dataSources' | 'lastUpdated'> {
  raceCount: number;
  daysUntilElection: number;
}

export interface UpcomingDeadline {
  type: 'registration' | 'early_voting_start' | 'early_voting_end' | 'election_day';
  date: Date;
  label: string;
  daysUntil: number;
}
