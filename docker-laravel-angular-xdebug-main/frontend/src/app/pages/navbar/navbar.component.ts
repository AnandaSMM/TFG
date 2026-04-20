import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private router = inject(Router);

  ocultarBotones = false;

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

  private actualizarVisibilidad(url: string): void {
    this.ocultarBotones = url === '/login' || url === '/register';
  }
}