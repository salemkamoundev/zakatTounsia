import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-inheritance-calculator',
  templateUrl: './inheritance-calculator.component.html',
  standalone: false
})
export class InheritanceCalculatorComponent {
  inheritanceForm: FormGroup;
  constructor(private fb: FormBuilder) { this.inheritanceForm = this.fb.group({ montant_total: [0] }); }
}
