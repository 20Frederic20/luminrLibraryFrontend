import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PublisherRequest, PublisherResponse, PublisherUpdateRequest } from '../models/publisher.model';
import { ApiResponse, Page } from '../../../core/models/api-response.model';
import { unwrapPage } from '../../../core/utils/rxjs-operator';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {
  private http = inject(HttpClient);

  getPublishers(): Observable<PublisherResponse[]> {
    return this.http
          .get<ApiResponse<Page<PublisherResponse>>>('/publishers')
          .pipe(unwrapPage());
  }

  createPublisher(publisherData: PublisherRequest): Observable<PublisherResponse> {
    return this.http.post<PublisherResponse>('/publishers', publisherData);
  }

  getPublisherById(id: string): Observable<PublisherResponse> {
    return this.http.get<PublisherResponse>(`/publishers/${id}`);
  }

  updatePublisher(id: string, publisherData: PublisherUpdateRequest): Observable<PublisherResponse> {
    return this.http.put<PublisherResponse>(`/publishers/${id}`, publisherData);
  }

  deletePublisher(id: string): Observable<void> {
    return this.http.delete<void>(`/publishers/${id}`);
  }
}
