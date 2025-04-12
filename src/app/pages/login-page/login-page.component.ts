import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

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

  constructor(private authService: AuthService, private router: Router) {}

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
    console.log("📤 Sending ID token to backend:", idToken);
    this.authService.loginWithGoogle(idToken).subscribe({
      next: (res: any) => {
        console.log('📸 Profil primit la login:', res.user.profilePicUrl);
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.user._id);
        localStorage.setItem('username', res.user.username);
        localStorage.setItem('email', res.user.email);
        localStorage.setItem('level', res.user.level || 'beginner');
        localStorage.setItem('profilePicUrl', res.user.profilePicUrl || '');
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
        console.log('📸 Profil primit la login:', res.user.profilePicUrl);
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.user._id);
        localStorage.setItem('username', res.user.username);
        localStorage.setItem('email', res.user.email);
        localStorage.setItem('level', res.user.level || 'beginner');
        localStorage.setItem('profilePicUrl', res.user.profilePicUrl || '');

        this.router.navigate(['/start-page']);
      },
      error: () => {
        this.errorMessage = 'Login failed. Please try again.';
      }
    });
  }
}
