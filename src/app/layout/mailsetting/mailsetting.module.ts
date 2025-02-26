import { NgModule } from '@angular/core';
import { LayoutModule } from '../layout.module';
import { MailsettingRoutingModule } from './mailsetting-routing.module';
import { MailsettingComponent } from './mailsetting.component';
import { SharedModule } from '../../shared';

@NgModule({
  imports: [
    MailsettingRoutingModule,
    LayoutModule,
    SharedModule
  ],
  declarations: [MailsettingComponent]
})
export class MailsettingModule { }
