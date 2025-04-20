import { bootstrapApplication } from '@angular/platform-browser';
//import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { socialAuthConfig } from './app/social-login.config';
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { importProvidersFrom, mergeApplicationConfig  } from '@angular/core'; // 🔹 necesar pentru module standalone
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, mergeApplicationConfig(appConfig, {
  providers: [
   // provideRouter(appRoutes),
    provideHttpClient(),
    importProvidersFrom(SocialLoginModule), 
    {
      provide: 'SocialAuthServiceConfig',   
      useValue: socialAuthConfig
    }
  ]
}))
.catch(err => console.error(err));
