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
    console.log("🔍 ngOnInit() called");
    this.authService.loadUserProgress(); // ✅ Încarcă progresul la refresh
    this.username = this.authService.getUsername(); 

    this.authService.completedLessons$.subscribe(completedLessons => {
      this.completedLessons = completedLessons;
  
      // 🔹 Obține lecțiile de nivel `intermediate`
      this.lessonService.getLessonsByLevel('intermediate').subscribe(data => {
        console.log("📌 API Response for Intermediate Lessons:", data);

        if (data.length > 0) {
          console.log("🔍 First lesson object:", data[0]); // Vezi structura primei lecții
        }

        this.totalLessons = data.length;
        this.authService.completedLessons$.subscribe(completedLessons => {
          this.completedLessons = completedLessons;
          this.updateProgress();
        });

        // 🔹 Filtrăm lecțiile pentru a afișa doar cele de nivel `intermediate`
        this.lessons = data.filter((lesson: Lesson) => lesson.level === 'intermediate').map((lesson: Lesson, index: number) => {
          const isCompleted = completedLessons.includes(lesson._id);
          return {
            ...lesson,
            isCompleted: isCompleted,
            isUnlocked: isCompleted || index === 0, // ✅ Lecțiile finalizate și prima lecție sunt deblocate
            level: lesson.level ?? 'intermediate'
          };
        });
        console.log("📌 Filtered lessons assigned to this.lessons:", this.lessons);


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
     if (this.totalLessons > 0) {
      this.progress = (this.completedLessons.length / this.totalLessons) * 100;
    }
}
  
goToLesson(lessonId: string) {
  console.log("🔹 goToLesson() called with lessonId:", lessonId); // ✅ Verifică dacă metoda este apelată
  const lesson = this.lessons.find(lesson => lesson._id === lessonId);

  console.log("🔹 Found lesson:", lesson);
  if (!lesson?.isUnlocked) return;

  const level = lesson.level; // 🔹 Extrage nivelul lecției
  console.log("🔹 goToLesson() called with:", { lessonId, level, fullPath: `/lesson/${level}/${lessonId}` });

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
