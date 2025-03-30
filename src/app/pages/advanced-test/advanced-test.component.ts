import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { CommonModule } from '@angular/common';
import { MultipleChoiceQuestionComponent } from '../../components/multiple-choice-question/multiple-choice-question.component';
import { FillInTheBlankComponent } from '../../components/fill-in-the-blank/fill-in-the-blank.component';
import { ListeningQuestionComponent } from '../../components/listening-question/listening-question.component';
import { ReadingComprehensionComponent } from '../../components/reading-comprehension/reading-comprehension.component';
import { AuthService } from '../../services/auth.service';
import { LessonService } from '../../services/lesson.service';
import { Lesson } from '../../models/lesson.model';

@Component({
  selector: 'app-advanced-test',
  standalone: true,
  templateUrl: './advanced-test.component.html',
  styleUrls: ['./advanced-test.component.css'],
  imports: [MultipleChoiceQuestionComponent,
            FillInTheBlankComponent,
            ListeningQuestionComponent,
            ReadingComprehensionComponent,
            CommonModule]
})
export class AdvancedTestComponent implements OnInit {
  correctAnswers = 0;
  totalQuestions = 0;
  lessonId: string = '';

  currentQuestionIndex = 0;
  score = 0;
  showResult = false;
  questions: any[] = [];

  feedbackMessage: string = '';
  isCorrect: boolean | null = null;
  selectedAnswer: string | null = null;
  isAnswered = false;

  constructor(private quizService: QuizService,
              private router: Router,
              private authService: AuthService,
              private lessonService: LessonService) {}

  ngOnInit(): void {
    this.questions = this.quizService.getQuestions('advanced');
    this.totalQuestions = this.quizService.getTotalQuestions('advanced');
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
    const isNewUser = !localStorage.getItem('currentLesson'); // ✅ verificare dacă e prima dată
  
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
  
        const markIntermediate = () => {
          this.lessonService.getLessonsByLevel('intermediate').subscribe(intermediateLessons => {
            const intermediateIds = intermediateLessons.map((l: Lesson) => l._id);
            this.authService.markLessonsAsCompleted(intermediateIds, 'intermediate');
  
            proceedWithAdvanced(); // 🔁 continuă după intermediate
          });
        };
  
        const proceedWithAdvanced = () => {
          this.lessonService.getLessonsByLevel('advanced').subscribe((advancedLessons: Lesson[]) => {
            if (!advancedLessons || advancedLessons.length === 0) return;
  
            advancedLessons.sort((a: Lesson, b: Lesson) => a.order - b.order);
  
            let startLessonIndex = 0;
            if (scorePercentage > 30 && scorePercentage <= 50) {
              startLessonIndex = Math.floor(advancedLessons.length * 0.3);
            } else if (scorePercentage > 60) {
              startLessonIndex = Math.floor(advancedLessons.length * 0.6);
            }
  
            this.lessonId = advancedLessons[startLessonIndex]?._id || advancedLessons[0]._id;
  
            const completedLessons = advancedLessons
              .slice(0, startLessonIndex)
              .map((lesson: Lesson) => lesson._id);
  
            console.log("✅ Lecția determinată:", this.lessonId);
            console.log("✅ Lecții marcate ca finalizate:", completedLessons);
  
            this.authService.setCurrentLesson(this.lessonId);
            if (completedLessons.length > 0) {
              this.authService.markLessonsAsCompleted(completedLessons, 'advanced');
            }
          });
        };
  
        // 🔹 dacă e utilizator nou → marchează și beginner
        if (isNewUser) {
          this.lessonService.getLessonsByLevel('beginner').subscribe(beginnerLessons => {
            const beginnerIds = beginnerLessons.map((lesson: Lesson) => lesson._id);
            this.authService.markLessonsAsCompleted(beginnerIds, 'beginner');
  
            markIntermediate(); // 🔁 apoi intermediate
          });
        } else {
          markIntermediate(); // 🔁 doar intermediate dacă nu e user nou
        }
      },
      error: (err) => {
        console.error('❌ Eroare la setarea nivelului advanced:', err);
      }
    });
  }
  
  
  goToLesson() {
    const level = 'advanced';
    console.log("🔹 Navigating to:", `/lesson/${level}/${this.lessonId}`);

    this.router.navigate([`/lesson/${level}/${this.lessonId}`]);

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
