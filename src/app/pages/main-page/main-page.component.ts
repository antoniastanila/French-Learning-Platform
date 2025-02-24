import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
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
  completedLessons: string[] = [];
  currentLessonId: string | null = null; 
  username: string | null = null;
  totalLessons: number = 0;
  progress: number = 0; 

  constructor(private lessonService: LessonService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.loadUserProgress(); // ✅ Încarcă progresul la refresh
    this.username = this.authService.getUsername(); 

    this.authService.completedLessons$.subscribe(completedLessons => {
      this.completedLessons = completedLessons;
  
      this.lessonService.getLessons().subscribe(data => {
        this.totalLessons = data.length;
        this.authService.completedLessons$.subscribe(completedLessons => {
          this.completedLessons = completedLessons;
          this.updateProgress();
        });
        this.lessons = data.map((lesson: any, index: number) => {
          const isCompleted = completedLessons.includes(lesson._id);
          return {
            ...lesson,
            isCompleted: isCompleted,
            isUnlocked: isCompleted || index === 0 // ✅ Lecțiile finalizate și prima lecție sunt deblocate
          };
        });

        // ✅ Determină lecția curentă (prima lecție nefinalizată) și o deblochează
        const firstIncompleteLesson = this.lessons.find(lesson => !lesson.isCompleted);
        if (firstIncompleteLesson) {
          this.currentLessonId = firstIncompleteLesson._id;

          // ✅ Modificăm `this.lessons` ca să reflecte noua stare
          this.lessons = this.lessons.map(lesson => ({
            ...lesson,
            isUnlocked: lesson.isUnlocked || lesson._id === this.currentLessonId
          }));
        }
      });
    });
  }

updateProgress(): void {
  console.log("📌 Lecții finalizate:", this.completedLessons);
  console.log("📌 Total lecții:", this.totalLessons);

    if (this.totalLessons > 0) {
      this.progress = (this.completedLessons.length / this.totalLessons) * 100;
    }
    console.log("📌 Progres calculat:", this.progress);

  }
  
  goToLesson(lessonId: string) {
    if (!this.lessons.find(lesson => lesson._id === lessonId)?.isUnlocked) return;
    this.router.navigate(['/lesson', lessonId]);
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
