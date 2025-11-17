export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  party: string | null;
  photoUrl: string | null;
  websiteUrl: string | null;
  email: string | null;
  phone: string | null;

  // Biographical
  biography: string | null;
  education: Education[];
  experience: Experience[];

  // Platform & Positions
  platformSummary: string | null;
  issuePositions: IssuePosition[];

  // Campaign Finance
  fundraisingTotal: number | null;
  expendituresTotal: number | null;
  topDonors: Donor[];

  // Endorsements
  endorsements: Endorsement[];

  // Voting Record (for incumbents)
  votingRecord: VoteRecord[];

  // Social Media
  socialMedia: SocialMediaLinks;

  // Metadata
  dataSources: DataSource[];
  lastUpdated: Date;
  createdAt: Date;
}

export interface CandidateListItem {
  id: string;
  fullName: string;
  party: string | null;
  photoUrl: string | null;
  isIncumbent: boolean;
}

export interface Education {
  institution: string;
  degree: string;
  field: string | null;
  year: number | null;
}

export interface Experience {
  title: string;
  organization: string;
  startDate: Date | null;
  endDate: Date | null;
  description: string | null;
  current: boolean;
}

export interface IssuePosition {
  issue: string;
  category: string; // 'economy', 'healthcare', 'education', 'environment', etc.
  position: string;
  sources: Source[];
  lastUpdated: Date;
}

export interface Donor {
  name: string;
  amount: number;
  type: 'individual' | 'organization' | 'pac';
}

export interface Endorsement {
  endorser: string;
  endorserType: 'individual' | 'organization' | 'media' | 'political_group';
  date: Date;
  source: Source;
}

export interface VoteRecord {
  bill: string;
  billNumber: string;
  date: Date;
  vote: 'yes' | 'no' | 'abstain' | 'present';
  description: string;
  category: string;
  source: Source;
}

export interface SocialMediaLinks {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
}

export interface DataSource {
  name: string;
  url: string;
  type: 'official' | 'news' | 'campaign' | 'nonprofit' | 'research';
  scrapedAt: Date;
}

export interface Source {
  name: string;
  url: string;
  publishedAt?: Date;
}
