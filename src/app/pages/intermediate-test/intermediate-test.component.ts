import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { CommonModule } from '@angular/common';
import { MultipleChoiceQuestionComponent } from '../../components/multiple-choice-question/multiple-choice-question.component';
import { FillInTheBlankComponent } from '../../components/fill-in-the-blank/fill-in-the-blank.component';
import { ListeningQuestionComponent } from '../../components/listening-question/listening-question.component';
import { ReadingComprehensionComponent } from '../../components/reading-comprehension/reading-comprehension.component';

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

  constructor(private quizService: QuizService, private router: Router) {}

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

    if (scorePercentage <= 30) {
      this.lessonId = '67b3a1f0bf5bcc73adb8f7c1'; // Lecția 1 - intermediate
    } else if (scorePercentage > 30 && scorePercentage <= 50) {
      this.lessonId = '67b3a1f4bf5bcc73adb8f7c5'; // Lecția 5 - intermediate
    } else if (scorePercentage > 60) {
      this.lessonId = '67b3a1f9bf5bcc73adb8f7ca'; // Lecția 10 - intermediate
    }
  }

  goToLesson() {
    if (this.lessonId) {
      console.log("🔍 Navigating to lesson:", this.lessonId, "Level:", "intermediate");
      this.router.navigate([`/lesson/intermediate/${this.lessonId}`]);
    }
  }
  
  

  goToMainPage() {
    this.router.navigate(['/main-page']);
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
