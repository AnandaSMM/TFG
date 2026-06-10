import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AlquilerService } from '../../services/alquiler.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmar-devolucion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './devolucion.component.html'
})
export class DevolucionComponent {
  private route = inject(ActivatedRoute);
  private alquilerService = inject(AlquilerService);
  private router = inject(Router);
  alquilerId!: number;

  devuelto = true;
  incidencia = false;
  tipoIncidencia = '';
  descripcionIncidencia = '';
  valoracionUsuario = 5;
  comentarioValoracion = '';
  estadoProducto = 'correcto';
  mensaje = '';
  error = '';

  tiposIncidencia = [
    'Producto roto',
    'Producto dañado',
    'Entrega tarde',
    'Producto incompleto',
    'No se devolvió',
    'Otro'
  ];

  estadosProducto = [
    'correcto',
    'dañado',
    'roto',
    'incompleto'
  ];

  
  ngOnInit(): void {
    this.alquilerId = Number(this.route.snapshot.paramMap.get('id'));
  }

  confirmarDevolucion(): void {
    const data = {
      devuelto: this.devuelto,
      estado_producto: this.estadoProducto,
      incidencia: this.incidencia,
      tipo_incidencia: this.incidencia ? this.tipoIncidencia : null,
      descripcion_incidencia: this.incidencia ? this.descripcionIncidencia : null,
      valoracion_usuario: this.valoracionUsuario,
      comentario_valoracion: this.comentarioValoracion
    };

    this.alquilerService.confirmarDevolucion(this.alquilerId, data).subscribe({
      next: (respuesta) => {
        this.mensaje = respuesta.message || 'Devolución confirmada correctamente';
        this.error = '';

        setTimeout(() => {
          this.router.navigate(['/calendar']);
        }, 1000);
      },
      error: (error) => {
        this.error = error.error?.message || 'Error al confirmar la devolución';
        this.mensaje = '';
      }
    });
  }
  
}