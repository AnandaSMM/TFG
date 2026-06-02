import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { DetallesProductoComponent } from '../detalles/detalles-producto.component';
import { ProductoService } from '../../services/producto.service';

interface ImagenProducto {
  id: number;
  producto_id: number;
  imagen: string;
}

interface UsuarioProducto {
  id: number;
  nombre: string;
  foto?: string | null;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface Producto {
  id: number;
  usuario_id: number;
  nombreUser: string;
  usuario?: UsuarioProducto | null;
  nombre: string;
  descripcion: string | null;
  precio_venta: number | string | null;
  precio_alquiler_dia: number | string | null;
  vendido?: boolean;
  disponible: boolean;
  localidad: string | null;
  imagenes: ImagenProducto[];
}

interface RespuestaProductos {
  current_page?: number;
  last_page?: number;
  total: number;
  data: Producto[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DetallesProductoComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private http = inject(HttpClient);
  private categoriaService = inject(CategoriaService);
  private productoService = inject(ProductoService);
  private timeoutBusqueda: any;
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: Categoria[] = [];
  categoriasSeleccionadas: number[] = [];

  busqueda = '';
  cargando = true;
  error = '';
  paginaActual = 1;
  totalPaginas = 1;
  categoriasMenuAbierto = false; 
  productoSeleccionado: Producto | null = null;
  modalAbierto = false;
  private apiUrl = 'http://localhost:8000/api/productos';

  imagenActualPorProducto: { [productoId: number]: number } = {};

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProductos();
  }

  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (respuesta: any) => {
        if (respuesta && Array.isArray(respuesta.data)) {
          this.categorias = respuesta.data;
        } else if (Array.isArray(respuesta)) {
          this.categorias = respuesta;
        } else {
          this.categorias = [];
        }
        console.log('Categorías procesadas:', this.categorias);
      },
      error: (err) => {
        console.error('ERROR CARGANDO CATEGORIAS:', err);
      }
    });
  }

 cargarProductos(page: number = 1): void {
  this.cargando = true;
  this.error = '';
  const termino = this.busqueda.trim();
  let url = `${this.apiUrl}?page=${page}`;

  if (termino) {
    url += `&buscar=${encodeURIComponent(termino)}`;
  }

  this.categoriasSeleccionadas.forEach((id) => {
    url += `&categorias[]=${id}`;
  });

  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  this.http.get<RespuestaProductos>(url, { headers }).subscribe({
    next: (respuesta) => {

      this.productos = respuesta.data || []; 
      this.productosFiltrados = [...this.productos];
      this.paginaActual = respuesta.current_page ?? 1;
      this.totalPaginas = respuesta.last_page ?? 1;
      
      // Inicializar índices de imágenes
      this.productos.forEach((p) => {
        if (this.imagenActualPorProducto[p.id] === undefined) {
          this.imagenActualPorProducto[p.id] = 0;
        }
      });

      this.cargando = false;
    },
    error: (err) => {
      this.error = 'No se pudieron cargar los productos';
      this.cargando = false;
    }
  });
}

  filtrarProductos(): void {
    clearTimeout(this.timeoutBusqueda);

    this.timeoutBusqueda = setTimeout(() => {
      this.paginaActual = 1;
      this.cargarProductos(1);
    }, 500);
  }

  cambiarPagina(page: number): void {
    if (page < 1 || page > this.totalPaginas || page === this.paginaActual) {
      return;
    }

    this.cargarProductos(page);
  }

  paginasVisibles(): number[] {
    const paginas: number[] = [];
    let inicio = Math.max(1, this.paginaActual - 2);
    let fin = Math.min(this.totalPaginas, this.paginaActual + 2);

    if (this.totalPaginas <= 5) {
      inicio = 1;
      fin = this.totalPaginas;
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }

    return paginas;
  }

  estaCategoriaSeleccionada(categoriaId: number): boolean {
    return this.categoriasSeleccionadas.includes(categoriaId);
  }

  toggleCategoria(categoriaId: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.categoriasSeleccionadas.includes(categoriaId)) {
        this.categoriasSeleccionadas.push(categoriaId);
      }
    } else {
      this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(
        id => id !== categoriaId
      );
    }
  }

  limpiarCategorias(): void {
    this.categoriasSeleccionadas = [];
    this.paginaActual = 1;
    this.cargarProductos(1);
  }
  
  toggleMenuCategorias(): void {
    this.categoriasMenuAbierto = !this.categoriasMenuAbierto;
  }

  cerrarMenuCategorias(): void {
    this.categoriasMenuAbierto = false;
  }

  aplicarFiltros(): void {
    this.paginaActual = 1;
    this.cargarProductos(1);
    this.categoriasMenuAbierto = false; 
  }

  quitarCategoria(categoriaId: number): void {
    this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(
      id => id !== categoriaId
    );
    this.paginaActual = 1;
    this.cargarProductos(1);
  }

  getCategoriasSeleccionadasDetalle(): Categoria[] {
    return this.categorias.filter(c =>
      this.categoriasSeleccionadas.includes(c.id)
    );
  }

  trackByCategoriaId(index: number, categoria: Categoria): number {
    return categoria.id;
  }

  abrirModal(producto: any): void {
    this.productoSeleccionado = producto;
    this.modalAbierto = true;
    document.body.classList.add('modal-open');

    this.productoService.obtenerProducto(producto.id).subscribe({
      next: (productoCompleto) => {
        this.productoSeleccionado = {
          ...producto,
          ...productoCompleto,
          imagenes:
            productoCompleto.imagenes?.length
              ? productoCompleto.imagenes
              : producto.imagenes
        };
      },
      error: (error) => {
        console.error('Error al cargar el producto completo', error);
      }
    });
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.productoSeleccionado = null;
    document.body.classList.remove('modal-open');
  }

  trackByProductoId(index: number, producto: Producto): number {
    return producto.id;
  }
}