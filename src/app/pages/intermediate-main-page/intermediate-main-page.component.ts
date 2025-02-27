import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LessonService } from '../../services/lesson.service';
import { Lesson } from '../../models/lesson.model';

@Component({
  selector: 'app-intermediate-main-page',
  standalone: true,
  templateUrl: './intermediate-main-page.component.html',
  styleUrls: ['./intermediate-main-page.component.css'],
  imports: [CommonModule]
})
export class IntermediateMainPageComponent implements OnInit {
  lessons: Lesson[] = [];
  completedLessons: string[] = [];
  currentLessonId: string | null = null;
  username: string | null = null;
  totalLessons: number = 0;
  progress: number = 0;

  constructor(private lessonService: LessonService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.loadUserProgress();
    this.username = this.authService.getUsername();

    this.authService.completedLessons$.subscribe(completedLessons => {
      this.completedLessons = completedLessons;

      this.lessonService.getLessonsByLevel('intermediate').subscribe(data => {
        this.totalLessons = data.length;
        this.lessons = data.map((lesson: any, index: number) => {
          const isCompleted = completedLessons.includes(lesson._id);
          return {
            ...lesson,
            isCompleted: isCompleted,
            isUnlocked: isCompleted || index === 0
          };
        });

        const firstIncompleteLesson = this.lessons.find(lesson => !lesson.isCompleted);
        if (firstIncompleteLesson) {
          this.currentLessonId = firstIncompleteLesson._id;
          this.lessons = this.lessons.map(lesson => ({
            ...lesson,
            isUnlocked: lesson.isUnlocked || lesson._id === this.currentLessonId
          }));
        }
      });
    });
  }

  goToLesson(lessonId: string) {
    const lesson = this.lessons.find(lesson => lesson._id === lessonId);
    if (!lesson?.isUnlocked) return;

    this.router.navigate([`/lesson/intermediate/${lessonId}`]);
  }

  goToUserProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.authService.logout();
  }
}
