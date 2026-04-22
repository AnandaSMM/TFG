import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

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
    telefono: ''
  };

  ngOnInit() {
    // Intentamos sacar los datos del usuario logueado del localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.userData.id = user.id;
      this.userData.nombre = user.nombre;
      this.userData.email = user.email;
      this.userData.telefono = user.telefono || '';
    }
  }

  saveProfile() {
    this.userService.actualizarUsuario(this.userData.id, this.userData).subscribe({
      next: (res) => alert('¡Datos actualizados en la Base de Datos!'),
      error: (err) => alert('Error al guardar cambios')
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
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
}