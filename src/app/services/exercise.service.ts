import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private apiUrl = 'http://localhost:5000/api/exercises'; // 🔹 URL-ul backend-ului

  constructor(private http: HttpClient) {}

  getExercisesByLessonId(lessonId: string, level: string): Observable<any> {
    console.log(`🔍 Fetching exercises for lesson ${lessonId} at level: ${level}`);
    return this.http.get(`/api/exercises/${lessonId}?level=${level}`);
}

getLessonsByLevel(level: string): Observable<any> {
  return this.http.get(`/api/lessons?level=${level}`);
}

}
