// src/app/services/exercise.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// detectăm dacă suntem pe frontend-ul de pe Render
const isRenderFrontend =
  typeof window !== 'undefined' &&
  window.location.hostname.includes('baguette-talk-frontend.onrender.com');

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  /**
   * Local:
   *   - hostname = localhost -> isRenderFrontend = false
   *   - apiBaseUrl = environment.apiUrl (care e '') -> folosim /api/... prin proxy.
   *
   * Render (frontend live):
   *   - hostname conține 'baguette-talk-frontend.onrender.com'
   *   - apiBaseUrl = 'https://baguette-talk-backend.onrender.com'
   */
  private apiBaseUrl = isRenderFrontend
    ? 'https://baguette-talk-backend.onrender.com'
    : (environment.apiUrl || '');

  constructor(private http: HttpClient) { }

  getExercisesByLessonId(lessonId: string, level: string): Observable<any> {
    const url = `${this.apiBaseUrl}/api/exercises/${lessonId}?level=${level}`;
    console.log(`🔍 Fetching exercises from: ${url}`);
    return this.http.get(url);
  }

  getLessonsByLevel(level: string): Observable<any> {
    const url = `${this.apiBaseUrl}/api/lessons?level=${level}`;
    console.log(`🔍 Fetching lessons from: ${url}`);
    return this.http.get(url);
  }
}
