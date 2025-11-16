import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';
import { BackgroundIllustrationComponent } from '../../shared/background-illustration/background-illustration.component';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, BackgroundIllustrationComponent],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LoginPageComponent implements AfterViewInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  showForgotModal: boolean = false;
  forgotEmail: string = '';
  forgotSuccessMessage: string = '';
  forgotErrorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) { }

  ngAfterViewInit(): void {
    const clientId = '596657709262-5i5u1htr50lmd3gbfaqflh0ihsb4f4ds.apps.googleusercontent.com';

    setTimeout(() => {
      const g = (window as any).google;
      const target = document.getElementById('g_id_signin');

      if (g?.accounts?.id && target) {
        g.accounts.id.initialize({
          client_id: clientId,
          callback: this.handleGoogleResponse.bind(this),
        });

        g.accounts.id.renderButton(target, {
          theme: 'outline',
          size: 'large',
          width: '300', // poți ajusta
        });
      } else {
        console.warn('🔴 Google GSI script or target element not ready.');
      }
    }, 100); // 100ms delay pentru siguranță
  }

  handleGoogleResponse(response: any): void {
    const idToken = response.credential;
    this.authService.loginWithGoogle(idToken).subscribe({
      next: (res: any) => {
        // Salvează în localStorage
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.user._id);
        localStorage.setItem('username', res.user.username);
        localStorage.setItem('email', res.user.email);
        localStorage.setItem('level', res.user.level || 'beginner');
        localStorage.setItem('profilePicUrl', res.user.profilePicUrl || '');
        localStorage.setItem('firstName', res.user.firstName || '');
        localStorage.setItem('lastName', res.user.lastName || '');
        localStorage.setItem('createdAt', res.user.createdAt || '');

        // ⬇️ Asta lipsea! Trebuie setat manual aici pentru a merge profilul
        this.authService.updateUserProfile(res.user);

        this.router.navigate(['/start-page']);
      },
      error: (err) => {
        console.error("❌ Google login failed:", err);
        this.errorMessage = 'Google login failed. Please try again.';
      }
    });
  }

  onSubmit(form: NgForm): void {
    console.log('✅ onSubmit called', form.value); // DEBUG
    if (form.invalid) {
      this.errorMessage = 'Please enter a valid email and password.';
      return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.user._id);
        localStorage.setItem('username', res.user.username);
        localStorage.setItem('email', res.user.email);
        localStorage.setItem('level', res.user.level || 'beginner');
        localStorage.setItem('profilePicUrl', res.user.profilePicUrl || '');
        localStorage.setItem('firstName', res.user.firstName || '');
        localStorage.setItem('lastName', res.user.lastName || '');
        localStorage.setItem('createdAt', res.user.createdAt || '');

        // 🔥 CRUCIAL: fără asta, userProfile$ rămâne null până la refresh
        this.authService.updateUserProfile(res.user);

        this.router.navigate(['/start-page']);
      },
      error: () => {
        this.errorMessage = 'Login failed. Please try again.';
      }
    });
  }

  sendResetLink(): void {
    this.forgotSuccessMessage = '';
    this.forgotErrorMessage = '';

    this.http.post('/api/users/forgot-password', { email: this.forgotEmail }).subscribe({
      next: () => {
        this.forgotSuccessMessage = 'Reset link sent! Check your email.';
        this.forgotErrorMessage = '';
        this.forgotEmail = '';
      },
      error: err => {
        this.forgotErrorMessage = err.error?.message || 'Something went wrong';
      }
    });
  }

  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }

}
