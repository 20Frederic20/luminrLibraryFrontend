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
  private apiUrl = 'http://localhost:8082/api/publishers';

  getPublishers(): Observable<PublisherResponse[]> {
    return this.http
          .get<ApiResponse<Page<PublisherResponse>>>(this.apiUrl)
          .pipe(unwrapPage());
  }

  createPublisher(publisherData: PublisherRequest): Observable<PublisherResponse> {
    return this.http.post<PublisherResponse>(this.apiUrl, publisherData);
  }

  getPublisherById(id: string): Observable<PublisherResponse> {
    return this.http.get<PublisherResponse>(`${this.apiUrl}/${id}`);
  }

  updatePublisher(id: string, publisherData: PublisherUpdateRequest): Observable<PublisherResponse> {
    return this.http.put<PublisherResponse>(`${this.apiUrl}/${id}`, publisherData);
  }

  deletePublisher(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
