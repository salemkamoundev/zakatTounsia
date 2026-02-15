import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Important pour | number
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ZakatRoutingModule } from './zakat-routing.module';
import { ZakatCalculatorComponent } from './zakat-calculator/zakat-calculator.component';

@NgModule({
  declarations: [ZakatCalculatorComponent],
  imports: [
    CommonModule,
    ZakatRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forChild() // .forChild() est crucial ici
  ]
})
export class ZakatModule { }
