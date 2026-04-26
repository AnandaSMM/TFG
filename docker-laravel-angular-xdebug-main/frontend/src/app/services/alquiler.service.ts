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
      `${this.apiUrl}/productos/${productoId}/alquilar`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      }
    );
  }
}