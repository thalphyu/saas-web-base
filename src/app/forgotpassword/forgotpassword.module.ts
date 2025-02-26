import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotpasswordRoutingModule } from './forgotpassword-routing.module';
import { ForgotpasswordComponent } from './forgotpassword.component';


@NgModule({
  imports: [
    CommonModule,
    ForgotpasswordRoutingModule
  ],
  declarations: [ForgotpasswordComponent]
})
export class ForgotpasswordModule { }
