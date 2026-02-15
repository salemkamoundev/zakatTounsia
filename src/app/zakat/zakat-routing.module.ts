import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZakatCalculatorComponent } from './zakat-calculator/zakat-calculator.component';

const routes: Routes = [{ path: '', component: ZakatCalculatorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZakatRoutingModule { }
