import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmssettingComponent } from './smssetting.component';
import { PermissionGuardService } from '../../core';
import { NgxPermissionsModule } from 'ngx-permissions';
const routes: Routes = [
  {path: '', component: SmssettingComponent, canActivate: [PermissionGuardService] },

];

@NgModule({
  imports: [RouterModule.forChild(routes), NgxPermissionsModule.forRoot()],
  exports: [RouterModule, NgxPermissionsModule],
  providers: [ PermissionGuardService ]
})

export class SmssettingRoutingModule { }
