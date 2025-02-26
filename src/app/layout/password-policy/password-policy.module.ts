import { NgModule } from '@angular/core';
import { PasswordPolicyRoutingModule } from './password-policy-routing.module';
import { PasswordPolicyComponent } from './password-policy.component';
import { SharedModule } from '../../shared';

@NgModule({
  imports: [
    PasswordPolicyRoutingModule,
    SharedModule
  ],
  declarations: [PasswordPolicyComponent]
})
export class PasswordPolicyModule { }
