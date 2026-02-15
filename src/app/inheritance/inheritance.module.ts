import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Important pour | number
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { InheritanceRoutingModule } from './inheritance-routing.module';
import { InheritanceCalculatorComponent } from './inheritance-calculator/inheritance-calculator.component';

@NgModule({
  declarations: [InheritanceCalculatorComponent],
  imports: [
    CommonModule,
    InheritanceRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forChild() // .forChild() est crucial ici
  ]
})
export class InheritanceModule { }
