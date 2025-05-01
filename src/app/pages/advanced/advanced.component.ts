import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-advanced',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.css']
})
export class AdvancedComponent implements OnInit {

  constructor(private router: Router, private renderer: Renderer2) {}

  ngOnInit() {
    const savedTheme = localStorage.getItem('selectedTheme') || 'theme-light';
    this.renderer.setAttribute(document.body, 'class', savedTheme);
  }

  navigateToAdvancedTest() {
    this.router.navigate(['/advanced-test']); 
  }

  navigateBackToStart() {
    this.router.navigate(['/start-page']); 
  }
}
