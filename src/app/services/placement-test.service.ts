import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PlacementTestService {
  constructor(private http: HttpClient) { }

  getTestQuestions(level: string) {
    return this.http.get<any[]>(
      `${environment.apiUrl}/api/exercises/placement-test/${level}`
    );
  }
}
