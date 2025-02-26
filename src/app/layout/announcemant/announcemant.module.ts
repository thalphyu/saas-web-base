import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LayoutModule } from '../layout.module';
import { FilterbyemployeemultiModule } from '../filterbyemployeemulti/filterbyemployeemulti.module';
import { AnnouncemantComponent } from './announcemant.component';
import { AnnouncemantRoutingModule } from './announcemant-routing.module';
import { CreateAnnouncemantModule } from '../create-announcemant/create-announcemant.module';
import { SharedModule } from '../../shared';

@NgModule({
  imports: [
    AnnouncemantRoutingModule,
    LayoutModule,
    FilterbyemployeemultiModule,
    CreateAnnouncemantModule,
    SharedModule
  ],
  declarations: [AnnouncemantComponent],
  exports:[AnnouncemantComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AnnouncemantModule { }
