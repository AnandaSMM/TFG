import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environtments/environtment';

export interface Alquiler {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlquilerService {
  private http = inject(HttpClient);
  private apiUrl =  environment.apiUrl;

  alquilarProducto(productoId: number, data: any) {
    const token = localStorage.getItem('token');
    return this.http.post(
      `${this.apiUrl}/productos/${productoId}/alquilar`,data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      }
    );
  }

  listarReservasProducto(productoId: number) {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.apiUrl}/productos/${productoId}/reservas`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });
  }

  listarReservados() {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.apiUrl}/reservas`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });
  }

  listarPrestados() {
    const token = localStorage.getItem('token');

    return this.http.get(`${this.apiUrl}/prestados`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });
  }

  cancelarAlquiler(id: number) {
    const token = localStorage.getItem('token');

    return this.http.put(
      `${this.apiUrl}/alquileres/${id}/cancelar`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      }
    );
  }

  confirmarDevolucion(id: number, data: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put<any>(`${this.apiUrl}/alquileres/${id}/devolucion`, data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });
  }

}