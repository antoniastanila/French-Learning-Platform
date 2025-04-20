import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule ],
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.http.post('/api/users/forgot-password', { email: this.email }).subscribe({
      next: () => alert('Reset link sent! Check your email.'),
      error: err => alert(err.error?.message || 'Something went wrong')
    });
  }
}
