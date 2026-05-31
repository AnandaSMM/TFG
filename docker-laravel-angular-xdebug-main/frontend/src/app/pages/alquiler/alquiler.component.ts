import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute,Router } from '@angular/router';
import { AlquilerService } from '../../services/alquiler.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ProductoService } from '../../services/producto.service';
import { ChatService } from '../../services/chat.service';


declare var bootstrap: any;
@Component({
  selector: 'app-alquiler',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FullCalendarModule],
  templateUrl: './alquiler.component.html',
})
export class AlquilerComponent implements OnInit {
  private alquilerService = inject(AlquilerService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private productoService = inject(ProductoService);
  private chatService = inject(ChatService);
  private router = inject(Router);
  

  productoId!: number;
  fechaInicio = '';
  fechaFin = '';
  opcionCompra = false;
  precioTotal = 0;
  error = '';
  mensaje = '';
  cargando = false;
  precioAlquilerDia = 0;
  producto: any = null;
  reservasCalendario: any[] = [];

  calendarOptions: any = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'es',
    selectable: true,
    selectMirror: true,
    height: 'auto',

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    },

    buttonText: {
      today: 'Hoy',
      month: 'Mes'
    },

    events: [],

    selectAllow: (selectInfo: any) => {
      return !this.reservasCalendario.some((reserva: any) => {
        const inicioReserva = new Date(reserva.start + 'T00:00:00');
        const finReserva = new Date(reserva.end + 'T00:00:00');

        return selectInfo.start < finReserva && selectInfo.end > inicioReserva;
      });
    },

    select: (info: any) => {
      this.onDateSelect(info);
    }
  };

  ngOnInit(): void {
    this.productoId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarProducto();
    this.cargarReservasProducto();
  }


 cargarReservasProducto(): void {
    this.cargando = true;
    this.alquilerService.listarReservados().subscribe({
      next: (res: any) => {
        const reservas = res.reservas || [];

        this.reservasCalendario = reservas
          .filter((r: any) => r.producto_id === this.productoId)
          .map((r: any) => {
            const fechaFin = new Date(r.fecha_fin + 'T00:00:00');
            fechaFin.setDate(fechaFin.getDate() + 1);

            return {
              title: 'Reservado',
              start: r.fecha_inicio,
              end: this.formatearFecha(fechaFin),
              color: '#dc3545'
            };
          });

        this.calendarOptions = {
          ...this.calendarOptions,
          events: [...this.reservasCalendario]
        };

        this.cargando = false;
      },
      error: () => {
        this.error = 'Error cargando reservas';
        this.cargando = false;
      }
    });
  }

  onDateSelect(info: any): void {
    const calendarApi = info.view.calendar;

  
    calendarApi.getEvents().forEach((event: any) => {
      if (event.extendedProps?.seleccionado) {
        event.remove();
      }
    });

    this.fechaInicio = info.startStr;

    const endDate = new Date(info.endStr + 'T00:00:00');
    endDate.setDate(endDate.getDate() - 1);

    this.fechaFin = this.formatearFecha(endDate);

    calendarApi.addEvent({
      start: this.fechaInicio,
      end: info.endStr,
      display: 'background',
      color: '#198754',
      extendedProps: {
        seleccionado: true
      }
    });

    this.calcularPrecioTotal();
  }

  calcularPrecioTotal(): void {
    if (!this.fechaInicio || !this.fechaFin) {
      this.precioTotal = 0;
      return;
    }
    const inicio = new Date(this.fechaInicio + 'T00:00:00');
    const fin = new Date(this.fechaFin + 'T00:00:00');

    if (fin < inicio) {
      this.precioTotal = 0;
      return;
    }

    const dias =
      (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24) + 1;

    this.precioTotal = dias * this.precioAlquilerDia;
  }

  alquilarProducto(): void {
    const data = {
      fecha_inicio: this.fechaInicio,
      fecha_fin: this.fechaFin,
      opcion_compra: this.opcionCompra
    };

    const usuario = JSON.parse(localStorage.getItem('user') || '{}');

    this.alquilerService.alquilarProducto(this.productoId, data).subscribe({
      next: () => {
        this.mensaje = 'Producto alquilado correctamente';
        this.error = '';

        this.cargarReservasProducto(); 

        this.productoService.obtenerProductoSimple(this.productoId).subscribe(producto => {
          const data1 = {
            receptor_id: producto.data.usuario.id,
            mensaje: `Hola, soy ${usuario.nombre}, quiero alquilar el producto: ${producto.data.nombre}`
          };

          this.chatService.enviarMensaje(data1).subscribe({
            next: () => {
              console.log('Chat creado correctamente');
            },
            error: (err) => {
              console.error('Error creando chat', err);
            }
          });
      });

      },
      error: (err) => {
        this.error = err.error?.message || 'Error al alquilar';
        this.mensaje = '';
      }
    });
    
  }

  private formatearFecha(fecha: Date): string {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');

    return `${y}-${m}-${d}`;
  }

  volver(): void {
    this.location.back();
  }

  cargarProducto(): void {
    this.cargando = true;
    this.productoService.obtenerProductoSimple(this.productoId).subscribe({
      next: (res: any) => {
        this.producto = res.data || res.producto || res;
        this.precioAlquilerDia = Number(this.producto.precio_alquiler_dia || 0);
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el producto';
        this.cargando = false;
      }
    });
  }
  contactarPropietario(): void {
    const propietarioId = this.producto?.usuario?.id || this.producto?.usuario_id;
    const propietarioNombre = this.producto?.usuario?.nombre;
    if (propietarioId) {
      this.router.navigate(['/chats'], { 
        queryParams: {
          nuevoChatCon: propietarioId,
          nombrePropietario: propietarioNombre
        } 
      });
    } else {
      console.error('No se encontró el ID ');
      alert('No se puede contactar con el propietario en este momento.');
    }
  }
}