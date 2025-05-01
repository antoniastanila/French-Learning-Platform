import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-beginner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './beginner.component.html',
  styleUrls: ['./beginner.component.css']
})
export class BeginnerComponent implements OnInit {

  constructor(private router: Router, private renderer: Renderer2) {}

  ngOnInit() {
    const savedTheme = localStorage.getItem('selectedTheme') || 'theme-light';
    this.renderer.setAttribute(document.body, 'class', savedTheme);
  }

  navigateToBeginnerTest() {
    this.router.navigate(['/beginner-test']); 
  }

  navigateBackToStart() {
    this.router.navigate(['/start-page']); 
  }
}
