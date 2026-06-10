import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CalendarioComponent } from './pages/calendar/calendar.component';
import { AlquilerComponent } from './pages/alquiler/alquiler.component';
import { DevolucionComponent } from './pages/devolucion/devolucion.component';
import { ChatComponent } from './pages/chat/chat.component';
import { GoogleComponent } from './pages/googleLogin/google.component';
import { PerfilUsuarioComponent } from "./pages/perfil-usuario/perfil-usuario.component";
import { InstalacionesComponent } from './pages/instalaciones/instalaciones.component';
import { MisProductosComponent } from './pages/mis-productos/mis-productos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard]  },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'calendar', component: CalendarioComponent, canActivate: [authGuard] },
  { path: 'alquilar/:id', component: AlquilerComponent, canActivate: [authGuard] },
  { path: 'devolucion/:id', component: DevolucionComponent, canActivate: [authGuard] },
  { path: 'alquileres/:id/cancelar', component: CalendarioComponent, canActivate: [authGuard] },
  { path: 'chats', component: ChatComponent, canActivate: [authGuard] },
  { path: 'auth/google/callback', component: GoogleComponent},
  { path: 'instalaciones', component: InstalacionesComponent, canActivate: [authGuard] },
  { path: 'mis-productos', component: MisProductosComponent, canActivate: [authGuard] },
  {path: 'perfil/:id',component: PerfilUsuarioComponent, canActivate: [authGuard]}
];
