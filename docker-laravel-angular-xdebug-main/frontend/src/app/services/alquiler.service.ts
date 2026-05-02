import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Alquiler {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlquilerService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api';

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
}