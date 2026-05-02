import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Admin } from './admin/admin';

const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'admin', component: Admin }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }