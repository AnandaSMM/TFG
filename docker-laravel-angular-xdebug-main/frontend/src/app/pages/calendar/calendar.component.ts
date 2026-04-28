import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { AlquilerService } from '../../services/alquiler.service';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [FullCalendarModule, CommonModule],
  templateUrl: './calendar.component.html',
})
export class CalendarioComponent implements OnInit {
  private alquilerService = inject(AlquilerService);
  cargando = false;
  alquileres: any[] = [];
  modo: 'reservados' | 'prestados' = 'reservados';

  calendarOptions: any = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'es',
    height: 'auto',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día'
    },
    events: []
  };

  ngOnInit(): void {
    this.cargarReservas();
  }


 cargarPrestados(): void {
  this.modo = 'prestados';
  this.cargando = true;
  this.alquileres = [];
  this.actualizarCalendario([]);

  this.alquilerService.listarPrestados().subscribe({
    next: (res: any) => {
      const productos = res.prestados || [];

      this.alquileres = productos
        .filter((producto: any) => producto.alquileres && producto.alquileres.length > 0)
        .map((producto: any) => {
          const alquiler = producto.alquileres[0];

          return {
            ...alquiler,
            producto: producto
          };
        });

      this.cargarEventosCalendario(this.alquileres, '#0d6efd');

      this.cargando = false;
    },
    error: (err) => {
      console.error('Error al cargar productos prestados', err);
      this.cargando = false;
    }
  });
}

cargarEventosCalendario(alquileres: any[], color: string): void {
  const eventos = alquileres.map((alquiler: any) => {
    const fechaFin = new Date(alquiler.fecha_fin + 'T00:00:00');
    fechaFin.setDate(fechaFin.getDate() + 1);

    return {
      title: alquiler.producto?.nombre || 'Producto',
      start: alquiler.fecha_inicio,
      end: this.formatearFecha(fechaFin),
      color
    };
  });

  this.actualizarCalendario(eventos);
}

actualizarCalendario(eventos: any[]): void {
  this.calendarOptions = {
    ...this.calendarOptions,
    events: eventos
  };
}

cargarReservas(): void {
  this.modo = 'reservados';
  this.cargando = true;
  this.alquileres = [];
  this.actualizarCalendario([]);

  this.alquilerService.listarReservados().subscribe({
    next: (res: any) => {
      this.alquileres = res.reservas || [];

      this.cargarEventosCalendario(this.alquileres, '#dc3545');

      this.cargando = false;
    },
    error: (err) => {
      console.error('Error al cargar reservas', err);
      this.cargando = false;
    }
  });
}

  /*actualizarCalendario(color: string, tituloDefault: string): void {
    const eventos = this.alquileres.map((alquiler: any) => {
      const fechaFin = new Date(alquiler.fecha_fin + 'T00:00:00');
      fechaFin.setDate(fechaFin.getDate() + 1);

      return {
        title: alquiler.producto?.nombre || tituloDefault,
        start: alquiler.fecha_inicio,
        end: this.formatearFecha(fechaFin),
        color
      };
    });

    this.calendarOptions = {
      ...this.calendarOptions,
      events: eventos
    };
  }*/

  private formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}