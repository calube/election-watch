/**
 * API client for Election Watch backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.error || 'An error occurred',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new Error(`Failed to fetch from API: ${error}`);
  }
}

export const api = {
  elections: {
    list: () => fetchAPI('/elections'),
    voterInfo: (address: string, electionId?: string) => {
      const params = new URLSearchParams({ address });
      if (electionId) params.append('electionId', electionId);
      return fetchAPI(`/elections/voter-info?${params.toString()}`);
    },
    representatives: (address: string, levels?: string[], roles?: string[]) => {
      const params = new URLSearchParams({ address });
      if (levels) params.append('levels', levels.join(','));
      if (roles) params.append('roles', roles.join(','));
      return fetchAPI(`/elections/representatives?${params.toString()}`);
    },
  },
};
