export interface AuthorRequest {
  firstName: string;
  lastName: string;
  birthPlace?: string; // Optionnel
  birthDate?: string;  // Optionnel (Format YYYY-MM-DD)
}

export interface AuthorResponse {
  id: string;          // Le UUID de Java se lit comme une string en TS
  firstName: string;
  lastName: string;
  birthPlace: string;
  birthDate: string;
}
