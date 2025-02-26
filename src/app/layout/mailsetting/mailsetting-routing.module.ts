import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MailsettingComponent } from './mailsetting.component';
import { PermissionGuardService } from '../../core';
import { NgxPermissionsModule } from 'ngx-permissions';

const routes: Routes = [{path: '', component: MailsettingComponent, canActivate: []}];

@NgModule({
  imports: [RouterModule.forChild(routes), NgxPermissionsModule.forRoot()],
  exports: [RouterModule, NgxPermissionsModule],
  providers: []
})
export class MailsettingRoutingModule { }
