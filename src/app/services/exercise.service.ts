// src/app/services/exercise.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  // baza pentru API: '' local (merge cu proxy), backend URL în producție
  private apiBaseUrl = environment.apiUrl || '';

  constructor(private http: HttpClient) { }

  getExercisesByLessonId(lessonId: string, level: string): Observable<any> {
    const url = `${this.apiBaseUrl}/api/exercises/${lessonId}?level=${level}`;
    console.log(`🔍 Fetching exercises from: ${url}`);
    return this.http.get(url);
  }

  getLessonsByLevel(level: string): Observable<any> {
    const url = `${this.apiBaseUrl}/api/lessons?level=${level}`;
    return this.http.get(url);
  }
}
