import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ZakatDataService } from '../../core/services/zakat-data.service';
import { DailyValues } from '../../core/models/daily-values.model';

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

  constructor(private fb: FormBuilder, private zakatService: ZakatDataService) {
    this.zakatForm = this.fb.group({
      epargne: [0], or_grammes: [0], argent_prete: [0], dettes: [0]
    });
  }

  ngOnInit(): void {
    // On suppose que le service existe déjà dans core/services
    this.zakatService.getNissab().subscribe(data => {
      this.dailyValues = data;
      this.calculer();
    });
    this.zakatForm.valueChanges.subscribe(() => this.calculer());
  }

  calculer(): void {
    if (!this.dailyValues) return;
    const v = this.zakatForm.value;
    const total = (v.epargne||0) + ((v.or_grammes||0) * this.dailyValues.goldPrice) + (v.argent_prete||0);
    const net = total - (v.dettes||0);
    
    if (net >= this.dailyValues.nissabZakat) {
      this.isEligible = true;
      this.zakatAmount = net * 0.025;
    } else {
      this.isEligible = false;
      this.zakatAmount = 0;
    }
  }
}
