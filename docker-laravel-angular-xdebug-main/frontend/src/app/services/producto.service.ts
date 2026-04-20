import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id: number;
  usuario_id: number;
  nombre: string;
  descripcion: string | null;
  precio_venta: number | null;
  precio_alquiler_dia: number | null;
  vendido: boolean;
  disponible: boolean;
  localidad: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/productos';

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }
}