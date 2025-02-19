import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-intermediate',
  standalone: true,
  templateUrl: './intermediate.component.html',
  styleUrls: ['./intermediate.component.css'],
  imports: [CommonModule]
})
export class IntermediateComponent {

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/start-page']); 
  }
}
