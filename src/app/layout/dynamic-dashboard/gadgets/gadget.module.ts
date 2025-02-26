import { NgModule } from '@angular/core';
import { DynamicFormModule } from '../dynamic-form/dynamic-form-module';
import { DndModule } from 'ng2-dnd';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GadgetSharedModule } from './_common/gadget-shared.module';
import { ErrorHandlerModule } from '../error/error.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { DataListModule } from '../datalist/data-list.module';
import { FacetModule } from '../facet/facet.module';
import { TypeAheadInputModule } from '../typeahead-input/typeahead-input.module';
import { AnnouncementGadgetComponent } from './announcement-gadget/announcement-gadget.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { SharedModule } from '../../../shared';

@NgModule({
	imports: [
		GadgetSharedModule,
		DndModule.forRoot(),
		DynamicFormModule,
		ErrorHandlerModule,
		NgxChartsModule,
		MatButtonModule,
		MatIconModule,
		MatCheckboxModule,
		MatInputModule,
		MatProgressBarModule,
		MatExpansionModule,
		MatOptionModule,
		MatSelectModule,
		FormsModule,
		FacetModule,
		TypeAheadInputModule,
		DataListModule,
		SharedModule
	],
	declarations: [
		AnnouncementGadgetComponent,
		DateAgoPipe
	],
	providers: [],
	exports: []
})

export class GadgetModule {
}

