import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { environment } from '../../../environtments/environtment';

// Fix para los iconos de Leaflet con webpack/Angular
const iconDefault = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-instalaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instalaciones.component.html',
  styleUrls: ['./instalaciones.component.scss']
})
export class InstalacionesComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/instalaciones`;

  mapa!: L.Map;
  instalaciones: any[] = [];
  instalacionSeleccionada: any = null;
  cargando = true;
  error = '';

  ngOnInit(): void {
    this.inicializarMapa();
    this.cargarInstalaciones();
  }

  ngOnDestroy(): void {
    if (this.mapa) {
      this.mapa.remove();
    }
  }

  private inicializarMapa(): void {
    this.mapa = L.map('mapa-instalaciones').setView([40.4168, -3.7038], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(this.mapa);
  }

  private cargarInstalaciones(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.instalaciones = data;
        this.colocarMarcadores(data);
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las instalaciones';
        this.cargando = false;
      }
    });
  }

  private colocarMarcadores(instalaciones: any[]): void {
    instalaciones.forEach((inst) => {
      const marcador = L.marker([inst.lat, inst.lng])
        .addTo(this.mapa)
        .bindTooltip(inst.nombre, { permanent: false });

      marcador.on('click', () => {
        this.instalacionSeleccionada = inst;
      });
    });
  }
}