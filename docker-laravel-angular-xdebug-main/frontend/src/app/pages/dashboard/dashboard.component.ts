import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <h1>Dashboard privado</h1>
    <button (click)="goToProfile()">Mi Perfil</button>
    <button (click)="logout()">Cerrar sesión</button>
  `
})
export class DashboardComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }
  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}