import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-facebook-callback',
  template: `<p>Processing Facebook login...</p>`,
})
export class FacebookCallbackComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace('#', ''));
    const accessToken = params.get('access_token');
  
    if (accessToken) {
      console.log('✅ Access token:', accessToken);
      localStorage.setItem('facebookAccessToken', accessToken);
  
      // 🚀 Redirecționează către pagina de start
      this.router.navigate(['/start-page']);
    } else {
      console.warn('❌ Access token not found in URL');
      this.router.navigate(['/login']);
    }
  }
  
  
}
