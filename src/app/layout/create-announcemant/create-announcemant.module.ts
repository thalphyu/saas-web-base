import { NgModule } from '@angular/core';
import { CreateAnnouncemantRoutingModule } from './create-announcemant-routing.module';
import { CreateAnnouncemantComponent } from './create-announcemant.component';
import { EditorModule } from '@tinymce/tinymce-angular';
//import tinymce from 'tinymce/tinymce';
import { FilterbyemployeemultiModule } from '../filterbyemployeemulti/filterbyemployeemulti.module';
import { FilterbyemployeeModule } from '../filterbyemployee/filterbyemployee.module';
import { SharedModule } from '../../shared';

// A theme is also required
//import 'tinymce/themes/silver';


@NgModule({
  imports: [
    CreateAnnouncemantRoutingModule,
    EditorModule ,
    FilterbyemployeeModule,
    FilterbyemployeemultiModule,
    SharedModule
  ],
  declarations: [CreateAnnouncemantComponent],
  exports:[CreateAnnouncemantComponent],
})
export class CreateAnnouncemantModule { }
