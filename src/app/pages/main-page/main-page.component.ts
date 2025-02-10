import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  constructor(private router: Router) {}

  navigateToBeginner() {
    this.router.navigate(['/beginner']); 
  }
  navigateToIntermediate() {
    this.router.navigate(['/intermediate']); 
  }
  navigateToAdvanced() {
    this.router.navigate(['/advanced']); 
  }
}
