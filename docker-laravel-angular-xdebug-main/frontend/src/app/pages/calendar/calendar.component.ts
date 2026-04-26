import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {  } from "module";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [FullCalendarModule,CommonModule],
  templateUrl: './calendar.component.html',
})
export class CalendarioComponent {
  alquileres = [
    {
      nombre: 'Balón de Baloncesto',
      propietario: 'Juan Pérez',
      fecha_devolucion: '2026-04-15',
      precio_alquiler_dia: 5,
      imagen: 'assets/balon.jpg',
      estado: 'Pendiente'
    },
    {
      nombre: 'Raqueta de Tenis',
      propietario: 'María García',
      fecha_devolucion: '2026-04-12',
      precio_alquiler_dia: 8,
      imagen: 'assets/raqueta.jpg',
      estado: 'Pendiente'
    }

  ];
  calendarOptions = {
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

    events: [
      {
        title: 'Devolución',
        date: '2026-04-25',
        color: '#ff7a1a'
      },
      {
        title: 'Producto alquilado',
        date: '2026-04-25'
      },
      {
        title: 'Reserva pendiente',
        date: '2026-04-28'
      }
    ]
  };

}