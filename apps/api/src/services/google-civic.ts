/**
 * Google Civic Information API Service
 * https://developers.google.com/civic-information
 */

interface GoogleCivicElection {
  id: string;
  name: string;
  electionDay: string;
  ocdDivisionId: string;
}

interface GoogleCivicCandidate {
  name: string;
  party?: string;
  candidateUrl?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  channels?: Array<{
    type: string;
    id: string;
  }>;
}

interface GoogleCivicContest {
  type: string;
  office: string;
  level?: string[];
  roles?: string[];
  district?: {
    name: string;
    scope: string;
  };
  candidates?: GoogleCivicCandidate[];
}

interface GoogleCivicPollingLocation {
  address: {
    locationName?: string;
    line1: string;
    line2?: string;
    line3?: string;
    city: string;
    state: string;
    zip: string;
  };
  pollingHours?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  sources?: Array<{
    name: string;
    official: boolean;
  }>;
}

interface VoterInfoResponse {
  election: GoogleCivicElection;
  contests?: GoogleCivicContest[];
  pollingLocations?: GoogleCivicPollingLocation[];
  earlyVoteSites?: GoogleCivicPollingLocation[];
  dropOffLocations?: GoogleCivicPollingLocation[];
  state?: Array<{
    name: string;
    electionAdministrationBody: {
      name?: string;
      electionInfoUrl?: string;
      electionRegistrationUrl?: string;
      electionRegistrationConfirmationUrl?: string;
      absenteeVotingInfoUrl?: string;
      votingLocationFinderUrl?: string;
      ballotInfoUrl?: string;
      correspondenceAddress?: any;
    };
  }>;
}

interface ElectionsResponse {
  elections: GoogleCivicElection[];
}

export class GoogleCivicService {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/civicinfo/v2';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Google Civic API key is required');
    }
    this.apiKey = apiKey;
  }

  /**
   * Get list of available elections
   */
  async getElections(): Promise<ElectionsResponse> {
    const url = `${this.baseUrl}/elections?key=${this.apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google Civic API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<ElectionsResponse>;
  }

  /**
   * Get voter information for a specific address
   */
  async getVoterInfo(address: string, electionId?: string): Promise<VoterInfoResponse> {
    const params = new URLSearchParams({
      key: this.apiKey,
      address: address,
    });

    if (electionId) {
      params.append('electionId', electionId);
    }

    const url = `${this.baseUrl}/voterinfo?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Google Civic API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return response.json() as Promise<VoterInfoResponse>;
  }

  /**
   * Get representatives for a specific address
   */
  async getRepresentatives(address: string, levels?: string[], roles?: string[]) {
    const params = new URLSearchParams({
      key: this.apiKey,
      address: address,
    });

    if (levels?.length) {
      params.append('levels', levels.join(','));
    }

    if (roles?.length) {
      params.append('roles', roles.join(','));
    }

    const url = `${this.baseUrl}/representatives?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google Civic API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

// Export singleton instance
let civicService: GoogleCivicService | null = null;

export function getGoogleCivicService(): GoogleCivicService {
  if (!civicService) {
    const apiKey = process.env.GOOGLE_CIVIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        'GOOGLE_CIVIC_API_KEY environment variable is not set. Please add it to your .env file.'
      );
    }
    civicService = new GoogleCivicService(apiKey);
  }
  return civicService;
}
