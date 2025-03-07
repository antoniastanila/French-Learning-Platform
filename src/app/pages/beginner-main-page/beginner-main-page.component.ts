import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LessonService } from '../../services/lesson.service';
import { Lesson } from '../../models/lesson.model';

@Component({
  selector: 'app-beginner-main-page',
  standalone: true,
  templateUrl: './beginner-main-page.component.html',
  styleUrls: ['./beginner-main-page.component.css'],
  imports: [CommonModule]
})
export class BeginnerMainPageComponent implements OnInit {
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
  
      this.lessonService.getLessonsByLevel('beginner').subscribe(data => {  
        this.totalLessons = data.length;
  
        let storedCurrentLesson = localStorage.getItem(`currentLesson_${userId}`);
  
        this.lessons = data.map((lesson: any, index: number) => ({
          ...lesson,
          isCompleted: completedLessons.includes(lesson._id),
          isUnlocked: index === 0 || completedLessons.includes(lesson._id),
          level: lesson.level ?? 'beginner'
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
    isCompleted: index < currentIndex, // Lecțiile anterioare sunt finalizate
    isUnlocked: index <= currentIndex, // Lecția curentă este accesibilă
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

  // ✅ Setăm lecția curentă și salvăm în localStorage pentru utilizator
  this.currentLessonId = lessonId;
  localStorage.setItem(`currentLesson_${userId}`, lessonId);

  // ✅ Trimitem lecția ca finalizată doar dacă nu este deja în lista lecțiilor completate
  const userLevel = 'beginner'; // Sau obține nivelul utilizatorului din AuthService

  if (!this.completedLessons.includes(lessonId)) {
    this.authService.markLessonsAsCompleted([lessonId], userLevel);
  }


  // ✅ Actualizăm interfața
  this.updateLessonsState();
  this.updateProgress();

  // ✅ Navigăm către lecția selectată
  this.router.navigate([`/lesson/${level}/${lessonId}`]);
}

  


  checkIfLessonIsUnlocked(index: number): boolean {
    return index <= 1; 
  }

  goToUserProfile() {
    this.router.navigate(['/profile']); // ✅ Navighează către pagina de profil
  }

  logout() {
    this.authService.logout(); // 🔹 Apelăm logout-ul din service
  }
  
}
