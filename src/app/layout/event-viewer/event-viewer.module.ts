import { NgModule } from '@angular/core';
import { EventViewerRoutingModule } from './event-viewer-routing.module';
import { EventViewerComponent } from './event-viewer.component';
import { FilterbyemployeeModule } from '../filterbyemployee/filterbyemployee.module';
import { MulticheckFilterComponent } from './multicheck-filter/multicheck-filter.component';
import { SharedModule } from '../../shared';

@NgModule({
  imports: [
    EventViewerRoutingModule,
    FilterbyemployeeModule,
    SharedModule
  ],
  declarations: [EventViewerComponent, MulticheckFilterComponent]
})
export class EventViewerModule { }
