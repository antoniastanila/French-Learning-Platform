import { Component, OnInit } from '@angular/core';
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
import { catchError, of, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PlacementTestService } from '../../services/placement-test.service'; // ✅ import nou
import { Renderer2 } from '@angular/core';
@Component({
  selector: 'app-intermediate-test',
  standalone: true,
  templateUrl: './intermediate-test.component.html',
  styleUrls: ['./intermediate-test.component.css'],
  imports: [
    CommonModule,
    MultipleChoiceQuestionComponent,
    FillInTheBlankComponent,
    ListeningQuestionComponent,
    ReadingComprehensionComponent
  ]
})
export class IntermediateTestComponent implements OnInit {
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

  constructor(
    private quizService: QuizService,
    private router: Router,
    private authService: AuthService,
    private lessonService: LessonService,
    private placementTestService: PlacementTestService,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('selectedTheme') || 'theme-light';
    this.renderer.setAttribute(document.body, 'class', savedTheme);
    this.placementTestService.getTestQuestions('intermediate').subscribe({
      next: (data) => {
        this.questions = data;
        this.totalQuestions = data.length;
        console.log('✅ Întrebări intermediate + ultimele 5 beginner:', data.map(q => q.questionType));
      },
      error: (err) => {
        console.error('❌ Eroare la încărcarea întrebărilor pentru testul intermediar:', err);
      }
    });
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
    if (this.selectedAnswer === currentQuestion.correctAnswer) {
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
        alert('Your score is too low to unlock intermediate level. Redirecting to beginner test.');
        this.router.navigate(['/beginner']);
      } else {
        alert('You did not pass the intermediate test. No changes were made to your current level.');
      }
      return;
    }

    this.authService.setUserLevel('intermediate').subscribe({
      next: () => {
        localStorage.setItem('level', 'intermediate');

        this.lessonService.getLessonsByLevel('intermediate').subscribe((intermediateLessons: Lesson[]) => {
          if (!intermediateLessons || intermediateLessons.length === 0) return;

          intermediateLessons.sort((a: Lesson, b: Lesson) => a.order - b.order);

          let startIndex = 0;
          if (scorePercentage < 30) {
            startIndex = Math.floor(intermediateLessons.length * 0.2);
          } else if (scorePercentage > 30 && scorePercentage <= 50) {
            startIndex = Math.floor(intermediateLessons.length * 0.3);
          } else if (scorePercentage > 60) {
            startIndex = Math.floor(intermediateLessons.length * 0.6);
          }

          this.lessonId = intermediateLessons[startIndex]?._id || intermediateLessons[0]._id;

          const completedIntermediate = intermediateLessons
            .slice(0, startIndex)
            .map((lesson: Lesson) => lesson._id);

          const markIntermediate$ = completedIntermediate.length > 0
            ? this.authService.markLessonsAsCompleted$(completedIntermediate, 'intermediate')
            : of(null);

          const markBeginner$ = this.lessonService.getLessonsByLevel('beginner').pipe(
            switchMap((beginnerLessons: Lesson[]) => {
              const beginnerIds = beginnerLessons.map((l: Lesson) => l._id);
              return this.authService.markLessonsAsCompleted$(beginnerIds, 'beginner');
            }),
            catchError(err => {
              console.error("❌ markBeginner$ failed:", err);
              return of(null);
           })
          );

          forkJoin([markIntermediate$, markBeginner$]).subscribe({
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
      error: (err: any) => console.error('❌ Failed to update user level to intermediate:', err)
    });
  }

  goToLesson() {
    this.router.navigate([`/lesson/intermediate/${this.lessonId}`]);
    this.authService.loadUserProgress();
  }

  goToMainPage() {
    this.router.navigate(['/intermediate-main-page']);
  }

}
