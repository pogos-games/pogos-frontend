import {inject, Injectable} from '@angular/core';
import {LocalStorageService} from "./storage/local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly localStorageService: LocalStorageService = inject(LocalStorageService);

  isDarkTheme: boolean = false;

  constructor() {
    // Initialize the theme based on user preference or system setting
    const savedTheme = this.localStorageService.getItem('theme');

    if (savedTheme !== null) {
      this.isDarkTheme = JSON.parse(savedTheme);
    } else {
      this.isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    document.body.classList.toggle('dark-theme', this.isDarkTheme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      if (savedTheme === null) {
        this.isDarkTheme = event.matches;
        document.body.classList.toggle('dark-theme', this.isDarkTheme);
      }
    });
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
    this.localStorageService.setItem('theme', JSON.stringify(this.isDarkTheme));
  }

}
