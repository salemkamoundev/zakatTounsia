import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false // <--- C'est la clé ! On force le mode classique.
})
export class AppComponent {
  title = 'zakattounsia';
}
