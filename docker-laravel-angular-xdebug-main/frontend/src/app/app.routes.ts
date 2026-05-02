import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CalendarioComponent } from './pages/calendar/calendar.component';
import { AlquilerComponent } from './pages/alquiler/alquiler.component';
import { DevolucionComponent } from './pages/devolucion/devolucion.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'calendar', component: CalendarioComponent, canActivate: [authGuard] },
  { path: 'alquilar/:id', component: AlquilerComponent, canActivate: [authGuard] },
  { path: 'devolucion/:id', component: DevolucionComponent, canActivate: [authGuard] },
  { path: 'alquileres/:id/cancelar', component: CalendarioComponent, canActivate: [authGuard] },
  
];