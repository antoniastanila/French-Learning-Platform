import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation  } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes, withHashLocation()),
    provideHttpClient()
  ],
}).catch(err => console.error(err));
