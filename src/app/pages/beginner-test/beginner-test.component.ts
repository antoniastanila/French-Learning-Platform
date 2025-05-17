import { Component, OnInit, Renderer2, HostListener  } from '@angular/core';
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
import { PlacementTestService } from '../../services/placement-test.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-beginner-test',
  standalone: true,
  templateUrl: './beginner-test.component.html',
  styleUrls: ['./beginner-test.component.css'],
  imports: [MultipleChoiceQuestionComponent, FormsModule, FillInTheBlankComponent, ListeningQuestionComponent, ReadingComprehensionComponent, CommonModule]
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
  fireworks: { x?: string; y: string; color: string; delay: string; left?: number }[] = [];

  showLeaveWarning = false;
  private ignoreNavigation = false;

  constructor(private quizService: QuizService, 
              private router: Router, 
              private authService: AuthService, 
              private lessonService: LessonService, 
              private renderer: Renderer2,
              private placementTestService: PlacementTestService) {}

    
  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent) {
    if (!this.showResult) {
      event.preventDefault();
      event.returnValue = ''; // necesar pentru unele browsere
    }
  }
  ngOnInit(): void {
   // history.pushState(null, '', location.href);

    window.addEventListener('popstate', this.handleBrowserBack);

    this.placementTestService.getTestQuestions('beginner').subscribe({
      next: (data) => {
        this.questions = data;
        this.totalQuestions = data.length;
        console.log("📌 Întrebări primite din MongoDB:", data);
        console.log("📊 Tipuri de întrebări:", this.questions.map(q => q.questionType));
      },
      error: (err) => {
        console.error('❌ Eroare la încărcarea întrebărilor din backend:', err);
      }
    });
  
  //   if (this.showResult) {
  //   this.generateFireworks(); 
  // }
    const savedTheme = localStorage.getItem('selectedTheme') || 'theme-light';
    this.renderer.setAttribute(document.body, 'class', savedTheme);
   // window.addEventListener('popstate', this.handleBrowserBack);

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


  onAnswerSelected(option: string) {
    this.selectedAnswer = option;
  }

  checkAnswer() {
    if (!this.selectedAnswer) return;
    const current = this.questions[this.currentQuestionIndex];
    this.isCorrect = this.normalizeText(this.selectedAnswer) === this.normalizeText(current.correctAnswer);
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
      this.generateFireworks();
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


