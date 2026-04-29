import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Recherche } from './recherche/recherche';

const routes: Routes = [
  { path: '', component: Recherche }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RechercheRoutingModule { }