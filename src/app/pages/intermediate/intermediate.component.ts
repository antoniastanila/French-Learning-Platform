import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-intermediate',
  standalone: true,
  templateUrl: './intermediate.component.html',
  styleUrls: ['./intermediate.component.css'],
  imports: [CommonModule]
})
export class IntermediateComponent implements OnInit {

  constructor(private router: Router, private renderer: Renderer2) {}

  ngOnInit() {
    const savedTheme = localStorage.getItem('selectedTheme') || 'theme-light';
    this.renderer.setAttribute(document.body, 'class', savedTheme);
  }

  navigateToIntermediateTest() {
    this.router.navigate(['/intermediate-test']); 
  }

  navigateBackToMain() {
    this.router.navigate(['/start-page']); 
  }
}
