import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-admin.html',
  styleUrl: './navbar-admin.css'
})
export class NavbarAdmin {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  get userName(): string {
    return this.authService.user()?.name || 'Admin';
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}