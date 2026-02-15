import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InheritanceCalculatorComponent } from './inheritance-calculator/inheritance-calculator.component';

const routes: Routes = [{ path: '', component: InheritanceCalculatorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InheritanceRoutingModule { }
