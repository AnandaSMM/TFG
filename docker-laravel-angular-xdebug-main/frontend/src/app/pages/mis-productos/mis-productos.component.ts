import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ProductoService } from '../../services/producto.service';
import { AlquilerService } from '../../services/alquiler.service';
import { CategoriaService } from '../../services/categoria.service';
import { environment } from '../../../environtments/environtment';

@Component({
  selector: 'app-mis-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-productos.component.html',
  styleUrls: ['./mis-productos.component.scss']
})
export class MisProductosComponent implements OnInit {
  private productoService  = inject(ProductoService);
  private alquilerService  = inject(AlquilerService);
  private categoriaService = inject(CategoriaService);

  misProductos:       any[] = [];
  productosPrestados: any[] = [];
  categorias:         any[] = [];
  cargando = true;
  error    = '';

  // Modal
  modalAbierto        = false;
  modoEdicion         = false;
  productoEditandoId: number | null = null;
  guardando    = false;
  mensajeForm  = '';
  errorForm    = '';

  form = {
    nombre:              '',
    descripcion:         '',
    precio_alquiler_dia: null as number | null,
    precio_venta:        null as number | null,
    localidad:           '',
    disponible:          true
  };

  categoriasSeleccionadas: number[] = [];
  imagenesActuales:        any[]    = [];
  imagenesAEliminar:       number[] = [];
  imagenesNuevas:          File[]   = [];
  imagenesNuevasPreview:   string[] = [];

  private readonly storageUrl = environment.storageUrl+'/';

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarDatos();
  }

  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (res: any) => { this.categorias = res.data || res || []; },
      error: () => {}
    });
  }

  cargarDatos(): void {
    this.cargando = true;

    this.productoService.misProductos().subscribe({
      next:  (res) => { this.misProductos = res.data || []; this.cargando = false; },
      error: ()    => { this.error = 'Error al cargar tus productos'; this.cargando = false; }
    });

    this.alquilerService.listarPrestados().subscribe({
      next:  (res: any) => { this.productosPrestados = res.prestados || []; },
      error: () => {}
    });
  }

  getPrimeraImagen(producto: any): string {
    const ruta = producto?.imagenes?.[0]?.imagen;
    return ruta ? `${this.storageUrl}${ruta}` : '/producto-placeholder.jpg';
  }

  getImagenUrl(ruta: string): string {
    return `${this.storageUrl}${ruta}`;
  }

  // ── Categorías ──────────────────────────────────────

  estaCategoriaSel(id: number): boolean {
    return this.categoriasSeleccionadas.includes(id);
  }

  toggleCategoria(id: number): void {
    if (this.estaCategoriaSel(id)) {
      this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(c => c !== id);
    } else {
      this.categoriasSeleccionadas.push(id);
    }
  }

  // ── Imágenes ────────────────────────────────────────

  estaImagenMarcada(id: number): boolean {
    return this.imagenesAEliminar.includes(id);
  }

  toggleEliminarImagen(id: number): void {
    if (this.estaImagenMarcada(id)) {
      this.imagenesAEliminar = this.imagenesAEliminar.filter(i => i !== id);
    } else {
      this.imagenesAEliminar.push(id);
    }
  }

  onImagenesSeleccionadas(event: any): void {
    const files: File[] = Array.from(event.target.files);
    this.imagenesNuevas = [...this.imagenesNuevas, ...files];
    this.imagenesNuevasPreview = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagenesNuevasPreview.push(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  // ── Modal ────────────────────────────────────────────

  abrirModalCrear(): void {
    this.modoEdicion        = false;
    this.productoEditandoId = null;
    this.resetForm();
    this.modalAbierto = true;
  }

  abrirModalEditar(producto: any): void {
    this.modoEdicion        = true;
    this.productoEditandoId = producto.id;
    this.form = {
      nombre:              producto.nombre,
      descripcion:         producto.descripcion || '',
      precio_alquiler_dia: Number(producto.precio_alquiler_dia),
      precio_venta:        producto.precio_venta ? Number(producto.precio_venta) : null,
      localidad:           producto.localidad || '',
      disponible:          producto.disponible
    };
    this.imagenesActuales        = [...(producto.imagenes || [])];
    this.imagenesAEliminar       = [];
    this.imagenesNuevas          = [];
    this.imagenesNuevasPreview   = [];
    this.categoriasSeleccionadas = producto.categorias?.map((c: any) => c.id) || [];
    this.mensajeForm = '';
    this.errorForm   = '';
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  private resetForm(): void {
    this.form = {
      nombre: '', descripcion: '',
      precio_alquiler_dia: null, precio_venta: null,
      localidad: '', disponible: true
    };
    this.imagenesActuales        = [];
    this.imagenesAEliminar       = [];
    this.imagenesNuevas          = [];
    this.imagenesNuevasPreview   = [];
    this.categoriasSeleccionadas = [];
    this.mensajeForm = '';
    this.errorForm   = '';
  }

  // ── Guardar ──────────────────────────────────────────

  guardar(): void {
    if (!this.form.nombre?.trim()) {
      this.errorForm = 'El nombre es obligatorio'; return;
    }
    if (!this.form.precio_alquiler_dia || this.form.precio_alquiler_dia <= 0) {
      this.errorForm = 'El precio por día es obligatorio'; return;
    }
    if (!this.form.localidad?.trim()) {
        this.errorForm = 'La localidad es obligatoria'; return;
    }

    this.guardando   = true;
    this.errorForm   = '';
    this.mensajeForm = '';

    // Si hay imágenes marcadas para borrar, las eliminamos primero
    if (this.imagenesAEliminar.length > 0) {
      forkJoin(
        this.imagenesAEliminar.map(id => this.productoService.eliminarImagen(id))
      ).subscribe({
        next:  () => this.guardarProducto(),
        error: () => { this.errorForm = 'Error al eliminar imágenes'; this.guardando = false; }
      });
    } else {
      this.guardarProducto();
    }
  }

  private guardarProducto(): void {
    const fd = new FormData();
    fd.append('nombre',              this.form.nombre);
    fd.append('descripcion',         this.form.descripcion || '');
    fd.append('precio_alquiler_dia', String(this.form.precio_alquiler_dia));
    fd.append('localidad',           this.form.localidad || '');
    fd.append('disponible',          this.form.disponible ? '1' : '0');
    if (this.form.precio_venta) {
      fd.append('precio_venta', String(this.form.precio_venta));
    }
    this.imagenesNuevas.forEach(img => fd.append('imagenes[]', img));

    const peticion = this.modoEdicion && this.productoEditandoId !== null
      ? this.productoService.actualizarProducto(this.productoEditandoId, fd)
      : this.productoService.crearProducto(fd);

    peticion.subscribe({
      next:  (res: any) => this.sincronizarCategorias(res),
      error: (err: any) => {
        this.errorForm = err.error?.message || 'Error al guardar el producto';
        this.guardando = false;
      }
    });
  }

  private sincronizarCategorias(res: any): void {
    const productoId = this.modoEdicion && this.productoEditandoId !== null
      ? this.productoEditandoId
      : res.producto?.id;

    this.productoService.asignarCategorias(productoId, this.categoriasSeleccionadas).subscribe({
      next: () => {
        this.mensajeForm = this.modoEdicion ? 'Producto actualizado' : 'Producto creado correctamente';
        this.guardando   = false;
        setTimeout(() => { this.cerrarModal(); this.cargarDatos(); }, 800);
      },
      error: (err: any) => {
        this.errorForm = err.error?.message || 'Error al asignar categorías';
        this.guardando = false;
      }
    });
  }

  // ── Eliminar producto ────────────────────────────────

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;
    this.productoService.eliminarProducto(id).subscribe({
      next:  () => this.cargarDatos(),
      error: () => alert('Error al eliminar el producto')
    });
  }
}