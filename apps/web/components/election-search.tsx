'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function ElectionSearch() {
  const [address, setAddress] = useState('');
  const [searchAddress, setSearchAddress] = useState('');

  const { data, isLoading, error } = useQuery<any>({
    queryKey: ['voterInfo', searchAddress],
    queryFn: () => api.elections.voterInfo(searchAddress),
    enabled: searchAddress.length > 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchAddress(address);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address (e.g., 123 Main St, City, State ZIP)"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Searching...' : 'Find Elections'}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-red-800 dark:text-red-200">
            {error instanceof Error ? error.message : 'Failed to fetch election information'}
          </p>
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
            Make sure you have configured the GOOGLE_CIVIC_API_KEY in your .env file
          </p>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Election Information */}
          {data.data?.election && (
            <div className="p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-2">{data.data.election.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Election Day:{' '}
                {new Date(data.data.election.electionDay).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}

          {/* Contests (Races) */}
          {data.data?.contests && data.data.contests.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Races on Your Ballot</h3>
              {data.data.contests.map((contest: any, index: number) => (
                <div
                  key={index}
                  className="p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  <h4 className="text-lg font-semibold mb-2">{contest.office}</h4>
                  {contest.district && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      District: {contest.district.name}
                    </p>
                  )}
                  {contest.candidates && contest.candidates.length > 0 && (
                    <div className="space-y-3 mt-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Candidates:
                      </p>
                      {contest.candidates.map((candidate: any, cidx: number) => (
                        <div
                          key={cidx}
                          className="pl-4 border-l-2 border-blue-500 py-2"
                        >
                          <p className="font-medium">{candidate.name}</p>
                          {candidate.party && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {candidate.party}
                            </p>
                          )}
                          {candidate.candidateUrl && (
                            <a
                              href={candidate.candidateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                            >
                              Campaign Website →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Polling Locations */}
          {data.data?.pollingLocations && data.data.pollingLocations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Your Polling Location</h3>
              {data.data.pollingLocations.map((location: any, index: number) => (
                <div
                  key={index}
                  className="p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  {location.address.locationName && (
                    <h4 className="text-lg font-semibold mb-2">
                      {location.address.locationName}
                    </h4>
                  )}
                  <p className="text-gray-700 dark:text-gray-300">
                    {location.address.line1}
                    {location.address.line2 && `, ${location.address.line2}`}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {location.address.city}, {location.address.state} {location.address.zip}
                  </p>
                  {location.pollingHours && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Hours: {location.pollingHours}
                    </p>
                  )}
                  {location.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {location.notes}
                    </p>
                  )}
                  {location.latitude && location.longitude && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                    >
                      Get Directions →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Early Vote Sites */}
          {data.data?.earlyVoteSites && data.data.earlyVoteSites.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Early Voting Locations</h3>
              {data.data.earlyVoteSites.map((site: any, index: number) => (
                <div
                  key={index}
                  className="p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  {site.address.locationName && (
                    <h4 className="text-lg font-semibold mb-2">{site.address.locationName}</h4>
                  )}
                  <p className="text-gray-700 dark:text-gray-300">
                    {site.address.line1}, {site.address.city}, {site.address.state}{' '}
                    {site.address.zip}
                  </p>
                  {site.pollingHours && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Hours: {site.pollingHours}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* State Election Info */}
          {data.data?.state && data.data.state[0]?.electionAdministrationBody && (
            <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-bold mb-3">Additional Resources</h3>
              {data.data.state[0].electionAdministrationBody.electionInfoUrl && (
                <a
                  href={data.data.state[0].electionAdministrationBody.electionInfoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-2"
                >
                  Election Information →
                </a>
              )}
              {data.data.state[0].electionAdministrationBody.electionRegistrationUrl && (
                <a
                  href={data.data.state[0].electionAdministrationBody.electionRegistrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-2"
                >
                  Voter Registration →
                </a>
              )}
              {data.data.state[0].electionAdministrationBody.ballotInfoUrl && (
                <a
                  href={data.data.state[0].electionAdministrationBody.ballotInfoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Ballot Information →
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
