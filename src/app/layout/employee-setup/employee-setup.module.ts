import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EmployeeSetupRoutingModule } from './employee-setup-routing.module';
import { EmployeeSetupComponent } from './employee-setup.component';
import { CompanyModule } from '../company/company.module';
import { FilterbyemployeeModule } from '../filterbyemployee/filterbyemployee.module';
import { FilterbyemployeemultiModule } from '../filterbyemployeemulti/filterbyemployeemulti.module';
import { DivisionModule } from '../division/division.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    EmployeeSetupRoutingModule,
    CompanyModule,
    FilterbyemployeeModule,
    FilterbyemployeemultiModule,
    DivisionModule,
    SharedModule
  ],
  declarations: [EmployeeSetupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmployeeSetupModule { }
