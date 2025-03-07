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
@Component({
  selector: 'app-intermediate-test',
  standalone: true,
  templateUrl: './intermediate-test.component.html',
  styleUrls: ['./intermediate-test.component.css'],
  imports: [MultipleChoiceQuestionComponent, 
            FillInTheBlankComponent, 
            ListeningQuestionComponent, 
            ReadingComprehensionComponent,
            CommonModule]
})
export class IntermediateTestComponent implements OnInit {
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
              private lessonService: LessonService, 
              private authService: AuthService
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
  
    this.lessonService.getLessonsByLevel('intermediate').subscribe(lessons => {
      // 🔹 Sortează lecțiile după ordinea lor naturală (poți avea un field `order` în DB)
      lessons.sort((a: any, b: any) => a.order - b.order);
  
      let startingIndex = 0;
      if (scorePercentage > 30 && scorePercentage <= 50) {
        startingIndex = 4; // Lecția 5
      } else if (scorePercentage > 60) {
        startingIndex = 9; // Lecția 10
      }
  
      if (startingIndex < lessons.length) {
        this.lessonId = lessons[startingIndex]._id;
  
        // 🔹 Marchează toate lecțiile anterioare ca fiind finalizate
        const completedLessons = lessons.slice(0, startingIndex).map((lesson: any) => lesson._id);
  
        console.log("✅ Lecția de start:", this.lessonId);
        console.log("✅ Lecții finalizate:", completedLessons);
  
        // 🔹 Trimite progresul utilizatorului către backend
        this.authService.markLessonsAsCompleted(completedLessons, 'intermediate');
  
        // 🔹 Setează lecția curentă
        this.authService.setCurrentLesson(this.lessonId);
      }
    });
  }
  
  goToLesson() {
    if (this.lessonId) {
      console.log("🔍 Navigating to lesson:", this.lessonId, "Level:", "intermediate");
      this.router.navigate([`/lesson/intermediate/${this.lessonId}`]);
    }
  }
  
  

  goToIntermediateMainPage() {
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
