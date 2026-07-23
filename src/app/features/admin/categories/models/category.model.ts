export interface CategoryRequest {
  name: string;
  description?: string; // Optionnel
}

export interface CategoryResponse {
  id: string; // UUID
  name: string;
  description: string;
}
