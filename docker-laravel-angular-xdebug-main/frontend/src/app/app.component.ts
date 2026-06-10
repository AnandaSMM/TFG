import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
<<<<<<< HEAD
=======
import { NavbarComponent } from './pages/navbar/navbar.component';
>>>>>>> develop

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
=======
  imports: [RouterOutlet, NavbarComponent],
  template: `
  <app-navbar></app-navbar>
  <router-outlet></router-outlet>`
})
export class AppComponent {}
>>>>>>> develop
