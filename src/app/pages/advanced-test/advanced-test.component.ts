import { Component, OnInit, HostListener, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../services/quiz.service';
import { AuthService } from '../../services/auth.service';
import { LessonService } from '../../services/lesson.service';
import { Lesson } from '../../models/lesson.model';
import { MultipleChoiceQuestionComponent } from '../../components/multiple-choice-question/multiple-choice-question.component';
import { FillInTheBlankComponent } from '../../components/fill-in-the-blank/fill-in-the-blank.component';
import { ListeningQuestionComponent } from '../../components/listening-question/listening-question.component';
import { ReadingComprehensionComponent } from '../../components/reading-comprehension/reading-comprehension.component';
import { catchError, forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PlacementTestService } from '../../services/placement-test.service';

@Component({
  selector: 'app-advanced-test',
  standalone: true,
  templateUrl: './advanced-test.component.html',
  styleUrls: ['./advanced-test.component.css'],
  imports: [
    CommonModule,
    MultipleChoiceQuestionComponent,
    FillInTheBlankComponent,
    ListeningQuestionComponent,
    ReadingComprehensionComponent
  ]
})
export class AdvancedTestComponent implements OnInit {
  currentQuestionIndex = 0;
  score = 0;
  totalQuestions = 0;
  lessonId: string = '';
  questions: any[] = [];
  showResult = false;
  isAnswered = false;
  selectedAnswer: string | null = null;
  feedbackMessage: string = '';
  isCorrect: boolean | null = null;
fireworks: { x?: string; y: string; color: string; delay: string; left?: number }[] = [];

showLeaveWarning = false;
  private ignoreNavigation = false;

  constructor(
    private quizService: QuizService,
    private router: Router,
    private authService: AuthService,
    private lessonService: LessonService,
    private renderer: Renderer2,

    private placementTestService: PlacementTestService

  ) {}
  @HostListener('window:beforeunload', ['$event'])
handleBeforeUnload(event: BeforeUnloadEvent) {
    if (!this.showResult) {
      event.preventDefault();
      event.returnValue = ''; // necesar pentru unele browsere
    }
  }
  ngOnInit(): void {
   //history.pushState(null, '', location.href);

    window.addEventListener('popstate', this.handleBrowserBack);

    this.placementTestService.getTestQuestions('advanced').subscribe({
      next: (data) => {
        this.questions = data;
        this.totalQuestions = data.length;
        console.log('📌 Întrebări primite pentru advanced test:', data.map(q => q.questionType));
      },
      error: (err) => {
        console.error('❌ Eroare la încărcarea întrebărilor pentru testul advanced:', err);
      }
    });
     const savedTheme = localStorage.getItem('selectedTheme') || 'theme-light';
    this.renderer.setAttribute(document.body, 'class', savedTheme);
   
    
  }

  
canDeactivate(): Promise<boolean> {
  if (this.showResult) return Promise.resolve(true);

  this.showLeaveWarning = true;

  return new Promise((resolve) => {
    this.confirmationResolver = resolve;
  });
}


confirmationResolver: ((confirmed: boolean) => void) | null = null;

handleBrowserBack = (event: PopStateEvent) => {
  if (!this.ignoreNavigation && !this.showResult) {
    this.showLeaveWarning = true;

    // pushState din nou ca să păstrezi utilizatorul pe pagină
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

ngOnDestroy(): void {
  window.removeEventListener('popstate', this.handleBrowserBack);
}

    normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')              // descompune caracterele cu diacritice
    .replace(/[\u0300-\u036f]/g, '') // elimină diacriticele
    .replace(/\s+/g, ' ')          // normalizează spațiile multiple
    .trim();                       // elimină spațiile de la început/sfârșit
}

generateFireworks() {
  this.fireworks = [];
  const colors = ['red', 'blue', 'yellow', 'magenta', 'lime', 'cyan', 'orange'];

  const launcherConfigs = [
    { left: 90, directionX: 1 },   // launcher stânga
    { left: 580, directionX: -1 }  // launcher dreapta
  ];

  launcherConfigs.forEach(launcher => {
    for (let i = 0; i < 15; i++) {
      const horizontalSpread = launcher.directionX * (Math.random() * 60 + 10); // ±70px
      const verticalHeight = -(Math.random() * 140 + 100); // până la -240px
      const offsetLeft = Math.floor(Math.random() * 20 - 10); // ±10px pentru plecare

      this.fireworks.push({
        x: `${horizontalSpread}px`,
        y: `${verticalHeight}px`,
        delay: `${(Math.random() * 1.2).toFixed(2)}s`,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: launcher.left + offsetLeft
      });
    }
  });
}

  onAnswerSelected(selectedOption: string) {
    this.selectedAnswer = selectedOption;
  }

  checkAnswer() {
    if (this.selectedAnswer === null) return;

    const currentQuestion = this.questions[this.currentQuestionIndex];
   if (this.normalizeText(this.selectedAnswer) === this.normalizeText(currentQuestion.correctAnswer)) {
  this.score++;
  this.feedbackMessage = 'Correct!';
  this.isCorrect = true;
} else {
  this.feedbackMessage = `Incorrect! The correct answer is: ${currentQuestion.correctAnswer}`;
  this.isCorrect = false;
}


    this.isAnswered = true;
  }

  nextQuestion() {
    this.feedbackMessage = '';
    this.isCorrect = null;
    this.selectedAnswer = null;
    this.isAnswered = false;

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.showResult = true;
      this.generateFireworks();
      this.determineLesson();
    }
  }

  determineLesson() {
    const scorePercentage = (this.score / this.totalQuestions) * 100;
    const existingLevel = localStorage.getItem('level');

    if (scorePercentage <= 10) {
      if (!existingLevel) {
        alert("Your score is too low to unlock advanced level. Redirecting to intermediate test.");
        this.router.navigate(['/intermediate']);
      } else {
        alert("You did not pass the advanced test. Your current level remains unchanged.");
      }
      return;
    }

    this.authService.setUserLevel('advanced').subscribe({
      next: () => {
        localStorage.setItem('level', 'advanced');

        this.lessonService.getLessonsByLevel('advanced').subscribe((advancedLessons: Lesson[]) => {
          if (!advancedLessons || advancedLessons.length === 0) return;

          advancedLessons.sort((a: Lesson, b: Lesson) => a.order - b.order);

          let startIndex = 0;
          if (scorePercentage < 30) {
            startIndex = Math.floor(advancedLessons.length * 0.2);
          } else if (scorePercentage > 30 && scorePercentage <= 50) {
            startIndex = Math.floor(advancedLessons.length * 0.3);
          } else if (scorePercentage > 60) {
            startIndex = Math.floor(advancedLessons.length * 0.6);
          }

          this.lessonId = advancedLessons[startIndex]?._id || advancedLessons[0]._id;

          const completedAdvanced = advancedLessons
            .slice(0, startIndex)
            .map((l: Lesson) => l._id);

          const markAdvanced$ = completedAdvanced.length > 0
            ? this.authService.markLessonsAsCompleted$(completedAdvanced, 'advanced')
            : of(null);

          const markIntermediate$ = this.lessonService.getLessonsByLevel('intermediate').pipe(
            switchMap((intermediateLessons: Lesson[]) => {
              const ids = intermediateLessons.map((l: Lesson) => l._id);
              return this.authService.markLessonsAsCompleted$(ids, 'intermediate');
            }),
            catchError(err => {
              console.error("❌ markIntermediate$ failed:", err);
              return of(null);
            })
          );

          const markBeginner$ = this.lessonService.getLessonsByLevel('beginner').pipe(
            switchMap((beginnerLessons: Lesson[]) => {
              const ids = beginnerLessons.map((l: Lesson) => l._id);
              return this.authService.markLessonsAsCompleted$(ids, 'beginner');
            }),
            catchError(err => {
              console.error("❌ markBeginner$ failed:", err);
              return of(null);
            })
          );

          forkJoin([markAdvanced$, markIntermediate$, markBeginner$]).subscribe({
            next: () => {
              this.authService.setCurrentLesson(this.lessonId);
              this.authService.loadUserProgress();
            },
            error: (err: any) => {
              console.error('❌ Failed to mark lessons as completed:', err);
            }
          });
        });
      },
      error: (err: any) => console.error('❌ Failed to update user level to advanced:', err)
    });
  }

  goToLesson() {
    this.router.navigate([`/lesson/advanced/${this.lessonId}`]);
    this.authService.loadUserProgress();
  }

  goToMainPage() {
    this.router.navigate(['/advanced-main-page']);
  }

  resetQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.showResult = false;
    this.feedbackMessage = '';
    this.isCorrect = null;
    this.selectedAnswer = null;
    this.isAnswered = false;
  }
}
