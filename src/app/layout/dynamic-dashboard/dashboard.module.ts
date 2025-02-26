import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {
	TimelineComponent,
	NotificationComponent,
	ChatComponent
} from './components';
import { StatModule } from '../../shared';
import { SharedModule } from '../../shared';
import { MenuModule } from './menu/menu.module';

@NgModule({
	imports: [
		DashboardRoutingModule,
		StatModule,
		SharedModule,
		MenuModule
	],
	declarations: [
		DashboardComponent,
		TimelineComponent,
		NotificationComponent,
		ChatComponent
	]
})
export class DashboardModule { }
