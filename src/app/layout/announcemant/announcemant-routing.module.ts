import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnnouncemantComponent } from './announcemant.component';
import { CreateAnnouncemantComponent } from '../create-announcemant/create-announcemant.component';

const routes: Routes = [
  { path: '', component: AnnouncemantComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes),],
  exports: [RouterModule,]

})
export class AnnouncemantRoutingModule { }
