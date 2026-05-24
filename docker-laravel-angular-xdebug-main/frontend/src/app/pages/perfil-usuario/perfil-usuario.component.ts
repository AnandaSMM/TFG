import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.css'
})
export class PerfilUsuarioComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private location = inject(Location);

  userData: any = {};
  cargando = true;
  error = '';

  alquileresTotales = 0;
  alquileresActivos = 0;

  private apiUrl = 'http://localhost:8000/api';

  ngOnInit(): void {
    const usuarioId = this.route.snapshot.paramMap.get('id');

    if (!usuarioId) {
      this.error = 'Usuario no encontrado';
      this.cargando = false;
      return;
    }

    this.cargarPerfilUsuario(usuarioId);
  }

  cargarPerfilUsuario(id: string): void {
    this.http.get<any>(`${this.apiUrl}/usuarios/${id}`).subscribe({
      next: (response) => {
        this.userData = response.usuario ?? response;
        this.alquileresTotales = response.alquileresTotales ?? 0;
        this.alquileresActivos = response.alquileresActivos ?? 0;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el perfil del usuario';
        this.cargando = false;
      }
    });
  }

  getFotoUsuario(): string {
    return this.userData.foto
      ? `http://localhost:8000/storage/${this.userData.foto}`
      : 'https://i.pravatar.cc/200';
  }

  volver(): void {
    this.location.back();
  }
}