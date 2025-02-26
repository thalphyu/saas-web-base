import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventViewerComponent } from './event-viewer.component';
import { NgxPermissionsModule } from '../../../../node_modules/ngx-permissions';
import { PermissionGuardService } from '../../core/services/permission-guard.service';
const routes: Routes = [{path: '', component: EventViewerComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class EventViewerRoutingModule { }
