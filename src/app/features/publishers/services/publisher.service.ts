import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PublisherRequest, PublisherResponse } from '../models/publisher.model';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8082/api/publishers';

  getPublishers(): Observable<PublisherResponse[]> {
    return this.http.get<PublisherResponse[]>(this.apiUrl);
  }

  createPublisher(publisherData: PublisherRequest): Observable<PublisherResponse> {
    return this.http.post<PublisherResponse>(this.apiUrl, publisherData);
  }
}
