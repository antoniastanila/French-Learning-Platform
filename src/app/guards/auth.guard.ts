import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const jwtToken = localStorage.getItem('token'); 
    const facebookToken = localStorage.getItem('facebookAccessToken'); 
  
    if (!jwtToken && !facebookToken) {
      this.router.navigate(['/login']);
      return false;
    }
  
    return true;
  }
  

}
  