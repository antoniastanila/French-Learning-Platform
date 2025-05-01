import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'french-learning-app';

  constructor(private router: Router, private themeService: ThemeService) {}

  ngOnInit() {
    // 🔵 Aplică tema stocată la inițializare
    this.themeService.applyStoredTheme();

    // 🔵 Reaplică tema la fiecare navigare
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.themeService.applyStoredTheme();
      }
    });
  }
}
