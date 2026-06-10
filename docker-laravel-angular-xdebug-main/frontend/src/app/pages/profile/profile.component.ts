import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { environment } from '../../../environtments/environtment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  
  userData = {
    id: 0,
    nombre: '',
    email: '',
    telefono: '',
    foto: '',
    password: ''
  };

  editando=false;

  activarEdicion(){
    this.editando=!this.editando;
    
  }
  alquileresTotales=0;
  alquileresActivos=0;
  ingresosTotales=0;
  productosmasAlquilados: any[] = [];

  fechaRegistro: string = '';

  ngOnInit() {
    const savedUser = localStorage.getItem('user');

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.userData.id = user.id;
        this.userData.nombre = user.nombre;
        this.userData.email = user.email;
        this.userData.telefono = user.telefono || '';
        this.userData.foto = user.foto || '';
        this.userData.password = '';
      } catch (e) {
        console.error('Error al parsear el usuario del localStorage:', e);
      }
    }
    if (this.userData.id > 0) {
      this.info();
    } 
  }
  onFileSelected(event: any) {
    const archivo: File = event.target.files[0];
    if (archivo) {
      this.subirFoto(archivo);
    }
  }

  subirFoto(file: File){
    const formData = new FormData();
    formData.append('foto', file);
    this.userService.actualizarFoto(this.userData.id, formData).subscribe({
      next: (res) => {
        alert('¡Foto de perfil actualizada!');
        this.userData.foto = res.fotoPath;
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.foto = res.fotoPath;
        localStorage.setItem('user', JSON.stringify(user));
      },
      error: (err) => {
        console.error(err);
        alert('Error al subir la foto');
      }
    });
  }

  saveProfile() {
    this.userService.actualizarUsuario(this.userData.id, this.userData).subscribe({
      next: (res) => {
        alert('¡Datos actualizados en la Base de Datos!');
        this.userData.password = ''; 
        this.editando = false;
        localStorage.setItem('user', JSON.stringify(res.user)); 
      },
      error: (err) => alert('Error al guardar cambios')
    });
    
  }

  deleteAccount() {
    if (confirm('¿Estás seguro de que quieres borrar tu cuenta? Esta acción no se puede deshacer.')) {
      this.userService.eliminarUsuario(this.userData.id).subscribe({
        next: () => {
          alert('Cuenta eliminada correctamente');
          localStorage.clear(); 
          this.router.navigate(['/login']);//fueraa
        },
        error: (err) => alert('Error al eliminar la cuenta')
      });
    }
  }

  info() {
    this.userService.obtenerStats(this.userData.id).subscribe({
      next: (res) => {
        this.alquileresTotales = res.alquileres || 0;
        this.alquileresActivos = res.alquileresAct || 0;
        this.ingresosTotales = res.ingresos || 0;
        this.productosmasAlquilados = res.productosEstrella || [];
      },
      error: (err) => {
        console.error('Error al obtener estadísticas', err)
        this.alquileresTotales = 0;
        this.alquileresActivos = 0;
        this.ingresosTotales =0;
        this.productosmasAlquilados = [];
      }
    });
  }
  // para sacar la foto de la cuenta de google salma
  getFotoPerfil(): string {
    if (!this.userData?.foto) {
      return 'https://i.pravatar.cc/200';
    }

    // Si viene de Google
    if (
      this.userData.foto.startsWith('http://') ||
      this.userData.foto.startsWith('https://')
    ) {
      return this.userData.foto;
    }

    // Si es una imagen local del storage
    return environment.storageUrl + '/' + this.userData.foto;
  }

}
