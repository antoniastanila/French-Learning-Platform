import { Component, OnInit } from '@angular/core';
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
  currentQuestionIndex = 0;  
  score = 0; 
  showResult = false;  
  questions: any[] = [];  

  feedbackMessage: string = '';  
  isCorrect: boolean | null = null;
  selectedAnswer: string | null = null; 
  isAnswered = false;  

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.questions = this.quizService.getQuestions();
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
