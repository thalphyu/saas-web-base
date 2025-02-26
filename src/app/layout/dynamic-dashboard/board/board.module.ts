import { NgModule } from '@angular/core';
import { GridModule } from '../grid/grid.module';
import { BoardComponent } from './board.component';
import { AnnouncementGadgetComponent } from '../gadgets/announcement-gadget/announcement-gadget.component';
import { SharedModule } from '../../../shared';

@NgModule({
	imports: [
		SharedModule,
		GridModule.withComponents([
			AnnouncementGadgetComponent
		])
	],
	providers: [],
	declarations: [
		BoardComponent
	],
	exports:[BoardComponent]
})

export class BoardModule {
}
