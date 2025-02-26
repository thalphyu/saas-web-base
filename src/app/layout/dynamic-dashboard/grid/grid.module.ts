import { NgModule, ANALYZE_FOR_ENTRY_COMPONENTS, ModuleWithProviders} from '@angular/core';
import { GridComponent } from './grid.component';
import { CellComponent } from './cell.component';
import { GadgetInstanceService } from './grid.service';
import { ConfigurationService } from '../services/configuration.service';
import { AddGadgetService } from '../add-gadget/service';
import { DndModule } from 'ng2-dnd';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from '../toast/toast.module';
import { SharedModule } from '../../../shared';
import { AnnouncementGadgetService } from '../gadgets/announcement-gadget/announcement-gadget.service';
import { TermsAndConditionModule } from '../../../terms-and-condition/terms-and-condition.module';
import { AddGadgetModule } from '../add-gadget/add-gadget.module';

@NgModule({
	imports: [
		ToastModule,
		HttpClientModule, DndModule.forRoot(),
		SharedModule,
		TermsAndConditionModule,
		AddGadgetModule
	],
	declarations: [
		GridComponent,
		CellComponent
	],
	exports: [
		GridComponent
	],
	providers: [
		GadgetInstanceService,
		ConfigurationService,
		AddGadgetService,
		AnnouncementGadgetService
	]
})

export class GridModule {
	static withComponents(components: any[]): ModuleWithProviders<GridModule> {
		return {
			ngModule: GridModule,
			providers: [
				{ provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: components, multi: true }
			]
		};
	}
}
