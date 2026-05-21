import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service'; // Asegúrate de que la ruta a tu servicio esté bien

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {
  private chatservice = inject(ChatService);
  
  misConversaciones: any[] = [];
  
  miId: number = JSON.parse(localStorage.getItem('user') || '{}').id;

  chatSeleccionado: any = null;
  mensajesChatActivo: any[] = [];

  ngOnInit(): void {
    this.cargarMisChats();
  }

  cargarMisChats() {
    this.chatservice.listarConversaciones(this.miId).subscribe({
      next: (response) => {
        this.misConversaciones = response.data; 
        console.log('Chats cargados con éxito:', this.misConversaciones);
      },
      error: (error) => {
        console.error('Error al traer los chats de Laravel', error);
      }
    });
  }
  seleccionarChat(chat: any){
    this.chatSeleccionado = chat;

    if (!this.miId) {
      console.error('No se encontró el ID del usuario en el LocalStorage');
      return;
    }
    this.chatservice.obtenerConversacion(this.miId, chat.otro_usuario_id).subscribe({
      next: (res: any) => {
        this.mensajesChatActivo = res.data;
        chat.no_leidos = 0;
      },
      error: (err) => {
        console.error('Error al cargar los mensajes de la conversación', err);
      }
    });
    
  }
}