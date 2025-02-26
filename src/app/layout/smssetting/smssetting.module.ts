import { NgModule } from '@angular/core';
import { SmssettingRoutingModule } from './smssetting-routing.module';
import { SmssettingComponent } from './smssetting.component';
import { SharedModule } from '../../shared';

@NgModule({
  imports: [
    SharedModule,
    SmssettingRoutingModule
  ],
  declarations: [SmssettingComponent]
})
export class SmssettingModule { }
