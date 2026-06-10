import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environtments/environtment';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {
  private chatservice = inject(ChatService);
  private route = inject(ActivatedRoute);
  storareUrl = environment.storageUrl;
  
  misConversaciones: any[] = [];
  miId: number | null = null;

  chatSeleccionado: any = null;
  mensajesChatActivo: any[] = [];
  nuevoMensaje: string = '';


  ngOnInit(): void {
    this.cargarMisChats();
    this.cargarMisChatsYRevisarURL();
  }
  cargarMisChatsYRevisarURL() {
    this.chatservice.listarConversaciones().subscribe({
      next: (response) => {
        this.misConversaciones = response.data; 
        console.log('Chats cargados con éxito:', this.misConversaciones);
        this.route.queryParams.subscribe(params => {
          const idPropietario = params['nuevoChatCon'];
          const nombrePropietario = params['nombrePropietario'];

          if (idPropietario) {
            this.revisarOIniciarChat(Number(idPropietario), nombrePropietario);
          }
        });
      },
      error: (error) => {
        console.error('Error al traer los chats de Laravel', error);
      }
    });
  }

  revisarOIniciarChat(idPropietario: number, nombre: string){
    const chatExistente = this.misConversaciones.find(conversacion => conversacion.otro_usuario_id === idPropietario);
    if (chatExistente) {
      this.seleccionarChat(chatExistente);

    } else {
      const usuarioLogueado = JSON.parse(localStorage.getItem('user') || '{}');
      if (usuarioLogueado && usuarioLogueado.id) {
        this.miId = Number(usuarioLogueado.id);
      }
      const chatFantasma = {
        otro_usuario_id: idPropietario,
        nombre: nombre, 
        foto: null,
        ultimo_mensaje: 'Iniciando conversación...',
        fecha: new Date().toISOString(),
        no_leido: 0
      };
      this.misConversaciones.unshift(chatFantasma);

      // 3. Lo dejamos seleccionado para que se abra la ventana del chat vacía en el centro
      this.chatSeleccionado = chatFantasma; 
      this.mensajesChatActivo = [];         
    }

  }

  cargarMisChats() {
    this.chatservice.listarConversaciones().subscribe({
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
    
    this.chatservice.obtenerConversacion(chat.otro_usuario_id).subscribe({
      next: (res: any) => {
          this.mensajesChatActivo = res.data;
          chat.no_leido = 0;

          this.chatservice.marcarComoLeidos(chat.otro_usuario_id).subscribe({
            next: (response) => {
              console.log('Mensajes marcados como leídos en el servidor con éxito');
            },
            error: (err) => {
              console.error('Error al marcar los mensajes como leídos en el servidor', err);
            }
          });

          const miMensajeEnviado = this.mensajesChatActivo.find(
            (msg) => msg.emisor_id !== chat.otro_usuario_id
          );

          if (miMensajeEnviado) {
            this.miId = miMensajeEnviado.emisor_id;
          } else {
            this.miId = chat.user_id || null;
          }
        },
      error: (err) => {
        console.error('Error al cargar los mensajes de la conversación', err);
      }
    });
    
  }

  enviarMensaje(){
    if (!this.chatSeleccionado || !this.nuevoMensaje.trim()) return;
    const data={
      receptor_id:this.chatSeleccionado.otro_usuario_id,
      mensaje: this.nuevoMensaje.trim()
    }
    this.nuevoMensaje = '';
    this.chatservice.enviarMensaje(data).subscribe({
    next: (res: any) => {
      console.log('Mensaje guardado en BD:', res.message);
      this.mensajesChatActivo.push(res.data);
    },
    error: (err) => {
      console.error('Error al enviar el mensaje:', err);
    }
  });
  }


}