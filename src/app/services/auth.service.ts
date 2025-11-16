import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/users`;
  private completedLessons = new BehaviorSubject<string[]>([]);
  completedLessons$ = this.completedLessons.asObservable();

  private userProfile = new BehaviorSubject<any>(null);
  userProfile$ = this.userProfile.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  updateUserProfile(user: any) {
    this.userProfile.next(user);
  }

  register(userData: any): Observable<any> {
    return this.http.post<UserResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        console.log("🔍 User registered response:", response);

        if (response.token) {
          localStorage.setItem('token', response.token);
        }

        if (response.user) {
          localStorage.setItem('userId', response.user._id);
          localStorage.setItem('firstName', response.user.firstName || '');
          localStorage.setItem('lastName', response.user.lastName || '');
          localStorage.setItem('username', response.user.username);
          localStorage.setItem('email', response.user.email);
          localStorage.setItem('createdAt', response.user.createdAt || '');
          const theme = response.user.theme || 'theme-light';
          localStorage.setItem('selectedTheme', theme);
          document.body.classList.remove('theme-light', 'theme-warm', 'theme-dark', 'theme-earth');
          document.body.classList.add(theme);
          console.log('📅 Data înregistrării salvată:', response.user.createdAt);

        }

        this.completedLessons.next([]);

        // de fapt, ajung in start-page, nu in main-page
        let mainPageRoute = '/main-page/beginner';
        if (response.user.level === 'intermediate') {
          mainPageRoute = '/main-page/intermediate';
        } else if (response.user.level === 'advanced') {
          mainPageRoute = '/main-page/advanced';
        }

        this.router.navigate([mainPageRoute]);
      })
    );
  }

  setUserLevel(level: string) {
    const userId = localStorage.getItem('userId');
    return this.http.patch(`https://localhost:5000/api/users/${userId}/update-level`, { level });
  }

  login(credentials: any): Observable<any> {
    return this.http.post<{ token: string; user: any }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.user._id);
        localStorage.setItem('username', response.user.username);
        localStorage.setItem('email', response.user.email);
        localStorage.setItem('firstName', response.user.firstName || '');
        localStorage.setItem('lastName', response.user.lastName || '');
        localStorage.setItem('createdAt', response.user.createdAt || '');
        localStorage.setItem('profilePicUrl', response.user.profilePicUrl || '');
        localStorage.setItem('selectedTheme', response.user.theme || 'theme-light');


        const userLevel = response.user.level || 'beginner';
        localStorage.setItem('level', userLevel);

        const theme = response.user.theme || 'theme-light';
        localStorage.setItem('selectedTheme', theme);
        document.body.classList.remove('theme-light', 'theme-warm', 'theme-dark', 'theme-earth');
        document.body.classList.add(theme);

        this.completedLessons.next(response.user.completedLessons || []);

        this.router.navigate(['/start-page']);
      })
    );
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('selectedTheme');
    this.router.navigate(['/home']);
  }

  loadUserProgress(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error("❌ userId lipsește din localStorage!");
      return;
    }

    const userLevel = localStorage.getItem('level') || 'beginner';

    console.log(`🔍 Cerere către backend: /api/users/${userId}/progress pentru nivelul ${userLevel}`);

    this.http.get<{ completedLessons: string[] }>(`${this.apiUrl}/${userId}/progress?level=${userLevel}`).subscribe(response => {
      if (localStorage.getItem('userId') === userId) {
        this.completedLessons.next(response.completedLessons || []);
      }
    }, error => {
      console.error("❌ Eroare la încărcarea progresului:", error);
    });
  }


  markLessonsAsCompleted(lessonIds: string[], level: string): void {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    console.log(`🔍 Lecții trimise către backend pentru completare (${level}):`, lessonIds);

    const newLessons = lessonIds.filter(id => !this.completedLessons.getValue().includes(id));

    if (newLessons.length > 0) {
      this.http.post(`${this.apiUrl}/${userId}/complete-multiple-lessons`, { lessonIds: newLessons, level }).subscribe(response => {
        console.log("✅ Răspuns de la backend:", response);
        const updatedLessons = [...new Set([...this.completedLessons.getValue(), ...newLessons])];
        this.completedLessons.next(updatedLessons);
      });
    }
  }

  markLessonsAsCompleted$(lessonIds: string[], level: string): Observable<any> {
    const userId = localStorage.getItem('userId');
    if (!userId || !lessonIds || lessonIds.length === 0) {
      return of(null);
    }

    return this.http.post(`${this.apiUrl}/${userId}/complete-multiple-lessons`, {
      lessonIds
    }).pipe(
      tap(() => {
        const current = this.completedLessons.getValue();
        const updated = [...new Set([...current, ...lessonIds])];
        this.completedLessons.next(updated);

        console.log(`✅ Lecții marcate ca finalizate pentru nivelul ${level}:`, lessonIds);
      }),
      catchError(error => {
        console.error(`❌ markLessonsAsCompleted$ failed for level ${level}:`, error);
        return of(null);
      })
    );
  }


  getUserLevel(): string {
    return localStorage.getItem('level') || 'beginner';
  }


  getCompletedLessons(): string[] {
    return this.completedLessons.getValue();
  }

  setCurrentLesson(lessonId: string): void {
    localStorage.setItem('currentLesson', lessonId);
    console.log(`✅ Lecția curentă setată: ${lessonId}`);
  }

  loginWithGoogle(idToken: string): Observable<any> {
    return this.http.post<{ token: string; user: any }>(`${this.apiUrl}/google-login`, { idToken }).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.user._id);
        localStorage.setItem('username', response.user.username);
        localStorage.setItem('email', response.user.email);
        localStorage.setItem('level', response.user.level || 'beginner');
        localStorage.setItem('profilePicUrl', response.user.profilePicUrl || '');
        localStorage.setItem('firstName', response.user.firstName || '');
        localStorage.setItem('lastName', response.user.lastName || '');
        localStorage.setItem('createdAt', response.user.createdAt || '');

        const theme = response.user.theme || 'theme-light';
        localStorage.setItem('selectedTheme', theme);

        document.body.classList.remove('theme-light', 'theme-warm', 'theme-dark', 'theme-earth');
        document.body.classList.add(theme);

        this.updateUserProfile(response.user);

        this.loadUserProgress();

        this.router.navigate(['/start-page']);
      })
    );
  }

}
