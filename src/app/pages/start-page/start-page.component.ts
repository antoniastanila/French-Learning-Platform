import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-start-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})
export class StartPageComponent {
  private apiUrl = 'http://localhost:5000/api/users'; // 🔹 API pentru utilizatori

  constructor(private router: Router, private http: HttpClient) {}

  setUserLevel(level: string) {
    const userId = localStorage.getItem('userId'); // 🔹 Preia ID-ul utilizatorului din localStorage
    if (!userId) {
      console.error('❌ Eroare: Nu există userId în localStorage.');
      return;
    }

    // 🔹 Actualizează nivelul utilizatorului în baza de date
    this.http.patch(`${this.apiUrl}/${userId}/update-level`, { level }).subscribe({
      next: () => {
        localStorage.setItem('level', level); // 🔹 Salvează și local pentru sesiunea curentă
        console.log(`✅ Nivel setat: ${level}`);

        // 🔹 Navigare către pagina de test aferentă nivelului
        let testRoute = '/beginner-test';
        if (level === 'intermediate') {
          testRoute = '/intermediate-test';
        }

        this.router.navigate([testRoute]); // 🔹 Redirecționează către test
      },
      error: (err) => {
        console.error('❌ Eroare la actualizarea nivelului:', err);
      }
    });
  }

  navigateToBeginner() {
    this.setUserLevel('beginner');
  }

  navigateToIntermediate() {
    this.setUserLevel('intermediate');
  }

  navigateToAdvanced() {
    this.setUserLevel('advanced');
  }
}
