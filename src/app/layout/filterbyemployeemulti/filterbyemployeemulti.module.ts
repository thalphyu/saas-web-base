import { NgModule } from '@angular/core';
import { FilterbyemployeemultiComponent } from './filterbyemployeemulti.component';
import { FilterbyemployeemultiRoutingModule } from './filterbyemployeemulti-routing.module';
import { FilterbyemployeeRoutingModule } from '../filterbyemployee/filterbyemployee-routing.module';
import { SharedModule } from '../../shared';
import { MulticheckFilterComponent } from './multicheck-filter/multicheck-filter.component';

@NgModule({
  imports: [
    FilterbyemployeemultiRoutingModule,
    FilterbyemployeeRoutingModule,
    SharedModule
  ],
  declarations: [FilterbyemployeemultiComponent,MulticheckFilterComponent],
  exports: [FilterbyemployeemultiComponent]
})
export class FilterbyemployeemultiModule { }
