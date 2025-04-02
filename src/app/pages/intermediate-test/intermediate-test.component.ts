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
    const existingLevel = localStorage.getItem('level');
  
    if (scorePercentage <= 10) {
      if (!existingLevel) {
        alert("Your score is too low to unlock intermediate level. Redirecting to beginner test.");
        this.router.navigate(['/beginner']);
      } else {
        alert("You did not pass the intermediate test. No changes were made to your current level.");
      }
      return;
    }
  
    this.authService.setUserLevel('intermediate').subscribe({
      next: () => {
        localStorage.setItem('level', 'intermediate');
  
        this.lessonService.getLessonsByLevel('intermediate').subscribe(intermediateLessons => {
          if (!intermediateLessons || intermediateLessons.length === 0) return;
          
          intermediateLessons.sort((a: Lesson, b: Lesson) => a.order - b.order);
        
          let startLessonIndex = 0;
          if(scorePercentage < 30){
            startLessonIndex = Math.floor(intermediateLessons.length * 0.2);
          } else if (scorePercentage > 30 && scorePercentage <= 50) {
            startLessonIndex = Math.floor(intermediateLessons.length * 0.3);
          } else if (scorePercentage > 60) {
            startLessonIndex = Math.floor(intermediateLessons.length * 0.6);
          }
        
          this.lessonId = intermediateLessons[startLessonIndex]?._id || intermediateLessons[0]._id;
        
          const completedLessons = intermediateLessons
            .slice(0, startLessonIndex)
            .map((lesson: Lesson) => lesson._id);
        
          this.authService.setCurrentLesson(this.lessonId);
          if (completedLessons.length > 0) {
            this.authService.markLessonsAsCompleted(completedLessons, 'intermediate');
          }
        
          // 🔄 Acum, după ce am setat nivelul și lecția de start, putem marca beginner-urile
          this.lessonService.getLessonsByLevel('beginner').subscribe(beginnerLessons => {
            const beginnerLessonIds = beginnerLessons.map((lesson: Lesson) => lesson._id);
            this.authService.markLessonsAsCompleted(beginnerLessonIds, 'beginner');
          });
        });
        
      },
      error: (err) => console.error('❌ Failed to update user level:', err)
    });
  }
  
  goToLesson() {
    const level = 'intermediate'; 
    console.log("🔍 Navigating to lesson:", this.lessonId, "Level:", "intermediate");
    this.router.navigate([`/lesson/${level}/${this.lessonId}`]);
    this.authService.loadUserProgress();
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
