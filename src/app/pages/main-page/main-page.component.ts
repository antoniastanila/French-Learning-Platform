import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { LessonService } from '../../services/lesson.service';
import { Lesson } from '../../models/lesson.model';
@Component({
  selector: 'app-main-page',
  standalone: true,
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  imports: [CommonModule]
})
export class MainPageComponent implements OnInit {
  lessons: Lesson[] = [];

  constructor(private lessonService: LessonService, private router: Router) {}

  ngOnInit(): void {
    this.lessonService.getLessons().subscribe(data => {
      this.lessons = data.map((lesson: Lesson, index: number) => ({
        ...lesson,
        isUnlocked: index === 0 || this.checkIfLessonIsUnlocked(index)
      }));
    });
  }

  goToLesson(lessonId: string) {
    this.router.navigate(['/lesson', lessonId]);
  }

  checkIfLessonIsUnlocked(index: number): boolean {
    return index <= 1; 
  }
}
