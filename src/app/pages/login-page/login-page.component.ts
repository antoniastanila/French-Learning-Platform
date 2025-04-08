import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';

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
  user: SocialUser | null = null;
  loggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private socialAuthService: SocialAuthService
  ) {}

  ngOnInit(): void {
    this.loadFacebookSDK();

    const userId = localStorage.getItem('userId');
    const userLevel = localStorage.getItem('level');

    if (userId) {
      console.log(`🔹 Utilizator conectat: ${userId}, nivel: ${userLevel}`);
    } else {
      console.warn("⚠️ Niciun utilizator conectat.");
    }

    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = !!user;

      if (user) {
        console.log("🔵 Utilizator Google conectat:", user);

        localStorage.setItem('token', user.idToken);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('email', user.email);
        localStorage.setItem('username', user.name);
        localStorage.setItem('level', 'beginner');

        this.router.navigate(['/start-page']);
      }
    });
  }

  private loadFacebookSDK(): void {
    (function (d, s, id) {
      var js: HTMLScriptElement,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
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
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.user._id);
        localStorage.setItem('username', response.user.username);
        localStorage.setItem('email', response.user.email);

        const userLevel = response.user.level || 'beginner';
        localStorage.setItem('level', userLevel);

        this.router.navigate(['/start-page']);
      },
      error: (err) => {
        if (err.status === 404) {
          this.errorMessage = 'Utilizatorul nu a fost găsit.';
        } else if (err.status === 401) {
          this.errorMessage = 'Parola este incorectă.';
        } else {
          this.errorMessage = 'Autentificare eșuată. Încercați din nou.';
        }
      }
    });
  }

  loginWithFacebook(): void {
    const appId = '981049047413825';
    const redirectUri = 'https://antoniastanila.github.io/French-Learning-Platform/index.html#/auth/facebook/callback';
    const scope = 'email,public_profile';

    const facebookLoginUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=token`;
    window.location.href = facebookLoginUrl;
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
}
