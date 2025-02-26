import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { NgxPermissionsModule } from 'ngx-permissions';

const routes: Routes = [{path: '', component: ProfileComponent, canActivate: []}];

@NgModule({
  imports: [RouterModule.forChild(routes), NgxPermissionsModule.forRoot()],
  exports: [RouterModule, NgxPermissionsModule],
  providers: []
})
export class ProfileRoutingModule { }
