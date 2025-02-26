import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeSetupComponent } from './employee-setup.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { PermissionGuardService } from '../../core/services/permission-guard.service';
const routes: Routes = [{path: '', component: EmployeeSetupComponent,  canActivate: [PermissionGuardService]}];

@NgModule({
  imports: [RouterModule.forChild(routes),NgxPermissionsModule.forRoot()],
  exports: [RouterModule,NgxPermissionsModule],
  providers: [ PermissionGuardService ]
})
export class EmployeeSetupRoutingModule { }
