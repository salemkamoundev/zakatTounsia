import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent {
  title = 'zakattounsia';

  // Injection du Router pour vérifier l'URL actuelle
  constructor(public router: Router) {}

  // Renvoie true si on est sur la page /login
  get isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}
