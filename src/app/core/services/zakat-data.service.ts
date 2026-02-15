import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { catchError, map, filter } from 'rxjs/operators';
import { DailyValues } from '../models/daily-values.model';

@Injectable({
  providedIn: 'root'
})
export class ZakatDataService {

  constructor(private afs: AngularFirestore) {}

  getNissab(): Observable<DailyValues> {
    // La syntaxe Compat est beaucoup plus robuste dans un environnement de modules
    return this.afs
      .doc<DailyValues>('configurations/daily_values')
      .valueChanges()
      .pipe(
        filter((data): data is DailyValues => !!data),
        catchError(err => {
          console.error('Erreur Firestore:', err);
          return of({ goldPrice: 0, nissabZakat: 0, lastUpdated: null } as DailyValues);
        })
      );
  }
}
