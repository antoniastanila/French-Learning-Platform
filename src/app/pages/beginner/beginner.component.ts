import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-beginner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './beginner.component.html',
  styleUrls: ['./beginner.component.css']
})
export class BeginnerComponent {
  constructor(private router: Router) {}

  navigateToBeginnerTest() {
    this.router.navigate(['/beginner-test']); 
  }

  navigateBackToStart() {
    this.router.navigate(['/start-page']); 
  }
}
