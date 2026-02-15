import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InheritanceRoutingModule } from './inheritance-routing.module';
import { InheritanceCalculatorComponent } from './inheritance-calculator/inheritance-calculator.component';

@NgModule({
  declarations: [InheritanceCalculatorComponent],
  imports: [CommonModule, InheritanceRoutingModule, ReactiveFormsModule]
})
export class InheritanceModule { }
