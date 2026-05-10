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
    return this.http.put(`${this.apiUrl}/usuarios/${id}`, data);
  }

  actualizarFoto(id: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/foto/${id}`, formData);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuarios/${id}`);
  }
  
  obtenerStats(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/${id}/stats`);
  }
}