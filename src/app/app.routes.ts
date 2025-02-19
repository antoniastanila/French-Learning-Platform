import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { StartPageComponent } from './pages/start-page/start-page.component';
import { BeginnerComponent } from './pages/beginner/beginner.component';
import { BeginnerTestComponent } from './pages/beginner-test/beginner-test.component';
import { IntermediateComponent } from './pages/intermediate/intermediate.component';
import { AdvancedComponent } from './pages/advanced/advanced.component';
import { LessonListComponent } from './components/lesson-list/lesson-list.component';
import { LessonDetailComponent } from './pages/lesson-detail/lesson-detail.component';
import { MainPageComponent } from './pages/main-page/main-page.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, 
  { path: 'home', component: HomePageComponent }, 
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignupPageComponent },
  { path: 'start-page', component: StartPageComponent }, 
  { path: 'beginner', component: BeginnerComponent },
  { path: 'beginner-test', component: BeginnerTestComponent },
  { path: 'intermediate', component: IntermediateComponent },
  { path: 'advanced', component: AdvancedComponent },
  { path: 'lessons', component: LessonListComponent },
  { path: '', component: LessonListComponent },
  { path: 'lesson/:id', component: LessonDetailComponent },
  { path: 'main-page', component: MainPageComponent },

];
