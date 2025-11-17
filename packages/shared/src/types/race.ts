export type OfficeLevel = 'local' | 'state' | 'national';
export type OfficeType = 'executive' | 'legislative' | 'judicial' | 'other';

export interface Race {
  id: string;
  electionId: string;
  officeName: string;
  officeLevel: OfficeLevel;
  officeType: OfficeType;
  districtNumber: string | null;
  candidates: string[]; // candidate IDs
  incumbents: string[]; // candidate IDs
  totalSeats: number;
  termLength: string;
  salary: number | null;
  responsibilities: string | null;
}

export interface RaceWithCandidates extends Race {
  candidateDetails: Array<{
    id: string;
    fullName: string;
    party: string | null;
    photoUrl: string | null;
    isIncumbent: boolean;
  }>;
}
