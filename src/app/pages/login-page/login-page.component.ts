import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; 

declare var FB: any;

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
  
  constructor(private authService: AuthService,private router: Router) {}

  ngOnInit(): void {
    this.loadFacebookSDK();
  
    const userId = localStorage.getItem('userId');
    const userLevel = localStorage.getItem('level');
  
    if (userId) {
      console.log(`🔹 Utilizator conectat: ${userId}, nivel: ${userLevel}`);
    } else {
      console.warn("⚠️ Niciun utilizator conectat.");
    }
  }
  

  private loadFacebookSDK(): void {
    (function (d, s, id) {
      var js: HTMLScriptElement,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode!.insertBefore(js, fjs);

      js.onerror = function () {
        console.error("Facebook SDK failed to load.");
        alert("Facebook login is unavailable at the moment.");
      };
    })(document, "script", "facebook-jssdk");

    (window as any).fbAsyncInit = () => {
      FB.init({
        appId: "981049047413825",
        xfbml: true,
        version: "v21.0"
      });
    };
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
        this.errorMessage = 'Please enter a valid email and password.';
        return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: (response) => {
            localStorage.setItem('token', response.token); // 🔹 Salvăm token-ul
            localStorage.setItem('userId', response.user._id);
            localStorage.setItem('username', response.user.username);
            localStorage.setItem('email', response.user.email);
            
            const userLevel = response.user.level || 'beginner'; // 🔹 Asigură-te că avem nivelul corect
            localStorage.setItem('level', userLevel);

            let mainPageRoute = '/beginner-main-page'; // Default
            if (userLevel === 'intermediate') {
                mainPageRoute = '/intermediate-main-page';
            } else if (userLevel === 'advanced') {
                mainPageRoute = '/advanced-main-page';
            }

            console.log(`🔹 Navigare după login către: ${mainPageRoute}`);
            this.router.navigate([mainPageRoute]); // 🔹 Navigăm către pagina corectă
        },
        error: (err) => {
            if (err.status === 404) {
                this.errorMessage = 'Utilizatorul nu a fost găsit.'; // 🛑 Utilizatorul nu există
            } else if (err.status === 401) {
                this.errorMessage = 'Parola este incorectă.'; // 🛑 Parolă greșită
            } else {
                this.errorMessage = 'Autentificare eșuată. Încercați din nou.'; // ❌ Alte erori
            }
        }
    });
}



  loginWithFacebook(): void {
    if (typeof FB === 'undefined') {
      alert('Facebook SDK not loaded. Please try again later.');
      return;
    }

    FB.login(
      (response: any) => {
        if (response.authResponse) {
          console.log("Welcome! Fetching your information...");
          FB.api("/me", { fields: "name,email" }, (userResponse: any) => {
            console.log("User Info:", userResponse);
            localStorage.setItem('facebookAccessToken', response.authResponse.accessToken);
            this.router.navigate(['/beginner-main-page']);
          });
        } else {
          alert("Login cancelled or not authorized.");
        }
      },
      { scope: "email,public_profile" }
    );
  }
}
