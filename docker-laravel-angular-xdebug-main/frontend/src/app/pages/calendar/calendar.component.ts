import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AlquilerService } from '../../services/alquiler.service';
import { RouterModule } from '@angular/router';

declare var bootstrap: any;
@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [FullCalendarModule, CommonModule, RouterModule],
  templateUrl: './calendar.component.html',
})
export class CalendarioComponent implements OnInit {
  private alquilerService = inject(AlquilerService);
  cargando = false;
  alquileres: any[] = [];
  modo: 'reservados' | 'prestados' = 'reservados';
  alquilerIdSeleccionado!: number;
 

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
        this.alquileres = res.prestados || [];
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
    const eventos = alquileres.map((alquiler: any) => ({
      id: alquiler.id,
      title: alquiler.producto?.nombre || 'Producto reservado',
      start: alquiler.fecha_inicio,
      end: this.sumarUnDia(alquiler.fecha_fin),
      color: color,
      extendedProps: {
        alquiler: alquiler,
        producto: alquiler.producto
      }
    }));

    this.actualizarCalendario(eventos);
  }
  sumarUnDia(fecha: string): string {
    const date = new Date(fecha);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
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
  
  puedeCancelar(fechaInicio: string): boolean {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const inicio = new Date(fechaInicio);
    inicio.setHours(0, 0, 0, 0);

    const limite = new Date(inicio);
    limite.setDate(limite.getDate() - 2);

    return hoy <= limite;
  }

  confirmarCancelacion(): void {
    this.alquilerService.cancelarAlquiler(this.alquilerIdSeleccionado).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarReservas(); // refrescar lista
      },
      error: (err) => {
        alert(err.error?.message || 'Error al cancelar');
      }
    });
  }
  
  abrirModalCancelar(id: number): void {
    this.alquilerIdSeleccionado = id;
    const modal = new bootstrap.Modal(
      document.getElementById('modalCancelar')
    );
    modal.show();
  }
  
  cerrarModal(): void {
    const modalElement = document.getElementById('modalCancelar');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }
  puedeDevolver(fechaFin: string, estado: string): boolean {
    if (estado !== 'activo') return false;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fin = new Date(fechaFin);
    fin.setHours(0, 0, 0, 0);

    return hoy >= fin;
  }
}