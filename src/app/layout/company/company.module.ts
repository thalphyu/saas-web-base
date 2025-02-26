import { NgModule } from '@angular/core';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';
import { FilterdataPipe } from './filterdata.pipe';
import { SharedModule } from '../../shared';
import { MulticheckfilterModule } from '../multicheckfilter/multicheckfilter.module';

@NgModule({
  imports: [
    CompanyRoutingModule,
    SharedModule,
    MulticheckfilterModule
  ],
  declarations: [CompanyComponent, FilterdataPipe],
  exports: [CompanyComponent]
})
export class CompanyModule { }
