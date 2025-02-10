import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { BeginnerComponent } from './pages/beginner/beginner.component';
import { BeginnerTestComponent } from './pages/beginner-test/beginner-test.component';
import { IntermediateComponent } from './pages/intermediate/intermediate.component';
import { AdvancedComponent } from './pages/advanced/advanced.component';
export const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, 
  { path: 'home', component: HomePageComponent }, 
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignupPageComponent },
  { path: 'main-page', component: MainPageComponent }, 
  { path: 'beginner', component: BeginnerComponent },
  { path: 'beginner-test', component: BeginnerTestComponent },
  { path: 'intermediate', component: IntermediateComponent },
  { path: 'advanced', component: AdvancedComponent },

];
