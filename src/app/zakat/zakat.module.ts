import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ZakatRoutingModule } from './zakat-routing.module';
import { ZakatCalculatorComponent } from './zakat-calculator/zakat-calculator.component';

@NgModule({
  declarations: [ZakatCalculatorComponent],
  imports: [CommonModule, ZakatRoutingModule, ReactiveFormsModule]
})
export class ZakatModule { }
