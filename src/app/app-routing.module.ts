import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'zakat', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'zakat', loadChildren: () => import('./zakat/zakat.module').then(m => m.ZakatModule) },
  { path: 'heritage', loadChildren: () => import('./inheritance/inheritance.module').then(m => m.InheritanceModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
