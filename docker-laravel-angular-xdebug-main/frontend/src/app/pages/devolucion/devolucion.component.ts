import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-confirmar-devolucion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './devolucion.component.html'
})
export class DevolucionComponent {
  private route = inject(ActivatedRoute);

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
      alquiler_id: this.alquilerId,
      devuelto: this.devuelto,
      estado_producto: this.estadoProducto,
      incidencia: this.incidencia,
      tipo_incidencia: this.incidencia ? this.tipoIncidencia : null,
      descripcion_incidencia: this.incidencia ? this.descripcionIncidencia : null,
      valoracion_usuario: this.valoracionUsuario,
      comentario_valoracion: this.comentarioValoracion
    };

    console.log('Datos a enviar al backend:', data);

    this.mensaje = 'Devolución confirmada correctamente';
    this.error = '';
  }
}