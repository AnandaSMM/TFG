import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'detalles-producto',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalles-producto.component.html',
})
export class DetallesProductoComponent {
  @Input() producto: any | null = null;
  @Input() modalAbierto = false;

  @Output() cerrar = new EventEmitter<void>();

  private baseUrl = 'http://localhost:8000/storage/';
  imagenActual = 0;

  getImagenUrl(ruta: string | null | undefined): string {
    if (!ruta) return 'producto-placeholder.jpg';
    return `${this.baseUrl}${ruta}`;
  }

  getImagenActual(): string {
    if (!this.producto?.imagenes || this.producto.imagenes.length === 0) {
      return 'producto-placeholder.jpg';
    }

    return this.getImagenUrl(this.producto.imagenes[this.imagenActual]?.imagen);
  }

  siguienteImagen(event?: Event): void {
    event?.stopPropagation();

    if (!this.producto?.imagenes || this.producto.imagenes.length <= 1) return;

    this.imagenActual = (this.imagenActual + 1) % this.producto.imagenes.length;
  }

  anteriorImagen(event?: Event): void {
    event?.stopPropagation();

    if (!this.producto?.imagenes || this.producto.imagenes.length <= 1) return;

    this.imagenActual =
      (this.imagenActual - 1 + this.producto.imagenes.length) %
      this.producto.imagenes.length;
  }

  cerrarModal(): void {
    this.imagenActual = 0;
    this.cerrar.emit();
  }
}