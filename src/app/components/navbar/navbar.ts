import { Component, inject, HostListener } from "@angular/core";
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./navbar.html",
  styleUrl: "./navbar.css",
})
export class Navbar {
  /*private router = inject(Router);

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Ctrl + Shift + L (puedes cambiar la combinación)
    if (event.ctrlKey && event.shiftKey && event.key === 'L') {
      event.preventDefault();
      this.router.navigate(['/login']);
    }
  }*/
}