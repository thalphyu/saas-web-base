import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddGadgetComponent } from './add-gadget-component';
import { AddGadgetService } from './service';
import { HttpClientModule } from '@angular/common/http';
import { DataListModule } from '../datalist/data-list.module';
import { MatButtonModule } from '@angular/material/button';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogsModule } from '@progress/kendo-angular-dialog';

@NgModule({
	imports: [
		CommonModule,
		DataListModule,
		HttpClientModule,
		MatButtonModule,
		DialogsModule,
		ButtonsModule
	],
	declarations: [
		AddGadgetComponent
	],
	providers: [
		AddGadgetService
	],
	exports: [
		AddGadgetComponent
	]
})
export class AddGadgetModule {
}

