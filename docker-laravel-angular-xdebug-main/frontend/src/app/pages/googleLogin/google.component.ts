import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-google',
  standalone: true,
  template: `<p>Iniciando sesión...</p>`
})
export class GoogleComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    localStorage.setItem('token', token);

    this.authService.getUser().subscribe({
      next: (user: any) => {

        localStorage.setItem('user', JSON.stringify(user));

        this.router.navigate(['/home']);
      },

      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}