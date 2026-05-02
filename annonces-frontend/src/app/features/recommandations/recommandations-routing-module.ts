import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Recommandations } from './recommandations/recommandations';

const routes: Routes = [
  { path: '', component: Recommandations }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecommandationsRoutingModule { }