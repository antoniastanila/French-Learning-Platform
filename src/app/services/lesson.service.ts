import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private apiUrl = 'http://localhost:5000/api/lessons';

  constructor(private http: HttpClient) {}

  getLessons(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addLesson(lesson: any): Observable<any> {
    return this.http.post(this.apiUrl, lesson);
  }

  getLessonById(lessonId: string, level: string) {
    const collection = level === 'intermediate' ? 'intermediate_lessons' : 'beginner_lessons';
    console.log(`Fetching from: ${this.apiUrl}/${collection}/${lessonId}`);
    return this.http.get(`${this.apiUrl}/${collection}/${lessonId}`);
  }
  
}
