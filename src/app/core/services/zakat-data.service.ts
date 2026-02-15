import { Injectable, inject } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DailyValues } from '../models/daily-values.model';

@Injectable({
  providedIn: 'root'
})
export class ZakatDataService {
  // Injection du service Firestore (API Modulaire)
  private firestore: Firestore = inject(Firestore);

  getNissab(): Observable<DailyValues> {
    // Référence au document
    const docRef = doc(this.firestore, 'configurations/daily_values');

    // docData renvoie un Observable en temps réel
    return docData(docRef).pipe(
      map(data => data as DailyValues), // Casting explicite
      catchError(err => {
        console.error('Erreur Firestore:', err);
        return of({ goldPrice: 0, nissabZakat: 0, lastUpdated: null } as DailyValues);
      })
    );
  }
}