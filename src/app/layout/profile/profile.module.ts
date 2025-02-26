import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProfileRoutingModule } from './profile-routing.module';
import { LayoutModule } from '../layout.module';
import { ProfileComponent } from './profile.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    ProfileRoutingModule,
    LayoutModule,
    SharedModule
  ],
  declarations: [ProfileComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class ProfileModule { }
