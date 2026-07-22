import { Observable, map } from 'rxjs';
import { ApiResponse, Page } from '../models/api-response.model';

/**
 * Extrait automatiquement le tableau `content` d'une réponse paginée
 */
export function unwrapPage<T>() {
  return (source$: Observable<ApiResponse<Page<T>>>): Observable<T[]> => {
    return source$.pipe(
      map(response => response.data?.content || [])
    );
  };
}

export function unwrapData<T>() {
  return (source$: Observable<ApiResponse<T>>): Observable<T> => {
    return source$.pipe(
      map(response => response.data)
    );
  };
}
