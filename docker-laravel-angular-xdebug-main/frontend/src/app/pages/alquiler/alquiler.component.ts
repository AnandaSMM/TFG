import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AlquilerService } from '../../services/alquiler.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ProductoService } from '../../services/producto.service';

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

  productoId!: number;
  fechaInicio = '';
  fechaFin = '';
  opcionCompra = false;
  precioTotal = 0;
  error = '';
  mensaje = '';
  cargando = false;
  enviandoAlquiler = false;
  precioAlquilerDia = 0;
  producto: any = null;
  reservasCalendario: any[] = [];
  fechaMinima = '';

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
      const hoy = new Date(this.obtenerHoy() + 'T00:00:00');

      if (selectInfo.start <= hoy) {
        return false;
      }

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
    this.fechaMinima = this.obtenerHoy();
    this.productoId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarProducto();
    this.cargarReservasProducto();
  }

  private obtenerHoy(): string {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return this.formatearFecha(hoy);
  }

  private fechasValidas(): boolean {
    this.error = '';
    if (!this.fechaInicio || !this.fechaFin) {
      this.error = 'Debes seleccionar fecha de inicio y fecha de fin';
      return false;
    }

    const hoy = new Date(this.obtenerHoy() + 'T00:00:00');
    const inicio = new Date(this.fechaInicio + 'T00:00:00');
    const fin = new Date(this.fechaFin + 'T00:00:00');

    if (inicio <= hoy) {
      this.error = 'No puedes alquilar hoy ni en fechas pasadas';
      return false;
    }
    if (fin < inicio) {
      this.error = 'La fecha fin no puede ser anterior a la fecha inicio';
      return false;
    }
    return true;
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
    if (this.enviandoAlquiler) {
      return;
    }

     if (!this.fechasValidas()) {
      this.mensaje = '';
      return;
    }
    
    const data = {
      fecha_inicio: this.fechaInicio,
      fecha_fin: this.fechaFin,
      opcion_compra: this.opcionCompra
    };

    this.alquilerService.alquilarProducto(this.productoId, data).subscribe({
      next: () => {
        this.mensaje = 'Producto alquilado correctamente';
        this.error = '';
        this.enviandoAlquiler = false;

        this.cargarReservasProducto(); 
      },
      error: (err) => {
        const mensajeBack = err.error?.message || '';

        if (
          mensajeBack.includes('Demasiados emails') ||
          mensajeBack.includes('emails por segundo')
        ) {
          this.error = 'Estás intentando alquilar demasiado rápido. Espera unos segundos y vuelve a intentarlo.';
        } else {
          this.error = mensajeBack || 'Error al alquilar';
        }

        this.mensaje = '';
        this.enviandoAlquiler = false;
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
}