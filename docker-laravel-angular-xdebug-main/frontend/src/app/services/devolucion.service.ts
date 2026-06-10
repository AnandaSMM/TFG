import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environtments/environtment';

@Injectable({
  providedIn: 'root'
})
export class DevolucionService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  confirmarDevolucion(data: any) {
    const token = localStorage.getItem('token');

    return this.http.post(
      `${this.apiUrl}/devolucion`,data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      }
    );
  }
}