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
    this.router.navigate(['/beginner']); 
  }
  navigateToIntermediate() {
    this.router.navigate(['/intermediate']); 
  }
  navigateToAdvanced() {
    this.router.navigate(['/advanced']); 
  }
}
