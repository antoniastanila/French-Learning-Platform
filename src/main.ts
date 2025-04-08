import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { socialAuthConfig } from './app/social-login.config';
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { importProvidersFrom } from '@angular/core'; // 🔹 necesar pentru module standalone

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),
    importProvidersFrom(SocialLoginModule), // ✅ adaugă modulul efectiv
    {
      provide: 'SocialAuthServiceConfig',    // ✅ corect: folosește string, nu tipul
      useValue: socialAuthConfig
    }
  ]
}).catch(err => console.error(err));
