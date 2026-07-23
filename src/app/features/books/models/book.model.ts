import { AuthorResponse } from '../../authors/models/author.model';
import { CategoryResponse } from '../../admin/categories/models/category.model';
import { PublisherResponse } from '../../admin/publishers/models/publisher.model';

// --- Modèle principal de lecture (Calqué sur BookResponse.java) ---

export interface BookResponse {
  id: string; // UUID
  title: string;
  isbn: string;
  description?: string;
  publicationDate?: string; // Format YYYY-MM-DD
  quantity: number;
  availableQuantity: number;
  category: CategoryResponse;
  publisher: PublisherResponse;
  authors: AuthorResponse[]; // Liste des auteurs associés
}

// --- Modèle d'écriture (Calqué sur CreateBookRequest.java & UpdateBookRequest.java) ---

export interface SaveBookRequest {
  title: string;
  isbn: string;
  description?: string;
  publicationDate?: string;
  quantity: number;
  categoryId: string;   // UUID de la catégorie
  publisherId: string;  // UUID de l'éditeur
  authorIds: string[];  // Tableau de UUIDs des auteurs (Set<UUID> côté Java)
}
