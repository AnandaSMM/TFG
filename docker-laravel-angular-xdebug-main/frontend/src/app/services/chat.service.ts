import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api';

  listarConversaciones(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/chat/${id}/listar`);
  }

  
  obtenerConversacion(id: number, receptorId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/chat/${id}/conversacion?persona_id=${receptorId}`);
  }
  
  /** 
  enviarMensaje(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/chat/enviar`, data);
  }
  */
}