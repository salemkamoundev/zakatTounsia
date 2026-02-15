import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ZakatDataService } from '../../core/services/zakat-data.service';
import { AuthService } from '../../core/services/auth.service';
import { DailyValues } from '../../core/models/daily-values.model';
import { Firestore, collection, addDoc, Timestamp, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-zakat-calculator',
  templateUrl: './zakat-calculator.component.html',
  standalone: false
})
export class ZakatCalculatorComponent implements OnInit {
  zakatForm: FormGroup;
  dailyValues: DailyValues | null = null;
  zakatAmount: number = 0;
  isEligible: boolean = false;
  isLoading: boolean = true;
  
  private firestore: Firestore = inject(Firestore);
  public auth: AuthService = inject(AuthService);

  constructor(private fb: FormBuilder, private zakatService: ZakatDataService) {
    this.zakatForm = this.fb.group({
      epargne: [0], or_grammes: [0], argent_prete: [0], dettes: [0]
    });
  }

  ngOnInit(): void {
    this.zakatService.getNissab().subscribe(async (data) => {
      this.isLoading = false;
      
      // Si aucune donnée n'existe dans Firestore, on les crée par défaut
      if (!data || !data.nissabZakat) {
        console.warn('⚠️ Configuration manquante. Création des valeurs par défaut...');
        await this.creerValeursParDefaut();
        return;
      }

      this.dailyValues = data;
      console.log('✅ Valeurs du jour chargées:', this.dailyValues);
      this.calculer();
    });

    this.zakatForm.valueChanges.subscribe(() => this.calculer());
  }

  async creerValeursParDefaut() {
    try {
      const defaultValues = {
        goldPrice: 250, // Prix estimatif de l'or (DT/g)
        nissabZakat: 21250, // 85g * 250
        lastUpdated: new Date().toISOString()
      };
      // Écriture dans Firestore
      const docRef = doc(this.firestore, 'configurations/daily_values');
      await setDoc(docRef, defaultValues);
      console.log('✅ Valeurs par défaut créées avec succès !');
    } catch (e) {
      console.error('❌ Erreur lors de la création des valeurs:', e);
    }
  }

  calculer(): void {
    if (!this.dailyValues) return;

    const v = this.zakatForm.value;
    
    // IMPORTANT : On force la conversion en Nombre (Number()) pour éviter l'addition de texte
    const epargne = Number(v.epargne) || 0;
    const or_grammes = Number(v.or_grammes) || 0;
    const argent_prete = Number(v.argent_prete) || 0;
    const dettes = Number(v.dettes) || 0;

    const total = epargne + (or_grammes * this.dailyValues.goldPrice) + argent_prete;
    const net = total - dettes;
    
    console.log(`Calcul: Net (${net}) vs Nissab (${this.dailyValues.nissabZakat})`);

    if (net >= this.dailyValues.nissabZakat) {
      this.isEligible = true;
      this.zakatAmount = net * 0.025; // 2.5%
    } else {
      this.isEligible = false;
      this.zakatAmount = 0;
    }
  }

  async sauvegarderResultat(user: any) {
    if (!user) return;
    try {
      const data = {
        userId: user.uid,
        date: Timestamp.now(),
        inputs: this.zakatForm.value,
        zakatAmount: this.zakatAmount,
        isEligible: this.isEligible,
        nissabUsed: this.dailyValues?.nissabZakat
      };
      await addDoc(collection(this.firestore, `users/${user.uid}/zakat_calculations`), data);
      alert('✅ Calcul sauvegardé !');
    } catch (err) {
      console.error(err);
      alert('❌ Erreur de sauvegarde');
    }
  }
}
