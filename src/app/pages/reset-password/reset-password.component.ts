import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    console.log('🛠 ResetPasswordComponent initialized');
    this.route.params.subscribe(params => {
      this.token = params['token'];
      console.log("🧩 Token din URL:", this.token);
    });
  }

  resetPassword(): void {
    this.successMessage = '';
    this.errorMessage = '';
  
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }
  
    this.http.post('/api/users/reset-password', {
      token: this.token,
      password: this.newPassword
    }).subscribe({
      next: () => {
        this.successMessage = 'Password has been reset successfully!';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Error resetting password';
      }
    });
  }
  

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
