import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { RechercheRoutingModule } from './recherche-routing-module';
import { Recherche } from './recherche/recherche';

@NgModule({
  imports: [
    SharedModule,
    RechercheRoutingModule,
    Recherche
  ]
})
export class RechercheModule { }