import { NgModule } from '@angular/core';
import { UserlevelcontrolRoutingModule } from './userlevelcontrol-routing.module';
import { UserlevelcontrolComponent } from './userlevelcontrol.component';
import { MulticheckFilterComponent } from './multicheck-filter/multicheck-filter.component';
import { FilterbyemployeemultiModule } from '../filterbyemployeemulti/filterbyemployeemulti.module';
import { SharedModule } from '../../shared';

@NgModule({
  imports: [
    UserlevelcontrolRoutingModule,
    FilterbyemployeemultiModule,
    SharedModule
  ],
  declarations: [UserlevelcontrolComponent,MulticheckFilterComponent],
})
export class UserlevelcontrolModule { }
