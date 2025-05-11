import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PlacementTestService {
  constructor(private http: HttpClient) {}

  getTestQuestions(level: string) {
    return this.http.get<any[]>(`/api/exercises/placement-test/${level}`);
  }
}
