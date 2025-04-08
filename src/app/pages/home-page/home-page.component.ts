import { Component } from '@angular/core';
import { RouterModule, Router, Routes } from '@angular/router';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

// Poți importa aici alte componente pe care le rutezi, dacă vrei
// import { LoginPageComponent } from '../login-page/login-page.component';
// import { SignupPageComponent } from '../signup-page/signup-page.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterModule], // adăugat RouterModule pentru navigare
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy // 💡 activează URL-uri fără #
    }
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
}
