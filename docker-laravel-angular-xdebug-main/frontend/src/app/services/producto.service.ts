import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

export interface ImagenProducto {
  id: number;
  producto_id: number;
  imagen: string;
}

export interface UsuarioProducto {
  id: number;
  nombre: string;
  foto?: string | null;
}

export interface Producto {
  id: number;
  usuario_id: number;
  nombreUser: string;
  usuario?: UsuarioProducto | null;
  nombre: string;
  descripcion: string | null;
  precio_venta: number | string | null;
  precio_alquiler_dia: number | string | null;
  vendido?: boolean;
  disponible: boolean;
  localidad: string | null;
  imagenes: ImagenProducto[];
}

export interface RespuestaProductosPaginados {
  current_page: number;
  data: Producto[];
  last_page: number;
  per_page: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/productos';

  getProductos(page: number = 1, buscar: string = '', categorias: number[] = []) {
    let url = `${this.apiUrl}?page=${page}&buscar=${encodeURIComponent(buscar)}`;

    categorias.forEach((id) => {
      url += `&categorias[]=${id}`;
    });

    return this.http.get<any>(url);
  }
  

  obtenerProductoSimple(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/simple`);
  }
  obtenerProducto(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

}