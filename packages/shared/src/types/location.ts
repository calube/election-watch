export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface PollingLocation {
  id: string;
  electionId: string;
  name: string;
  address: Address;
  geoLocation: GeoLocation;
  locationType: 'polling_place' | 'early_voting' | 'dropbox';
  hoursOpen: TimeRange[];
  accessibilityInfo: string | null;
  parkingInfo: string | null;
  notes: string | null;
}

export interface TimeRange {
  dayOfWeek?: string; // for early voting with multiple days
  date?: Date; // for specific dates
  open: string; // HH:mm format
  close: string; // HH:mm format
}

export interface LocationInput {
  address?: string;
  zipCode?: string;
  geoLocation?: GeoLocation;
}
