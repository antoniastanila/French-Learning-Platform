import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'selectedTheme'; // folosește aceași cheie peste tot

  setTheme(themeClass: string) {
    document.body.classList.remove('theme-light', 'theme-warm', 'theme-dark', 'theme-earth');
    document.body.classList.add(themeClass);
    localStorage.setItem(this.THEME_KEY, themeClass);
  }

  getTheme(): string {
    return localStorage.getItem(this.THEME_KEY) || 'theme-light';
  }

  applyStoredTheme(): void {
    this.setTheme(this.getTheme());
  }
}
