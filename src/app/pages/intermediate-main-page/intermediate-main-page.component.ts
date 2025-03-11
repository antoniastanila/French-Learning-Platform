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

        // ✅ Construim lista lecțiilor și stabilim progresul
        this.lessons = data.map((lesson: any, index: number) => ({
          ...lesson,
          isCompleted: completedLessons.includes(lesson._id),
          isUnlocked: index === 0 || completedLessons.includes(lesson._id),
          level: lesson.level ?? 'intermediate'
        }));

        // ✅ Găsim prima lecție necompletată
        const firstIncompleteLesson = this.lessons.find(lesson => !lesson.isCompleted);

        // ✅ Setăm lecția curentă
        if (!firstIncompleteLesson) {
          // Toate lecțiile sunt completate
          this.currentLessonId = null;
          localStorage.removeItem(`currentLesson_${userId}`);
        } else {
          // Există lecții necompletate → setăm prima lecție necompletată ca fiind curentă
          this.currentLessonId = firstIncompleteLesson._id;
          localStorage.setItem(`currentLesson_${userId}`, this.currentLessonId);
        }

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
    const allCompleted = this.completedLessons.length === this.totalLessons;
  
    // ✅ Găsim prima lecție necompletată
    const firstIncompleteLesson = this.lessons.find(lesson => !this.completedLessons.includes(lesson._id));
  
    // ✅ Dacă există lecții nefinalizate, aceasta devine curentă
    if (!allCompleted && firstIncompleteLesson) {
      this.currentLessonId = firstIncompleteLesson._id;
    } else {
      this.currentLessonId = null; // Nu mai avem lecție curentă dacă toate sunt completate
    }
  
    this.lessons = this.lessons.map(lesson => ({
      ...lesson,
      isCompleted: this.completedLessons.includes(lesson._id), 
      isUnlocked: allCompleted || lesson._id === this.currentLessonId || this.completedLessons.includes(lesson._id), 
    }));
  
    // ✅ Dacă toate lecțiile sunt finalizate, eliminăm lecția curentă
    if (allCompleted) {
      this.currentLessonId = null;
      localStorage.removeItem(`currentLesson_${localStorage.getItem('userId')}`);
    } else {
      localStorage.setItem(`currentLesson_${localStorage.getItem('userId')}`, this.currentLessonId || '');
    }
  }
  

  goToLesson(lessonId: string) {
    console.log("🔹 goToLesson() called with lessonId:", lessonId);
    const lesson = this.lessons.find(lesson => lesson._id === lessonId);

    if (!lesson?.isUnlocked) return;

    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const level = lesson.level;
    console.log("🔹 Navigating to:", { lessonId, level, fullPath: `/lesson/${level}/${lessonId}` });

    // ✅ Setăm lecția curentă și salvăm în localStorage pentru utilizator
    this.currentLessonId = lessonId;
    localStorage.setItem(`currentLesson_${userId}`, lessonId);

    // ✅ Trimitem lecția ca finalizată doar dacă nu este deja în lista lecțiilor completate
    const userLevel = 'intermediate';

    if (!this.completedLessons.includes(lessonId)) {
      this.authService.markLessonsAsCompleted([lessonId], userLevel);
    }

    // ✅ Actualizăm interfața
    this.updateLessonsState();
    this.updateProgress();

    // ✅ Navigăm către lecția selectată
    this.router.navigate([`/lesson/${level}/${lessonId}`]);
  }

  goToUserProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.authService.logout();
  }
}
