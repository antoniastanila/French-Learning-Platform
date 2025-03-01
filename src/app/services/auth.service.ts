import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router'; 
import { UserResponse } from '../models/user.model'; 

@Injectable({
  providedIn: 'root',
})


export class AuthService {
  private apiUrl = 'http://localhost:5000/api/users';
  private completedLessons = new BehaviorSubject<string[]>([]);
  completedLessons$ = this.completedLessons.asObservable();

  constructor(private http: HttpClient,  private router: Router) {}

  register(userData: any): Observable<any> {
    return this.http.post<UserResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        console.log("🔍 User registered response:", response); // ✅ Log pentru debugging
  
        // ✅ Salvează token-ul
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
  
        // ✅ Verifică dacă `user` există și conține date valide
        if (response.user) {
          localStorage.setItem('userId', response.user._id);
          localStorage.setItem('username', response.user.username);
          localStorage.setItem('email', response.user.email);
          
          const userLevel = response.user.level || localStorage.getItem('level') || 'beginner';
          localStorage.setItem('level', userLevel);        }
  
        // ✅ Resetare progres lecții
        this.completedLessons.next([]);
  
        // ✅ Navigare către pagina principală
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
  
  
  
  

  login(credentials: any): Observable<any> {
    return this.http.post<{ token: string; user: any }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.user._id);
        localStorage.setItem('username', response.user.username);
        localStorage.setItem('email', response.user.email);
  
        // 🔹 Salvează `level` dacă există în user, altfel folosește ce e deja în localStorage
        const userLevel = response.user.level || localStorage.getItem('level') || 'beginner';
        localStorage.setItem('level', userLevel);
  
        this.completedLessons.next(response.user.completedLessons || []); // 🔹 Păstrează progresul lecțiilor
        
        // ✅ Redirecționare în funcție de nivel
        let mainPageRoute = `/beginner-main-page`;
        if (userLevel === 'intermediate') {
          mainPageRoute = '/intermediate-main-page';
        } else if (userLevel === 'advanced') {
          mainPageRoute = '/advanced-main-page';
        }
  
        this.router.navigate([mainPageRoute]);
      })
    );
  }
  

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  logout() {
    localStorage.removeItem('token'); // 🔹 Ștergem doar autentificarea, NU progresul
    this.router.navigate(['/home']); // 🔹 Redirecționează utilizatorul
  }

  loadUserProgress(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error("❌ userId lipsește din localStorage!");
        return;
    }

    console.log(`🔍 Cerere către backend: /api/users/${userId}/progress`);

    this.http.get<{ completedLessons: string[] }>(`${this.apiUrl}/${userId}/progress`).subscribe(response => {
        this.completedLessons.next(response.completedLessons || []);
    }, error => {
        console.error("❌ Eroare la încărcarea progresului:", error);
    });
}

  markLessonComplete(lessonId: string): void {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.http.post(`${this.apiUrl}/${userId}/complete-lesson`, { lessonId }).subscribe(() => {
      // Adăugăm lecția în progresul local al utilizatorului
      const updatedLessons = [...this.completedLessons.getValue(), lessonId];
      this.completedLessons.next(updatedLessons);
    });
  }

  getCompletedLessons(): string[] {
    return this.completedLessons.getValue();
  }
}
