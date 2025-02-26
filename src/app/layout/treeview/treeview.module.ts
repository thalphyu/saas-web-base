import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeviewRoutingModule } from './treeview-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewComponent } from './treeview.component';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { FilterdataPipe } from './filterdata.pipe';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { StatModule } from '../../shared';

@NgModule({
  imports: [
    CommonModule,
    TreeviewRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TreeViewModule,
    DialogModule,
    StatModule
  ],
  declarations: [TreeviewComponent,FilterdataPipe]
})
export class TreeviewModule { }
