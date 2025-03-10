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
      const level = localStorage.getItem('level') || 'beginner'; // 🔹 Asigură-te că nivelul este preluat corect
      console.log(`🔹 Cerere API către: /api/exercises/${this.lessonId}?level=${level}`); // ✅ Debugging în frontend

      if (this.lessonId) {
        this.exerciseService.getExercisesByLessonId(this.lessonId).subscribe(
          exercises => {
            this.exercises = exercises;
          },
          error => {
            console.error("❌ Eroare la preluarea exercițiilor:", error);
          }
        );
      }
    });
  }
  

  validateAnswer(exerciseId: string, userAnswer: string): void {
    this.http.post(`http://localhost:5000/api/exercises/${exerciseId}/validate`, { userAnswer }).subscribe((response: any) => {
      console.log("🔍 Răspuns primit de la server:", response); // ✅ Log pentru debugging
  
      this.feedbackMessage[exerciseId] = response.message;
  
      if (response.isCorrect !== undefined) { 
        this.completedExercises[exerciseId] = response.isCorrect;
      } else {
        console.error("⚠️ Proprietatea 'isCorrect' lipsește din răspunsul serverului!");
      }
  
      if (this.exercises.length === 1) {
        this.allExercisesCompleted = response.isCorrect || false;
      } else {
        this.allExercisesCompleted = Object.values(this.completedExercises).every(status => status);
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
    const level = 'beginner';
    if (!this.lessonId) return;
  
    const lessonIds = [
      '67adff85ba1cb07465fad7fe', // Lesson 1
      '67ae296eba1cb07465fad800', // Lesson 2
      '67b30e72bf5bcc73adb8f797', // Lesson 3
      '67b30ed9bf5bcc73adb8f799', // Lesson 4
      '67b30efdbf5bcc73adb8f79b', // Lesson 5
      '67b30f0fbf5bcc73adb8f79d', // Lesson 6
      '67b30f28bf5bcc73adb8f79f', // Lesson 7
      '67b30f39bf5bcc73adb8f7a1', // Lesson 8
      '67b30f46bf5bcc73adb8f7a3', // Lesson 9
      '67b30f52bf5bcc73adb8f7a5', // Lesson 10
      '67b30f5fbf5bcc73adb8f7a7', // Lesson 11
      '67b30f6dbf5bcc73adb8f7a9'  // Lesson 12
    ];
  
    const currentIndex = lessonIds.indexOf(this.lessonId);
    if (currentIndex !== -1 && currentIndex < lessonIds.length - 1) {
      const nextLessonId = lessonIds[currentIndex + 1];
      const level = 'beginner'; // 🔹 Adaptează la nivelul lecției curente
      this.router.navigate([`/lesson/${level}/${nextLessonId}`]);
    }
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
