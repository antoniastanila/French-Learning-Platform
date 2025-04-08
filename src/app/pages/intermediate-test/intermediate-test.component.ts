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

  constructor(
    private quizService: QuizService,
    private router: Router,
    private authService: AuthService,
    private lessonService: LessonService
  ) {}

  ngOnInit(): void {
    this.questions = this.quizService.getQuestions('intermediate');
    this.totalQuestions = this.quizService.getTotalQuestions('intermediate');
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
