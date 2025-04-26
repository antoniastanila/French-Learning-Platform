import { Component } from '@angular/core';
import { RouterModule, Router, Routes } from '@angular/router';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { provideAnimations } from '@angular/platform-browser/animations';

import { BackgroundIllustrationComponent } from '../../shared/background-illustration/background-illustration.component';
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterModule, CommonModule, BackgroundIllustrationComponent], // adăugat RouterModule pentru navigare
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy // 💡 activează URL-uri fără #
    }
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
  
})
export class HomePageComponent {

  isLoading = true;
  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
}
