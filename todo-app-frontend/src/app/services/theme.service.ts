import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  public darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      this.setTheme(savedTheme === 'dark');
    } else {
      // Default to light mode
      this.setTheme(false);
    }
  }

  toggleTheme() {
    const currentTheme = this.darkModeSubject.value;
    this.setTheme(!currentTheme);
  }

  setTheme(isDark: boolean) {
    this.darkModeSubject.next(isDark);
    
    // Apply theme to document
    if (isDark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    // Force a repaint to ensure theme is applied
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }
}

