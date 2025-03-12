import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ExerciseService } from '../../services/exercise.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-exercise-detail',
  standalone: true,
  templateUrl: './exercise-detail.component.html',
  styleUrls: ['./exercise-detail.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ExerciseDetailComponent implements OnInit {
  exercises: any[] = [];
  lessonId: string | null = null;
  selectedAnswer: { [key: string]: string } = {}; 
  feedbackMessage: { [key: string]: string } = {}; 

  allExercisesCompleted: boolean = false; // Inițial, butonul va fi ascuns
  completedExercises: { [key: string]: boolean } = {}; // Obiect pentru a ține evidența răspunsurilor corecte
  lessonCompleted: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient, private exerciseService: ExerciseService,  private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
        this.lessonId = params.get('lessonId');

        this.route.queryParams.subscribe(queryParams => {
            const level = queryParams['level'] || 'beginner'; // 🔹 Preia level din URL

            console.log(`🔹 Cerere API către: /api/exercises/${this.lessonId}?level=${level}`); // ✅ Debugging în frontend

            if (this.lessonId) {
                this.exerciseService.getExercisesByLessonId(this.lessonId, level).subscribe(
                    exercises => {
                        this.exercises = exercises;
                    },
                    error => {
                        console.error("❌ Eroare la preluarea exercițiilor:", error);
                    }
                );
            }
        });
    });
}



  validateAnswer(exerciseId: string, userAnswer: string): void {
    this.http.post(`http://localhost:5000/api/exercises/${exerciseId}/validate`, { userAnswer }).subscribe((response: any) => {
      console.log("🔍 Răspuns primit de la server:", response); // ✅ Debugging
  
      this.feedbackMessage[exerciseId] = response.message;
  
      if (response.isCorrect !== undefined) { 
        this.completedExercises[exerciseId] = response.isCorrect;
      } else {
        console.error("⚠️ Proprietatea 'isCorrect' lipsește din răspunsul serverului!");
      }
  
      // ✅ Verifică dacă toate exercițiile sunt completate corect
      this.allExercisesCompleted = Object.values(this.completedExercises).every(status => status);

      if (this.allExercisesCompleted) {
        this.completeLesson(); // ✅ Marchează lecția ca fiind completată automat
      }
    });
}

  
  completeLesson() {
    if (this.lessonId) {
        const userLevel = this.authService.getUserLevel(); // 🔹 Preluăm nivelul utilizatorului
        this.authService.markLessonsAsCompleted([this.lessonId], userLevel);
        this.lessonCompleted = true; // 🔹 Marchează vizual lecția ca fiind completată
    }
}

goToNextLesson() {
  if (!this.lessonId) return;

  const level = this.route.snapshot.queryParams['level'] || 'beginner'; // 🔹 Preia nivelul din URL

  this.exerciseService.getLessonsByLevel(level).subscribe(
      (lessons: any[]) => {
          console.log("📌 Lecții returnate de backend:", lessons); // ✅ Debugging

          const lessonIds = lessons.map(lesson => lesson._id); 
          console.log("📌 Lista de ID-uri ale lecțiilor:", lessonIds); // ✅ Debugging

          const currentIndex = lessonIds.indexOf(this.lessonId);
          console.log("📌 Index lecție curentă:", currentIndex); // ✅ Debugging

          if (currentIndex !== -1 && currentIndex < lessonIds.length - 1) {
              const nextLessonId = lessonIds[currentIndex + 1];
              console.log("📌 Navigare către lecția următoare:", nextLessonId); // ✅ Debugging

              this.router.navigate([`/lesson/${level}/${nextLessonId}`]);
          } else {
              console.warn("⚠️ Nu există lecție următoare!");
          }
      },
      error => {
          console.error("❌ Eroare la preluarea lecțiilor:", error);
      }
  );
}


  
  goToMainPage() {
    const userLevel = localStorage.getItem('level') || 'beginner'; // 🔹 Preluăm nivelul utilizatorului
    
    let mainPageRoute = '/beginner-main-page'; // Default
    
    if (userLevel === 'intermediate') {
      mainPageRoute = '/intermediate-main-page';
    } else if (userLevel === 'advanced') {
      mainPageRoute = '/advanced-main-page';
    }
  
    console.log(`🔹 Navigare către: ${mainPageRoute}`);
    this.router.navigate([mainPageRoute]);
  }
  

}
