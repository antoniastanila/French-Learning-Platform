import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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
export class ExerciseDetailComponent implements OnInit, OnDestroy {
  exercises: any[] = [];
  lessonId: string | null = null;
  selectedAnswer: string = ""; 
  feedbackMessage: string = ""; 
  currentExerciseIndex: number = 0; 

  allExercisesCompleted: boolean = false; // Inițial, butonul va fi ascuns
  completedExercises: { [key: string]: boolean } = {}; // Obiect pentru a ține evidența răspunsurilor corecte
  lessonCompleted: boolean = false;

  wrongExercisesIndexes: number[] = []; // Lista cu indexurile exercițiilor greșite
  reviewingWrongExercises: boolean = false; // Flag pentru a ști dacă revenim la exerciții greșite  

  isAnswered: boolean = false;
  wasAnswerCorrect: boolean | null = null; 

  showReviewMessage: boolean = false;
  reviewFadeClass: string = ''; 

  showLeaveWarning = false;
  private ignoreNavigation = false;
  
  confirmationResolver: ((confirmed: boolean) => void) | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private exerciseService: ExerciseService,  private router: Router, private authService: AuthService) {}

  
 ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
        this.lessonId = params.get('lessonId');
        this.route.queryParams.subscribe(queryParams => {
            const level = queryParams['level'] || 'beginner';
            console.log(`🔹 Cerere API către: /api/exercises/${this.lessonId}?level=${level}`);
            if (this.lessonId) {
                this.exerciseService.getExercisesByLessonId(this.lessonId, level).subscribe(
                    response => {
                        console.log("📌 Exercițiile primite:", response);
                        
                        // ✅ Extragerea exercițiilor corecte
                        if (Array.isArray(response) && response.length > 0 && response[0].exercises) {
                            const allExercises = response[0].exercises;
                            this.exercises = this.getRandomExercises(allExercises, 10);
                        } else {
                            this.exercises = [];
                        }
                    },
                    error => {
                        console.error("❌ Eroare la preluarea exercițiilor:", error);
                    }
                );
            }
        });
    });
    window.addEventListener('popstate', this.handleBrowserBack);
  }

 
  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent) {
    if (!this.allExercisesCompleted) {
      event.preventDefault();
      event.returnValue = ''; // necesar pentru unele browsere
    }
  }

 handleBrowserBack = (event: PopStateEvent) => {
  if (!this.ignoreNavigation && !this.allExercisesCompleted && !this.showLeaveWarning) {
    this.showLeaveWarning = true;

    // Adăugăm un nou entry în istoric doar o dată, la prima interceptare
    history.pushState(null, '', location.href);
  }
};

  confirmExit() {
    this.ignoreNavigation = true;
    this.showLeaveWarning = false;
    this.confirmationResolver?.(true);
    history.back(); 
  }

  stayOnPage() {
    this.showLeaveWarning = false;
    this.confirmationResolver?.(false);
  }

  canDeactivate(): Promise<boolean> {
      console.log('🛑 Interceptare canDeactivate');

    if (this.allExercisesCompleted) return Promise.resolve(true);
    this.showLeaveWarning = true;
    return new Promise((resolve) => {
      this.confirmationResolver = resolve;
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('popstate', this.handleBrowserBack);
  }


 getRandomExercises(array: any[], count: number): any[] {
    const copied = [...array]; // 🔸 Copie locală ca să nu afectăm originalul
    const selected: any[] = [];
  
    while (selected.length < count && copied.length > 0) {
      const randomIndex = Math.floor(Math.random() * copied.length);
      const [exercise] = copied.splice(randomIndex, 1); // 🔸 Extrage și elimină
      selected.push(exercise);
    }
  
    return selected;
  }
  
  
    // ✅ Returnează exercițiul curent
    getCurrentExercise() {
        return this.exercises[this.currentExerciseIndex];
    }

    // ✅ Trecerea la următorul exercițiu
    nextExercise() {
        if (!this.reviewingWrongExercises) {
          // 🔹 Modul normal de parcurgere
          if (this.currentExerciseIndex < this.exercises.length - 1) {
            this.currentExerciseIndex++;
          } else if (this.wrongExercisesIndexes.length > 0) {
            // 🔹 Începem revizuirea exercițiilor greșite
            this.reviewingWrongExercises = true;
            this.currentExerciseIndex = this.wrongExercisesIndexes.shift()!;
          
            // ✅ Resetăm starea exercițiului înainte de return!
            this.isAnswered = false;
            this.selectedAnswer = "";
            this.feedbackMessage = "";
            this.wasAnswerCorrect = null;
          
            // ✅ Afișăm mesajul animat pentru revizuire
            this.showReviewMessage = true;

            this.reviewFadeClass = 'fade-in';
          
            setTimeout(() => {
              this.reviewFadeClass = 'fade-out';
            }, 4000);
          
            setTimeout(() => {
              this.showReviewMessage = false;
              this.reviewFadeClass = '';
            }, 5500);
          
            return;     
          } else {
            // 🔹 Finalizare lecție
            console.log("🎉 Ai terminat toate exercițiile!");
            this.allExercisesCompleted = true;
            return;
          }
        } else {
          // 🔹 Modul de revizuire a exercițiilor greșite
          if (this.wrongExercisesIndexes.length > 0) {
            this.currentExerciseIndex = this.wrongExercisesIndexes.shift()!;
          } else {
            // 🔹 Finalizarea lecției după corectarea tuturor exercițiilor greșite
            console.log("🎉 Ai terminat toate exercițiile, inclusiv cele greșite!");
            this.allExercisesCompleted = true;
            this.reviewingWrongExercises = false;
            return;
          }
        }
      
        // 🔹 Resetăm răspunsurile și feedback-ul pentru noul exercițiu
        this.isAnswered = false;
        this.selectedAnswer = "";
        this.feedbackMessage = "";
        this.wasAnswerCorrect = null;

    }
      
  
  validateAnswer() {
    console.log("📌 Validate answer called");
    const currentExercise = this.getCurrentExercise();
    if (!currentExercise) return;

    const userAnswer = this.selectedAnswer;

    const normalizedUserAnswer = this.normalizeText(userAnswer);
    const normalizedCorrectAnswer = this.normalizeText(currentExercise.correctAnswer);
    
    if (normalizedUserAnswer === normalizedCorrectAnswer) { 
        this.feedbackMessage = "Correct!  ";
        this.wasAnswerCorrect = true;
        const wrongIndex = this.wrongExercisesIndexes.indexOf(this.currentExerciseIndex);
        if (wrongIndex !== -1) {
            this.wrongExercisesIndexes.splice(wrongIndex, 1);
        }

    } else {
        this.feedbackMessage = `Incorrect! Correct solution: ${currentExercise.correctAnswer}`;
        this.wasAnswerCorrect = false;
        if (!this.wrongExercisesIndexes.includes(this.currentExerciseIndex)) { 
            this.wrongExercisesIndexes.push(this.currentExerciseIndex);
        }
    }
    this.isAnswered = true;

}

  
  completeLesson() {
      if (this.lessonId) {
          const userLevel = this.authService.getUserLevel(); // 🔹 Preluăm nivelul utilizatorului
          this.authService.markLessonsAsCompleted([this.lessonId], userLevel);
          this.lessonCompleted = true; // 🔹 Marchează vizual lecția ca fiind completată
      }
  }

  finishLesson() {
    this.completeLesson(); // Apelează funcția existentă care marchează lecția
    this.allExercisesCompleted = true;
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
  
  shouldShowFinishLessonButton(): boolean {
    return this.isAnswered &&
      this.wrongExercisesIndexes.length === 0 &&
      !this.allExercisesCompleted &&
      (
        (!this.reviewingWrongExercises && this.currentExerciseIndex === this.exercises.length - 1) ||
        (this.reviewingWrongExercises && this.wrongExercisesIndexes.length === 0)
      );
  }
  
  normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize("NFD") // Descompune caracterele cu diacritice
      .replace(/[\u0300-\u036f]/g, ""); // Elimină diacriticele
  }
  

}
