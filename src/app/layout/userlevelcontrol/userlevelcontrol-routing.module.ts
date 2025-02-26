import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuardService } from '../../core/services/permission-guard.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { UserlevelcontrolComponent } from './userlevelcontrol.component';

const routes: Routes = [
  { path: '', component: UserlevelcontrolComponent, canActivate: [PermissionGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes), NgxPermissionsModule.forRoot()],
  exports: [RouterModule, NgxPermissionsModule],
  providers: [PermissionGuardService]
})
export class UserlevelcontrolRoutingModule { }
