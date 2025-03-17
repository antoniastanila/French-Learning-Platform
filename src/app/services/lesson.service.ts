import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private apiUrl = 'https://localhost:5000/api/lessons';

  constructor(private http: HttpClient) {}

  getLessons(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addLesson(lesson: any): Observable<any> {
    return this.http.post(this.apiUrl, lesson);
  }

  getLessonById(lessonId: string, level: string) {
    let collection = 'beginner_lessons'; // Default la beginner

    if (level === 'intermediate') {
        collection = 'intermediate_lessons';
    } else if (level === 'advanced') { // ✅ Adăugat suport pentru advanced
        collection = 'advanced_lessons';
    }

    console.log(`Fetching from: ${this.apiUrl}/${collection}/${lessonId}`);
    return this.http.get(`${this.apiUrl}/${level}/${lessonId}`);
  }

getLessonsByLevel(level: string): Observable<any> {
  return this.http.get(`${this.apiUrl}?level=${level}`);
}


}
