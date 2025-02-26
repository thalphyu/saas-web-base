import { NgModule } from '@angular/core';
import { ApplicationOptionRoutingModule } from './application-option-routing.module';
import { ApplicationOptionComponent } from './application-option.component';
import { SharedModule } from '../../shared';

@NgModule({
  imports: [
    ApplicationOptionRoutingModule,
    SharedModule
  ],
  declarations: [ApplicationOptionComponent]
})
export class ApplicationOptionModule { }
