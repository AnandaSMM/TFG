import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ImagenProducto {
  id: number;
  producto_id: number;
  imagen: string;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_alquiler_dia: number | string | null;
  disponible: boolean;
  localidad: string | null;
  imagenes: ImagenProducto[];
}

interface RespuestaProductos {
  total: number;
  data: Producto[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private http = inject(HttpClient);

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];

  busqueda = '';
  cargando = true;
  error = '';

  private apiUrl = 'http://localhost:8000/api/productos';
  private baseUrl = 'http://localhost:8000/storage/';

  // guarda qué imagen está viendo el usuario en cada producto
  imagenActualPorProducto: { [productoId: number]: number } = {};

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.error = '';

    this.http.get<RespuestaProductos>(this.apiUrl).subscribe({
      next: (respuesta) => {
        this.productos = Array.isArray(respuesta.data) ? respuesta.data : [];
        this.productosFiltrados = [...this.productos];

        // inicializar indice de imagen en 0 para cada producto
        this.productos.forEach(producto => {
          this.imagenActualPorProducto[producto.id] = 0;
        });

        this.cargando = false;
        console.log('PRODUCTOS CON IMAGENES:', this.productos);
      },
      error: (err) => {
        console.error('ERROR CARGANDO PRODUCTOS:', err);
        this.error = 'No se pudieron cargar los productos';
        this.cargando = false;
      }
    });
  }

  filtrarProductos(): void {
    const texto = this.busqueda.trim().toLowerCase();

    if (!texto) {
      this.productosFiltrados = [...this.productos];
      return;
    }

    this.productosFiltrados = this.productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(texto) ||
      (producto.localidad?.toLowerCase().includes(texto) ?? false) ||
      (producto.descripcion?.toLowerCase().includes(texto) ?? false)
    );
  }

  getImagenUrl(ruta: string | null | undefined): string {
    if (!ruta) {
      return 'assets/producto-placeholder.jpg';
    }

    return `${this.baseUrl}${ruta}`;
  }

  getImagenActual(producto: Producto): string {
    if (!producto.imagenes || producto.imagenes.length === 0) {
      return 'assets/producto-placeholder.jpg';
    }

    const indice = this.imagenActualPorProducto[producto.id] ?? 0;
    return this.getImagenUrl(producto.imagenes[indice]?.imagen);
  }

  siguienteImagen(producto: Producto): void {
    if (!producto.imagenes || producto.imagenes.length <= 1) return;

    const actual = this.imagenActualPorProducto[producto.id] ?? 0;
    this.imagenActualPorProducto[producto.id] =
      (actual + 1) % producto.imagenes.length;
  }

  anteriorImagen(producto: Producto): void {
    if (!producto.imagenes || producto.imagenes.length <= 1) return;

    const actual = this.imagenActualPorProducto[producto.id] ?? 0;
    this.imagenActualPorProducto[producto.id] =
      (actual - 1 + producto.imagenes.length) % producto.imagenes.length;
  }
}