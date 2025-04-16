import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private apiUrl = '/api/test';

  constructor(private http: HttpClient) {}

  generateTest(lessons: any[]): Observable<{ test: string }> {
    return this.http.post<{ test: string }>(`${this.apiUrl}/generate`, { lessons });
  }
}
