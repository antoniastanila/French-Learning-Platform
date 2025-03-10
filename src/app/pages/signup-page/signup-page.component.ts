import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-signup-page',
  standalone: true,
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class SignupPageComponent implements OnInit {
  signupForm!: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]] 
    });
    
  }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    const userLevel = localStorage.getItem('level');
  
    if (userId) {
      console.log(`🔹 Utilizator conectat: ${userId}, nivel: ${userLevel}`);
    } else {
      console.warn("⚠️ Niciun utilizator conectat.");
    }
  }
  
  onSubmit(): void {
    if (this.signupForm.invalid) return;

    this.authService.register(this.signupForm.value).subscribe({
      next: (response) => {
        // 🔹 Salvăm token-ul în localStorage
        localStorage.setItem('token', response.token);

        // 🔹 Redirecționăm utilizatorul direct către pagina principală
        this.router.navigate(['/start-page']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Registration failed!';
      }
    });
}

}

