import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'zakat', loadChildren: () => import('./zakat/zakat.module').then(m => m.ZakatModule) },
  { path: 'heritage', loadChildren: () => import('./inheritance/inheritance.module').then(m => m.InheritanceModule) },
  { path: '', redirectTo: 'zakat', pathMatch: 'full' },
  { path: '**', redirectTo: 'zakat' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
