import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private apiUrl = 'http://localhost:5000/api/exercises'; // 🔹 URL-ul backend-ului

  constructor(private http: HttpClient) {}

  // 🔹 Metodă pentru a obține exercițiile unei lecții pe baza ID-ului lecției
  getExercisesByLessonId(lessonId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${lessonId}`);
  }
}
