import { NgModule } from '@angular/core';
import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { ChangePasswordComponent } from './change-password.component';
import { SharedModule } from '../../shared';

@NgModule({
  imports: [
    ChangePasswordRoutingModule,
    SharedModule
  ],
  declarations: [ChangePasswordComponent]
})
export class ChangePasswordModule { }
