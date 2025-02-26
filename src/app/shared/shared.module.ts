import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbDropdownModule, NgbAlertModule, NgbTooltipModule, NgbCollapseModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RippleModule } from '@progress/kendo-angular-ripple';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule, PanelBarModule, SplitterModule, TabStripModule } from '@progress/kendo-angular-layout';
import { TimePickerModule, DatePickerModule, DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { PageHeaderModule } from './modules/page-header/page-header.module';
import { SvgIconModule } from './modules/svg-icon/svg-icon.module';
import { ActionBtnModule } from './modules/action-btn/action-btn.module';
import { DialogModule, WindowModule } from '@progress/kendo-angular-dialog';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule, NumericTextBoxModule, ColorPickerModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule, DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { IntlModule } from '@progress/kendo-angular-intl';
import { LabelModule, FloatingLabelModule } from '@progress/kendo-angular-label';
import { PopupModule } from '@progress/kendo-angular-popup';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { UploadModule } from '@progress/kendo-angular-upload';
import { ContextMenuModule } from '@progress/kendo-angular-menu';
import { SimplebarAngularModule } from 'simplebar-angular';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { GaugesModule } from '@progress/kendo-angular-gauges';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { GridHeightDirective } from '../core/directives/grid-height.directive';

@NgModule({
	imports: [
		CommonModule,
		NgbModule,
		NgbDropdownModule,
		RippleModule,
		FormsModule,
		ReactiveFormsModule,
		LayoutModule,
		DatePickerModule,
		DateInputsModule,
		DialogModule,
		WindowModule,
		InputsModule,
		NumericTextBoxModule,
		ColorPickerModule,
		ButtonsModule,
		NgbAlertModule,
		NgbTooltipModule,
		NgbCollapseModule,
		PanelBarModule,
		SplitterModule,
		GridModule,
		DropDownsModule,
		DropDownListModule,
		TimePickerModule,
		DatePickerModule,
		DateInputsModule,
		IntlModule,
		LabelModule,
		FloatingLabelModule,
		PopupModule,
		TreeViewModule,
		UploadModule,
		PageHeaderModule,
		SvgIconModule,
		ActionBtnModule,
		ContextMenuModule,
		SimplebarAngularModule,
		ChartsModule,
		GaugesModule,
		IndicatorsModule
	],
	exports: [
		CommonModule,
		NgbModule,
		NgbDropdownModule,
		RippleModule,
		FormsModule,
		ReactiveFormsModule,
		GridModule,
		DialogModule,
		WindowModule,
		InputsModule,
		NumericTextBoxModule,
		ColorPickerModule,
		ButtonsModule,
		NgbAlertModule,
		NgbTooltipModule,
		NgbCollapseModule,
		PanelBarModule,
		SplitterModule,
		LayoutModule,
		TimePickerModule,
		DatePickerModule,
		DateInputsModule,
		DropDownsModule,
		DropDownListModule,
		IntlModule,
		LabelModule,
		FloatingLabelModule,
		PopupModule,
		TreeViewModule,
		UploadModule,
		PageHeaderModule,
		SvgIconModule,
		ActionBtnModule,
		ContextMenuModule,
		SimplebarAngularModule,
		ChartsModule,
		GaugesModule,
		IndicatorsModule,
		GridHeightDirective
	],
	providers: [
		NgbActiveModal
	],
	declarations: [GridHeightDirective],
	schemas: [
		NO_ERRORS_SCHEMA,
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class SharedModule { }
