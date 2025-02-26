import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationOptionComponent } from './application-option.component';

const routes: Routes = [
  { path: '', component: ApplicationOptionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationOptionRoutingModule { }
