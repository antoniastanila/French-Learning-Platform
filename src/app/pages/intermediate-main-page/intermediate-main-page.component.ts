import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
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
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error("❌ User ID is missing!");
      return;
    }

    this.authService.loadUserProgress();
    this.username = this.authService.getUsername();

    this.authService.completedLessons$.subscribe(completedLessons => {
      if (localStorage.getItem('userId') !== userId) return;

      this.completedLessons = completedLessons;

      this.lessonService.getLessonsByLevel('intermediate').subscribe(data => {
        this.totalLessons = data.length;

        let storedCurrentLesson = localStorage.getItem(`currentLesson_${userId}`);

        this.lessons = data.map((lesson: any, index: number) => ({
          ...lesson,
          isCompleted: completedLessons.includes(lesson._id),
          isUnlocked: index === 0 || completedLessons.includes(lesson._id),
          level: lesson.level ?? 'intermediate'
        }));

        const firstIncompleteLesson = this.lessons.find(lesson => !lesson.isCompleted);
        if (storedCurrentLesson && completedLessons.includes(storedCurrentLesson)) {
          this.currentLessonId = firstIncompleteLesson ? firstIncompleteLesson._id : storedCurrentLesson;
        } else if (firstIncompleteLesson) {
          this.currentLessonId = firstIncompleteLesson._id;
        }

        localStorage.setItem(`currentLesson_${userId}`, this.currentLessonId || '');

        this.updateLessonsState();
        this.updateProgress();
      });
    });
  }

  updateProgress(): void {
    const completedCount = this.lessons.filter(lesson => lesson.isCompleted).length;
    if (this.totalLessons > 0) {
      this.progress = (completedCount / this.totalLessons) * 100;
    }
  }

  updateLessonsState(): void {
    const currentIndex = this.lessons.findIndex(lesson => lesson._id === this.currentLessonId);

    this.lessons = this.lessons.map((lesson, index) => ({
      ...lesson,
      isCompleted: index < currentIndex,
      isUnlocked: index <= currentIndex,
    }));
  }

  goToLesson(lessonId: string) {
    console.log("🔹 goToLesson() called with lessonId:", lessonId);
    const lesson = this.lessons.find(lesson => lesson._id === lessonId);

    if (!lesson?.isUnlocked) return;

    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const level = lesson.level;
    console.log("🔹 Navigating to:", { lessonId, level, fullPath: `/lesson/${level}/${lessonId}` });

    this.currentLessonId = lessonId;
    localStorage.setItem(`currentLesson_${userId}`, lessonId);

    const userLevel = 'intermediate';

    if (!this.completedLessons.includes(lessonId)) {
      this.authService.markLessonsAsCompleted([lessonId], userLevel);
    }

    this.updateLessonsState();
    this.updateProgress();

    this.router.navigate([`/lesson/${level}/${lessonId}`]);
  }

  goToUserProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.authService.logout();
  }
}
