import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { CommonModule } from '@angular/common';
import { MultipleChoiceQuestionComponent } from '../../components/multiple-choice-question/multiple-choice-question.component';
import { FillInTheBlankComponent } from '../../components/fill-in-the-blank/fill-in-the-blank.component';
import { ListeningQuestionComponent } from '../../components/listening-question/listening-question.component';
import { ReadingComprehensionComponent } from '../../components/reading-comprehension/reading-comprehension.component';
@Component({
  selector: 'app-beginner-test',
  standalone: true,
  templateUrl: './beginner-test.component.html',
  styleUrls: ['./beginner-test.component.css'],
  imports: [MultipleChoiceQuestionComponent, 
            FillInTheBlankComponent, 
            ListeningQuestionComponent, 
            ReadingComprehensionComponent,
            CommonModule]
})
export class BeginnerTestComponent implements OnInit {
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
    this.questions = this.quizService.getQuestions();
    this.totalQuestions = this.quizService.getTotalQuestions();
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

  this.isAnswered = true; // Marchez întrebarea ca fiind verificată
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
    this.lessonId = '67adff85ba1cb07465fad7fe'; // Lecția 1
  } else if (scorePercentage > 30 && scorePercentage <= 50) {
    this.lessonId = '67b30efdbf5bcc73adb8f79b'; // Lecția 5
  } else if (scorePercentage > 60) {
    this.lessonId = '67b30f52bf5bcc73adb8f7a5'; // Lecția 10
  }
}

goToLesson() {
  if (this.lessonId) {
    this.router.navigate(['/lesson', this.lessonId]);
  }
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
