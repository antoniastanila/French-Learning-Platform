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
    this.authService.loadUserProgress();
    this.username = this.authService.getUsername();

    const storedCurrentLesson = localStorage.getItem('currentLesson');

    this.authService.completedLessons$.subscribe(completedLessons => {
      this.completedLessons = completedLessons;

      this.lessonService.getLessonsByLevel('intermediate').subscribe(data => {  
        this.totalLessons = data.length;

        // ✅ Obține lecția curentă din localStorage sau determin-o
        let firstIncompleteLesson = data.find((lesson: Lesson) => !completedLessons.includes(lesson._id));
        if (storedCurrentLesson) {
          this.currentLessonId = storedCurrentLesson;
        } else if (firstIncompleteLesson) {
          this.currentLessonId = firstIncompleteLesson._id;
        }

        // ✅ Marchează lecțiile corect
        this.lessons = data.map((lesson: Lesson, index: number) => ({
          ...lesson,
          isCompleted: completedLessons.includes(lesson._id),
          isUnlocked: index === 0 || completedLessons.includes(lesson._id),
          level: 'intermediate'
        }));

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
      isCompleted: index < currentIndex, // Lecțiile anterioare sunt finalizate
      isUnlocked: index <= currentIndex, // Lecția curentă este accesibilă
    }));
  }

  goToLesson(lessonId: string) {
    console.log("🔹 goToLesson() called with lessonId:", lessonId);
    const lesson = this.lessons.find(lesson => lesson._id === lessonId);
  
    if (!lesson?.isUnlocked) return;
  
    const level = 'intermediate';
    console.log("🔹 Navigating to:", `/lesson/${level}/${lessonId}`);
  
    this.currentLessonId = lessonId;
    localStorage.setItem('currentLesson', lessonId);
  
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
