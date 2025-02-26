import { NgModule } from '@angular/core';
import { FilterbyemployeeComponent } from './filterbyemployee.component';
import { FilterbyemployeeRoutingModule } from './filterbyemployee-routing.module';
import { FilterbyemployeemultiModule } from '../filterbyemployeemulti/filterbyemployeemulti.module';
import { SharedModule } from '../../shared';

@NgModule({
  imports: [
    FilterbyemployeeRoutingModule,
    FilterbyemployeemultiModule,
    SharedModule
  ],
  declarations: [FilterbyemployeeComponent],
  exports: [FilterbyemployeeComponent]
})
export class FilterbyemployeeModule { }
