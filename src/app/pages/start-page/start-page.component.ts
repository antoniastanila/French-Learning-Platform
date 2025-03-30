import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LessonService } from '../../services/lesson.service';
import { AuthService } from '../../services/auth.service';
import { Lesson } from '../../models/lesson.model';
@Component({
  selector: 'app-start-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})
export class StartPageComponent implements OnInit {
  userLevel: string | null = null;
  isFirstTime = false;
  username: string | null = null;

  beginnerButtonText = 'Jump here';
  intermediateButtonText = 'Jump here';
  advancedButtonText = 'Jump here';

  globalProgress: number = 0; // ✅ progres total
  allLessons: string[] = [];

  isReady: boolean = false;

  constructor(
              private router: Router,
              private lessonService: LessonService,
              private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userLevel = localStorage.getItem('level');
    this.username = localStorage.getItem('username');
    this.loadGlobalProgress();
  
    // 🟡 Ascultăm modificările reale ale progresului
    this.authService.completedLessons$.subscribe(completed => {
      if (!this.userLevel) {
        this.beginnerButtonText = 'Jump here';
        this.intermediateButtonText = 'Jump here';
        this.advancedButtonText = 'Jump here';
        this.isReady = true;
      } else {
        this.lessonService.getLessonsByLevel('beginner').subscribe(beginnerLessons => {
          const allBeginnerIds = beginnerLessons.map((l: Lesson) => l._id);
          const hasAllBeginnerDone = allBeginnerIds.every((id: string) => completed.includes(id));
  
          this.lessonService.getLessonsByLevel('intermediate').subscribe(intermediateLessons => {
            const allIntermediateIds = intermediateLessons.map((l: Lesson) => l._id);
            const hasAllIntermediateDone = allIntermediateIds.every((id: string) => completed.includes(id));
  
            switch (this.userLevel) {
              case 'beginner':
                this.beginnerButtonText = 'Continue Learning';
                this.intermediateButtonText = 'Jump here';
                this.advancedButtonText = 'Jump here';
                break;
              case 'intermediate':
                this.beginnerButtonText = hasAllBeginnerDone ? 'All done' : 'Jump here';
                this.intermediateButtonText = 'Continue Learning';
                this.advancedButtonText = 'Jump here';
                break;
              case 'advanced':
                this.beginnerButtonText = hasAllBeginnerDone ? 'All done' : 'Jump here';
                this.intermediateButtonText = hasAllIntermediateDone ? 'All done' : 'Jump here';
                this.advancedButtonText = 'Continue Learning';
                break;
            }
            this.isReady = true;
          });
        });
      }
    });
  
    // 🟡 Asigură-te că progresul este încărcat
    this.authService.loadUserProgress();
  }
  
  handleBeginnerClick() {
    if (!this.userLevel) {
      this.router.navigate(['/beginner']);
    } else if (this.beginnerButtonText === 'Jump here') {
      this.router.navigate(['/beginner']);
    } else {
      this.router.navigate(['/beginner-main-page']);
    }
  }

  handleIntermediateClick() {
    if (!this.userLevel) {
      this.router.navigate(['/intermediate']);
    } else if (this.intermediateButtonText === 'Jump here') {
      this.router.navigate(['/intermediate']);
    } else {
      this.router.navigate(['/intermediate-main-page']);
    }
  }

  handleAdvancedClick() {
    if (!this.userLevel) {
      this.router.navigate(['/advanced']);
    } else if (this.advancedButtonText === 'Jump here') {
      this.router.navigate(['/advanced']);
    } else {
      this.router.navigate(['/advanced-main-page']);
    }
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
  
  logout() {
    localStorage.clear();
    this.router.navigate(['/home']);
  }
  
  loadGlobalProgress() {
    const levels = ['beginner', 'intermediate', 'advanced'];
    let totalLessons: string[] = [];
    let loadedCount = 0;
  
    levels.forEach(level => {
      this.lessonService.getLessonsByLevel(level).subscribe((lessons: any[]) => {
        const ids = lessons.map(lesson => lesson._id);
        totalLessons = totalLessons.concat(ids);
        loadedCount++;
  
        if (loadedCount === levels.length) {
          // Așteaptă progresul încărcat
          this.authService.completedLessons$.subscribe(completed => {
            this.allLessons = totalLessons;
            const completedCount = totalLessons.filter(id => completed.includes(id)).length;
            this.globalProgress = (completedCount / totalLessons.length) * 100;
  
            // ✅ Opțional: salvăm progresul în localStorage dacă vrei
            localStorage.setItem('globalProgress', this.globalProgress.toFixed(2));
          });
        }
      });
    });
  }
  
}
