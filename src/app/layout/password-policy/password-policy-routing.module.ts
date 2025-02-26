import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PasswordPolicyComponent } from './password-policy.component';
// import { PermissionGuardService } from '../../core/services/permission-guard.service';
// import { NgxPermissionsModule } from '../../../../node_modules/ngx-permissions';

const routes: Routes = [
  { path: '', component: PasswordPolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes), ],
  exports: [RouterModule,],
  // providers: [PermissionGuardService]
})

export class  PasswordPolicyRoutingModule { }

