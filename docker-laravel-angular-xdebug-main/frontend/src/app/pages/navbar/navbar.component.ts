import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  
  ocultarBotones = false;
  menuAbierto = false;
  menuMensajesAbierto = false;
  menuPerfilAbierto = false;

  user =JSON.parse(localStorage.getItem('user') || '{}');
  constructor() {
    this.actualizarVisibilidad(this.router.url);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event) => {
        this.actualizarVisibilidad(event.urlAfterRedirects);
      });
  }

    toggleMensajes() {
      this.menuMensajesAbierto =
        !this.menuMensajesAbierto;

      this.menuPerfilAbierto = false;
    }
    toggleChat() {
      // 1. Igual que el perfil: pone el menú abierto en false por si acaso estamos en móvil
      this.menuAbierto = false; 

      // 2. Escribe en la ruta /chats para cambiar de pantalla
      this.router.navigate(['/chats']); 
    }

    togglePerfil() {
      this.menuPerfilAbierto =
        !this.menuPerfilAbierto;

      this.menuMensajesAbierto = false;
    }

  private actualizarVisibilidad(url: string): void {
    this.ocultarBotones = url === '/login' || url === '/register';
  }
  
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
  

}