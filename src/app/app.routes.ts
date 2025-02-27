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
import { BeginnerMainPageComponent } from './pages/beginner-main-page/beginner-main-page.component';
import { ExerciseDetailComponent } from './pages/exercise-detail/exercise-detail.component';
import { AuthGuard } from './guards/auth.guard';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { IntermediateTestComponent } from './pages/intermediate-test/intermediate-test.component';
import { IntermediateMainPageComponent } from './pages/intermediate-main-page/intermediate-main-page.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, 
  { path: 'home', component: HomePageComponent }, 
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignupPageComponent },
  { path: 'start-page', component: StartPageComponent, canActivate: [AuthGuard]  }, 
  { path: 'beginner', component: BeginnerComponent, canActivate: [AuthGuard]  },
  { path: 'beginner-test', component: BeginnerTestComponent },
  { path: 'intermediate', component: IntermediateComponent, canActivate: [AuthGuard]  },
  { path: 'intermediate-test', component: IntermediateTestComponent },
  { path: 'advanced', component: AdvancedComponent, canActivate: [AuthGuard]  },
  { path: 'lessons', component: LessonListComponent },
  { path: '', component: LessonListComponent },
  { path: 'lesson/:level/:id', component: LessonDetailComponent },
  { path: 'beginner-main-page', component: BeginnerMainPageComponent, canActivate: [AuthGuard] },
  { path: 'exercises/:lessonId', component: ExerciseDetailComponent, canActivate: [AuthGuard]  },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'intermediate-main-page', component: IntermediateMainPageComponent },

];
