import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { RecommandationsRoutingModule } from './recommandations-routing-module';
import { Recommandations } from './recommandations/recommandations';

@NgModule({
  imports: [
    SharedModule,
    RecommandationsRoutingModule,
    Recommandations
  ]
})
export class RecommandationsModule { }