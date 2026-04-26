import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AlquilerService } from '../../services/alquiler.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Location } from '@angular/common';


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

  productoId!: number;
  fechaInicio = '';
  fechaFin = '';
  opcionCompra = false;
  precioTotal = 0;
  error = '';
  mensaje = '';

  precioAlquilerDia = 5; // temporal, luego puedes traerlo del backend

  reservasCalendario: any[] = [
    {
      title: 'Reservado',
      start: '2026-05-10',
      end: '2026-05-16',
      color: '#dc3545'
    }
  ];

  calendarOptions = {
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

    events: this.reservasCalendario,

    selectAllow: (selectInfo: any) => {
      return !this.reservasCalendario.some((reserva: any) => {
        const inicioReserva = new Date(reserva.start + 'T00:00:00');
        const finReserva = new Date(reserva.end + 'T00:00:00');

        return (
          selectInfo.start < finReserva &&
          selectInfo.end > inicioReserva
        );
      });
    },

    select: (info: any) => {
      this.onDateSelect(info);
    }
  };

  ngOnInit(): void {
    this.productoId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID producto:', this.productoId);
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

    const diferencia = fin.getTime() - inicio.getTime();
    const dias = diferencia / (1000 * 60 * 60 * 24) + 1;

    this.precioTotal = dias * this.precioAlquilerDia;
  }

  alquilarProducto(): void {
    const data = {
      fecha_inicio: this.fechaInicio,
      fecha_fin: this.fechaFin,
      opcion_compra: this.opcionCompra
    };

    this.alquilerService.alquilarProducto(this.productoId, data).subscribe({
      next: () => {
        this.mensaje = 'Producto alquilado correctamente';
        this.error = '';

        this.agregarReservaAlCalendario();
        this.mostrarToast();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al alquilar el producto';
        this.mensaje = '';
      }
    });
  }

  
  agregarReservaAlCalendario(): void {
    const fechaFinEvento = new Date(this.fechaFin + 'T00:00:00');
    fechaFinEvento.setDate(fechaFinEvento.getDate() + 1);

    const nuevaReserva = {
      title: 'Reservado',
      start: this.fechaInicio,
      end: this.formatearFecha(fechaFinEvento),
      color: '#dc3545'
    };

    this.reservasCalendario.push(nuevaReserva);

    this.calendarOptions = {
      ...this.calendarOptions,
      events: [...this.reservasCalendario]
    };

    this.fechaInicio = '';
    this.fechaFin = '';
    this.precioTotal = 0;
    this.opcionCompra = false;
  }

  mostrarToast(): void {
    const toastElement = document.getElementById('toastAlquiler');

    if (toastElement) {
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
    }
  }
  private formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  volver(): void {
    this.location.back();
  }
}