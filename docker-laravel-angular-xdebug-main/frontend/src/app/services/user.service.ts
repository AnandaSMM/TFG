import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api';

  obtenerUsuario(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/${id}`);
  }

  actualizarUsuario(id: number, data: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(
      `${this.apiUrl}/usuarios/${id}`, 
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      }
    );
  }

  actualizarFoto(id: number, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(
      `${this.apiUrl}/usuarios/foto/${id}`, 
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      }
    );
  }

  eliminarUsuario(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(
      `${this.apiUrl}/usuarios/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      }
    );
  }
  
  obtenerStats(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/${id}/stats`);
  }
}