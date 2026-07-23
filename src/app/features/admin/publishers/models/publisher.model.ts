export interface PublisherRequest {
  name: string;
  code: string;
  address?: string; // Optionnel
}

export interface PublisherResponse {
  id: string; // UUID
  name: string;
  code: string;
  address: string;
}

export interface PublisherUpdateRequest {
  name?: string;
  code?: string;
  address?: string;
}
