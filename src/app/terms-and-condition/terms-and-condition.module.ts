import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsAndConditionRoutingModule } from './terms-and-condition-routing.module';
import { TermsAndConditionComponent } from './terms-and-condition.component';
import { SharedModule } from '../shared';

@NgModule({
  imports: [
	  CommonModule,
  	TermsAndConditionRoutingModule,
	SharedModule
  ],
  declarations: [TermsAndConditionComponent]
})
export class TermsAndConditionModule { }
