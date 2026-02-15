import { Injectable, inject } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signInAnonymously, signOut, user, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);
  
  // Observable de l'utilisateur courant
  user$: Observable<User | null> = user(this.auth);

  constructor() {}

  // Login avec Google
  async loginWithGoogle() {
    try {
      await signInWithPopup(this.auth, new GoogleAuthProvider());
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Erreur Login Google:', error);
      alert('Erreur de connexion Google');
    }
  }

  // Login Anonyme
  async loginAnonymously() {
    try {
      await signInAnonymously(this.auth);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Erreur Login Anonyme:', error);
      alert('Erreur de connexion anonyme');
    }
  }

  // Logout
  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}
