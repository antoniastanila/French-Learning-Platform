import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  showForgotModal: boolean = false;
  forgotEmail: string = '';
  forgotSuccessMessage: string = '';
  forgotErrorMessage: string = '';  

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    // ✅ initializează Google login GSI
    const clientId = '555078852596-a4cmrg9dcrru8m3p714ct642o45lhi6o.apps.googleusercontent.com';

    // Verificăm că există `google` din scriptul GSI
    if ((window as any).google && (window as any).google.accounts) {
      (window as any).google.accounts.id.initialize({
        client_id: clientId,
        callback: this.handleGoogleResponse.bind(this),
      });

      (window as any).google.accounts.id.renderButton(
        document.getElementById('g_id_signin'),
        { theme: 'outline', size: 'large' }
      );
    } else {
      console.error("🔴 Google GSI script is not loaded.");
    }
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
 
  
}
