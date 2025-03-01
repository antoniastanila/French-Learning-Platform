import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})
export class StartPageComponent {
  constructor(private router: Router) {}

  navigateToBeginner() {
    localStorage.setItem('level', 'beginner'); // 🔹 Salvează nivelul
    this.router.navigate(['/beginner']); 
  }
  
  navigateToIntermediate() {
    localStorage.setItem('level', 'intermediate'); // 🔹 Salvează nivelul
    this.router.navigate(['/intermediate']); 
  }
  
  navigateToAdvanced() {
    localStorage.setItem('level', 'advanced'); // 🔹 Salvează nivelul
    this.router.navigate(['/advanced']); 
  }
  
}
