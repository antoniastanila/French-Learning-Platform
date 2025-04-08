// ✅ BEGINNER TEST COMPONENT
// File: beginner-test.component.ts
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
  selector: 'app-beginner-test',
  standalone: true,
  templateUrl: './beginner-test.component.html',
  styleUrls: ['./beginner-test.component.css'],
  imports: [MultipleChoiceQuestionComponent, FillInTheBlankComponent, ListeningQuestionComponent, ReadingComprehensionComponent, CommonModule]
})
export class BeginnerTestComponent implements OnInit {
  score = 0;
  currentQuestionIndex = 0;
  selectedAnswer: string | null = null;
  isAnswered = false;
  showResult = false;
  questions: any[] = [];
  totalQuestions = 0;
  lessonId: string = '';
  feedbackMessage: string = '';
  isCorrect: boolean | null = null;

  constructor(private quizService: QuizService, private router: Router, private authService: AuthService, private lessonService: LessonService) {}

  ngOnInit(): void {
    this.questions = this.quizService.getQuestions('beginner');
    this.totalQuestions = this.quizService.getTotalQuestions('beginner');
  }

  onAnswerSelected(option: string) {
    this.selectedAnswer = option;
  }

  checkAnswer() {
    if (!this.selectedAnswer) return;
    const current = this.questions[this.currentQuestionIndex];
    this.isCorrect = this.selectedAnswer === current.correctAnswer;
    this.feedbackMessage = this.isCorrect ? 'Correct!' : `Incorrect! The correct answer is: ${current.correctAnswer}`;
    if (this.isCorrect) this.score++;
    this.isAnswered = true;
  }

  nextQuestion() {
    this.feedbackMessage = '';
    this.isCorrect = null;
    this.selectedAnswer = null;
    this.isAnswered = false;

    if (++this.currentQuestionIndex >= this.questions.length) {
      this.showResult = true;
      this.determineLesson();
    }
  }

  determineLesson() {
    const scorePercentage = (this.score / this.totalQuestions) * 100;
  
    this.authService.setUserLevel('beginner').subscribe({
      next: () => {
        localStorage.setItem('level', 'beginner');
  
        this.lessonService.getLessonsByLevel('beginner').subscribe((lessons: Lesson[]) => {
          if (!lessons || lessons.length === 0) return;
  
          lessons.sort((a: Lesson, b: Lesson) => a.order - b.order);
  
          let startIndex = 0;
          if (scorePercentage < 30) {
            startIndex = Math.floor(lessons.length * 0.2);
          } else if (scorePercentage > 30 && scorePercentage <= 50) {
            startIndex = Math.floor(lessons.length * 0.3);
          } else if (scorePercentage > 60) {
            startIndex = Math.floor(lessons.length * 0.6);
          }
  
          this.lessonId = lessons[startIndex]?._id || lessons[0]._id;
  
          const completedLessons = lessons
            .slice(0, startIndex)
            .map((l: Lesson) => l._id);
  
          this.authService.setCurrentLesson(this.lessonId);
          if (completedLessons.length > 0) {
            this.authService.markLessonsAsCompleted(completedLessons, 'beginner');
          }
        });
      },
      error: (err: any) => {
        console.error('❌ Eroare la setarea nivelului beginner:', err);
      }
    });
  }
  goToLesson() {
    this.router.navigate([`/lesson/beginner/${this.lessonId}`]);
    this.authService.loadUserProgress();
  }

  goToMainPage() {
    this.router.navigate(['/beginner-main-page']);
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


