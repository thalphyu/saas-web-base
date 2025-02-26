import { NgModule } from '@angular/core';
import { DivisionRoutingModule } from './division-routing.module';
import { DivisionComponent } from './division.component';
import { FilterdataPipe } from './filterdata.pipe';
import { MulticheckfilterModule } from '../multicheckfilter/multicheckfilter.module';
import { SharedModule } from '../../shared';

@NgModule({
  imports: [
    DivisionRoutingModule,
    SharedModule,
    MulticheckfilterModule
  ],
  declarations: [DivisionComponent, FilterdataPipe],
  exports: [DivisionComponent]
})
export class DivisionModule { }
