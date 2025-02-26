import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { LabelModule } from '@progress/kendo-angular-label';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutRoutingModule } from './layout-routing.module';
import { SimplebarAngularModule } from 'simplebar-angular';
import { SvgIconModule } from '../shared/modules/svg-icon/svg-icon.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
	imports: [
		CommonModule,
		LayoutRoutingModule,
		TranslateModule,
		NgbDropdownModule,
		LabelModule,
		InputsModule,
		SvgIconModule,
		SimplebarAngularModule
	],
	exports: [
	   SvgIconModule
	],
	declarations: [LayoutComponent, SidebarComponent, HeaderComponent,]
})
export class LayoutModule {}
