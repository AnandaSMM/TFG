import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-google',
  template: '<p>Iniciando sesión...</p>'
})
export class GoogleComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const user = this.route.snapshot.queryParamMap.get('user');

    if (token) {
      localStorage.setItem('token', token);

      if (user) {
        localStorage.setItem('user', user);
      }

      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}