import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { DashboardRoutingModule } from './dashboard-routing-module';
import { Dashboard } from './dashboard/dashboard';
import { Admin } from './admin/admin';

@NgModule({
  imports: [
    SharedModule,
    DashboardRoutingModule,
    Dashboard,
    Admin
  ]
})
export class DashboardModule { }