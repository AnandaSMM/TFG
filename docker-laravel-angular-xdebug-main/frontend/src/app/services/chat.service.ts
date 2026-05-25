import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api';

  listarConversaciones(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(
      `${this.apiUrl}/chat/listar`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      }
    );
  }

  
  obtenerConversacion(receptorId: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(
      `${this.apiUrl}/chat/${receptorId}/conversacion`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      }
    );
  }
  
  
  enviarMensaje(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.apiUrl}/chat/enviar`, 
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      }
    );
  }
  marcarComoLeidos(idEmisor: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(
      `${this.apiUrl}/chat/${idEmisor}/leer`, 
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