import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8000/api';

  private get headers() {
    return { Authorization: `Bearer ${localStorage.getItem('token')}` };
  }

  getProductos(page = 1, buscar = '', categorias: number[] = []): Observable<any> {
    let url = `${this.base}/productos?page=${page}&buscar=${encodeURIComponent(buscar)}`;
    categorias.forEach(id => url += `&categorias[]=${id}`);
    return this.http.get<any>(url);
  }

  obtenerProducto(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/productos/${id}`);
  }

  obtenerProductoSimple(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/productos/${id}/simple`);
  }

  misProductos(): Observable<any> {
    return this.http.get<any>(`${this.base}/mis-productos`, { headers: this.headers });
  }

  crearProducto(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.base}/productos`, formData, { headers: this.headers });
  }

  actualizarProducto(id: number, formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.base}/productos/${id}/actualizar`, formData, { headers: this.headers });
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/productos/${id}`, { headers: this.headers });
  }

  eliminarImagen(imagenId: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/imagenes/${imagenId}`, { headers: this.headers });
  }

  asignarCategorias(productoId: number, categorias: number[]): Observable<any> {
    return this.http.post<any>(
      `${this.base}/productos/${productoId}/categorias`,
      { categorias },
      { headers: this.headers }
    );
  }
}