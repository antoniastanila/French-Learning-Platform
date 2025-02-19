import { Component } from '@angular/core';
import { Router
  
 } from '@angular/router';
@Component({
  selector: 'app-advanced',
  imports: [],
  templateUrl: './advanced.component.html',
  styleUrl: './advanced.component.css'
})
export class AdvancedComponent {
constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/start-page']); 
  }
}
