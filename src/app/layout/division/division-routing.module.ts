import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DivisionComponent } from './division.component';
import { PermissionGuardService } from '../../core/services/permission-guard.service';
import { NgxPermissionsModule } from 'ngx-permissions';

const routes: Routes = [
    { path: '', component: DivisionComponent, canActivate: [PermissionGuardService] },
];

@NgModule({
    imports: [RouterModule.forChild(routes), NgxPermissionsModule.forRoot()],
    exports: [RouterModule, NgxPermissionsModule],
    providers: [PermissionGuardService]
})

export class DivisionRoutingModule { }
